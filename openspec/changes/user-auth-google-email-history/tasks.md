## 1. Závislosti a schéma databáze

- [x] 1.1 Přidat balíček `@auth/drizzle-adapter` (a případné typové závislosti) a ověřit kompatibilitu s `next-auth@5` v projektu.
- [x] 1.2 Navrhnout a zapsat do Drizzle tabulky podle dokumentace adaptéru (`user`, `account`, `session`, `verificationToken` nebo aktuální ekvivalent) včetně vazeb na existující doménovou tabulku uživatelů.
- [x] 1.3 Upravit `users.password_hash` na nullable a vygenerovat SQL migraci; migraci otestovat na kopii dat (stávající uživatelé s heslem zůstanou funkční).
- [x] 1.4 Spustit migrace na dev/preview (`npm run db:migrate`) a ověřit schéma v Drizzle Studio / SQL klientovi.

## 2. Auth.js: Google, adaptér a identita

- [x] 2.1 Rozšířit `auth.ts` / `auth.config.ts` o provider `Google` a Drizzle adaptér; doplnit `AUTH_SECRET`, `AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` do `.env.example` s krátkým komentářem.
- [x] 2.2 Implementovat mapování mezi záznamem Auth.js a doménovým `users.id` (callbacks / events) tak, aby `session.user.id` vždy odpovídalo FK v `preparation_sessions` a `reflection_sessions`.
- [x] 2.3 Upravit Credentials `authorize`: zamítnout přihlášení heslem, pokud uživatel nemá uložený hash hesla; zobrazit srozumitelnou českou chybu na klientovi (query param nebo `auth()` error handling na login stránce).
- [x] 2.4 Vyřešit pravidlo pro stejný e-mail u Google a u účtu s heslem (propojení vs. odmítnutí) podle rozhodnutí z `design.md` a zapsat chování do kódu a krátkého komentáře.
- [x] 2.5 Otestovat lokálně a na preview: přihlášení Google, odhlášení, přihlášení e-mailem/heslem u stávajícího uživatele, nový OAuth uživatel bez hesla.

## 3. Přihlašovací UI

- [x] 3.1 Upravit `app/login` (formulář) o tlačítko „Přihlásit se přes Google“ (`signIn('google')`) a sjednotit české texty podle specifikace.
- [x] 3.2 Zobrazit uživatelsky vstřícné hlášky při chybách OAuth a při zamítnutí přihlášení heslem (bez úniku interních detailů).

## 4. Historie příprav a reflexí

- [x] 4.1 Přidat serverové funkce pro výpis **všech** příprav uživatele (draft i complete), seřazených od nejnovějších, bez omezení jen na „čekající na reflexi“.
- [x] 4.2 Upravit nebo doplnit stránku seznamu příprav tak, aby splňovala spec `user-consultation-history` (stavy, datumy, prázdný stav, odkazy na `/preparations/[id]`); zvážit ponechání samostatného pohledu „čekající“ jako sekce nebo filtr.
- [x] 4.3 Zkontrolovat seznam reflexí (`/reflections`): doplnit chybějící požadavky specifikace (řazení, draft vs. dokončeno, prázdný stav, odkazy na `/reflections/[id]`).
- [x] 4.4 Ověřit, že `getPreparationForUser` / `getReflectionForUser` a všechny mutace striktně filtrují podle `session.user.id` (scénář cizího ID v URL).

## 5. Dokončení a nasazení

- [x] 5.1 Zaregistrovat OAuth klienta v Google Cloud Console (redirect URI pro lokál i Vercel preview/prod) a zdokumentovat kroky pro provozovatele stručně v existující dev dokumentaci nebo v komentáři u `.env.example` (bez duplikace zbytečného markdownu).
- [x] 5.2 Projít manuální checklist před produkcí: env na Vercelu, callback URL, smoke test přihlášení a historie.
- [x] 5.3 Po implementaci spustit `/opsx:verify` (nebo ekvivalent `openspec verify`) vůči této změně a podle výsledku upravit kód nebo spec.
