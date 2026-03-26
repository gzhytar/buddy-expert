import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { spawnSync } from "child_process";

const root = process.cwd();
for (const name of [".env.local", ".env"]) {
  const p = resolve(root, name);
  if (existsSync(p)) {
    config({ path: p, override: false });
  }
}

const result = spawnSync("npx", ["tsx", "scripts/seed.ts"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
  cwd: root,
});

process.exit(result.status ?? 1);
