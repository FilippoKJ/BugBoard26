import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { AppConfig } from './config/AppConfig.js';
import { Database } from './config/Database.js';
import { UserRepository } from './repositories/UserRepository.js';
import { DemoUserSeeder } from './services/DemoUserSeeder.js';
import { PasswordHasher } from './services/PasswordHasher.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const config = new AppConfig();
const migrationPath = resolve(
  currentDirectory,
  '../database/migrations/001_initial_schema.sql'
);
const database = new Database(config.databasePath, migrationPath);

database.connect();
database.initializeSchema();

const userRepository = new UserRepository(database);
const passwordHasher = new PasswordHasher();
const demoUserSeeder = new DemoUserSeeder(userRepository, passwordHasher);
await demoUserSeeder.seed(config.demoUsers);

const app = createApp({ database });
const server = app.listen(config.port, () => {
  console.log(`BugBoard26 backend listening on port ${config.port}`);
});

function shutDown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutDown('SIGINT'));
process.on('SIGTERM', () => shutDown('SIGTERM'));

export { app, database, server };
