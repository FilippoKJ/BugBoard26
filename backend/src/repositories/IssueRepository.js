import { Issue } from '../entities/Issue.js';

const issueProjection = `
  SELECT
    issues.id,
    issues.title,
    issues.description,
    issues.type,
    issues.priority,
    issues.status,
    issues.author_id AS authorId,
    users.email AS authorEmail,
    issues.archived,
    issues.created_at AS createdAt,
    issues.updated_at AS updatedAt
  FROM issues
  JOIN users ON users.id = issues.author_id
`;

const priorityOrder = `CASE issues.priority
  WHEN 'CRITICAL' THEN 4
  WHEN 'HIGH' THEN 3
  WHEN 'MEDIUM' THEN 2
  WHEN 'LOW' THEN 1
END`;

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
      .prepare(`${issueProjection} WHERE issues.id = ?`)
      .get(id);

    return IssueRepository.toEntity(row);
  }

  findAll({ type, status, priority, archived = false, sortBy, sortOrder }) {
    const conditions = ['issues.archived = ?'];
    const parameters = [Number(archived)];

    for (const [column, value] of [
      ['issues.type', type],
      ['issues.status', status],
      ['issues.priority', priority]
    ]) {
      if (value) {
        conditions.push(`${column} = ?`);
        parameters.push(value);
      }
    }

    const orderExpression = sortBy === 'priority'
      ? priorityOrder
      : 'issues.created_at';
    const rows = this.connection.prepare(
      `${issueProjection}
       WHERE ${conditions.join(' AND ')}
       ORDER BY ${orderExpression} ${sortOrder}, issues.id ${sortOrder}`
    ).all(...parameters);

    return rows.map(IssueRepository.toEntity);
  }

  archive(id) {
    const result = this.connection.prepare(
      `UPDATE issues
       SET archived = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND archived = 0`
    ).run(id);

    return result.changes ? this.findById(id) : null;
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
