import { ConflictError } from '../errors/ConflictError.js';

export class CommentService {
  constructor(commentRepository, issueService) {
    this.commentRepository = commentRepository;
    this.issueService = issueService;
  }

  listComments(issueId) {
    this.issueService.getIssue(issueId);
    return this.commentRepository.findByIssueId(issueId);
  }

  addComment(issueId, text, authorId) {
    const issue = this.issueService.getIssue(issueId);
    if (issue.archived) {
      throw new ConflictError('Archived issues cannot receive new comments');
    }
    return this.commentRepository.create({ issueId, text, authorId });
  }
}
