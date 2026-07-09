import {
  IssuePriority,
  IssueStatus,
  isIssuePriority,
  isIssueStatus,
  isIssueType
} from './IssueValues.js';

export class Issue {
  constructor({
    id = null,
    title,
    description,
    type,
    priority = IssuePriority.MEDIUM,
    status = IssueStatus.TODO,
    authorId,
    authorEmail = null,
    image = null,
    archived = false,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.title = Issue.normalizeText(title, 'title');
    this.description = Issue.normalizeText(description, 'description');
    this.type = type;
    this.priority = priority;
    this.status = status;
    this.authorId = authorId;
    this.authorEmail = authorEmail;
    this.image = image;
    this.archived = archived;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  static normalizeText(value, fieldName) {
    if (typeof value !== 'string') {
      throw new TypeError(`Issue ${fieldName} must be a string`);
    }

    return value.trim();
  }

  validate() {
    if (!this.title || this.title.length > 150) {
      throw new TypeError('Issue title must contain between 1 and 150 characters');
    }

    if (!this.description || this.description.length > 5_000) {
      throw new TypeError(
        'Issue description must contain between 1 and 5000 characters'
      );
    }

    if (!isIssueType(this.type)) {
      throw new TypeError(`Unsupported issue type: ${this.type}`);
    }

    if (!isIssuePriority(this.priority)) {
      throw new TypeError(`Unsupported issue priority: ${this.priority}`);
    }

    if (!isIssueStatus(this.status)) {
      throw new TypeError(`Unsupported issue status: ${this.status}`);
    }

    if (!Number.isInteger(this.authorId) || this.authorId < 1) {
      throw new TypeError('Issue author id must be a positive integer');
    }

    if (typeof this.archived !== 'boolean') {
      throw new TypeError('Issue archived flag must be boolean');
    }
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      priority: this.priority,
      status: this.status,
      authorId: this.authorId,
      authorEmail: this.authorEmail,
      image: this.image,
      archived: this.archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
