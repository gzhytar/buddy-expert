## ADDED Requirements

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
