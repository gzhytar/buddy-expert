## Context

Reflexní flow už ukládá drafty v `reflection_sessions` a vazební tabulkách principů a kalibrací rolí (`lib/db/schema.ts`, akce v `lib/reflection/`). Příprava má `preparation_roles` s typem záměru (posílení / tlumení), reflexe může mít `preparation_id`. Produkt má zachovat **psychologickou bezpečnost** a **nevnímatelný dohled**; asistent je **dobrovolná opora**, ne evaluace.

## Goals / Non-Goals

**Goals:**

- Dvoufázový asistent: (A) 3–5 reflexivních otázek personalizovaných podle rolí z přípravy nebo kotvicích rolí / sebeohodnocení; (B) strukturovaný **návrh** principů, rolí s kalibrací a poučení, vždy editovatelný a potvrzovaný expertem.
- Inferenční vrstva: **OpenRouter** (konfigurovatelný model) + **RAG** nad schváleným korpusem (embeddings + vyhledávání chunků; zdroje minimálně texty principů a rolí z DB nebo statických exportů).
- Autorizace: každé volání ověří, že `reflection_sessions.user_id` = přihlášený uživatel; žádné čtení cizích reflexí.
- Perzistence mezikroků v rámci draft reflexe (obnovení po opuštění stránky).
- UX a interakce: jasná zpětná vazba při generování, respekt k `prefers-reduced-motion`, degradace při chybě API.

**Non-Goals:**

- Ukládání promptů / odpovědí pro analytiku managementu.
- Fine-tuning vlastního modelu.
- Automatické odeslání dokončené reflexe.
- Realtime streaming (může být fáze 2; MVP může být jednorázová odpověď).

## Decisions

1. **Uložení stavu asistenta:** Nový nullable JSON sloupec na `reflection_sessions`, např. `assistant_state` (nebo samostatná tabulka `reflection_assistant_state` s 1:1 na reflexi). **Rozhodnutí:** jeden JSON sloupec pro MVP — jednodušší migrace, atomická aktualizace s `updated_at`. Schéma JSON (verze `v1`): `phase` (`idle` | `questions` | `proposal`), `questions[]` { id, text }, `answers` map id→text, `anchorRoleIds[]` (fallback), `proposal` { principleIds[], roles: { roleId, calibration }[], learningNote }, `lastError` (volitelně, jen pro UI, ne logovat mimo session).

2. **Pořadí ve flow:** Asistent je dostupný z draft reflexe **před nebo během** vyplňování klasického formuláře; tlačítko „Použít návrh“ **merge** do lokálního stavu formuláře (principy, role, kalibrace, poučení) bez uložení, dokud expert neuloží draft / nedokončí reflexi. Alternativa — přímý zápis do DB při „Použít návrh“ — zamítnuto, aby šlo snadno vrátit úpravy v jedné transakci s existujícím `saveReflectionDraft`.

3. **RAG:** Embeddings generované build-time nebo lazy při deploy z kanonických textů (`principles`, `consulting_roles` popisy). Úložiště: tabulka `rag_chunks` + `embedding` vektor (pgvector pokud dostupné, jinak cosine přes externí embedding store — **preferovat pgvector na Neon** pokud projekt povolí extension). Alternativa čistě „vložit celý korpus do promptu“ — zamítnuto u většího objemu; pro MVP lze zúžit na top-k chunků podle dotazu sestaveného z labelu, rolí a otázek.

4. **OpenRouter:** Server-side pouze (`OPENROUTER_API_KEY`); klient volá vlastní API route / Server Action, která sestaví zprávy, přiloží RAG kontext a parsuje strukturovaný výstup (JSON schema nebo tool calling). Alternativa přímý fetch z prohlížeče — zamítnuto (exposure klíče).

5. **Parsování výstupu:** Vynutit JSON odpověď se známým schema (např. `response_format` / instrukce + validace Zod); při neúspěchu jeden retry s opravou, jinak uživatelsky čitelná chyba a ruční pokračování.

6. **Signál rolí pro otázky:** Server načte z `preparation_id` role typu strengthen/dampen; pokud chybí, použije `anchorRoleIds` z UI nebo z `user_consulting_role_self_eval` stav `focus_improve` (pokud tabulka existuje v době implementace); jinak obecná sada s upozorněním v UI, že dotazy budou obecnější.

## Interakce a rozhraní (interaction design)

- **Fáze A → B:** Po odeslání odpovědí krátký přechod (200–300 ms opacity nebo výška panelu), ne choreografie nad 500 ms; obsah nové fáze může `fadeIn` 200–300 ms. Při `prefers-reduced-motion: reduce` použít okamžitý přepnutí bez animace nebo trvání ≤ 1 ms ekvivalent (viz obecné guideline skillu).
- **Generování otázek / návrhu:** Zobrazit **skeleton** nebo indeterminantní progress v oblasti, kde se objeví výsledek — zachovat layout, aby nedocházelo ke skoku. Primární tlačítko ve stavu loading: `aria-busy="true"`, disabled stav, text typu „Generuji návrh…“.
- **Chyby sítě / API:** Neblokovat celou reflexi — zpráva inline s možností „Zkusit znovu“ a „Pokračovat bez asistenta“. Žádné agresivní toastové záplavy; jedna jasná chybová oblast.
- **Úspěch „Použít návrh“:** Krátká vizuální potvrzení (např. 150 ms scale nebo zvýraznění sekce formuláře), pak focus na první upravené pole pro klávesnicové pokračování (volitelně).
- **Výkon animací:** Preferovat `transform` a `opacity` pro přechody panelů asistenta.

## Risks / Trade-offs

- **Halucinace / nesprávné principy** → Mitigace: RAG, validace ID proti DB, expert vždy kontroluje; copy zdůrazní „návrh“.
- **Únik citlivého obsahu reflexe k OpenRouter** → Mitigace: DPA, minimalizace PII v promptu (label může být anonymizovaný uživatelem), dokumentace v UI.
- **Latence a náklady** → Mitigace: caching podobných dotazů záměrně ne (riziko soukromí); limit délky vstupů, timeout s fallback.
- **JSON sloupec roste** → Mitigace: limit délky odpovědí na klientu/serveru, případně v budoucnu extrakce do tabulky.
- **pgvector na Neon** → Mitigace: ověřit extension; fallback na menší korpus v promptu bez vektorů.

## Migration Plan

- Drizzle migrace: přidat `assistant_state` (typ `text` / JSON string) na `reflection_sessions` případně enable `vector` extension + tabulka chunků.
- Deploy: migrace před buildem (`npm run db:migrate`).
- Rollback: drop sloupce / tabulky — ztráta mezikroků asistenta akceptovatelná.

## Open Questions

- Přesný seznam dokumentů v RAG kromě principů a rolí (např. úvodní misní text) — doplní JIC před nasazením.
- Výchozí model a limity tokenů na OpenRouter — konfigurace prostředí + dokumentace pro provoz.
