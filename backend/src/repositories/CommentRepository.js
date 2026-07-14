import { Comment } from '../entities/Comment.js';

const projection = `
  SELECT comments.id, comments.issue_id AS "issueId",
         comments.author_id AS "authorId", users.email AS "authorEmail",
         comments.text, comments.created_at AS "createdAt"
  FROM comments
  JOIN users ON users.id = comments.author_id
`;

export class CommentRepository {
  constructor(database) {
    database.ensureConnected();
    this.database = database;
  }

  async create({ issueId, authorId, text }) {
    const comment = new Comment({ issueId, authorId, text });
    const row = await this.database.queryOne(
      `INSERT INTO comments (issue_id, author_id, text)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [comment.issueId, comment.authorId, comment.text]
    );
    return this.findById(Number(row.id));
  }

  async findById(id) {
    const row = await this.database.queryOne(
      `${projection} WHERE comments.id = $1`,
      [id]
    );
    return CommentRepository.toEntity(row);
  }

  async findByIssueId(issueId) {
    const rows = await this.database.queryAll(
      `${projection}
       WHERE comments.issue_id = $1
       ORDER BY comments.created_at ASC, comments.id ASC`,
      [issueId]
    );
    return rows.map(CommentRepository.toEntity);
  }

  static toEntity(row) {
    return row
      ? new Comment({
        ...row,
        id: Number(row.id),
        issueId: Number(row.issueId),
        authorId: Number(row.authorId)
      })
      : null;
  }
}
