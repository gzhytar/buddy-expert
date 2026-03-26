import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";

function resolveSqlitePath(): string {
  const url = process.env.DATABASE_URL ?? "file:./data/buddy.db";
  if (url.startsWith("file:")) {
    return url.slice("file:".length);
  }
  return url;
}

const sqlitePath = resolveSqlitePath();
const dir = dirname(sqlitePath);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const client = new Database(sqlitePath);
client.pragma("journal_mode = WAL");
client.pragma("foreign_keys = ON");

export const db = drizzle(client, { schema });
