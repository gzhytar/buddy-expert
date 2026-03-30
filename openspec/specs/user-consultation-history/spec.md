# Historie konzultační práce uživatele

Kanónická spec sloučená z delt `user-auth-google-email-history` a `delete-reflections-preparation-notes` (mazání z přehledů a chování po smazání).

## Requirements

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

### Requirement: Mazání z přehledu příprav

Systém MUSÍ z přehledu vlastních příprav umožnit spuštění akce trvalého smazání konkrétního záznamu (např. tlačítkem nebo položkou nabídky u řádku), která vede na potvrzení podle požadavků capability přípravy.

#### Scenario: Řádek v přehledu nabízí smazání

- **WHEN** expert zobrazí přehled svých příprav
- **THEN** u každého záznamu nebo u vybraného záznamu je dostupná akce smazání, která po potvrzení odstraní záznam a přehled se aktualizuje

### Requirement: Mazání z přehledu reflexí

Systém MUSÍ z přehledu vlastních reflexí umožnit spuštění akce trvalého smazání konkrétní reflexe s potvrzením podle požadavků capability reflexe.

#### Scenario: Řádek v přehledu reflexí nabízí smazání

- **WHEN** expert zobrazí přehled svých reflexí
- **THEN** u každého záznamu nebo u vybraného záznamu je dostupná akce smazání, která po potvrzení odstraní reflexi a přehled se aktualizuje

### Requirement: Přímý odkaz na smazaný záznam

Systém MUSÍ po smazání přípravy nebo reflexe zajistit, že přímý pokus o otevření záznamu pod jeho dřívějším identifikátorem (např. URL) nepřečte obsah záznamu a chová se konzistentně s izolací dat (odmítnutí přístupu nebo přesměrování bez úniku cizích dat).

#### Scenario: Otevření URL po smazání

- **WHEN** uživatel otevře URL smazané vlastní přípravy nebo reflexe
- **THEN** systém nepřečte obsah smazaného záznamu a zobrazí nebo provede vhodnou českou odpověď (např. chyba nebo návrat na přehled) bez odhalení existence záznamu jiného uživatele
