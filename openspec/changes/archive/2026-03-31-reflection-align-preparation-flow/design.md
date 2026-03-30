## Context

Reflexe (`ReflectionWizard`) má kroky Konzultace → Desatero → Role → Poznámka k učení. `RoleSelector` v režimu reflexe dnes vždy vykresluje jeden sloupec fází; v přípravě při kompletním sebeohodnocení a `focus_improve` role používá dvousekci se stejnými nadpisy jako orientace. `ReflectionAssistantPanel` je umístěn nad `<section>` kroků a je dostupný na všech krocích po rozbalení. Generování otázek v `generateReflectionAssistantQuestions` skládá RAG dotaz z labelu konzultace a popisu rolí z přípravy / kotvy / sebeohodnocení, ale **nepředává explicitně text `focusNote`** z propojené přípravy jako primární kotvu.

## Goals / Non-Goals

**Goals:**

- Zrcadlit **dvousekční výběr rolí** z přípravy v reflexi za stejných podmínek (kompletní eval, aspoň jedna `focus_improve`).
- Vykreslit **Strukturovací asistent** jen ve **kroku Poznámka k učení** (uvnitř obsahu kroku, ne jako globální panel nad wizardem).
- **Vizuálně** sjednotit panel asistenta s `PreparationReflectiveQuestionsPanel` (Sparkles u primární akce, obdobné mezery, typografie sekcí, animovaný seznam otázek tam, kde už dnes příprava používá framer-motion; respektovat `prefers-reduced-motion`).
- Na serveru při generování otázek: **nejprve** vyhodnotit, zda existuje neprázdný **původní záměr** (`preparation_sessions.focusNote`) u propojené přípravy; pokud ano, vložit ho do promptu jako dominantní blok; **jinak** sestavit kontext z uloženého draftu reflexe (vybrané principy + vybrané role s kalibrací + label/čas).

**Non-Goals:**

- Měnit pořadí kroků reflexe ani obsah kroku Konzultantské desatero.
- Slučovat dvoufázového asistenta reflexe (otázky → návrh struktury) do jedné fáze jako v přípravě.
- Měnit schéma databáze (dostatečná data už existují v přípravě a v tabulkách reflexe).

## Decisions

1. **`RoleSelector`:** Rozšířit `ReflectionProps` o volitelné `focusPartition?: { focusRoleIds: string[] }` se stejnou sémantikou jako v přípravě. Refaktorovat `RoleSelector` tak, aby sdílel s přípravou stejnou větev „dvě `<details>` sekce“ a pro reflexi volal existující `renderRoleRows` v režimu reflexe (výběr + kalibrace). Nadpisy sekcí **sjednotit s přípravou**: „Role, ve kterých chcete růst“ / „Ostatní situační role“.
2. **Data pro `focusPartition`:** Na RSC stránce `app/reflections/[id]/page.tsx` načíst `getRoleSelfEvalSummaryForUser` (jako příprava) a předat do wizardu snapshot `focusRoleIds` + `isComplete`; typ lze znovu použít z `preparation-self-eval-context-hint` nebo lokální typ.
3. **Umístění asistenta:** Odstranit globální `ReflectionAssistantPanel` mezi `OriginalIntentPanel` a `<section>`. Vložit panel **uvnitř** větve `step === 3` nad nebo pod úvodní text a textarea poznámky — konkrétní pořadí: nejprve stručný popis kroku, pak asistent (volitelná opora), pak pole poznámky (aby šlo vygenerované vložit pod textarea jako v přípravě, pokud implementace přidá „vložit do poznámky“; pokud ne, ponechat současné „Použít návrh“ pro celou strukturu). *Rozhodnutí:* pořadí **úvodní odstavec → asistent → Textarea poznámky**, aby textarea zůstala primárním místem zápisu pod nástroji.
4. **Kontext generování otázek:** V `generateReflectionAssistantQuestions` načíst z přípravy `focusNote` (join přes `reflection_sessions.preparation_id` již existuje u načítání rolí — rozšířit načtení o `focusNote` z `preparation_sessions`). Definovat `hasPrimaryPrepIntent = !!(focusNote?.trim())`. Pokud `hasPrimaryPrepIntent`, sestavit `roleContextDescription` / doplněk tak, aby **první a výrazná část** user promptu pro `generateQuestionTexts` byl blok „Původní záměr z přípravy“; RAG dotaz (`queryParts`) preferovat tento text. Pokud ne, načíst z DB aktuální **principy reflexe** (`reflection_principles`) a **role s kalibrací** (`reflection_role_calibrations` nebo ekvivalent uložený u draftu) a popsat je textově pro model (názvy principů z tabulky `principles`, role jako dnes). **Kotvicí role** (`anchorRoleIds`) a fallback na `focus_improve` z orientace ponechat jen tam, kde draft reflexe **nemá** vybrané role ani principy v DB — upřesnit v implementaci, aby při kroku 3 po standardním průchodu byly role a principy vždy uložené z předchozích kroků; pokud expert přeskočil výběr, chování zůstane odolné.
5. **UI parity:** Zarovnat třídy obalu `ReflectionAssistantPanel` na vizuální vzor přípravy (např. `rounded-xl border`, sekce s ikonou `Sparkles` u generování, sdílené utility nebo extrahovaný malý `ReflectiveAssistantSection` — zvolit minimální duplikaci: upravit přímo panel reflexe podle `PreparationReflectiveQuestionsPanel`).
6. **`generateStructuredProposal`:** Stejnou logiku priority záměru z přípravy použít i ve druhé fázi (návrh struktury), aby návrh byl konzistentní s otázkami (rozšíření `generateStructuredProposal` / sdílená funkce `buildReflectionAssistantUserContext`).

## Risks / Trade-offs

- **[Riziko] Expert otevře krok 3 bez uložení předchozích kroků** → Mitigace: tlačítko Další už ukládá draft; generování čte DB stav; pokud prázdné, fallback kotvy / orientace jako dnes.
- **[Riziko] Příliš dlouhý `focusNote` v promptu** → Mitigace: rozumný limit řezu (např. 3000 znaků) s dokumentací v kódu.
- **[Riziko] Asistent „zmizí“ na krocích 0–2** → Mitigace: krátká věta v úvodu wizardu nebo v kroku 3, že opora je až u poznámky (volitelné, copy v tasks).

## Migration Plan

Nasazení aplikační logiky a UI bez migrace DB. Rollback revertem commitu.

## Open Questions

- Žádné blokující; jemné pořadí prvků v kroku 3 lze doladit podle UX zpětné vazby.
