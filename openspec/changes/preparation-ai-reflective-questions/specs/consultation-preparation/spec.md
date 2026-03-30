# Delta: consultation-preparation — AI reflexivní otázky ve kroku Záměr

## ADDED Requirements

### Requirement: Volitelné generování reflexivních otázek ve kroku Záměr

Systém MUSÍ ve kroku behaviorálního záměru (Záměr) wizardu přípravy nabídnout **volitelnou** akci, která vygeneruje **3 až 5** krátkých reflexivních otázek v češtině. Generování MUSÍ proběhnout na serveru s využitím retrievalu nad schváleným korpusem JIC (RAG) a inferencí přes OpenRouter API, konzistentně s přístupem použitým u asistenta reflexe. Otázky MUSÍ tematicky vycházet z **aktuálního výběru situačních rolí** v téže přípravě včetně polarity **posílit** nebo **tlumit** u každé vybrané role a MUSÍ zohlednit dostupný kontext přípravy (např. nepovinný label schůzky a plánovaný čas), pokud je v záznamu vyplněn.

#### Scenario: Expert vygeneruje otázky po výběru rolí

- **WHEN** expert má v přípravě alespoň jednu roli označenou k posílení nebo k tlumení a aktivuje akci generování otázek ve kroku Záměr
- **THEN** systém zavolá serverovou inferenci s RAG kontextem a zobrazí expertovi seznam 3 až 5 reflexivních otázek v češtině

#### Scenario: Bez rolí generování není nabídnuto nebo selže s vysvětlením

- **WHEN** expert nemá v přípravě žádnou roli k posílení ani k tlumení a pokusí se o generování otázek
- **THEN** systém generování neprovede a zobrazí srozumitelnou českou zprávu, že je potřeba nejdřív vybrat role v kroku Role

### Requirement: Expert jako autor textu záměru a bez automatického přepsání

Systém NESMÍ automaticky přepsat nebo doplnit uložený text behaviorálního záměru (fokusu) bez **výslovné** akce expertu. Systém MUSÍ umožnit expertovi otázky pouze zobrazit, případně zkopírovat, a volitelně **vložit** do pole záměru prostřednictvím samostatné akce (např. vložení s předsunutým oddělovačem nebo po potvrzení, pokud pole již obsahuje text).

#### Scenario: Výchozí stav po generování

- **WHEN** systém dokončí generování otázek
- **THEN** text v poli záměru zůstane beze změny, dokud expert neprovede akci vložení nebo ruční úpravu

#### Scenario: Vložení do záměru na výslovnou žádost

- **WHEN** expert zvolí akci vložení vygenerovaných otázek do pole záměru
- **THEN** systém doplní obsah pole záměru podle zvoleného chování (např. připojení za existující text) a expert může text před uložením přípravy libovolně upravit

### Requirement: Degradace při nedostupnosti AI a ochrana vlastnictví

Systém MUSÍ při chybějící konfiguraci OpenRouter nebo chybě služby zobrazit srozumitelnou českou hlášku a umožnit pokračovat v přípravě bez použití AI. Systém MUSÍ generování a uložený stav asistenta přípravy zpřístupnit pouze vlastníkovi záznamu přípravy; požadavky jiného uživatele MUSÍ odmítnout.

#### Scenario: Chybí API klíč nebo služba selže

- **WHEN** generování nelze dokončit z důvodu konfigurace nebo chyby rozhraní
- **THEN** systém neuloží neúplný výsledek jako úspěšná sada otázek a expert vidí vysvětlení bez zablokování zbytku přípravy

#### Scenario: Cizí uživatel

- **WHEN** autentizovaný uživatel, který není vlastníkem přípravy, vyžádá generování nebo stav asistenta pro cizí přípravu
- **THEN** systém žádost odmítne

### Requirement: Označení návrhu a podpůrný tón v UI

Viditelné texty v rozhraní generování otázek v přípravě MUSÍ prezentovat výstup jako **oporu k přemýšlení** nebo návrh otázek, nikoli jako hodnocení, příkaz nebo rozhodnutí organizace.

#### Scenario: Formulace akcí a nadpisů

- **WHEN** se zobrazí panel s vygenerovanými otázkami
- **THEN** rozhraní používá české formulace v duchu „návrh otázek“ / „můžete upravit záměr ručně“, nikoli „vyhodnocení přípravy“ nebo „povinné odpovědi“

### Requirement: Uložení stavu vygenerovaných otázek v draftu přípravy

Systém MUSÍ uchovat naposledy úspěšně vygenerovaný seznam reflexivních otázek v rámci záznamu přípravy (draft), aby jej expert po opětovném otevření stejné přípravy viděl, aniž by musel znovu volat model.

#### Scenario: Obnovení draftu

- **WHEN** expert uloží přípravu po úspěšném generování otázek a později stejný draft znovu otevře
- **THEN** systém zobrazí uložené otázky ve kroku Záměr v souladu s uloženým stavem
