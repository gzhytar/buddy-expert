## Why

Tok reflexe a přípravy má společnou smyčku učení, ale UI a chování asistenta se liší: výběr rolí v reflexi nemá stejnou dvousekci „zaměření / ostatní“ jako příprava, strukturovací asistent je vidět nad celým wizardem místo u místa zápisu poučení, a generování reflexivních otázek zatím nekladě **původní behaviorální záměr z přípravy** (`focusNote`) jako primární kotvu tam, kde příprava existuje a záměr je vyplněný. Sjednocení snižuje kognitivní zátěž a posiluje kontinuitu plán vs. realita.

## What Changes

- **Krok Role ve reflexi:** Při **kompletním** sebeohodnocení rolí v orientaci a **alespoň jedné** roli ve stavu zaměření na zlepšení (`focus_improve`) systém zobrazí stejnou strukturu jako v přípravě: sekce **„Role, ve kterých chcete růst“** (výchozí rozbalená) a **„Ostatní situační role“** (výchozí sbalená), se stejným chováním výběru a kalibrace jako dnes.
- **Strukturovací asistent:** Panel asistenta se zobrazí **pouze ve kroku „Poznámka k učení“**, ne nad celým průběhem reflexe.
- **Vizuální sjednocení:** Rozhraní asistenta reflexe (nadpisy, primární akce, seznam otázek, stavy načítání, podpůrný tón) se **vizuálně přiblíží** panelu reflexivních otázek v přípravě (`PreparationReflectiveQuestionsPanel`), aniž by se mažila dvoufázová logika reflexe (otázky → návrh struktury), pokud produkt nepožaduje jinak.
- **Kontext generování otázek (server):** Při generování reflexivních otázek asistentem platí:
  - Pokud je reflexe propojena s přípravou a v přípravě je po ořezání mezer **neprázdný** text **původního záměru** (`focusNote`), systém MUSÍ tento záměr použít jako **hlavní** vstupní kontext pro model (výrazně zdůrazněný v uživatelském promptu / instrukci).
  - Jinak systém MUSÍ pro generování využít dostupný kontext **z rozpracované reflexe**: vybrané principy z Konzultantského desatera a vybrané role s kalibrací (jak jsou uloženy u draftu reflexe), doplněné např. labelem a časem konzultace podle stávajících pravidel.

## Capabilities

### New Capabilities

- *(žádná)*

### Modified Capabilities

- `consultation-reflection`: dvousekční výběr rolí jako v přípravě za daných podmínek; umístění strukturovacího asistenta jen v kroku poznámky k učení.
- `reflection-structuring-assistant`: priorita kontextu při generování otázek (záměr z přípravy vs. principy + role z reflexe); sjednocení UI s panelem přípravy tam, kde to dává smysl.

## Impact

- `ReflectionWizard`, `RoleSelector` (režim reflexe + volitelný `focusPartition`), `ReflectionAssistantPanel` (nebo extrahované sdílené styly s přípravou).
- `app/reflections/[id]/page.tsx` — načtení souhrnu sebeohodnocení pro předání do wizardu (obdobně jako u přípravy).
- `lib/reflection/assistant-actions.ts`, `lib/ai/reflection-assistant-openrouter.ts` — rozšíření vstupu pro generování otázek (text záměru z přípravy; principy a role z reflexe).
- Volitelně načtení `focusNote` přípravy v dotazu pro generování (již dostupné přes existující načítání přípravy u reflexe).
