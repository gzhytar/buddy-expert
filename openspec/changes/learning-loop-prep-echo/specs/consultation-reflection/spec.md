# Delta: consultation-reflection (learning-loop-prep-echo)

## ADDED Requirements

### Requirement: Cesta k nové přípravě po dokončení reflexe

Po úspěšném dokončení reflexe systém MUSÍ uživateli nabídnout jasnou primární navigaci k založení **nové přípravy před konzultací** (existující flow přípravy), aby byla podpořena produktová smyčka „reflexe → další příprava“. Text výzvy MUSÍ být formulovaný podpůrně, ne evaluativně.

#### Scenario: Po dokončení reflexe je k dispozici odkaz na přípravu

- **WHEN** expert dokončí reflexi a systém potvrdí úspěch
- **THEN** na následující obrazovce nebo v potvrzovacím bloku je viditelný odkaz nebo tlačítko vedoucí na vytvoření nové přípravy

#### Scenario: Dokončení bez ztráty stávajícího chování

- **WHEN** expert dokončí reflexi
- **THEN** systém stále splní všechny stávající požadavky na uložení dokončené reflexe a přístup k vlastním reflexím
