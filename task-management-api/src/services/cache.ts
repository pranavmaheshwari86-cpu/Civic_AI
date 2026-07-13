import Redis from 'ioredis';
import { env } from '@/config';
import { logger } from '@/utils/logger';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        logger.error('Redis max retries reached');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error', { error: err.message }));
redis.on('close', () => logger.warn('Redis connection closed'));

export const cacheKeys = {
  task: (id: string) => `task:${id}`,
  tasks: (userId: string, query: string) => `tasks:${userId}:${query}`,
  user: (id: string) => `user:${id}`,
};

export const invalidateTaskCache = async (userId: string, taskId?: string) => {
  const keys: string[] = [];
  if (taskId) keys.push(cacheKeys.task(taskId));
  keys.push(cacheKeys.tasks(userId, '*'));
  
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

export default redis;