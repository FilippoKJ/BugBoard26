export class HealthService {
  constructor(database) {
    this.database = database;
  }

  async getStatus() {
    const databaseReachable = await this.database.isReachable();

    return {
      status: databaseReachable ? 'ok' : 'degraded',
      service: 'bugboard26-backend',
      databaseProvider: this.database.provider,
      database: databaseReachable ? 'reachable' : 'unreachable',
      timestamp: new Date().toISOString()
    };
  }
}
