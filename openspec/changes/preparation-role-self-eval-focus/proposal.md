## Why

Sebeohodnocení rolí v orientaci už umí expertovi zaznamenat, na kterých rolích chce **cíleně pracovat** (`focus_improve`). Tato informace dnes v přípravě před konzultací chybí, takže se přeruší smyčka „vědomí z orientace → záměr v přípravě“. Propojením obou toků expert při výběru rolí k posílení/tlumení dostane kontext svých dřívějších rozhodnutí, bez nového povinného kroku nebo automatického přepisování záměru.

## What Changes

- V **kroku výběru rolí** přípravy (wizard `/preparations`), pokud je sebeohodnocení **dokončené** a expert má alespoň jednu roli označenou ve stavu „chci se zlepšovat“, systém zobrazí výběr rolí ve **dvou sekcích**:
  - **Zaměření (role k rozvoji)** — výchozí stav **rozbaleno**; obsahuje pouze situační role, které expert v sebeohodnocení označil jako zaměření na zlepšení (`focus_improve`).
  - **Ostatní role** — výchozí stav **sbalený**; obsahuje zbývající role z katalogu šestnácti rolí.
- Obě sekce používají **stejný mechanismus** výběru posílení/tlumení jako dnes; žádné automatické předvyplnění ani přepsání uloženého draftu přípravy — expert si role k posílení/tlumení stále vybírá výslovně.
- Pokud je sebeohodnocení dokončené, ale **žádná** role nemá stav rozvoje, zůstává **jeden** přehled všech rolí (jako dosud, bez dvojsekce).
- Pokud sebeohodnocení **není** dokončené, krok rolí zůstává **jedním** seznamem jako dnes; volitelně jemná výzva s odkazem na orientaci, **bez blokace** přípravy.
- Na **ostatních krocích** wizardu může zůstat **stručný** kontext (např. věta + odkaz na orientaci), aby se celý rozdělený seznam rolí neopakoval — podrobnosti v designu/spec.

## Capabilities

### New Capabilities

- *(žádná nová samostatná capability — rozšíření chování přípravy pod stávající spec.)*

### Modified Capabilities

- `consultation-preparation`: Nové požadavky na propojení dokončeného sebeohodnocení rolí s krokem výběru rolí (dvě sekce: zaměření rozbaleno / ostatní sbalené) a na doprovodný kontext v průběhu přípravy.

## Impact

- Serverové načtení souhrnu sebeohodnocení (včetně **identifikátorů** rolí ve stavu `focus_improve`, nejen názvů) na stránkách přípravy, předání do `PreparationWizard` / `RoleSelector` (nebo obalovací komponenty kroku rolí).
- UI: rozbalovací sekce (např. Radix Collapsible / details) s výchozími stavy otevřeno vs. zavřeno podle návrhu.
- Žádná změna schématu DB ani API ukládání přípravy (jen čtení `user_consulting_role_self_evals`).
