## Context

Příprava před konzultací má krok **Záměr** (behaviorální fokus) jako volný text. Reflexe už má **strukturovacího asistenta** s RAG nad korpusem JIC a OpenRouter na serveru. Cílem je přidat **analogickou, lehčí** vrstvu jen pro generování **reflexivních otázek** ve kroku Záměr, odvozených od rolí vybraných v přípravě (posílit / tlumit) a volitelného kontextu konzultace — bez druhé fáze „návrh struktury“ jako u reflexe.

## Goals / Non-Goals

**Goals:**

- Volitelná akce ve kroku Záměr: vygenerovat 3–5 otázek v češtině, podpůrný tón.
- Vstup pro inferenci: seznam rolí s polaritou (posílit / tlumit) z aktuálního stavu přípravy, volitelně label a čas konzultace z přípravy.
- Server-side volání OpenRouter + stejný nebo sdílený RAG retrieval jako u reflexe (`lib/ai/rag-context.ts` nebo ekvivalent).
- Expert může otázky přečíst, zkopírovat nebo vložit do pole fokusu — bez automatického přepsání existujícího textu bez výslovné akce.
- Vlastník přípravy only; při chybě API nebo klíče srozumitelná hláška, příprava bez AI funguje dál.

**Non-Goals:**

- Druhá fáze asistenta (návrh principů, rolí s kalibrací, poučení) — zůstává výhradně u reflexe.
- Agregace, reporty, managerský dohled.
- Nahrazení ručního zápisu záměru povinným použitím AI.

## Decisions

1. **Reuse RAG + OpenRouter**  
   **Rozhodnutí:** Použít stejný vzor jako `reflection-assistant-openrouter.ts` / `assistant-actions.ts` (system prompt, RAG snippet, model z env).  
   **Proč:** Jedna konfigurace klíčů, konzistentní kvalita a údržba.  
   **Alternativa:** Samostatný endpoint a proměnné — zamítnuto kvůli duplicitě.

2. **Nový modul pro přípravu vs. rozšíření reflexních actions**  
   **Rozhodnutí:** Nové server actions (např. `lib/preparation/preparation-assistant-actions.ts`) volající sdílenou utilitu pro volání modelu + RAG; prompt specifický pro „otázky k přípravě před schůzkou“.  
   **Proč:** Oddělení domény (preparation_session vs reflection_session), jasná autorizace podle ID přípravy.  
   **Alternativa:** Parametrizovat reflexní action — zamítnuto kvůli zamotání validací a vlastnictví záznamu.

3. **Persistace vygenerovaných otázek**  
   **Rozhodnutí:** Uložit poslední vygenerovaný seznam otázek (a případně čas generování) do JSON sloupce na `preparation_sessions`, např. `preparation_assistant_state` (text/json), struktura kompatibilní s minimem polí: `{ "reflectiveQuestions": string[], "generatedAt"?: string }`.  
   **Proč:** Obnovení stránky neztratí náhled; konzistentně s `assistant_state` u reflexe.  
   **Alternativa:** Pouze client state — zamítnuto kvůli UX po refreshi.  
   **Migrace:** Drizzle migrace + aktualizace `lib/db/schema.ts`.

4. **Validace vstupu před voláním modelu**  
   **Rozhodnutí:** Pokud expert nemá vybranou **žádnou** roli (ani posílení ani tlumení), tlačítko generování je disabled nebo akce vrátí srozumitelnou chybu v češtině („Nejdřív vyberte alespoň jednu roli v kroku Role“).  
   **Proč:** Otázky mají být vázané na záměr rolí; prázdný vstup by vedl k obecným otázkám mimo scope změny.

5. **UI**  
   **Rozhodnutí:** V kroku Záměr sekce pod nebo nad textareou: primární akce „Vygenerovat reflexivní otázky“, loading stav, seznam otázek, sekundární akce „Vložit do záměru“ (append nebo replace podle volby — **preferovat append s oddělovačem** nebo jednorázové potvrzení při neprázdném poli).  
   **Proč:** Splnění požadavku „nesmí bez souhlasu přepsat“ — explicitní akce „Vložit“ s bezpečným výchozím chováním (append nebo confirm replace).

## Risks / Trade-offs

- **[Riziko] Latence a náklady API** → Mitigace: jedno volání na kliknutí, žádné auto-refresh; případně stejný rate limiting vzor jako u reflexe pokud existuje.
- **[Riziko] Halucinace nebo nevhodný tón** → Mitigace: RAG, krátký system prompt zdůrazňující podpůrný tón a češtinu; uživatelské označení jako „návrh otázek“.
- **[Riziko] Přetežení UI krokem Záměr** → Mitigace: sekce sbalitelná nebo kompaktní seznam; nezobrazovat panel, dokud uživatel neklikne na generování (kromě obnovení uloženého stavu).

## Migration Plan

1. Přidat sloupec `preparation_assistant_state` (nebo dohodnutý název) do `preparation_sessions` migrací.
2. Nasadit kód čtoucí/zapisující stav; staré řádky mají NULL — UI chová se jako bez uložených otázek.
3. Rollback: migrace down odstraní sloupec; aplikace musí tolerovat chybějící sloupec pouze pokud rollback — v praxi jeden release s migrací vpřed.

## Open Questions

- Zda znovupoužít přesně stejný env název modelu jako reflexe (`OPENROUTER_*`) — předpoklad ano, potvrdit v implementaci podle `.env.example`.
