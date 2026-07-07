import { Injectable, Logger } from '@nestjs/common';
import { VoyageAIClient } from 'voyageai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private voyage: VoyageAIClient | null = null;

  constructor() {
    const apiKey = process.env.VOYAGE_API_KEY;
    if (apiKey) {
      this.voyage = new VoyageAIClient({ apiKey });
    } else {
      this.logger.warn('VOYAGE_API_KEY not provided. Embedding service is running in mock mode.');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.voyage) {
      try {
        const response = await this.voyage.embed({
          input: text,
          model: 'voyage-2',
        });
        return response.data?.[0]?.embedding || [];
      } catch (error) {
        this.logger.error('Failed to generate embedding with Voyage AI', error);
        throw error;
      }
    }

    // Mock embedding generator when no API key is provided
    this.logger.debug(`Generating mock embedding for text length: ${text.length}`);
    return Array.from({ length: 1024 }, () => Math.random() * 2 - 1);
  }
}
