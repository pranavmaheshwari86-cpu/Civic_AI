import { Controller, Get, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Redis } from 'ioredis';

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  @Get('healthz')
  async getHealth(): Promise<{ status: string; services: Record<string, string>; timestamp: string }> {
    const services: Record<string, string> = {};

    // Check MongoDB connectivity
    try {
      const mongoState = this.mongoConnection.readyState;
      services.mongodb = mongoState === 1 ? 'connected' : 'disconnected';
    } catch {
      services.mongodb = 'error';
    }

    // Check Redis connectivity
    try {
      const pong = await this.redis.ping();
      services.redis = pong === 'PONG' ? 'connected' : 'disconnected';
    } catch {
      services.redis = 'error';
    }

    const allHealthy = Object.values(services).every((s) => s === 'connected');

    return {
      status: allHealthy ? 'OK' : 'DEGRADED',
      services,
      timestamp: new Date().toISOString(),
    };
  }
}
