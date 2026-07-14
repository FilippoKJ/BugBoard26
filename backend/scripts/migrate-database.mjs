import { AppConfig } from '../src/config/AppConfig.js';
import { runDatabaseMigrations } from '../src/config/runDatabaseMigrations.js';

const result = await runDatabaseMigrations(new AppConfig());
console.log(
  `Database ${result.provider}: ${result.appliedCount} migration(s) applied`
);
