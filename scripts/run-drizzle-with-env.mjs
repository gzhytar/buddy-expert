/**
 * Načte .env.local / .env (jako db:migrate) a spustí drizzle-kit s předanými argumenty.
 * Použití: node scripts/run-drizzle-with-env.mjs push
 */
import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { spawnSync } from "child_process";

const args = process.argv.slice(2);
if (!args.length) {
  console.error(
    "Usage: node scripts/run-drizzle-with-env.mjs <drizzle-kit subcommand> [options]",
  );
  process.exit(1);
}

const root = process.cwd();
for (const name of [".env.local", ".env"]) {
  const p = resolve(root, name);
  if (existsSync(p)) {
    config({ path: p, override: false });
  }
}

const result = spawnSync("npx", ["drizzle-kit", ...args], {
  stdio: "inherit",
  shell: true,
  env: process.env,
  cwd: root,
});

process.exit(result.status ?? 1);
