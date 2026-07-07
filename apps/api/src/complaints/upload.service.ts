import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async getPresignedUploadUrl(contentType: string, originalFilename: string) {
    if (!process.env.R2_BUCKET_NAME) {
      throw new InternalServerErrorException('Storage bucket not configured');
    }
    
    // Create safe filename
    const ext = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
    const key = `complaints/${Date.now()}-${nanoid()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return {
        uploadUrl,
        fileKey: key,
        // The public URL assuming a custom domain is mapped or public R2 access is on
        publicUrl: `${process.env.R2_PUBLIC_DOMAIN || 'https://assets.smartbharat.dev'}/${key}`,
      };
    } catch (error) {
      console.error('Failed to generate presigned URL', error);
      throw new InternalServerErrorException('Failed to generate upload URL');
    }
  }
}
