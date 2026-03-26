## Why

Chceme uzavřít učební smyčku experta tím, že mu umožníme vědomě si naplánovat záměr před konzultací a následně jej porovnat s realitou v reflexi. Bez záměru je reflexe pouze pasivním vzpomínáním; se záměrem se stává aktivním nástrojem pro vědomou změnu chování a rozvoj expertního judgmentu.

## What Changes

- **Nová schopnost: Příprava před konzultací**: Expert si před schůzkou zvolí 3–5 rolí, které chce posílit, 1–3 role, které chce tlumit, a formuluje svůj krátký behaviorální záměr (fokus).
- **Rozšíření reflexe**: Při reflexi po konzultaci expert vidí svůj původní záměr a reflektuje, jak se mu jej podařilo naplnit. Systém vizuálně porovnává "plánované role" se "skutečně použitými rolemi".
- **Navigační flow**: Propojení přípravy a reflexe do jednoho logického celku, kde dokončená příprava "čeká" na svou reflexi.

## Capabilities

### New Capabilities
- `consultation-preparation`: Definice procesu vědomé přípravy, výběru rolí k posílení/tlumení a formulace záměru před konzultací.

### Modified Capabilities
- `consultation-reflection`: Úprava požadavků na reflexi tak, aby zahrnovala porovnání se záměrem z existující přípravy (pokud existuje).

## Impact

- **Data**: Nová tabulka `preparation_sessions` (vazba na uživatele, volitelně na reflexi, seznam rolí s polaritou, text záměru).
- **UI/UX**: Nové flow pro přípravu; úprava komponenty pro výběr rolí (podpora pro +/- priority); vizualizace "Záměr vs. Realita" v detailu reflexe.
- **Backend**: Serverové akce pro ukládání přípravy a jejich propojování s následnou reflexí.
