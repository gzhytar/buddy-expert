## Context

Orientační stránka `/orientation/principles` načítá principy z tabulky `principles` přes `getPrinciplesOrdered()` a vykresluje je komponentou `OrientationPrincipleCard` (titulek, shrnutí, ilustrace). Produkt má principy chápat jako výukový rámec a kotvu reflexe, ne jako checklist — nový obsah má přidat „uchopitelnost“ bez měny této role.

## Goals / Non-Goals

**Goals:**

- U každého z 10 principů uložit a zobrazit dva samostatné textové bloky: **Tipy a triky** a **Příběhy z praxe**.
- Zachovat stávající titulek, pořadí, `id` principu a ilustrace.
- Zajistit migraci schématu kompatibilní s Postgres (Neon) — typy bez SQLite-specific zkratek, kde to jde.
- Naplnit oba bloky smysluplným českým obsahem pro všech deset principů Konzultantského desatera (seed).

**Non-Goals:**

- Rich-text editor pro uživatele, verzování obsahu, CMS, překlady do jiných jazyků.
- Testy / kvízy / gamifikace u principů.
- Měnit texty reflexních flow jen kvůli této změně (mimo případné pozdější propojení, které není v tomto návrhu).

## Decisions

1. **Ukládání do sloupců tabulky `principles`**  
   - **Rozhodnutí**: Přidat dva sloupce typu text (např. `learning_tips` a `field_stories` v DB; v Drizzle camelCase podle konvence projektu).  
   - **Rationale**: Principy jsou již v DB, dotaz je jeden, žádný nový join. Odpovídá „single source of truth“ pro orientaci.  
   - **Alternativa zvažovaná**: Samostatná tabulka `principle_learning_blocks` — zbytečná složitost pro 1:1 vztah a fixní dvě sekce.

2. **Formát textu: prostý text s odstavci / odrážkami**  
   - **Rozhodnutí**: Ukládat jako víceřádkový plain text; v UI renderovat s zachováním zalomení řádků (`white-space: pre-line` nebo rozdělení na odstavce podle `\n\n`). Bez Markdown/HTML v první iteraci, pokud není v projektu již bezpečný renderer.  
   - **Rationale**: Rychlá implementace, žádné XSS riziko, seed je čitelný.  
   - **Alternativa**: Markdown — použitelná, až bude sdílený sanitizovaný renderer; do té doby plain text.

3. **Povinnost obsahu**  
   - **Rozhodnutí**: Sloupce `NOT NULL`; seed vždy vyplní oba pro všech 10 řádků. Existující nasazení: migrace doplní dočasné krátké věty nebo stejný obsah jako u nového seedu (viz úkoly).  
   - **Rationale**: Konzistence s požadavkem „užitečné pro učení“; prázdné sekce by působily rozbitě.

4. **UI struktura**  
   - **Rozhodnutí**: Pod stávajícím shrnutím dvě podsekce s viditelnými nadpisy (např. typografie `text-sm font-semibold` + tělo `text-sm text-muted-foreground`), sémanticky `<h3>` nebo `role="group"` + `aria-labelledby` pro přístupnost.  
   - **Rationale**: Konzistentní se stávající kartou; skenovatelnost na mobilu.

5. **Pojmenování v UI**  
   - **Rozhodnutí**: Přesné štítky **„Tipy a triky“** a **„Příběhy z praxe“** (sjednoceno napříč všemi kartami).  
   - **Rationale**: Odpovídá zadání uživatele; srozumitelná čeština.

## Risks / Trade-offs

- **[Riziko] Příliš dlouhé texty** na mobilu unaví → **Mitigace**: držet seed na stručné odstavce / krátké odrážky; případně `max-w-prose` a dostatečné řádkování.  
- **[Riziko] Příběhy vyzní jako moralizující „špatně/dobře“** → **Mitigace**: v obsahu seedu používat popis situací a dilemat, ne hodnotící štítky; v úkolu pro obsah uvést tón z ProductSpecification (psychologická bezpečnost).  
- **[Trade-off] Plain text vs formátování** — méně výrazné než MD → akceptováno pro MVP; později výměna rendereru.

## Migration Plan

1. Přidat sloupce migrací Drizzle (SQLite lokálně; stejný SQL kompatibilní s Postgres).  
2. Doplnit `onConflictDoUpdate` v seedu o nová pole pro všech 10 principů.  
3. Pro již existující DB spustit `npm run db:migrate` (nebo ekvivalent) a `npm run db:seed`.  
4. Rollback: migrace down odstraní sloupce (pozor na ztrátu dat — u MVP lokální SQLite akceptovatelné).

## Open Questions

- Zda v budoucnu sjednotit obsah principů s externím zdrojem (např. wiki JIC) — mimo rozsah této změny.  
- Kdo finálně odsouhlasí copy u „Příběhů z praxe“ (obsahový vlastník) — před nasazením do produkce.
