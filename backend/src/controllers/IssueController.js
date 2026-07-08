import { CreateIssueRequest } from '../dto/CreateIssueRequest.js';
import { IssueQueryRequest } from '../dto/IssueQueryRequest.js';
import { parsePositiveId } from '../validators/parsePositiveId.js';

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

  list = (request, response, next) => {
    try {
      const query = IssueQueryRequest.from(request.query);
      const issues = this.issueService.listIssues(query);
      response.status(200).json({ issues: issues.map((issue) => issue.toObject()) });
    } catch (error) {
      next(error);
    }
  };

  listArchived = (request, response, next) => {
    try {
      const query = IssueQueryRequest.from(request.query);
      const issues = this.issueService.listArchivedIssues(query);
      response.status(200).json({ issues: issues.map((issue) => issue.toObject()) });
    } catch (error) {
      next(error);
    }
  };

  getById = (request, response, next) => {
    try {
      const issue = this.issueService.getIssue(parsePositiveId(request.params.id));
      response.status(200).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };

  archive = (request, response, next) => {
    try {
      const issue = this.issueService.archiveIssue(parsePositiveId(request.params.id));
      response.status(200).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };
}
