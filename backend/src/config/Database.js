import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import pg from 'pg';

const { Pool } = pg;

class DatabaseExecutor {
  constructor(provider, connection) {
    this.provider = provider;
    this.connection = connection;
  }

  async queryOne(sql, parameters = []) {
    if (this.provider === 'sqlite') {
      return this.connection
        .prepare(DatabaseExecutor.toSqliteSql(sql))
        .get(...DatabaseExecutor.toSqliteParameters(parameters)) ?? null;
    }

    const result = await this.connection.query(sql, parameters);
    return result.rows[0] ?? null;
  }

  async queryAll(sql, parameters = []) {
    if (this.provider === 'sqlite') {
      return this.connection
        .prepare(DatabaseExecutor.toSqliteSql(sql))
        .all(...DatabaseExecutor.toSqliteParameters(parameters));
    }

    const result = await this.connection.query(sql, parameters);
    return result.rows;
  }

  async execute(sql, parameters = []) {
    if (this.provider === 'sqlite') {
      const result = this.connection
        .prepare(DatabaseExecutor.toSqliteSql(sql))
        .run(...DatabaseExecutor.toSqliteParameters(parameters));
      return { changes: result.changes };
    }

    const result = await this.connection.query(sql, parameters);
    return { changes: result.rowCount };
  }

  async executeScript(sql) {
    if (this.provider === 'sqlite') {
      this.connection.exec(sql);
      return;
    }

    await this.connection.query(sql);
  }

  static toSqliteSql(sql) {
    return sql.replace(/\$\d+/g, '?');
  }

  static toSqliteParameters(parameters) {
    return parameters.map((value) => {
      if (typeof value === 'boolean') {
        return Number(value);
      }
      return value;
    });
  }
}

export class Database {
  constructor(options, legacyMigrationPath = null) {
    const normalizedOptions = typeof options === 'string'
      ? { databasePath: options, migrationPath: legacyMigrationPath }
      : options;

    this.databasePath = normalizedOptions.databasePath;
    this.databaseUrl = normalizedOptions.databaseUrl ?? null;
    this.migrationsDirectory = normalizedOptions.migrationsDirectory
      ?? (normalizedOptions.migrationPath
        ? dirname(normalizedOptions.migrationPath)
        : null);
    this.connection = null;
    this.executor = null;
    this.sqliteQueue = Promise.resolve();
  }

  get provider() {
    return this.databaseUrl ? 'postgresql' : 'sqlite';
  }

  async connect() {
    if (this.connection) {
      return this;
    }

    if (this.databaseUrl) {
      this.connection = new Pool({
        connectionString: this.databaseUrl,
        max: 5,
        connectionTimeoutMillis: 10_000,
        idleTimeoutMillis: 30_000
      });
      this.executor = new DatabaseExecutor('postgresql', this.connection);
      await this.executor.queryOne('SELECT 1 AS value');
      return this;
    }

    mkdirSync(dirname(this.databasePath), { recursive: true });
    const { DatabaseSync } = await import('node:sqlite');
    this.connection = new DatabaseSync(this.databasePath);
    this.connection.exec('PRAGMA foreign_keys = ON;');
    this.connection.exec('PRAGMA journal_mode = WAL;');
    this.connection.exec('PRAGMA busy_timeout = 5000;');
    this.executor = new DatabaseExecutor('sqlite', this.connection);

    return this;
  }

