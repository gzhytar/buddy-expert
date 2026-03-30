## 1. Databáze a doménový model

- [x] 1.1 Přidat do `preparation_sessions` textový/JSON sloupec pro stav asistenta přípravy (např. `preparation_assistant_state`) včetně Drizzle migrace a aktualizace `lib/db/schema.ts`.
- [x] 1.2 Definovat typ TypeScript pro serializovaný stav (např. pole `reflectiveQuestions`, volitelné `generatedAt`) a mapování při čtení/zápisu přípravy.

## 2. Server: RAG, OpenRouter a akce

- [x] 2.1 Implementovat sdílenou nebo dedikovanou utilitu pro generování otázek přípravy (prompt v češtině, výstup 3–5 otázek) s reuse RAG z `lib/ai/rag-context.ts` (nebo ekvivalent) a voláním OpenRouter jako u reflexe.
- [x] 2.2 Přidat server action(y) v `lib/preparation/` (např. `preparation-assistant-actions.ts`): validace vlastníka přípravy, kontrola alespoň jedné role s polaritou, sestavení kontextu rolí + label/čas konzultace, volání modelu, uložení výsledku do `preparation_assistant_state`.
- [x] 2.3 Ošetřit chybějící konfiguraci API a chyby inference srozumitelnými českými hláškami; neukládat neúplný výsledek jako úspěšný.

## 3. UI: krok Záměr ve wizardu přípravy

- [x] 3.1 Ve kroku Záměr (`PreparationWizard` / související komponenta) přidat sekci s akcí „Vygenerovat reflexivní otázky“, stavem načítání a zobrazením uložených otázek po načtení draftu.
- [x] 3.2 Zablokovat nebo odmítnout generování bez vybraných rolí (posílit/tlumit) podle specifikace; texty v podpůrném tónu (návrh, ne hodnocení).
- [x] 3.3 Přidat akci „Vložit do záměru“ (výchozí bezpečné chování: append s oddělovačem nebo potvrzení při neprázdném poli) bez automatického přepsání textu bez výslovné akce uživatele.
- [x] 3.4 Po úspěšném uložení přípravy ověřit, že se otázky znovu zobrazí po obnovení stránky.

## 4. Konfigurace a dokončení

- [x] 4.1 Zkontrolovat `.env.example` a dokumentaci: stejné nebo nové proměnné jako u reflexe (OpenRouter, model), bez úniku tajných hodnot.
- [x] 4.2 Ručně projít scénáře z delta spec `specs/consultation-preparation/spec.md` (happy path, bez rolí, chyba API, cizí vlastník, obnovení draftu).
