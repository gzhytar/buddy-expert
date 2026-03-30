## ADDED Requirements

### Requirement: Dvě sekce v kroku výběru rolí podle sebeohodnocení

Systém MUSÍ na kroku výběru situačních rolí v přípravě, pokud je pro přihlášeného experta sebeohodnocení rolí **kompletní** a existuje **alespoň jedna** role ve stavu zaměření na zlepšení (`focus_improve`), zobrazit role ve **dvou oddělených sekcích**:

1. Sekce s rolemi, které expert v sebeohodnocení označil jako zaměření na zlepšení — výchozí stav rozhraní MUSÍ být **rozbalený** (expert vidí tuto sekci otevřenou bez dalšího kliknutí).
2. Sekce se **všemi ostatními** situačními rolemi z katalogu — výchozí stav MUSÍ být **sbalený**.

V obou sekcích MUSÍ zůstat dostupný stejný způsob volby posílení a tlumení rolí jako v přípravě dosud. Systém NESMÍ automaticky zapsat role ze sebeohodnocení do výběru přípravy bez výslovné akce uživatele.

#### Scenario: Dokončené sebeohodnocení a alespoň jedna role k rozvoji

- **WHEN** expert otevře krok výběru rolí v přípravě, sebeohodnocení je kompletní a obsahuje alespoň jednu roli ve stavu zaměření na zlepšení
- **THEN** systém zobrazí nejprve sekci s těmito rolemi v rozbaleném stavu a pod ní sekci s ostatními rolemi ve sbaleném stavu, obě s možností výběru posílení nebo tlumení

#### Scenario: Interakce se sbalenou sekcí

- **WHEN** expert rozbalí sekci ostatních rolí
- **THEN** systém zobrazí zbývající role katalogu a umožní stejný výběr polarit jako v sekci zaměření

#### Scenario: Dokončené sebeohodnocení bez rolí k rozvoji

- **WHEN** sebeohodnocení je kompletní a žádná role nemá stav zaměření na zlepšení
- **THEN** systém zobrazí jeden přehled všech rolí bez dvojsekce (chování ekvivalentní před zavedením této změny)

#### Scenario: Nedokončené sebeohodnocení

- **WHEN** sebeohodnocení rolí není kompletní
- **THEN** systém zobrazí jeden přehled všech rolí jako dosud a nepoužije sekci „zaměření“ založenou na sebeohodnocení

### Requirement: Stručný kontext mimo krok výběru rolí

Systém MUSÍ na krocích přípravy, které nejsou krokem výběru rolí, nezobrazovat plnou dvousekční strukturu rolí. Pokud je vhodné připomenout souvislost se sebeohodnocením, systém MUSÍ použít **stručný** informativní prvek (např. krátký text a odkaz na úpravu sebeohodnocení v orientaci), aby nedocházelo k duplikaci celého seznamu rolí z kroku výběru.

#### Scenario: Expert na kroku kontextu nebo fokusu

- **WHEN** expert je na jiném kroku než výběr rolí a sebeohodnocení je kompletní s alespoň jednou rolí k rozvoji
- **THEN** systém nezobrazí stejné dvě sekce rolí jako na kroku výběru; může zobrazit stručnou připomínku a odkaz na orientaci podle návrhu v produktu

### Requirement: Odkaz k úpravě sebeohodnocení

Pokud systém zobrazí připomínku související se sebeohodnocením nebo dvousekční výběr rolí, MUSÍ být uživateli dostupná navigace na sekci orientace, kde lze sebeohodnocení upravit (např. `/orientation/roles`), bez blokace dokončení přípravy.

#### Scenario: Expert chce upravit orientační volby

- **WHEN** expert aktivuje odkaz na stránku rolí v orientaci z přípravy
- **THEN** systém naviguje na příslušnou stránku orientace a po návratu může expert pokračovat v přípravě
