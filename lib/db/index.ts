import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Ensure we have a database connection string. If not set, use a dummy local fallback
// to prevent crash at startup/build time.
if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("WARNING: DATABASE_URL is not set in production environment.");
}

const dbUrl = connectionString || "postgresql://postgres:postgres@localhost:5432/life_calendar";

const isNeon = dbUrl.includes("neon.tech");

export const db = isNeon
  ? drizzleNeon(neon(dbUrl), { schema })
  : drizzlePg(postgres(dbUrl, { prepare: false }), { schema });

