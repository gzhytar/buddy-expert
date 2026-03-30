## Why

Experti potřebují vědomě vnímat, ve kterých situačních rolích jsou silní, které chtějí rozvíjet a kterým se raději vyhýbají — bez toho se orientační materiály snadno stanou jen pasivním čtením. Strukturovaná sebeohodnocení rolí a značení „kam se chci zaměřit“ poskytne kotvu pro přípravu i reflexi a podpoří kontinuální učení.

## What Changes

- U každé ze šestnácti situačních rolí může expert zvolit jednu z hodnot sebeohodnocení: **miluji tuto roli** (srdce), **chci se v ní zlepšovat** (zaměření/fokus), **tuto roli nemám rád/a** (neoblíbené), **zatím nechci označit** (neprozkoumáno / bez preference).
- Uložení hodnot per uživatel (perzistence napříč relacemi).
- Dokud expert neoznačí všech šestnáct rolí jednou z výše uvedených voleb, systém v **relevantních místech** (např. orientace, přehled rolí) **nabídne dokončení sebeohodnocení** — bez blokování jiných funkcí (konzistentně s tím, že orientace nesmí zamykat reflexi).
- Po dokončení sebeohodnocení zobrazí v relevantních UI (např. stránka rolí v orientaci) **stručnou připomínku** rolí, na které se expert rozhodl **zaměřit** (fokus).

## Capabilities

### New Capabilities

- `orientation-role-self-evaluation`: Per-role sebeohodnocení (čtyři stavy), perzistence, UI pro výběr, stav „dokončeno / nedokončeno“, nabídky k dokončení tam, kde dává smysl, a po dokončení připomínka rolí se záměrem zlepšovat.

### Modified Capabilities

- `orientation-basics`: Rozšíření o interaktivní sebeohodnocení rolí a měkké výzvy k jeho dokončení; upřesnění, že se nejedná o povinné gating reflexe ani o povinné „dokončení orientace“ ve smyslu blokace jiných částí aplikace.

## Impact

- Databázové schéma (tabulka nebo rozšíření profilu uživatele pro mapu roleId → stav sebeohodnocení).
- API nebo server actions pro čtení/zápis sebeohodnocení.
- Komponenty orientace: karty rolí nebo související obrazovky, případně sdílené bannery / callouty.
- Možná úprava domovské nebo navigační části orientace pro konzistentní nabídku dokončení.
