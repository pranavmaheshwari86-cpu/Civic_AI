import app from './app';
import { env } from '@/config';
import { logger } from '@/utils/logger';
import { closeRedis } from '@/middleware/rateLimit';
import { prisma } from '@/repositories';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`, {
    env: env.NODE_ENV,
    apiPrefix: env.API_PREFIX,
  });
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    logger.info('HTTP server closed');

    await closeRedis();
    await prisma.$disconnect();

    logger.info('Database and Redis connections closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

export { app };