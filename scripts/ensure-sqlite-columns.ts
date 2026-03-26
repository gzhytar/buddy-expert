/**
 * Idempotent SQLite patches for local dev when the DB file predates a migration.
 * Skips when DATABASE_URL is not a file: SQLite URL (e.g. Postgres in prod).
 */
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

function resolveSqlitePath(): string | null {
  const url = process.env.DATABASE_URL ?? "file:./data/buddy.db";
  if (!url.startsWith("file:")) return null;
  return url.slice("file:".length);
}

const sqlitePath = resolveSqlitePath();
if (!sqlitePath) {
  console.log("ensure-sqlite-columns: skip (non-file DATABASE_URL)");
  process.exit(0);
}

const dir = dirname(sqlitePath);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const client = new Database(sqlitePath);
try {
  const tableExists = client
    .prepare(
      "SELECT 1 FROM sqlite_master WHERE type='table' AND name='principles'",
    )
    .get();
  if (!tableExists) {
    console.log("ensure-sqlite-columns: no principles table yet, skip");
    process.exit(0);
  }

  const cols = client.prepare("PRAGMA table_info(principles)").all() as {
    name: string;
  }[];
  const names = new Set(cols.map((c) => c.name));

  if (!names.has("learning_tips")) {
    client.exec(
      "ALTER TABLE principles ADD COLUMN learning_tips text NOT NULL DEFAULT ''",
    );
    console.log("ensure-sqlite-columns: added principles.learning_tips");
  }
  if (!names.has("field_stories")) {
    client.exec(
      "ALTER TABLE principles ADD COLUMN field_stories text NOT NULL DEFAULT ''",
    );
    console.log("ensure-sqlite-columns: added principles.field_stories");
  }
} finally {
  client.close();
}
