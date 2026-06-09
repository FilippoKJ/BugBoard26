import { Issue } from '../entities/Issue.js';

const issueProjection = `
  SELECT
    id,
    title,
    description,
    type,
    priority,
    status,
    author_id AS authorId,
    archived,
    created_at AS createdAt,
    updated_at AS updatedAt
  FROM issues
`;

export class IssueRepository {
  constructor(database) {
    database.ensureConnected();
    this.connection = database.connection;
  }

  create({ title, description, type, priority, authorId }) {
    const issue = new Issue({
      title,
      description,
      type,
      priority,
      authorId
    });
    const result = this.connection
      .prepare(
        `INSERT INTO issues (
          title,
          description,
          type,
          priority,
          status,
          author_id,
          archived
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        issue.title,
        issue.description,
        issue.type,
        issue.priority,
        issue.status,
        issue.authorId,
        Number(issue.archived)
      );

    return this.findById(Number(result.lastInsertRowid));
  }

  findById(id) {
    const row = this.connection
      .prepare(`${issueProjection} WHERE id = ?`)
      .get(id);

    return IssueRepository.toEntity(row);
  }

  count() {
    return this.connection.prepare('SELECT COUNT(*) AS count FROM issues').get().count;
  }

  static toEntity(row) {
    if (!row) {
      return null;
    }

    return new Issue({
      ...row,
      archived: Boolean(row.archived)
    });
  }
}
