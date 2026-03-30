## Why

Experti potřebují mít kontrolu nad vlastními záznamy: někdy chtějí odstranit rozpracovanou nebo dokončenou reflexi či přípravu (chyba, duplicita, citlivost). Bez mazání zůstávají záznamy navždy v historii, což zvyšuje kognitivní zátěž a brání pocitu soukromí nad vlastní reflexní prací.

## What Changes

- Serverová akce a datový model: trvalé smazání záznamu přípravy vlastněného přihlášeným expertem (včetně závislostí definovaných schématem, např. role, stav asistenta).
- Serverová akce a datový model: trvalé smazání záznamu reflexe vlastněného přihlášeným expertem (včetně vazeb principů, kalibrací rolí, stavu asistenta).
- Řešení vazby reflexe → příprava: při smazání přípravy buď zákaz, pokud na ni odkazuje reflexe jiného uživatele (nepravděpodobné v MVP — vlastník je stejný), nebo bezpečné nullnutí / kaskáda podle stávajících FK; při smazání reflexe pouze uvolnění vazby z reflexe na přípravu (příprava zůstane, pokud existuje).
- UI: z historie a/nebo z detailu/editoru možnost „Smazat“ s potvrzením (české copy), zpětná vazba při úspěchu/chybě; po smazání přesměrování nebo aktualizace seznamu.
- Přehled historie: smazané záznamy se v seznamech neobjevují; přímý odkaz na smazaný ID vede k odepření přístupu konzistentně s izolací dat.

## Capabilities

### New Capabilities

_(žádné — rozšíření stávajících domén)_

### Modified Capabilities

- `consultation-preparation`: nový požadavek na dobrovolné trvalé smazání vlastní přípravy včetně očekávaného chování vazeb a ochrany cizích záznamů.
- `consultation-reflection`: nový požadavek na dobrovolné trvalé smazání vlastní reflexe včetně očekávaného chování vazeb a ochrany cizích záznamů.
- `user-consultation-history`: rozšíření přehledů o možnost smazání (nebo odkaz z přehledu na akci smazání) a konzistence se seznamy po smazání.

## Impact

- Server actions: `lib/preparation/actions.ts`, `lib/reflection/actions.ts` (nebo oddělené delete moduly), případně úpravy `revalidatePath` / cache.
- Schéma DB / migrace: ověření FK a `onDelete` u `reflection_sessions.preparation_id` a podřízených tabulek (`preparation_roles`, `reflection_principles`, …); případná migrace pro kaskádu nebo explicitní mazání v kódu.
- UI: stránky a komponenty přehledu příprav/reflexí (`app/...`, komponenty wizardů / seznamů), dialog potvrzení (existující pattern v projektu).
- Bez nových veřejných API mimo Next.js server actions, pokud projekt takto pokračuje.
