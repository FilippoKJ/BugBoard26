import { Router } from 'express';

export function createHealthRouter(healthController) {
  const router = Router();
  router.get('/', healthController.getStatus);
  return router;
}
