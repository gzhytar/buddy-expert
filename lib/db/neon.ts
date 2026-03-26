/**
 * Neon + Drizzle (bez `server-only`) — sdílené pro Next i CLI skripty (seed).
 * Aplikace importuje `db` z `@/lib/db`; ten modul přidává `server-only`.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Use a Neon Postgres connection string (see .env.example).",
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
