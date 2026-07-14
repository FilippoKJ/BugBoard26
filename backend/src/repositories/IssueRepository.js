import { Issue } from '../entities/Issue.js';
import { IssueStatus } from '../entities/IssueValues.js';

const issueProjection = `
  SELECT
    issues.id,
    issues.title,
    issues.description,
    issues.type,
    issues.priority,
    issues.status,
    issues.author_id AS "authorId",
    users.email AS "authorEmail",
    issues.archived,
    issues.created_at AS "createdAt",
    issues.updated_at AS "updatedAt",
    issue_images.file_name AS "imageFileName",
    issue_images.mime_type AS "imageMimeType"
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
    this.database = database;
  }

  async create({ title, description, type, priority, authorId, image }) {
    const issue = new Issue({
      title,
      description,
      type,
      priority,
      authorId
    });

    return this.database.transaction(async (transaction) => {
      const row = await transaction.queryOne(
        `INSERT INTO issues (
          title,
          description,
          type,
          priority,
          status,
          author_id,
          archived
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
        [
          issue.title,
          issue.description,
          issue.type,
          issue.priority,
          issue.status,
          issue.authorId,
          issue.archived
        ]
      );

      const issueId = Number(row.id);
      if (image) {
        await transaction.execute(
          `INSERT INTO issue_images (issue_id, file_name, mime_type, data)
           VALUES ($1, $2, $3, $4)`,
          [issueId, image.fileName, image.mimeType, image.data]
        );
      }

      return this.findById(issueId, transaction);
    });
  }

  async findById(id, executor = this.database) {
    const row = await executor.queryOne(
      `${issueProjection} WHERE issues.id = $1`,
      [id]
    );

    return IssueRepository.toEntity(row);
  }

  async findAll({ type, status, priority, archived = false, sortBy, sortOrder }) {
    const conditions = ['issues.archived = $1'];
    const parameters = [archived];

    for (const [column, value] of [
      ['issues.type', type],
      ['issues.status', status],
      ['issues.priority', priority]
    ]) {
      if (value) {
        parameters.push(value);
        conditions.push(`${column} = $${parameters.length}`);
      }
    }

    const orderExpression = sortBy === 'priority'
      ? priorityOrder
      : 'issues.created_at';
    const rows = await this.database.queryAll(
      `${issueProjection}
       WHERE ${conditions.join(' AND ')}
       ORDER BY ${orderExpression} ${sortOrder}, issues.id ${sortOrder}`,
      parameters
    );

    return rows.map(IssueRepository.toEntity);
  }

  async archive(id) {
    const result = await this.database.execute(
      `UPDATE issues
       SET status = $1, archived = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND archived = FALSE`,
      [IssueStatus.DONE, id]
    );

    return result.changes ? this.findById(id) : null;
  }

  async findImageByIssueId(id) {
    return await this.database.queryOne(
      `SELECT file_name AS "fileName", mime_type AS "mimeType", data
       FROM issue_images
       WHERE issue_id = $1`,
      [id]
    );
  }

  async count() {
    const row = await this.database.queryOne(
      'SELECT COUNT(*) AS count FROM issues'
    );
    return Number(row.count);
  }

  static toEntity(row) {
    if (!row) {
      return null;
    }

    return new Issue({
      ...row,
      id: Number(row.id),
      authorId: Number(row.authorId),
      image: row.imageFileName
        ? { fileName: row.imageFileName, mimeType: row.imageMimeType }
        : null,
      archived: Boolean(row.archived)
    });
  }
}
