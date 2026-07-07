import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;

  const mockMongoConnection = { readyState: 1 };
  const mockRedis = { ping: jest.fn().mockResolvedValue('PONG') };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: getConnectionToken(), useValue: mockMongoConnection },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthz', () => {
    it('should return OK when all services are connected', async () => {
      const result = await appController.getHealth();
      expect(result.status).toBe('OK');
      expect(result.services.mongodb).toBe('connected');
      expect(result.services.redis).toBe('connected');
      expect(result.timestamp).toBeDefined();
    });

    it('should return DEGRADED when Redis is down', async () => {
      mockRedis.ping.mockRejectedValueOnce(new Error('Connection refused'));
      const result = await appController.getHealth();
      expect(result.status).toBe('DEGRADED');
      expect(result.services.redis).toBe('error');
    });
  });
});
