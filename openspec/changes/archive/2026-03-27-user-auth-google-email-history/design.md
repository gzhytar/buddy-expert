## Context

Aplikace už používá Auth.js (NextAuth v5) s JWT relací a přihlášením přes Credentials (e-mail + bcrypt heslo). Uživatelské záznamy, přípravy a reflexe jsou v PostgreSQL (Neon) přes Drizzle; `user_id` na přípravách a reflexích už existuje. Chybí OAuth poskytovatel (Google) a u tabulky `users` je dnes povinný `password_hash`, což brání čistému účtu „jen přes Google“. Uživatelé nemají jedno místo v UI pro přehled vlastních příprav a reflexí.

## Goals / Non-Goals

**Goals:**

- Umožnit přihlášení přes **Google** a zachovat přihlášení **e-mailem a heslem** pro existující i nové účty s heslem.
- Persistovat OAuth účty a (volitelně) relace v Postgresu přes schéma slučitelné s **Auth.js + Drizzle adaptérem**, aby byly tokeny a propojení účtů konzistentní.
- Uvolnit model uživatele tak, aby **heslo bylo volitelné** pro uživatele vytvořené přes OAuth.
- Doplnit **přehled historie** (přípravy a reflexe) viditelný jen pro přihlášeného vlastníka, s odkazem do stávajících editorů/detailů.

**Non-Goals:**

- Magic link, vícefaktorová autentizace, správa organizací a rolí v aplikaci.
- Slučování dvou různých e-mailů do jedné identity bez explicitního produktového rozhodnutí (viz otevřené otázky).
- Export dat, administrace uživatelů, notifikace e-mailem.

## Decisions

1. **Google OAuth v Auth.js**  
   **Rozhodnutí:** Přidat oficiální provider `Google` do konfigurace NextAuth vedle Credentials.  
   **Důvod:** Jednotný stack, podpora na Vercelu, minimum vlastní bezpečnostní logiky.  
   **Alternativa:** Samostatný OAuth klient — zbytečná duplicita a rizika.

2. **Drizzle adaptér pro Auth.js**  
   **Rozhodnutí:** Zavést tabulky `user` / `account` / `session` / `verificationToken` (nebo ekvivalent podle verze adaptéru) generované a udržované v souladu s `@auth/drizzle-adapter` a sladit je s existující doménovou tabulkou uživatelů.  
   **Důvod:** OAuth vyžaduje ukládání `providerAccountId`, refresh tokenů apod.; JWT-only bez úložiště znesnadňuje správu účtů a odhlášení napříč zařízeními.  
   **Alternativa:** Jen JWT bez DB pro OAuth — menší složitost, ale horší správa relací a účtů; pro MVP s historickými daty per user je DB persistace vhodnější.

3. **Mapování `User` Auth.js ↔ doménový `users`**  
   **Rozhodnutí:** Při přihlášení (callbacks `signIn` / `jwt` / event `createUser` podle potřeby) udržovat **jeden interní `users.id`**, který se propíše do JWT `sub` a používá se ve foreign keys příprav/reflexí. Konkrétní strategie implementace (sloučená tabulka vs. synchronizace ID) se zvolí tak, aby migrace nezlomila existující řádky.  
   **Důvod:** Stávající dotazy a RLS-chování na úrovni aplikace očekávají `userId` v doménových tabulkách.  
   **Alternativa:** Přejmenovat doménové FK na auth tabulku 1:1 — větší refactor migrací.

4. **`password_hash` volitelný**  
   **Rozhodnutí:** Migrace na `password_hash` nullable; Credentials provider povolí přihlášení jen uživatelům s neprázdným hashem.  
   **Důvod:** Google uživatelé nemají lokální heslo.  
   **Alternativa:** Fiktivní hash — bezpečnostně a datově nepřijatelné.

5. **Historie v UI**  
   **Rozhodnutí:** Nová stránka (nebo dvě sekce na jedné) pod App Routerem se serverovým načtením seznamů podle `session.user.id`, řazení od nejnovějších, stavy draft / dokončeno, odkazy na existující routy úprav.  
   **Důvod:** Rychlá hodnota bez měnící se doménové logiky ukládání.  
   **Alternativa:** Jen rozšířit dashboard — záleží na IA; lze iterovat.

## Risks / Trade-offs

- **[Riziko] Duplicitní uživatelé** (stejný e-mail, nejdřív heslo, pak Google nebo naopak) **→ [Mitigace]** jednoznačné pravidlo v `signIn` (např. propojení účtu jen při shodě ověřeného e-mailu z Google a existujícího uživatele) nebo odmítnutí s srozumitelnou českou chybou; dokumentovat v implementaci.
- **[Riziko] Chybějící nebo špatné env na Vercelu** (`AUTH_SECRET`, callback URL, Google klient) **→ [Mitigace]** `.env.example`, checklist v úkolech, ověření redirect URI.
- **[Riziko] Složitost sladění Auth.js schématu s existující `users`** **→ [Mitigace]** malý experimentální krok v úkolu „spike“ nebo první PR jen s migrací a jedním flow.
- **Trade-off:** Persistované session v DB zvyšuje počet tabulek a migrací oproti čistému JWT — výhra je správa OAuth účtů a konzistence s dokumentací Auth.js.

## Migration Plan

1. Přidat Drizzle migraci: nové auth tabulky (podle adaptéru), `password_hash` nullable, indexy/unikátní klíče podle adaptéru.
2. Nasadit na dev/preview, spustit migrace, ověřit přihlášení stávajícím heslem a novým Google účtem.
3. Nastavit Google OAuth credentials pro produkci a Vercel env; nasadit produkci.
4. **Rollback:** předchozí migrace zpět pouze pokud nevznikly OAuth účty závislé na nových tabulkách; jinak reverzní migrace, která zachová data nebo je archivuje (dle stavu rolloutu).

## Open Questions

- Má se **automaticky spojit** účet Google s existujícím účtem se stejným e-mailem, nebo má uživatel nejdřív nastavit heslo / potvrdit e-mail?
- Má být historie **jedna kombinovaná časová osa**, nebo **dvě záložky** (přípravy / reflexe)?
- Potřebuje JIC **registraci** nových e-mailových účtů z UI, nebo zůstane pouze seed/administrátorské zakládání uživatelů?
