import { describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../../src/errors/ConflictError.js';
import { CommentService } from '../../src/services/CommentService.js';

describe('CommentService.addComment(issueId, text, authorId)', () => {
  it('persists the comment when the issue is active', async () => {
    const savedComment = { id: 5, issueId: 9, authorId: 3, text: 'Update' };
    const commentRepository = {
      create: vi.fn(async () => savedComment)
    };
    const issueService = {
      getIssue: vi.fn(async () => ({ id: 9, archived: false }))
    };
    const service = new CommentService(commentRepository, issueService);

    await expect(service.addComment(9, 'Update', 3)).resolves.toBe(savedComment);
    expect(commentRepository.create).toHaveBeenCalledWith({
      issueId: 9,
      text: 'Update',
      authorId: 3
    });
  });

  it('rejects comments on archived issues without accessing persistence', async () => {
    const commentRepository = {
      create: vi.fn()
    };
    const issueService = {
      getIssue: vi.fn(async () => ({ id: 9, archived: true }))
    };
    const service = new CommentService(commentRepository, issueService);

    await expect(service.addComment(9, 'Late update', 3))
      .rejects.toBeInstanceOf(ConflictError);
    expect(commentRepository.create).not.toHaveBeenCalled();
  });
});
