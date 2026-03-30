# Databáze: Postgres (Neon)

## Požadavky

- Účet [Neon](https://neon.tech) a projekt s databází.
- V konzoli Neon zkopírujte connection string (pro serverless často **pooled** varianta).
- Lokálně: soubor `.env.local` s `DATABASE_URL=postgresql://...` (viz `.env.example`).

## První nastavení

1. Zkopírujte `.env.example` → `.env.local` a doplňte `DATABASE_URL` a `AUTH_SECRET`.
2. Aplikujte schéma: `npm run db:migrate`
3. (Volitelně) naplňte data: `npm run db:seed`

## Běžné příkazy

| Příkaz | Účel |
|--------|------|
| `npm run db:migrate` | Aplikuje SQL migrace z `drizzle/` proti DB z `DATABASE_URL` |
| `npm run db:generate` | Po změně `lib/db/schema.ts` vygeneruje novou migraci |
| `npm run db:seed` | Demo uživatel, Konzultantské desatero (principy) a role |
| `npm run db:studio` | Drizzle Studio (potřebuje platný `DATABASE_URL`) |

Skripty `db:migrate`, `db:push` a `db:studio` spouští Drizzle přes `scripts/run-drizzle-with-env.mjs`, který nejdřív načte `.env.local` / `.env` (na Vercelu už proměnné v procesu jsou, soubor není nutný).

## Vercel

V **Settings → Environment Variables** nastavte `DATABASE_URL` pro Production a případně Preview (doporučená samostatná Neon větev nebo databáze pro preview).

**Build Command** nastavte na `npm run build:with-migrate` (spustí `db:migrate` a pak `next build`). Lokálně často stačí `npm run build` jen ke kontrole kompilace; migrace před prvním během: `npm run db:migrate`.

Pro migrace použijte u Neon **direct** connection string (ne pooler), pokud `drizzle-kit migrate` selže přes pooler.

## Poznámka k migraci ze SQLite

Starý soubor `data/buddy.db` se do repozitáře necommituje. Data z SQLite je nutné znovu vytvořit migrací + seedem, případně jednorázově exportovat/importovat mimo tento návod.
