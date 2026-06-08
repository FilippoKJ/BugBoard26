import express from 'express';
import { HealthController } from './controllers/HealthController.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { HealthService } from './services/HealthService.js';

export function createApp({ database }) {
  const app = express();
  const healthService = new HealthService(database);
  const healthController = new HealthController(healthService);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/health', createHealthRouter(healthController));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
