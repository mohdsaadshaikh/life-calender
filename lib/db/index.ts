import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Ensure we have a database connection string. If not set, use a dummy local fallback
// to prevent crash at startup/build time.
if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("WARNING: DATABASE_URL is not set in production environment.");
}

const dbUrl = connectionString || "postgresql://postgres:postgres@localhost:5432/life_calendar";

// Prevent multiple connections during hot-reloads in Next.js development.
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(dbUrl, {
  prepare: false, // Disable prefetch for compatibility with connection poolers like PgBouncer
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
