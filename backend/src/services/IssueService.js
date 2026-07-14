import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export class IssueService {
  constructor(issueRepository) {
    this.issueRepository = issueRepository;
  }

  async createIssue(title, description, type, priority, authorId, image = null) {
    return await this.issueRepository.create({
      title,
      description,
      type,
      priority,
      authorId,
      image
    });
  }

  async listIssues(filters) {
    return await this.issueRepository.findAll({ ...filters, archived: false });
  }

  async listArchivedIssues(filters) {
    return await this.issueRepository.findAll({ ...filters, archived: true });
  }

  async getIssue(id) {
    const issue = await this.issueRepository.findById(id);
    if (!issue) {
      throw new NotFoundError('Issue');
    }
    return issue;
  }

  async getIssueImage(id) {
    await this.getIssue(id);
    const image = await this.issueRepository.findImageByIssueId(id);
    if (!image) {
      throw new NotFoundError('Issue image');
    }
    return image;
  }

  async archiveIssue(id) {
    const issue = await this.getIssue(id);
    if (issue.archived) {
      throw new ConflictError('Issue is already archived');
    }

    return await this.issueRepository.archive(id);
  }
}
