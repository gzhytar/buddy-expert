## Context

Dnes aplikace používá Drizzle ORM nad `better-sqlite3` a soubor `data/buddy.db` (viz `lib/db/index.ts`, `drizzle.config.ts` s dialectem `sqlite`). Skript `scripts/ensure-sqlite-columns.ts` doplňuje chybějící sloupce u starších SQLite souborů a při ne-SQLite `DATABASE_URL` se přeskočí. Produkt má být na Vercelu; SQLite na serverless není udržitelný. Konfigurace OpenSpec už počítá s Neon (Postgres) jako produkčním cílem.

## Goals / Non-Goals

**Goals:**

- Provozní databáze na PostgreSQL přes Neon s `DATABASE_URL`.
- Jedno Drizzle schéma v `pg-core`, migrace generované a aplikovatelné přes `drizzle-kit`.
- Funkční `build` / `dev` / seed proti Postgresu po nastavení env.
- Odstranění závislosti běhu na `better-sqlite3` v produkční cestě.

**Non-Goals:**

- Automatický import dat ze stávajících lokálních `.db` souborů (lze řešit samostatně dump/importem).
- Změna doménových pravidel příprav/reflexí nebo UI textů.
- Přechod z Drizzle na jiný ORM.

## Decisions

1. **Drizzle + Postgres typy**  
   Přepsat `lib/db/schema.ts` z `sqlite-core` na `pg-core` (např. `text`, `integer` → vhodné Postgres typy; enumy jako `text` s enum v Drizzle nebo check — zachovat stávající sémantiku).  
   *Alternativa zvážená:* dual-schema (SQLite + Postgres) — zamítnuto kvůli dvojí údržbě a chybám parity.

2. **Klient pro Neon na Vercelu**  
   Použít `@neondatabase/serverless` a `drizzle-orm/neon-http` (HTTP) pro dotazy z serverového kódu Next.js, což je běžný vzor pro serverless Postgres na Vercelu.  
   *Alternativa:* `postgres` (postgres.js) s TCP — vyžaduje Node runtime a funguje, ale Neon dokumentuje serverless driver jako primární pro jejich platformu; HTTP varianta redukuje problémy s connection limity na cold startech.

3. **Migrace**  
   Vygenerovat novou sadu migrací pro Postgres (po převodu schématu), nebo jednorázově `drizzle-kit push` jen pro dev a pro repozitář preferovat verzované SQL migrace. Doporučení: **verzované migrace** v `drizzle/` pro reprodukovatelnost CI a produkce.  
   Stávající SQLite SQL migrace v repozitáři přestanou platit jako zdroj pravdy — nahradí je Postgres migrace (**BREAKING** pro týmy spoléhající na staré soubory).

4. **Lokální vývoj**  
   Jednotný cíl: vývojář nastaví `DATABASE_URL` na Neon „development“ branch nebo na lokální Postgres (Docker). SQLite jako výchozí režim se odstraní z `lib/db/index.ts`, aby nebyly dva runtime příběhy.  
   *Alternativa:* ponechat SQLite pro dev — zamítnuto v této změně kvůli divergenci typů a testů.

5. **Skript `ensure-sqlite-columns`**  
   Po přechodu na výhradně Postgres odstranit nebo zjednodušit na no-op s vysvětlením v README; sloupce zajistí migrace Drizzle. `package.json` skripty `db:ensure` / `build` upravit tak, aby volaly pouze to, co dává smysl (např. `drizzle-kit migrate` před buildem v CI, nebo dokumentovaný manuální krok).

6. **Seed**  
   `scripts/seed.ts` MUST používat stejný `db` export jako aplikace (Neon/Postgres driver), ne přímý `better-sqlite3`.

## Risks / Trade-offs

- **[Riziko] Regrese při mapování typů** (SQLite text vs Postgres timestamp) → **Mitigace:** explicitně definovat sloupce času jako `timestamp` nebo zachovat ISO text v `text`, konzistentně se stávající aplikační logikou; otestovat seed a kritické flow.  
- **[Riziko] Náklady Neon / limity připojení** → **Mitigace:** použít serverless driver; monitorovat Neon dashboard; connection string z Vercelu env.  
- **[Riziko] Ztráta lokální rychlosti „jen soubor“** → **Mitigace:** bezplatná Neon dev větev nebo lokální Docker Postgres.  
- **[Trade-off] BREAKING změna pro vývojáře bez Postgres** → dokumentovat v `.env.example` a krátkém README oddílu.

## Migration Plan

1. Vytvořit Neon projekt a databázi; získat `DATABASE_URL` (pooling URL dle doporučení Neon pro serverless).  
2. Převést schéma na `pg-core`, vygenerovat Postgres migrace, aplikovat na Neon.  
3. Nahradit `lib/db/index.ts` inicializací Neon + Drizzle.  
4. Upravit závislosti (`package.json`), odstranit `better-sqlite3` z runtime cesty (případně ponechat jen ve devDependencies pokud by nějaký skript ještě dočasně potřeboval — ideálně ne).  
5. Aktualizovat `db:ensure` / `build` skripty a dokumentaci.  
6. Nasadit na Vercel s nastaveným `DATABASE_URL`.  
7. **Rollback:** obnovit předchozí deployment a SQLite větev kódu (git); Postgres instance ponechat pro opakovaný pokus; data na Neon zůstanou oddělená od starého SQLite.

## Open Questions

- Zda použít pooled connection string (`-pooler`) vs direct pro `drizzle-kit` operace — ověřit v Neon dokumentaci pro migrace vs runtime.  
- Zda všechny DB dotazy běží výhradně v Node runtime (žádný Edge) — pokud ano, případně lze zvážit TCP `postgres.js`; aktuální předpoklad: Node + `neon-http` je dostačující.
