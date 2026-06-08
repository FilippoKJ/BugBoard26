import { Router } from 'express';
import { UserRole } from '../entities/UserRole.js';
import { requireRole } from '../middlewares/requireRole.js';

export function createUserRouter(userController, authenticate) {
  const router = Router();
  router.post(
    '/',
    authenticate,
    requireRole(UserRole.ADMIN),
    userController.create
  );
  return router;
}
