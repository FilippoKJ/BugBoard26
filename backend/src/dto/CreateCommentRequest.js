import { ValidationError } from '../errors/ValidationError.js';

export class CreateCommentRequest {
  constructor(text) {
    this.text = text;
  }

  static from(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ValidationError('A JSON request body is required');
    }
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text || text.length > 2_000) {
      throw new ValidationError('Comment must contain between 1 and 2000 characters');
    }
    return new CreateCommentRequest(text);
  }
}
