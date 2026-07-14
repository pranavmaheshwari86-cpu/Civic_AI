import './instrument';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SentryFilter } from './sentry.filter';
import helmet from 'helmet';

import { AdminService } from './admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const adminService = app.get(AdminService);
  await adminService.seedAdmin('admin@example.com', 'CorrectPassword123!');

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  
  app.use(helmet());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.listen(process.env.API_PORT ?? 3001);
  console.log(`API running on port ${process.env.API_PORT ?? 3001}`);
}
bootstrap();
