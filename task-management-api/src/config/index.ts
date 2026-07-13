import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().url(),

  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  REDIS_TTL: z.coerce.number().default(3600),

  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('json'),

  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  SWAGGER_PATH: z.string().default('/api-docs'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const corsOptions = {
  origin: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  credentials: true,
  optionsSuccessStatus: 200,
};