import express from 'express';
import { AuthController } from './controllers/AuthController.js';
import { HealthController } from './controllers/HealthController.js';
import { IssueController } from './controllers/IssueController.js';
import { UserController } from './controllers/UserController.js';
import { createAuthenticationMiddleware } from './middlewares/authenticate.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createAuthRouter } from './routes/authRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { createIssueRouter } from './routes/issueRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';
import { HealthService } from './services/HealthService.js';

export function createApp({
  database,
  authService,
  tokenService,
  userService,
  issueService
}) {
  const app = express();
  const healthService = new HealthService(database);
  const healthController = new HealthController(healthService);
  const authController = new AuthController(authService);
  const userController = new UserController(userService);
  const issueController = new IssueController(issueService);
  const authenticate = createAuthenticationMiddleware(tokenService);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/health', createHealthRouter(healthController));
  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/users', createUserRouter(userController, authenticate));
  app.use('/api/issues', createIssueRouter(issueController, authenticate));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
