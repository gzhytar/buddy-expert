## 1. Závislosti a konfigurace

- [x] 1.1 Přidat `@neondatabase/serverless` a zajistit kompatibilní verzi `drizzle-orm`; z `dependencies` / `devDependencies` odstranit `better-sqlite3` tam, kde po migraci nebude potřeba.
- [x] 1.2 Upravit `drizzle.config.ts` na dialect `postgresql` a `dbCredentials.url` z `process.env.DATABASE_URL` (bez výchozího SQLite souboru).
- [x] 1.3 Aktualizovat `.env.example`: povinný Postgres `DATABASE_URL`, stručná poznámka k Neon (dev větev / pooling).

## 2. Schéma a migrace

- [x] 2.1 Přepsat `lib/db/schema.ts` z `drizzle-orm/sqlite-core` na `drizzle-orm/pg-core` a sjednotit typy sloupců s Postgres (včetně enumů a výchozích hodnot).
- [x] 2.2 Vygenerovat nové Postgres migrace (`drizzle-kit generate`) a sladit složku `drizzle/` — archivovat nebo odstranit SQLite-specifické migrace podle týmové dohody, aby jediný zdroj pravdy byly Postgres SQL soubory.
- [x] 2.3 Ověřit `drizzle-kit push` nebo `migrate` proti čisté Neon / lokální instanci a doplnit dokumentaci kroků pro vývojáře.

## 3. Runtime a skripty

- [x] 3.1 Nahradit obsah `lib/db/index.ts` inicializací Neon klienta a `drizzle-orm/neon-http` (nebo schválenou alternativou z designu); odstranit vytváření adresáře pro SQLite soubor.
- [x] 3.2 Upravit `scripts/seed.ts` tak, aby importoval stejný `db` jako aplikace (bez přímého SQLite).
- [x] 3.3 Odstranit nebo nahradit `scripts/ensure-sqlite-columns.ts` a upravit `package.json` skripty `db:ensure`, `build`, `dev` tak, aby nepředpokládaly SQLite (např. migrace před buildem v CI podle zvoleného workflow).

## 4. Ověření a nasazení

- [x] 4.1 Spustit `npm run lint` a `npm run build` s platným `DATABASE_URL` na Postgres.
- [ ] 4.2 Ručně projít kritická flow (přihlášení, příprava, reflexe, orientace čtení z DB) proti Neon dev.
- [ ] 4.3 Nastavit `DATABASE_URL` na Vercelu (a případně preview) a ověřit nasazení po merge.

## 5. Specifikace (po implementaci)

- [x] 5.1 Po dokončení kódu spustit `/opsx:sync` nebo ekvivalentní krok pro sloučení delty `platform-database` do `openspec/specs/`, pokud to workflow projektu vyžaduje před archivem změny.
