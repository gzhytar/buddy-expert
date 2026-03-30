## ADDED Requirements

### Requirement: Dvě sekce v kroku výběru rolí v reflexi podle sebeohodnocení

Systém MUSÍ na kroku výběru situačních rolí v **reflexi**, pokud je pro přihlášeného experta sebeohodnocení rolí **kompletní** a existuje **alespoň jedna** role ve stavu zaměření na zlepšení (`focus_improve`), zobrazit role ve **dvou oddělených sekcích** se **stejnými nadpisy a výchozím chováním rozbalení** jako v přípravě před konzultací:

1. Sekce **„Role, ve kterých chcete růst“** — výchozí stav rozhraní MUSÍ být **rozbalený**.
2. Sekce **„Ostatní situační role“** — výchozí stav MUSÍ být **sbalený**, pokud existují jiné role mimo zaměření.

V obou sekcích MUSÍ zůstat stejný způsob výběru rolí a kalibrace (`underused` / `balanced` / `overused`) jako v reflexi dosud. Systém NESMÍ automaticky zaškrtnout role ze sebeohodnocení bez výslovné akce uživatele.

#### Scenario: Kompletní sebeohodnocení a role k rozvoji

- **WHEN** expert otevře krok výběru rolí v reflexi, sebeohodnocení je kompletní a obsahuje alespoň jednu roli ve stavu zaměření na zlepšení
- **THEN** systém zobrazí nejprve sekci s těmito rolemi v rozbaleném stavu a pod ní sekci s ostatními rolemi ve sbaleném stavu, obě s možností výběru a kalibrace jako dosud

#### Scenario: Bez rolí k rozvoji nebo nedokončené sebeohodnocení

- **WHEN** sebeohodnocení není kompletní nebo neobsahuje žádnou roli ve stavu zaměření na zlepšení
- **THEN** systém zobrazí jeden přehled rolí podle fází jako dosud, bez dvousekce založené na sebeohodnocení

### Requirement: Strukturovací asistent jen v kroku poznámky k učení

Systém MUSÍ zobrazovat panel **Strukturovacího asistenta reflexe** pouze tehdy, když je aktivní krok **Poznámka k učení** v průběhu rozpracované reflexe. Systém NESMÍ zobrazovat tento panel nad celým wizardem reflexe na ostatních krocích.

#### Scenario: Expert na kroku principů nebo rolí

- **WHEN** expert je na jiném kroku než poznámka k učení
- **THEN** strukturovací asistent se nezobrazí

#### Scenario: Expert na kroku poznámky k učení

- **WHEN** expert je na kroku poznámky k učení
- **THEN** systém zobrazí strukturovacího asistenta v rámci tohoto kroku (součást obsahu kroku), aniž by rušil dokončení reflexe bez použití asistenta
