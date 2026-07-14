import { existsSync } from 'node:fs';
import { AppConfig } from '../src/config/AppConfig.js';
import { Database } from '../src/config/Database.js';

const config = new AppConfig();
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required to import data into PostgreSQL');
}
if (!existsSync(config.databasePath)) {
  throw new Error(`SQLite database not found at ${config.databasePath}`);
}

const source = new Database({ databasePath: config.databasePath });
const target = new Database({
  databaseUrl: config.databaseMigrationUrl,
  migrationsDirectory: config.migrationsDirectory
});

await source.connect();
await target.connect();

try {
  await target.migrate();

  const [users, issues, images, comments] = await Promise.all([
    source.queryAll(
      `SELECT id, email, password_hash, role, created_at
       FROM users ORDER BY id`
    ),
    source.queryAll(
      `SELECT id, title, description, type, priority, status, author_id,
              archived, created_at, updated_at
       FROM issues ORDER BY id`
    ),
    source.queryAll(
      `SELECT issue_id, file_name, mime_type, data, created_at
       FROM issue_images ORDER BY issue_id`
    ),
    source.queryAll(
      `SELECT id, issue_id, author_id, text, created_at
       FROM comments ORDER BY id`
    )
  ]);

  await target.transaction(async (transaction) => {
    const targetCounts = await transaction.queryOne(
      `SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM issues) AS issues,
        (SELECT COUNT(*) FROM issue_images) AS images,
        (SELECT COUNT(*) FROM comments) AS comments`
    );
    const targetRowCount = Object.values(targetCounts)
      .reduce((sum, value) => sum + Number(value), 0);
    if (targetRowCount > 0) {
      throw new Error(
        'PostgreSQL already contains application data; import cancelled'
      );
    }

    for (const user of users) {
      await transaction.execute(
        `INSERT INTO users (
          id, email, password_hash, role, created_at
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          user.id,
          user.email,
          user.password_hash,
          user.role,
          user.created_at
        ]
      );
    }

    for (const issue of issues) {
      const archived = Boolean(issue.archived);
      await transaction.execute(
        `INSERT INTO issues (
          id, title, description, type, priority, status, author_id,
          archived, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          issue.id,
          issue.title,
          issue.description,
          issue.type,
          issue.priority,
          archived ? 'DONE' : issue.status,
          issue.author_id,
          archived,
          issue.created_at,
          issue.updated_at
        ]
      );
    }

    for (const image of images) {
      await transaction.execute(
        `INSERT INTO issue_images (
          issue_id, file_name, mime_type, data, created_at
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          image.issue_id,
          image.file_name,
          image.mime_type,
          Buffer.from(image.data),
          image.created_at
        ]
      );
    }

    for (const comment of comments) {
      await transaction.execute(
        `INSERT INTO comments (
          id, issue_id, author_id, text, created_at
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          comment.id,
          comment.issue_id,
          comment.author_id,
          comment.text,
          comment.created_at
        ]
      );
    }

    for (const table of ['users', 'issues', 'comments']) {
      await transaction.queryOne(
        `SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE(MAX(id), 1),
          COUNT(*) > 0
        ) AS value FROM ${table}`
      );
    }
  });

  console.log(
    `Imported ${users.length} users, ${issues.length} issues, `
      + `${images.length} images and ${comments.length} comments`
  );
} finally {
  await Promise.all([source.close(), target.close()]);
}
