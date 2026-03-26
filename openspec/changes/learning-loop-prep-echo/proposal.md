## Why

Produktová smyčka (příprava → konzultace → reflexe → lepší příprava) je v datech téměř uzavřená, ale v rozhraní chybí **viditelné napojení**: expert po dokončení reflexe zapíše poučení, při další přípravě ale nemá bezprostřední oporu z minulého cyklu. Tím se oslabuje každodenní návyk a hodnota pole pro učení v reflexi. Doplňujeme lehkou vrstvu „echa“ z poslední dokončené reflexe do kontextu přípravy a jemné ukončení smyčky po dokončení reflexe — bez nového hodnocení, bez buddy (to zůstává samostatný scope).

## What Changes

- Na **obrazovce přípravy** (nová i rozpracovaná): pokud existuje **poslední dokončená reflexe** uživatele s neprázdným **poučením / learning note**, zobrazí se čitelný panel s tímto textem (a minimálním kontextem, např. datum nebo štítek konzultace), pouze pro čtení — není to pole k editaci v rámci přípravy.
- Po **dokončení reflexe** (úspěšné uložení dokončeného stavu): krátká navigace nebo výzva typu „promítnout do přípravy“ s odkazem na vytvoření nové přípravy (existující flow přípravy).
- Žádné ukládání kopie poučení do přípravy, žádná analytika trendů, žádné sdílení s buddy — čistě čtení z pravdy reflexí a odkaz.

## Capabilities

### New Capabilities

- _(žádné — jde o rozšíření chování stávajících schopností.)_

### Modified Capabilities

- `consultation-preparation`: Příprava musí umět zobrazit echo z poslední dokončené reflexe uživatele (learning note + srozumitelný kontext), pokud data existují.
- `consultation-reflection`: Po dokončení reflexe musí být k dispozici jasná cesta k zahájení nové přípravy (copy + odkaz), v souladu s produktovou smyčkou.

## Impact

- **UI**: komponenty stránek přípravy a potvrzení / detailu po dokončení reflexe.
- **Dotazy / server**: jeden dotaz typu „poslední dokončená reflexe s learning note“ pro přihlášeného uživatele (scope vlastní data).
- **Schéma DB**: bez změny, pokud stačí existující pole `learningNote` / stav dokončení reflexe.
- **Spec delta**: `openspec/changes/learning-loop-prep-echo/specs/` pro uvedené dva capability soubory.