  async migrate() {
    this.ensureConnected();
    if (!this.migrationsDirectory) {
      throw new Error('A migrations directory is required');
    }

    const migrations = this.readMigrations();
    return this.transaction(async (transaction) => {
      if (this.provider === 'postgresql') {
        await transaction.queryOne(
          'SELECT pg_advisory_xact_lock(26042026) AS locked'
        );
      }

      await transaction.executeScript(this.migrationLedgerSchema());
      const appliedRows = await transaction.queryAll(
        'SELECT version, checksum FROM schema_migrations'
      );
      const appliedMigrations = new Map(
        appliedRows.map((row) => [row.version, row.checksum])
      );

      let appliedCount = 0;
      for (const migration of migrations) {
        const previousChecksum = appliedMigrations.get(migration.version);
        if (previousChecksum) {
          if (previousChecksum !== migration.checksum) {
            throw new Error(
              `Migration ${migration.version} changed after it was applied`
            );
          }
          continue;
        }

        await transaction.executeScript(migration.sql);
        await transaction.execute(
          `INSERT INTO schema_migrations (version, checksum)
           VALUES ($1, $2)`,
          [migration.version, migration.checksum]
        );
        appliedCount += 1;
      }

      return appliedCount;
    });
  }

  async initializeSchema() {
    return this.migrate();
  }

  async queryOne(sql, parameters = []) {
    await this.waitForSqliteTransactions();
    return this.executor.queryOne(sql, parameters);
  }

  async queryAll(sql, parameters = []) {
    await this.waitForSqliteTransactions();
    return this.executor.queryAll(sql, parameters);
  }

  async execute(sql, parameters = []) {
    await this.waitForSqliteTransactions();
    return this.executor.execute(sql, parameters);
  }

  async transaction(work) {
    this.ensureConnected();

    if (this.provider === 'sqlite') {
      const previousTransaction = this.sqliteQueue;
      let releaseTransaction;
      this.sqliteQueue = new Promise((resolve) => {
        releaseTransaction = resolve;
      });
      await previousTransaction;

      let transactionStarted = false;
      try {
        this.connection.exec('BEGIN IMMEDIATE');
        transactionStarted = true;
        const result = await work(this.executor);
        this.connection.exec('COMMIT');
        return result;
      } catch (error) {
        if (transactionStarted) {
          this.connection.exec('ROLLBACK');
        }
        throw error;
      } finally {
        releaseTransaction();
      }
    }

    const client = await this.connection.connect();
    const transaction = new DatabaseExecutor('postgresql', client);
    try {
      await client.query('BEGIN');
      const result = await work(transaction);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async isReachable() {
    try {
      const result = await this.queryOne('SELECT 1 AS value');
      return Number(result?.value) === 1;
    } catch {
      return false;
    }
  }

  async close() {
    if (!this.connection) {
      return;
    }

    await this.waitForSqliteTransactions();
    if (this.provider === 'sqlite') {
      this.connection.close();
    } else {
      await this.connection.end();
    }
    this.connection = null;
    this.executor = null;
  }

  ensureConnected() {
    if (!this.connection) {
      throw new Error('Database connection has not been opened');
    }
  }

  async waitForSqliteTransactions() {
    if (this.provider === 'sqlite') {
      await this.sqliteQueue;
    }
  }

  readMigrations() {
    const isPostgresqlMigration = (fileName) => (
      fileName.endsWith('.postgres.sql')
    );
    const files = readdirSync(this.migrationsDirectory)
      .filter((fileName) => {
        if (!/^\d+_[a-z0-9_]+(?:\.postgres)?\.sql$/i.test(fileName)) {
          return false;
        }
        return this.provider === 'postgresql'
          ? isPostgresqlMigration(fileName)
          : !isPostgresqlMigration(fileName);
      })
      .sort((left, right) => left.localeCompare(right, 'en'));

    if (!files.length) {
      throw new Error(`No ${this.provider} migrations were found`);
    }

    return files.map((fileName) => {
      const sql = readFileSync(
        `${this.migrationsDirectory}/${fileName}`,
        'utf8'
      ).replace(/\r\n/g, '\n');
      const version = fileName.replace(/(?:\.postgres)?\.sql$/, '');
      const checksum = createHash('sha256').update(sql).digest('hex');
      return { version, checksum, sql };
    });
  }

  migrationLedgerSchema() {
    const appliedAtType = this.provider === 'postgresql'
      ? 'TIMESTAMPTZ'
      : 'TEXT';
    return `CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at ${appliedAtType} NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;
  }
}
