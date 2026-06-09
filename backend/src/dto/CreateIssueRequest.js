import {
  IssuePriority,
  isIssuePriority,
  isIssueType
} from '../entities/IssueValues.js';
import { ValidationError } from '../errors/ValidationError.js';

export class CreateIssueRequest {
  constructor(title, description, type, priority) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.priority = priority;
  }

  static from(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ValidationError('A JSON request body is required');
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string'
      ? body.description.trim()
      : '';
    const type = typeof body.type === 'string' ? body.type.toUpperCase() : '';
    let priority = IssuePriority.MEDIUM;
    if (body.priority !== undefined) {
      priority = typeof body.priority === 'string'
        ? body.priority.toUpperCase()
        : '';
    }

    if (!title || title.length > 150) {
      throw new ValidationError(
        'Title must contain between 1 and 150 characters'
      );
    }

    if (!description || description.length > 5_000) {
      throw new ValidationError(
        'Description must contain between 1 and 5000 characters'
      );
    }

    if (!isIssueType(type)) {
      throw new ValidationError(
        'Type must be QUESTION, BUG, DOCUMENTATION or FEATURE'
      );
    }

    if (!isIssuePriority(priority)) {
      throw new ValidationError(
        'Priority must be LOW, MEDIUM, HIGH or CRITICAL'
      );
    }

    return new CreateIssueRequest(title, description, type, priority);
  }
}
