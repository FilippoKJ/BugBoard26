import { CreateCommentRequest } from '../dto/CreateCommentRequest.js';
import { parsePositiveId } from '../validators/parsePositiveId.js';

export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  list = async (request, response, next) => {
    try {
      const comments = await this.commentService.listComments(parsePositiveId(request.params.id));
      response.status(200).json({ comments: comments.map((comment) => comment.toObject()) });
    } catch (error) {
      next(error);
    }
  };

  create = async (request, response, next) => {
    try {
      const issueId = parsePositiveId(request.params.id);
      const { text } = CreateCommentRequest.from(request.body);
      const comment = await this.commentService.addComment(issueId, text, request.user.id);
      response.status(201).json({ comment: comment.toObject() });
    } catch (error) {
      next(error);
    }
  };
}
