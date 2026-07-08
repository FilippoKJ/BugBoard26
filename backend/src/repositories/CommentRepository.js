import { Comment } from '../entities/Comment.js';

const projection = `
  SELECT comments.id, comments.issue_id AS issueId,
         comments.author_id AS authorId, users.email AS authorEmail,
         comments.text, comments.created_at AS createdAt
  FROM comments
  JOIN users ON users.id = comments.author_id
`;

export class CommentRepository {
  constructor(database) {
    database.ensureConnected();
    this.connection = database.connection;
  }

  create({ issueId, authorId, text }) {
    const comment = new Comment({ issueId, authorId, text });
    const result = this.connection.prepare(
      'INSERT INTO comments (issue_id, author_id, text) VALUES (?, ?, ?)'
    ).run(comment.issueId, comment.authorId, comment.text);
    return this.findById(Number(result.lastInsertRowid));
  }

  findById(id) {
    return CommentRepository.toEntity(
      this.connection.prepare(`${projection} WHERE comments.id = ?`).get(id)
    );
  }

  findByIssueId(issueId) {
    return this.connection.prepare(
      `${projection} WHERE comments.issue_id = ? ORDER BY comments.created_at ASC, comments.id ASC`
    ).all(issueId).map(CommentRepository.toEntity);
  }

  static toEntity(row) {
    return row ? new Comment(row) : null;
  }
}
