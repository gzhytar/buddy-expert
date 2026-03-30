## ADDED Requirements

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
