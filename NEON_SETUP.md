# Neon PostgreSQL setup

The application uses Neon PostgreSQL in deployed environments and keeps SQLite
as a zero-configuration option for local development.

## Neon MCP in Codex

The project-level `.codex/config.toml` registers Neon's official remote MCP
server at `https://mcp.neon.tech/mcp`. It uses Neon OAuth, so no API key or
database password is stored in Git.

After opening the project in a new Codex task, authorize Neon when Codex asks.
The MCP server can then create a project or development branch, run SQL and
return the connection strings. Use MCP only against development or testing
branches, as recommended by Neon.

## Connection strings

Create `.env` in the project root from `.env.example` and set:

```dotenv
# Pooled URL (hostname contains -pooler) used by the running application.
DATABASE_URL=postgresql://USER:PASSWORD@ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=require

# Direct URL used for migrations and one-time imports. Optional but recommended.
DATABASE_MIGRATION_URL=postgresql://USER:PASSWORD@ENDPOINT.REGION.aws.neon.tech/neondb?sslmode=require
```

`DATABASE_MIGRATION_URL` falls back to `DATABASE_URL` when omitted. Never commit
the real `.env` file. The application reports `databaseProvider: "postgresql"`
from `/api/health` after it connects to Neon.

## Versioned migrations

Migrations in `backend/database/migrations` are applied in filename order. The
backend records their SHA-256 checksums in `schema_migrations`, refuses changed
historical migrations and uses a PostgreSQL advisory lock to prevent two app
instances from migrating concurrently.

The backend applies pending migrations before accepting requests. They can also
be run explicitly. Backend commands automatically load the root `.env` and an
optional `backend/.env` override:

```powershell
cd backend
pnpm db:migrate
```

## Import the existing SQLite data

The importer preserves IDs, users, password hashes, issues, images, comments
and timestamps. It also closes every archived issue. For safety, it refuses to
write if Neon already contains any application data.

Run it once, before starting the app against a new Neon database:

```powershell
cd backend
pnpm db:import-sqlite
```

The command reads `DATABASE_PATH` (or `backend/database/bugboard.sqlite`) and
writes through `DATABASE_MIGRATION_URL`. Keep a backup of the SQLite file until
the cloud data has been verified.

When `DATABASE_URL` is empty, the backend continues to use SQLite.
