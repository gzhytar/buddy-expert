## 1. Datový model a migrace

- [x] 1.1 Rozšířit `lib/db/schema.ts` o tabulku `preparation_sessions` (id, user_id, status, consultation_label, occurred_at, focus_note, timestamps).
- [x] 1.2 Přidat tabulku `preparation_roles` pro vazbu M:N mezi přípravou a rolemi (id, preparation_id, role_id, type: 'strengthen' | 'downregulate').
- [x] 1.3 Přidat pole `preparation_id` do tabulky `reflection_sessions` v `schema.ts`.
- [x] 1.4 Vygenerovat a spustit migrace pro SQLite (lokálně).

## 2. Refaktoring a sdílené komponenty

- [x] 2.1 Refaktorovat komponentu pro výběr rolí do univerzálního `RoleSelector` (podpora pro `PreparationMode` s polaritou a `ReflectionMode` s kalibrací).
- [x] 2.2 Implementovat animace výběru rolí pomocí `framer-motion` (spring animace pro přidání, layout transitions pro změnu priority).
- [x] 2.3 Vytvořit UI komponentu `PlanVsRealitySummary` pro vizualizaci porovnání záměru a skutečnosti.

## 3. Schopnost: Příprava před konzultací (`consultation-preparation`)

- [x] 3.1 Implementovat routu `/preparations/new` s formulářem (kontext -> výběr rolí s prioritami -> fokus).
- [x] 3.2 Implementovat serverové akce pro uložení přípravy (validace pomocí Zod).
- [x] 3.3 Vytvořit stránku přehledu příprav (zatím nereflektované schůzky).

## 4. Rozšíření reflexe (`consultation-reflection` delta)

- [x] 4.1 Upravit seznam reflexí tak, aby nabízel zahájení reflexe z "Čekajících příprav".
- [x] 4.2 Upravit serverové akce a formulář reflexe pro podporu `preparationId` (předvyplnění labelu a datumu).
- [x] 4.3 Integrovat `PlanVsRealitySummary` do detailu reflexe (`/reflections/[id]`).
- [x] 4.4 Zobrazit původní behaviorální záměr (fokus) v kontextu reflexe.

## 5. Ověření a leštění

- [x] 5.1 Manuálně otestovat flow: vytvoření přípravy -> start reflexe z přípravy -> kontrola vizualizace.
- [x] 5.2 Prověřit přístupnost nových prvků (aria-labels pro priority).
- [x] 5.3 Dokumentace nových proměnných prostředí (pokud vznikly).
