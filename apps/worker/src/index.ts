import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { VoyageAIClient } from 'voyageai';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URI || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const voyage = process.env.VOYAGE_API_KEY ? new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY }) : null;

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bharat');
  console.log('Worker connected to MongoDB');

  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB not connected');
  const serviceCatalog = db.collection('service_catalog');

  const reEmbedWorker = new Worker(
    'catalog-embeddings',
    async (job) => {
      console.log(`Processing re-embed job for catalog entry ${job.data.id}`);
      
      const { id, text } = job.data;
      if (!id || !text) {
        throw new Error('Missing id or text for embedding');
      }

      let embedding = Array.from({ length: 1024 }, () => Math.random() * 2 - 1); // Mock default
      
      if (voyage) {
        try {
          const response = await voyage.embed({
            input: text,
            model: 'voyage-2',
          });
          if (response.data?.[0]?.embedding) {
            embedding = response.data[0].embedding;
          }
        } catch (err) {
          console.error('Failed to call Voyage AI', err);
          throw err; // retry job
        }
      } else {
        console.log('VOYAGE_API_KEY not set. Using mock embeddings.');
      }

      await serviceCatalog.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { embedding } }
      );

      console.log(`Successfully generated and saved embedding for ${id}`);
    },
    { connection: connection as any },
  );

  const duplicateScanWorker = new Worker(
    'duplicate-scan',
    async (job) => {
      console.log(`Running background duplicate scan...`);
      const complaintsCol = db.collection('complaints');
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

      // Find recent complaints without a duplicate link
      const recentComplaints = await complaintsCol
        .find({
          createdAt: { $gte: fourteenDaysAgo },
          duplicateOfComplaintId: null,
          status: { $in: ['submitted', 'under_review'] },
        })
        .sort({ createdAt: -1 })
        .limit(200)
        .toArray();

      let flagged = 0;
      for (const complaint of recentComplaints) {
        if (!complaint.geoLocation?.coordinates) continue;
        const [lng, lat] = complaint.geoLocation.coordinates;

        const nearbyDuplicate = await complaintsCol.findOne({
          _id: { $ne: complaint._id },
          category: complaint.category,
          createdAt: { $gte: fourteenDaysAgo },
          geoLocation: {
            $nearSphere: {
              $geometry: { type: 'Point', coordinates: [lng, lat] },
              $maxDistance: 100, // 100 meters
            },
          },
        });

        if (nearbyDuplicate) {
          await complaintsCol.updateOne(
            { _id: complaint._id },
            { $set: { duplicateOfComplaintId: nearbyDuplicate._id } },
          );
          flagged++;
        }
      }

      console.log(`Duplicate scan complete: ${flagged} flagged out of ${recentComplaints.length} scanned`);
    },
    { connection: connection as any },
  );

  reEmbedWorker.on('completed', (job) => console.log(`Job ${job.id} completed`));
  reEmbedWorker.on('failed', (job, err) => console.log(`Job ${job?.id} failed: ${err.message}`));

  console.log('Worker started and listening to queues');
}

bootstrap().catch(err => {
  console.error('Worker bootstrap failed', err);
  process.exit(1);
});
