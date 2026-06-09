export class Comment {
  constructor({ id = null, issueId, authorId, authorEmail = null, text, createdAt = null }) {
    this.id = id;
    this.issueId = issueId;
    this.authorId = authorId;
    this.authorEmail = authorEmail;
    this.text = typeof text === 'string' ? text.trim() : '';
    this.createdAt = createdAt;
    this.validate();
  }

  validate() {
    if (!Number.isInteger(this.issueId) || this.issueId < 1) {
      throw new TypeError('Comment issue id must be a positive integer');
    }
    if (!Number.isInteger(this.authorId) || this.authorId < 1) {
      throw new TypeError('Comment author id must be a positive integer');
    }
    if (!this.text || this.text.length > 2_000) {
      throw new TypeError('Comment text must contain between 1 and 2000 characters');
    }
  }

  toObject() {
    return {
      id: this.id,
      issueId: this.issueId,
      authorId: this.authorId,
      authorEmail: this.authorEmail,
      text: this.text,
      createdAt: this.createdAt
    };
  }
}
