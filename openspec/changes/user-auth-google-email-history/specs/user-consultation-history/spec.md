# Historie konzultační práce uživatele

Delta z `user-auth-google-email-history`.

## ADDED Requirements

### Requirement: Přehled vlastních příprav

Systém MUST zobrazit přihlášenému expertovi seznam jeho záznamů příprav před konzultací s rozlišením stavu (rozpracováno / dokončeno) a s informacemi umožňujícími orientaci v čase (např. datum úpravy nebo plánovaný čas schůzky, je-li k dispozici).

#### Scenario: Expert vidí své přípravy

- **WHEN** přihlášený expert otevře přehled historie příprav
- **THEN** systém zobrazí pouze přípravy, jejichž vlastníkem je tento expert, seřazené od nejnovějších

#### Scenario: Žádné přípravy

- **WHEN** expert nemá žádný záznam přípravy
- **THEN** systém zobrazí českou informaci o prázdném stavu a odkaz nebo tlačítko k vytvoření nové přípravy

### Requirement: Přehled vlastních reflexí

Systém MUST zobrazit přihlášenému expertovi seznam jeho reflexí s rozlišením stavu (rozpracováno / dokončeno) a s informacemi umožňujícími orientaci v čase (např. datum dokončení nebo label konzultace, je-li k dispozici).

#### Scenario: Expert vidí své reflexe

- **WHEN** přihlášený expert otevře přehled historie reflexí
- **THEN** systém zobrazí pouze reflexe, jejichž vlastníkem je tento expert, seřazené od nejnovějších

### Requirement: Otevření záznamu z přehledu

Z přehledu historie MUST být možné otevřít konkrétní přípravu nebo reflexi tak, aby uživatel pokračoval ve stávajícím editoru nebo detailu určeném pro daný typ záznamu.

#### Scenario: Pokračování v draftu přípravy

- **WHEN** expert z přehledu zvolí rozpracovanou přípravu
- **THEN** systém otevře stejný průběh úprav přípravy jako při přímém vstupu z hlavní navigace

#### Scenario: Otevření dokončené reflexe

- **WHEN** expert z přehledu zvolí dokončenou reflexi
- **THEN** systém zobrazí obsah reflexe v režimu určeném aplikací (např. čtení nebo omezená úprava podle stávajících pravidel produktu)

### Requirement: Izolace dat mezi uživateli

Systém MUST zajistit, že přehled historie a odkazy z něj nikdy neodhalí záznamy jiného uživatele, včetně pokusů o přímý přístup přes identifikátor v URL.

#### Scenario: Cizí identifikátor

- **WHEN** uživatel A se pokusí otevřít záznam přípravy nebo reflexe uživatele B (např. manipulací URL)
- **THEN** systém přístup odepře a přesměruje nebo zobrazí českou chybu bez úniku obsahu záznamu B
