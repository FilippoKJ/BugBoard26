import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IssueRepository } from '../../src/repositories/IssueRepository.js';

const migrationPath = fileURLToPath(
  new URL('../../database/migrations/001_initial_schema.sql', import.meta.url)
);
const schema = readFileSync(migrationPath, 'utf8');

describe('IssueRepository.archive(id)', () => {
  let connection;
  let repository;

  beforeEach(() => {
    connection = new DatabaseSync(':memory:');
    connection.exec('PRAGMA foreign_keys = ON;');
    connection.exec(schema);
    connection.prepare(
      `INSERT INTO users (email, password_hash, role)
       VALUES (?, ?, ?)`
    ).run('author@example.test', 'not-used-by-this-test', 'USER');
    repository = new IssueRepository({
      connection,
      ensureConnected() {}
    });
  });

  afterEach(() => connection.close());

  it('closes the issue when it is archived', () => {
    const issue = repository.create({
      title: 'Archive me',
      description: 'The archive action must close this issue.',
      type: 'BUG',
      priority: 'MEDIUM',
      authorId: 1
    });

    expect(issue.status).toBe('TODO');

    const archivedIssue = repository.archive(issue.id);

    expect(archivedIssue.archived).toBe(true);
    expect(archivedIssue.status).toBe('DONE');
    expect(repository.findById(issue.id).status).toBe('DONE');
  });
});
