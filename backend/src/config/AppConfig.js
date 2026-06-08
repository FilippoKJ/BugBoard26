import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export class AppConfig {
  constructor(environment = process.env) {
    this.port = AppConfig.parsePort(environment.PORT ?? '3000');
    this.databasePath = environment.DATABASE_PATH
      ? resolve(environment.DATABASE_PATH)
      : resolve(backendRoot, 'database', 'bugboard.sqlite');
    this.demoUsers = [
      {
        email: environment.DEMO_ADMIN_EMAIL ?? 'admin@softengunina.it',
        password: environment.DEMO_ADMIN_PASSWORD ?? 'Admin123!',
        role: 'ADMIN'
      },
      {
        email: environment.DEMO_USER_EMAIL ?? 'user@softengunina.it',
        password: environment.DEMO_USER_PASSWORD ?? 'User123!',
        role: 'USER'
      }
    ];
  }

  static parsePort(value) {
    const port = Number(value);

    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new TypeError('PORT must be an integer between 1 and 65535');
    }

    return port;
  }
}
