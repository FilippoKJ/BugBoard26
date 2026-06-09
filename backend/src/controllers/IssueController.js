import { CreateIssueRequest } from '../dto/CreateIssueRequest.js';

export class IssueController {
  constructor(issueService) {
    this.issueService = issueService;
  }

  create = (request, response, next) => {
    try {
      const createIssueRequest = CreateIssueRequest.from(request.body);
      const issue = this.issueService.createIssue(
        createIssueRequest.title,
        createIssueRequest.description,
        createIssueRequest.type,
        createIssueRequest.priority,
        request.user.id
      );
      response.status(201).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };
}
