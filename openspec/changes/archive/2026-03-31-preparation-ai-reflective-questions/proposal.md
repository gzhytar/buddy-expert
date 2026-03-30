## Why

V reflexi už expert může využít AI asistenta s RAG nad korpusy JIC k hlubšímu promýšlení. Příprava před konzultací má stejně důležitý moment v podobě kroku **Záměr**, ale dnes tam chybí strukturovaná podpora k přemýšlení — expert píše jen volný text. Generování **reflexivních otázek** odvozených od rolí z kroku Role (posílit / tlumit) sníží tření při formulaci záměru a posílí kontinuitu mezi přípravou a reflexí, aniž by AI nahrazovala autora.

## What Changes

- Ve kroku **Záměr** wizardu přípravy přibude **volitelná** akce (např. tlačítko) „vygenerovat reflexivní otázky“.
- Generování poběží **na serveru** (analogicky k asistentovi reflexe): inferencí přes OpenRouter a využitím **RAG** nad schváleným korpusem JIC, pokud je to v projektu pro reflexi již nastavené.
- Vstup pro model MUSÍ zahrnovat **aktuální výběr rolí** z přípravy: u každé vybrané role **název** a záměr **posílit** nebo **tlumit**; volitelně doplněk z kroku Konzultace (název, čas).
- Výstup: krátký seznam **3–5 otázek** v češtině, podpůrný tón (ne hodnotící), vhodné k promýšlení před schůzkou.
- Expert si otázky **přečte** a může je **vložit** do pole záměru nebo použít jako podklad — systém **nesmí** bez výslovné akce přepsat existující text záměru.
- Při chybějícím klíči API nebo chybě služby musí být **srozumitelná** hláška a příprava zůstane použitelná bez AI.

## Capabilities

### New Capabilities

- *(žádná — rozšíření stávající capability přípravy.)*

### Modified Capabilities

- `consultation-preparation`: nové požadavky na volitelné AI generování reflexivních otázek ve kroku Záměr, vázané na výběr rolí a polaritu posílení/tlumení.

## Impact

- `PreparationWizard` (krok 2 / Záměr), nová nebo sdílená UI sekce pro náhled otázek a vložení do textarea.
- Nové server actions (nebo rozšíření `lib/preparation`) + volání OpenRouter / RAG (reuse vzorů z `lib/ai/`, `lib/reflection/assistant-actions.ts`).
- Volitelné rozšíření schématu `preparation_sessions` o uložení stavu asistenta (otázky, případně odpovědi), pokud se má draft zachovat po obnovení stránky — rozhodnutí v designu.
- Proměnné prostředí (např. OpenRouter) — konzistence s reflexí; dokumentace v `.env.example` pokud přibude nový klíč.
