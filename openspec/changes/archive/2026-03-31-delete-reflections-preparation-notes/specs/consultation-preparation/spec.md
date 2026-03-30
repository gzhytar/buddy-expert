## ADDED Requirements

### Requirement: Trvalé smazání vlastní přípravy

Systém MUSÍ umožnit autentizovanému expertovi trvale smazat záznam přípravy, kterého je výhradním vlastníkem. Smazání MUSÍ být dostupné až po výslovném potvrzení v rozhraní (např. dialog), který uživatele informuje, že akce je nenávratná. Po úspěšném smazání MUSÍ záznam zmizet z přehledů a MUSÍ být nedostupný pro další čtení ani úpravy pod stejným identifikátorem.

#### Scenario: Úspěšné smazání z přehledu

- **WHEN** expert v přehledu svých příprav zvolí smazání konkrétní přípravy a potvrdí dialog
- **THEN** systém odstraní záznam přípravy a související data patřící k této přípravě podle implementačního modelu a přehled se obnoví bez tohoto záznamu

#### Scenario: Odepření smazání cizí přípravy

- **WHEN** uživatel se pokusí smazat přípravu, která není jeho vlastnictvím
- **THEN** systém akci neprovede a nepovolí únik dat ani změnu cizího záznamu

#### Scenario: Reflexe po smazání přípravy

- **WHEN** expert smaže přípravu, ke které byla dříve navázána jeho reflexe přes identifikátor přípravy
- **THEN** systém zajistí, že reflexe zůstane uložena jako záznam uživatele, ale vazba na smazanou přípravu se zruší (např. prázdný odkaz na přípravu), aby nedošlo k porušení integrity databáze

### Requirement: Mazání přípravy z kontextu úprav

Systém MUSÍ nabídnout možnost smazání přípravy také z kontextu úprav nebo detailu této přípravy (např. záhlaví nebo nabídka akcí), konzistentně s přehledem historie, aby expert nemusel hledat akci jen na jednom místě.

#### Scenario: Smazání z otevřené přípravy

- **WHEN** expert má otevřenou vlastní přípravu a zvolí smazání s potvrzením
- **THEN** systém provede stejné trvalé smazání jako z přehledu a přesměruje nebo vrátí uživatele na bezpečnou stránku (např. přehled příprav) bez zobrazení smazaného záznamu
