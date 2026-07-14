import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Database } from '../../src/config/Database.js';
import { IssueRepository } from '../../src/repositories/IssueRepository.js';

const migrationPath = fileURLToPath(
  new URL('../../database/migrations/001_initial_schema.sql', import.meta.url)
);

describe('IssueRepository.archive(id)', () => {
  let database;
  let repository;

  beforeEach(async () => {
    database = new Database({
      databasePath: ':memory:',
      migrationPath
    });
    await database.connect();
    await database.initializeSchema();
    await database.execute(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)`,
      ['author@example.test', 'not-used-by-this-test', 'USER']
    );
    repository = new IssueRepository(database);
  });

  afterEach(async () => database.close());

  it('closes the issue when it is archived', async () => {
    const issue = await repository.create({
      title: 'Archive me',
      description: 'The archive action must close this issue.',
      type: 'BUG',
      priority: 'MEDIUM',
      authorId: 1
    });

    expect(issue.status).toBe('TODO');

    const archivedIssue = await repository.archive(issue.id);

    expect(archivedIssue.archived).toBe(true);
    expect(archivedIssue.status).toBe('DONE');
    await expect(repository.findById(issue.id))
      .resolves.toMatchObject({ status: 'DONE' });
  });

  it('closes issues archived before the status transition was introduced', async () => {
    const legacyIssue = await repository.create({
      title: 'Legacy archive',
      description: 'This issue was archived while still in TODO.',
      type: 'DOCUMENTATION',
      priority: 'LOW',
      authorId: 1
    });
    const activeIssue = await repository.create({
      title: 'Active issue',
      description: 'Active issues must remain in TODO.',
      type: 'FEATURE',
      priority: 'HIGH',
      authorId: 1
    });
    await database.execute(
      `UPDATE issues
       SET archived = TRUE, status = 'TODO'
       WHERE id = $1`,
      [legacyIssue.id]
    );

    await database.initializeSchema();

    await expect(repository.findById(legacyIssue.id))
      .resolves.toMatchObject({ status: 'DONE' });
    await expect(repository.findById(activeIssue.id))
      .resolves.toMatchObject({ status: 'TODO' });
  });
});
