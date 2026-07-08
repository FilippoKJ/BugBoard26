import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export class IssueService {
  constructor(issueRepository) {
    this.issueRepository = issueRepository;
  }

  createIssue(title, description, type, priority, authorId) {
    return this.issueRepository.create({
      title,
      description,
      type,
      priority,
      authorId
    });
  }

  listIssues(filters) {
    return this.issueRepository.findAll({ ...filters, archived: false });
  }

  listArchivedIssues(filters) {
    return this.issueRepository.findAll({ ...filters, archived: true });
  }

  getIssue(id) {
    const issue = this.issueRepository.findById(id);
    if (!issue) {
      throw new NotFoundError('Issue');
    }
    return issue;
  }

  archiveIssue(id) {
    const issue = this.getIssue(id);
    if (issue.archived) {
      throw new ConflictError('Issue is already archived');
    }

    return this.issueRepository.archive(id);
  }
}
