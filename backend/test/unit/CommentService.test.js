import { describe, expect, it, vi } from 'vitest';
import { ConflictError } from '../../src/errors/ConflictError.js';
import { CommentService } from '../../src/services/CommentService.js';

describe('CommentService.addComment(issueId, text, authorId)', () => {
  it('persists the comment when the issue is active', () => {
    const savedComment = { id: 5, issueId: 9, authorId: 3, text: 'Update' };
    const commentRepository = {
      create: vi.fn(() => savedComment)
    };
    const issueService = {
      getIssue: vi.fn(() => ({ id: 9, archived: false }))
    };
    const service = new CommentService(commentRepository, issueService);

    expect(service.addComment(9, 'Update', 3)).toBe(savedComment);
    expect(commentRepository.create).toHaveBeenCalledWith({
      issueId: 9,
      text: 'Update',
      authorId: 3
    });
  });

  it('rejects comments on archived issues without accessing persistence', () => {
    const commentRepository = {
      create: vi.fn()
    };
    const issueService = {
      getIssue: vi.fn(() => ({ id: 9, archived: true }))
    };
    const service = new CommentService(commentRepository, issueService);

    expect(() => service.addComment(9, 'Late update', 3))
      .toThrow(ConflictError);
    expect(commentRepository.create).not.toHaveBeenCalled();
  });
});
