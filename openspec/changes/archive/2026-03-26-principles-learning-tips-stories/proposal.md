## Why

Stránka s Konzultantským desaterem (deset principů konzultování JIC) dnes nabízí hlavně titulek a krátké shrnutí. Pro onboarding a sebevzdělávání v praxi (viz ProductSpecification — učení skrz praxi, principy místo rigidních skriptů) chybí vrstva, která princip „uchopitelným“ způsobem propojí s každodenními situacemi. Doplňujeme proto u každého principu výukové sekce, které zvyšují užitečnost orientace bez změny postavení principů jako rámce kvality, ne checklistu.

## What Changes

- U **každého** principu Konzultantského desatera v orientaci přibudou dvě konzistentně pojmenované a vizuálně oddělené sekce: **Tipy a triky** a **Příběhy z praxe** (nebo ekvivalentní české názvy sjednocené v UI).
- Obsah těchto sekcí bude součástí datového modelu principu (např. sloupce v SQLite / migrace) a naplní se reálným českým textem (seed nebo ekvivalentní zdroj), ne prázdnými placeholdery.
- Karta principu v UI rozšíří layout tak, aby summary zůstalo čitelné a nové sekce byly skenovatelné (nadpisy, typografie, případně krátké odrážky / odstavce podle designu).
- Žádné vyhodnocování, kvízy ani gating — orientace zůstává referenčním materiálem ve smyslu stávajících produktových principů (opora, ne kontrola).

## Capabilities

### New Capabilities

- `orientation-principles-learning`: Konzultantské desatero v sekci orientace musí u každého záznamu zobrazovat navíc strukturovaný obsah sekcí „Tipy a triky“ a „Příběhy z praxe“, načtený z datového zdroje pravdy aplikace, s důrazem na čitelnost a přístupnost.

### Modified Capabilities

- _(prázdné — hlavní `openspec/specs/` zatím neobsahuje kanonické specy; nová schopnost je samostatný balík požadavků pro tuto změnu.)_

## Impact

- **Schéma DB**: rozšíření tabulky `principles` (např. dva textové sloupce pro tipy a příběhy) + Drizzle migrace.
- **Seed**: rozšíření `scripts/seed.ts` o texty pro všech deset principů Konzultantského desatera.
- **Typy a dotazy**: `lib/db/schema.ts`, `lib/queries/orientation` (nebo ekvivalent), mapování do UI.
- **UI**: `OrientationPrincipleCard` (případně podkomponenty) — nové sekce pod existujícím shrnutím.
- **Psychologická bezpečnost / tón**: příběhy formulovat jako ilustrativní situace, ne jako hodnotící příklady „špatně vs. správně“ shora — v souladu s produktovým vymezením.
