# Neon PostgreSQL setup

The backend supports Neon PostgreSQL in production and SQLite for local development.

## Configure Neon

1. Create a project in the Neon Console.
2. Open **Connect** and copy a pooled connection string. Its hostname contains
   `-pooler` and the URL includes `sslmode=require`.
3. Copy `.env.example` to `.env` and set:

   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```

4. Keep `JWT_SECRET` and demo account passwords outside source control.
5. Start the application with `docker compose up --build -d`.

On startup, the backend connects to Neon and initializes the PostgreSQL schema.
The health endpoint reports `databaseProvider: "postgresql"` when Neon is in use.

If `DATABASE_URL` is empty, the backend keeps using the SQLite database at
`DATABASE_PATH`. This makes local development work without a cloud dependency.

## Existing SQLite data

The two databases are intentionally independent. Setting `DATABASE_URL` creates
the schema in Neon but does not upload an existing SQLite file. Export or import
existing data separately before switching a production environment.
