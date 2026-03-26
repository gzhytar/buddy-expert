# Příprava před konzultací

Kanónické požadavky: `plan-vs-reality-loop`, echo poučení z `learning-loop-prep-echo`.

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
