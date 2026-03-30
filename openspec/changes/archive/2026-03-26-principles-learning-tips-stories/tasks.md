## 1. Databáze a model

- [x] 1.1 Rozšířit `lib/db/schema.ts` u entity principů o dva povinné textové sloupce (např. `learningTips`, `fieldStories`) podle `design.md`.
- [x] 1.2 Vygenerovat a zkontrolovat Drizzle migraci; ověřit kompatibilitu typů s Postgres.
- [x] 1.3 Aktualizovat typ `Principle` / exporty tak, aby je používaly dotazy a UI.

## 2. Seed a obsah

- [x] 2.1 Rozšířit `scripts/seed.ts`: pro každý z 10 principů Konzultantského desatera doplnit neprázdný český text „Tipy a triky“ a „Příběhy z praxe“ (ilustrativní situace, neutrální tón, bez moralizování).
- [x] 2.2 V `onConflictDoUpdate` zahrnout aktualizaci nových sloupců, aby re-seed obsah sjednotil.

## 3. Dotazy a server

- [x] 3.1 Ujistit se, že `getPrinciplesOrdered()` (nebo ekvivalent) vrací nová pole pro všechny principy.

## 4. UI

- [x] 4.1 Upravit `OrientationPrincipleCard`: pod shrnutím zobrazit sekce s nadpisy „Tipy a triky“ a „Příběhy z praxe“, renderovat víceřádkový text podle rozhodnutí v `design.md` (např. `pre-line`).
- [x] 4.2 Zajistit přístupnost: sémantické nadpisy nebo skupina s `aria-labelledby` pro obě sekce.
- [x] 4.3 Krátce upravit úvodní odstavec na `/orientation/principles`, pokud je potřeba zmínit nové výukové sekce (volitelné, konzistentně s tónem stránky).

## 5. Ověření

- [x] 5.1 Lokálně spustit migraci + seed, otevřít `/orientation/principles` a vizuálně zkontrolovat všech 10 karet (desktop i úzký viewport).
- [x] 5.2 Projít checklist proti `specs/orientation-principles-learning/spec.md` (včetně scénáře s čtečkou, pokud je k dispozici).
