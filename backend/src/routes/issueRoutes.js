import { Router } from 'express';
import { UserRole } from '../entities/UserRole.js';
import { requireRole } from '../middlewares/requireRole.js';

export function createIssueRouter(issueController, commentController, authenticate) {
  const router = Router();
  router.post('/', authenticate, issueController.create);
  router.get('/', authenticate, issueController.list);
  router.get('/archived', authenticate, issueController.listArchived);
  router.get('/:id/image', authenticate, issueController.getImage);
  router.get('/:id', authenticate, issueController.getById);
  router.patch(
    '/:id/archive',
    authenticate,
    requireRole(UserRole.ADMIN),
    issueController.archive
  );
  router.get('/:id/comments', authenticate, commentController.list);
  router.post('/:id/comments', authenticate, commentController.create);
  return router;
}
