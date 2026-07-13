import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient, type RedisClientType } from 'redis';
import { env } from '@/config';

let redisClient: RedisClientType | null = null;

const isTestEnv = process.env.NODE_ENV === 'test';

const createRedisClient = () => {
  if (isTestEnv) return null;
  
  const client = createClient({ url: env.REDIS_URL }) as RedisClientType;
  client.on('error', (err) => console.error('Redis connection error:', err));
  client.connect().catch(console.error);
  return client;
};

redisClient = createRedisClient();

const getStore = (prefix: string) => {
  if (isTestEnv || !redisClient) {
    return undefined; // Use default in-memory store
  }
  
  return new RedisStore({
    sendCommand: (...args: string[]) => redisClient!.sendCommand(args),
    prefix,
  });
};

export const rateLimiter = rateLimit({
  store: getStore('rl:api:'),
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later' },
  keyGenerator: (req) => req.ip || 'unknown',
  skip: (req) => req.path.startsWith('/health') || req.path.startsWith('/api-docs'),
});

export const authLimiter = rateLimit({
  store: getStore('rl:auth:'),
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many authentication attempts, please try again later' },
  keyGenerator: (req) => req.ip || 'unknown',
  skipSuccessfulRequests: true,
});

export const closeRedis = () => redisClient?.quit();