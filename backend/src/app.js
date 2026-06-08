import express from 'express';
import { AuthController } from './controllers/AuthController.js';
import { HealthController } from './controllers/HealthController.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createAuthRouter } from './routes/authRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { HealthService } from './services/HealthService.js';

export function createApp({ database, authService }) {
  const app = express();
  const healthService = new HealthService(database);
  const healthController = new HealthController(healthService);
  const authController = new AuthController(authService);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/health', createHealthRouter(healthController));
  app.use('/api/auth', createAuthRouter(authController));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
