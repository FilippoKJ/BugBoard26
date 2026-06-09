import { Router } from 'express';

export function createIssueRouter(issueController, authenticate) {
  const router = Router();
  router.post('/', authenticate, issueController.create);
  return router;
}
