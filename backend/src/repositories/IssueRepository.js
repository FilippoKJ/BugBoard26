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
    issues.updated_at AS updatedAt,
    issue_images.file_name AS imageFileName,
    issue_images.mime_type AS imageMimeType
  FROM issues
  JOIN users ON users.id = issues.author_id
  LEFT JOIN issue_images ON issue_images.issue_id = issues.id
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

  create({ title, description, type, priority, authorId, image }) {
    const issue = new Issue({
      title,
      description,
      type,
      priority,
      authorId
    });
    this.connection.exec('BEGIN');
    try {
      const result = this.connection.prepare(
        `INSERT INTO issues (
          title,
          description,
          type,
          priority,
          status,
          author_id,
          archived
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        issue.title,
        issue.description,
        issue.type,
        issue.priority,
        issue.status,
        issue.authorId,
        Number(issue.archived)
      );

      const issueId = Number(result.lastInsertRowid);
      if (image) {
        this.connection.prepare(
          `INSERT INTO issue_images (issue_id, file_name, mime_type, data)
           VALUES (?, ?, ?, ?)`
        ).run(issueId, image.fileName, image.mimeType, image.data);
      }

      this.connection.exec('COMMIT');
      return this.findById(issueId);
    } catch (error) {
      this.connection.exec('ROLLBACK');
      throw error;
    }
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

  findImageByIssueId(id) {
    return this.connection.prepare(
      `SELECT file_name AS fileName, mime_type AS mimeType, data
       FROM issue_images
       WHERE issue_id = ?`
    ).get(id) ?? null;
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
      image: row.imageFileName
        ? { fileName: row.imageFileName, mimeType: row.imageMimeType }
        : null,
      archived: Boolean(row.archived)
    });
  }
}
