import { CreateIssueRequest } from '../dto/CreateIssueRequest.js';
import { IssueQueryRequest } from '../dto/IssueQueryRequest.js';
import { parsePositiveId } from '../validators/parsePositiveId.js';

export class IssueController {
  constructor(issueService) {
    this.issueService = issueService;
  }

  create = async (request, response, next) => {
    try {
      const createIssueRequest = CreateIssueRequest.from(request.body);
      const issue = await this.issueService.createIssue(
        createIssueRequest.title,
        createIssueRequest.description,
        createIssueRequest.type,
        createIssueRequest.priority,
        request.user.id,
        createIssueRequest.image
      );
      response.status(201).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };

  list = async (request, response, next) => {
    try {
      const query = IssueQueryRequest.from(request.query);
      const issues = await this.issueService.listIssues(query);
      response.status(200).json({ issues: issues.map((issue) => issue.toObject()) });
    } catch (error) {
      next(error);
    }
  };

  listArchived = async (request, response, next) => {
    try {
      const query = IssueQueryRequest.from(request.query);
      const issues = await this.issueService.listArchivedIssues(query);
      response.status(200).json({ issues: issues.map((issue) => issue.toObject()) });
    } catch (error) {
      next(error);
    }
  };

  getById = async (request, response, next) => {
    try {
      const issue = await this.issueService.getIssue(parsePositiveId(request.params.id));
      response.status(200).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };

  getImage = async (request, response, next) => {
    try {
      const image = await this.issueService.getIssueImage(
        parsePositiveId(request.params.id)
      );
      response
        .status(200)
        .type(image.mimeType)
        .set('Content-Disposition', `inline; filename="${encodeURIComponent(image.fileName)}"`)
        .set('Cache-Control', 'private, max-age=3600')
        .send(image.data);
    } catch (error) {
      next(error);
    }
  };

  archive = async (request, response, next) => {
    try {
      const issue = await this.issueService.archiveIssue(parsePositiveId(request.params.id));
      response.status(200).json({ issue: issue.toObject() });
    } catch (error) {
      next(error);
    }
  };
}
