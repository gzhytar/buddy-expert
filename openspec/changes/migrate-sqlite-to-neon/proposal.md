## Why

Aplikace je nasazená na Vercelu; serverless prostředí nemá trvalý souborový systém vhodný pro SQLite. Bez Postgresu v cloudu nelze spolehlivě persistovat uživatelská data v produkci. Neon (managed Postgres) je v konfiguraci projektu už plánovaný cíl — migrace odstraní blokátor nasazení a sjednotí stack s doporučením v `openspec/config.yaml`.

## What Changes

- Přechod z Drizzle + `better-sqlite3` na Postgres: buď `@neondatabase/serverless` / `postgres` + `drizzle-orm/neon-http` (nebo ekvivalent vhodný pro Edge/serverless), nebo synchronní driver tam, kde běží Node runtime — **konkrétní volba v designu**.
- Úprava `lib/db/schema.ts` z `drizzle-orm/sqlite-core` na `drizzle-orm/pg-core` (typy, výchozí hodnoty, případné rozdíly enumů).
- `drizzle.config.ts`: dialect `postgresql`, credentials z `DATABASE_URL` (Neon connection string).
- Nové SQL migrace pro Postgres (nebo regenerace a nahrazení sqlite-specifických migrací — **BREAKING** pro existující sqlite-only workflow).
- Lokální vývoj: buď lokální Postgres, nebo ponechaný SQLite přes podmíněnou konfiguraci — **BREAKING** pokud se odstraní SQLite úplně bez náhrady pro dev.
- Dokumentace / `.env.example`: Neon `DATABASE_URL`, poznámka k seedu a migracím.
- Skripty (`db:ensure`, seed): musí cílit na stejný driver a schéma jako runtime.

## Capabilities

### New Capabilities

- `platform-database`: Požadavky na provozní úložiště dat — Postgres (Neon) v produkci, konfigurace připojení, reprodukovatelné migrace schématu a konzistence s Drizzle schématem; bez změny doménového chování příprav a reflexí.

### Modified Capabilities

- _(žádné — funkční požadavky přípravy, reflexe a orientace zůstávají; mění se pouze implementační vrstva a provozní prostředí.)_

## Impact

- `lib/db/index.ts`, `lib/db/schema.ts`, `drizzle.config.ts`, složka `drizzle/` (migrace).
- `package.json` / závislosti: odstranění nebo omezení `better-sqlite3`, přidání Neon/Postgres klienta.
- `scripts/ensure-sqlite-columns.ts` — přejmenovat/refaktorovat nebo nahradit čistě migracemi Drizzle (název a chování).
- CI / Vercel: proměnná `DATABASE_URL` (Neon), případně `DATABASE_URL` pro preview větve.
- Vývojáři: nová závislost na Postgres URL nebo explicitní lokální Postgres; existující `data/buddy.db` zůstane mimo git (volitelný one-off export dat, není součástí scope, pokud není požadováno).
