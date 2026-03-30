## 1. Role v reflexi (dvousekce)

- [x] 1.1 Rozšířit `RoleSelector` o volitelné `focusPartition` pro `mode: "reflection"` a sdílet stejnou dvousekční strukturu a nadpisy jako v přípravě.
- [x] 1.2 Na `app/reflections/[id]/page.tsx` načíst souhrn sebeohodnocení (`getRoleSelfEvalSummaryForUser`) a předat do `ReflectionWizard` snapshot vhodný pro `focusRoleIds` / `isComplete`.
- [x] 1.3 V `ReflectionWizard` předat `focusPartition` do `RoleSelector` při splnění podmínek ze specifikace.

## 2. Umístění a vzhled asistenta

- [x] 2.1 Přesunout `ReflectionAssistantPanel` z globální pozice do obsahu kroku **Poznámka k učení** (`step === 3`); na ostatních krocích panel nezobrazovat.
- [x] 2.2 Sladit vizuální styl panelu s `PreparationReflectiveQuestionsPanel` (obal, Sparkles u generování, seznam otázek, loading, `prefers-reduced-motion`).

## 3. Server: kontext generování

- [x] 3.1 V `generateReflectionAssistantQuestions` načíst `focusNote` propojené přípravy; pokud je neprázdný po trim, použít ho jako primární blok v promptu a v RAG dotazu.
- [x] 3.2 Pokud záměr z přípravy chybí nebo je prázdný, sestavit kontext z uložených principů a rolí draftu reflexe (názvy z DB) a použít ho místo primárního záměru.
- [x] 3.3 Rozšířit `generateQuestionTexts` / `generateStructuredProposal` (OpenRouter vrstva) o parametry pro „původní záměr“ a sjednotit prioritu ve druhé fázi asistenta podle designu.

## 4. Ověření

- [x] 4.1 Projít ručně: reflexe s přípravou + vyplněný záměr → otázky navazují na záměr; bez záměru → otázky vycházejí z principů a rolí; asistent jen v posledním kroku; role dvousekce při kompletním eval.
