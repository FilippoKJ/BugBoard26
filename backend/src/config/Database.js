import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export class Database {
  constructor(databasePath, migrationPath) {
    this.databasePath = databasePath;
    this.migrationPath = migrationPath;
    this.connection = null;
  }

  connect() {
    if (this.connection) {
      return this;
    }

    mkdirSync(dirname(this.databasePath), { recursive: true });
    this.connection = new DatabaseSync(this.databasePath);
    this.connection.exec('PRAGMA foreign_keys = ON;');
    this.connection.exec('PRAGMA journal_mode = WAL;');
    this.connection.exec('PRAGMA busy_timeout = 5000;');

    return this;
  }

  initializeSchema() {
    this.ensureConnected();
    const schema = readFileSync(this.migrationPath, 'utf8');
    this.connection.exec(schema);
  }

  isReachable() {
    this.ensureConnected();
    const result = this.connection.prepare('SELECT 1 AS value').get();
    return result.value === 1;
  }

  close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }

  ensureConnected() {
    if (!this.connection) {
      throw new Error('Database connection has not been opened');
    }
  }
}
