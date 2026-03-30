# Příprava před konzultací

Kanónické požadavky: `plan-vs-reality-loop`, echo poučení z `learning-loop-prep-echo`, sebeohodnocení rolí v přípravě z `preparation-role-self-eval-focus`.

## Requirements

### Requirement: Zahájení přípravy před konzultací

Systém MUSÍ umožnit autentizovanému expertovi vytvořit nový záznam přípravy před konzultací.

#### Scenario: Vytvoření draftu přípravy

- **WHEN** expert zvolí možnost vytvořit novou přípravu
- **THEN** systém vytvoří záznam přípravy vlastněný tímto expertem a zobrazí formulář přípravy

### Requirement: Kontext konzultace v přípravě

Systém MUSÍ umožnit expertovi zadat nepovinný název schůzky (label) a plánovaný datum/čas, aby bylo možné přípravu později identifikovat pro reflexi.

#### Scenario: Zadání labelu pro schůzku

- **WHEN** expert zadá název schůzky "Strategický workshop - Alfa" a uloží
- **THEN** systém uloží tento label do záznamu přípravy

### Requirement: Výběr rolí k posílení a tlumení

Systém MUSÍ umožnit expertovi vybrat ze seznamu 16 situačních rolí ty, které chce vědomě posílit (3–5 rolí) a ty, které chce vědomě tlumit nebo nepřepálit (1–3 role).

#### Scenario: Výběr rolí s prioritou

- **WHEN** expert vybere roli "Posluchač" k posílení a roli "Konfrontátor" k tlumení
- **THEN** systém uloží tyto role s příslušnou polaritou (+/-) do záznamu přípravy

### Requirement: Behaviorální záměr (fokus)

Systém MUSÍ umožnit expertovi zapsat si krátký textový záměr nebo varování pro sebe (fokus), který mu bude připomenut před schůzkou a při reflexi.

#### Scenario: Uložení fokusu

- **WHEN** expert zapíše fokus "Dát klientovi prostor doříct myšlenku" a uloží přípravu
- **THEN** systém tento text uloží jako součást přípravy

### Requirement: Echo posledního poučení z reflexe na obrazovce přípravy

Systém MUSÍ na obrazovce přípravy (včetně rozpracovaného draftu) zobrazit informativní panel s textem poučení z **nejnovější dokončené reflexe** daného uživatele, u které je pole poučení po ořezání mezer neprázdné. Panel MUSÍ být určen pouze ke čtení a MUSÍ obsahovat alespoň datum dokončení této reflexe a text poučení. Pokud reflexe ukládá volitelný label konzultace, systém MUSÍ tento label v panelu zobrazit.

#### Scenario: Expert vidí poučení při nové přípravě

- **WHEN** autentizovaný expert otevře vytvoření nové přípravy a v minulosti dokončil reflexi s neprázdným poučením
- **THEN** systém zobrazí nad nebo pod hlavním obsahem přípravy panel s tímto poučením, datem dokončení reflexe a případným labelem konzultace

#### Scenario: Bez vhodné reflexe se panel nezobrazí

- **WHEN** expert nemá žádnou dokončenou reflexi s neprázdným poučením
- **THEN** systém nezobrazí panel echa a příprava funguje jako dosud

#### Scenario: Echo patří jen vlastníkovi

- **WHEN** expert A otevře přípravu vlastněnou expertem A
- **THEN** systém nikdy nezobrazí poučení z reflexe uživatele B

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

### Requirement: Odkaz k úpravě sebeohodnocení z přípravy

Pokud systém zobrazí připomínku související se sebeohodnocením nebo dvousekční výběr rolí, MUSÍ být uživateli dostupná navigace na sekci orientace, kde lze sebeohodnocení upravit (např. `/orientation/roles`), bez blokace dokončení přípravy.

#### Scenario: Expert chce upravit orientační volby

- **WHEN** expert aktivuje odkaz na stránku rolí v orientaci z přípravy
- **THEN** systém naviguje na příslušnou stránku orientace a po návratu může expert pokračovat v přípravě
