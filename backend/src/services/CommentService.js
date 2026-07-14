import { ConflictError } from '../errors/ConflictError.js';

export class CommentService {
  constructor(commentRepository, issueService) {
    this.commentRepository = commentRepository;
    this.issueService = issueService;
  }

  async listComments(issueId) {
    await this.issueService.getIssue(issueId);
    return await this.commentRepository.findByIssueId(issueId);
  }

  async addComment(issueId, text, authorId) {
    const issue = await this.issueService.getIssue(issueId);
    if (issue.archived) {
      throw new ConflictError('Archived issues cannot receive new comments');
    }
    return await this.commentRepository.create({ issueId, text, authorId });
  }
}
