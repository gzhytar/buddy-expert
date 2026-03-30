# Příprava před konzultací

Kanónické požadavky: `plan-vs-reality-loop`, echo poučení z `learning-loop-prep-echo`, sebeohodnocení rolí v přípravě (`preparation-role-self-eval-focus`), volitelné reflexivní otázky ve kroku Záměr (`preparation-ai-reflective-questions`), krok Konzultantské desatero (`preparation-konzultantske-desatero-step`), trvalé smazání vlastní přípravy (`delete-reflections-preparation-notes`).

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

### Requirement: Krok Konzultantské desatero v přípravě mezi Role a Záměr

Systém MUSÍ ve wizardu přípravy před konzultací zobrazit po kroku výběru rolí a před krokem behaviorálního záměru samostatný krok označený jako **Konzultantské desatero**, který experta připomene principy konzultování z Konzultantského desatera jako podpůrný rámec přípravy a MUSÍ mu umožnit přejít na obsah principů v orientaci.

#### Scenario: Pořadí kroků

- **WHEN** expert prochází přípravu od začátku
- **THEN** pořadí kroků MUSÍ být: Konzultace, Role, Konzultantské desatero, Záměr

#### Scenario: Navigace k principům

- **WHEN** expert je na kroku Konzultantské desatero
- **THEN** systém MUSÍ nabídnout zřetelnou navigaci na stránku principů v orientaci (cesta odpovídající `/orientation/principles`)

#### Scenario: Bez nového povinného vstupu

- **WHEN** expert na kroku Konzultantské desatero stiskne pokračování na další krok
- **THEN** systém NESMÍ vyžadovat vyplnění nového pole specifického pro tento krok nad rámec stávajícího ukládání přípravy mezi kroky

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
