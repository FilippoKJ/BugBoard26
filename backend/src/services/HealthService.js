export class HealthService {
  constructor(database) {
    this.database = database;
  }

  getStatus() {
    const databaseReachable = this.database.isReachable();

    return {
      status: databaseReachable ? 'ok' : 'degraded',
      service: 'bugboard26-backend',
      database: databaseReachable ? 'reachable' : 'unreachable',
      timestamp: new Date().toISOString()
    };
  }
}
