import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export class AppConfig {
  constructor(environment = process.env) {
    this.port = AppConfig.parsePort(environment.PORT ?? '3000');
    this.nodeEnvironment = environment.NODE_ENV ?? 'development';
    this.databasePath = environment.DATABASE_PATH
      ? resolve(environment.DATABASE_PATH)
      : resolve(backendRoot, 'database', 'bugboard.sqlite');
    this.jwtSecret = environment.JWT_SECRET
      ?? 'bugboard26-development-only-secret-change-before-production';
    this.jwtExpiresIn = environment.JWT_EXPIRES_IN ?? '1h';
    this.corsOrigin = environment.CORS_ORIGIN ?? 'http://localhost:5173';

    if (this.nodeEnvironment === 'production' && !environment.JWT_SECRET) {
      throw new Error('JWT_SECRET is required in production');
    }

    this.demoUsers = [
      AppConfig.parseDemoUser(environment, 'ADMIN'),
      AppConfig.parseDemoUser(environment, 'USER')
    ].filter(Boolean);
  }

  static parsePort(value) {
    const port = Number(value);

    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new TypeError('PORT must be an integer between 1 and 65535');
    }

    return port;
  }

  static parseDemoUser(environment, role) {
    const email = environment[`DEMO_${role}_EMAIL`]?.trim() ?? '';
    const password = environment[`DEMO_${role}_PASSWORD`] ?? '';

    if (!email && !password) {
      return null;
    }

    if (!email || !password) {
      throw new Error(
        `DEMO_${role}_EMAIL and DEMO_${role}_PASSWORD must be configured together`
      );
    }

    return { email, password, role };
  }
}
