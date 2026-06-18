import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { AppConfig } from './config/AppConfig.js';
import { Database } from './config/Database.js';
import { IssueRepository } from './repositories/IssueRepository.js';
import { CommentRepository } from './repositories/CommentRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { AuthService } from './services/AuthService.js';
import { DemoUserSeeder } from './services/DemoUserSeeder.js';
import { JwtTokenService } from './services/JwtTokenService.js';
import { IssueService } from './services/IssueService.js';
import { CommentService } from './services/CommentService.js';
import { PasswordHasher } from './services/PasswordHasher.js';
import { UserService } from './services/UserService.js';

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
const issueRepository = new IssueRepository(database);
const commentRepository = new CommentRepository(database);
const passwordHasher = new PasswordHasher();
const demoUserSeeder = new DemoUserSeeder(userRepository, passwordHasher);
await demoUserSeeder.seed(config.demoUsers);
const tokenService = new JwtTokenService(
  config.jwtSecret,
  config.jwtExpiresIn
);
const authService = new AuthService(
  userRepository,
  passwordHasher,
  tokenService
);
const userService = new UserService(userRepository, passwordHasher);
const issueService = new IssueService(issueRepository);
const commentService = new CommentService(commentRepository, issueService);

const app = createApp({
  database,
  authService,
  tokenService,
  userService,
  issueService,
  commentService,
  corsOrigin: config.corsOrigin
});
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
