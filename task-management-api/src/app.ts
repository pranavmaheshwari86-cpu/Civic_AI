import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env, corsOptions } from '@/config';
import { logger } from '@/utils/logger';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { rateLimiter } from '@/middleware/rateLimit';
import { swaggerSpec } from '@/docs/swagger';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(env.API_PREFIX, routes);

if (env.SWAGGER_ENABLED) {
  app.use(env.SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;