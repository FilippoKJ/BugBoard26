import { Database } from './Database.js';

export async function runDatabaseMigrations(config) {
  const database = new Database({
    databasePath: config.databasePath,
    databaseUrl: config.databaseMigrationUrl,
    migrationsDirectory: config.migrationsDirectory
  });

  await database.connect();
  try {
    const appliedCount = await database.migrate();
    return { appliedCount, provider: database.provider };
  } finally {
    await database.close();
  }
}
