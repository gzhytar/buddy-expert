# Strukturovací asistent reflexe

Volitelný krok ve flow konzultační reflexe: generování reflexivních otázek a návrhu struktury (principy, role s kalibrací, poučení) s RAG nad korpusem JIC a inferencí přes OpenRouter na serveru. Expert zůstává autorem finálního obsahu.

## Requirements

### Requirement: Volitelná aktivace asistenta v draft reflexe

Systém MUSÍ uvnitř flow rozpracované reflexe nabídnout volitelný krok „asistent“, který expert nemusí použít; ruční vyplnění reflexe MUSÍ zůstat plně funkční bez asistenta.

#### Scenario: Expert přeskočí asistenta

- **WHEN** expert vyplňuje reflexi a neaktivuje asistenta
- **THEN** systém umožní dokončit reflexi stejně jako před zavedením asistenta

### Requirement: Generování reflexivních otázek s vazbou na situační role

Systém MUSÍ v první fázi asistenta vygenerovat několik krátkých reflexivních otázek (počet v rozmezí 3 až 5) a před jejich generováním MUSÍ zohlednit situační role z kontextu: nejdříve role označené v propojené přípravě k posílení a k tlumení; pokud příprava chybí nebo neobsahuje takové role, MUSÍ expert moci zvolit až tři kotvicí role, jinak MUSÍ systém použít role ve stavu zaměření na zlepšení ze sebeohodnocení v orientaci, pokud jsou k dispozici, a teprve poté smí použít obecnější sadu otázek. Generování MUSÍ využívat retrieval nad schváleným korpusem JIC (RAG) a inferenci přes OpenRouter API na serveru.

#### Scenario: Otázky personalizované podle přípravy

- **WHEN** draft reflexe má propojenou přípravu s alespoň jednou rolí k posílení nebo tlumení
- **THEN** systém při generování otázek pošle do inferenčního řetězce identifikátory a názvy těchto rolí tak, aby text otázek tematicky navazoval na záměr před schůzkou

#### Scenario: Kotvicí role bez přípravy

- **WHEN** příprava není propojena nebo neobsahuje role záměru a expert zvolí dvě kotvicí role
- **THEN** systém vygeneruje otázky vázané na tyto role v souladu s popisy rolí z kanonického zdroje

### Requirement: Odpovědi experta na reflexivní otázky

Systém MUSÍ umožnit expertovi zapsat k jednotlivým otázkám volný text (včetně zkrácených odpovědí) a MUSÍ tyto odpovědi uchovat v rámci draft reflexe spolu s relací reflexe.

#### Scenario: Uložení odpovědí v draftu

- **WHEN** expert vyplní odpovědi a uloží draft reflexe nebo explicitně uloží stav asistenta
- **THEN** systém persistuje odpovědi tak, aby je expert po opětovném otevření draftu viděl

### Requirement: Druhá fáze — návrh struktury reflexe

Systém MUSÍ na základě odpovědí z první fáze a dostupného kontextu reflexe (např. label konzultace, datum, propojená příprava) vygenerovat návrh: podmnožinu principů z Konzultantského desatera, množinu použitých rolí s kalibrací `underused`, `balanced` nebo `overused`, a text poučení pro příště. Návrh MUSÍ být generován přes OpenRouter se stejným RAG kontextem jako v první fázi nebo s rozšířeným kontextem odvozeným od odpovědí. Identifikátory principů a rolí v návrhu MUSÍ odpovídat záznamům v databázi aplikace.

#### Scenario: Návrh obsahuje pouze platné identifikátory

- **WHEN** inferenční vrstva vrátí návrh struktury
- **THEN** systém validuje principle a role ID proti kanonickým datům a zahodí nebo opraví neplatné položky před zobrazením expertovi

### Requirement: Expert jako autor finálního obsahu

Systém NESMÍ automaticky dokončit reflexi ani automaticky přepsat uložená pole reflexe bez explicitní akce expertu. Expert MUSÍ moci návrh upravit, zahodit nebo částečně přijmout a poté ručně uložit draft nebo dokončit reflexi stávajícím postupem.

#### Scenario: Použití návrhu do formuláře

- **WHEN** expert potvrdí akci typu „Použít návrh“
- **THEN** systém předvyplní odpovídající části rozhraní reflexe hodnotami z návrhu a expert může je před uložením libovolně změnit

### Requirement: Soukromí a absence managerského dohledu

Systém MUSÍ zajistit, že obsah odpovědí na reflexivní otázky, návrh asistenta a související stav jsou přístupné pouze vlastníkovi reflexie (stejně jako zbytek reflexe). Systém NESMÍ z těchto dat vytvářet manažerské přehledy, skóre výkonu ani agregace pro HR v rámci tohoto rozsahu změny.

#### Scenario: Jiný uživatel nemá přístup

- **WHEN** autentizovaný uživatel, který není vlastníkem reflexe, vyžádá generování nebo stav asistenta pro cizí `reflection_id`
- **THEN** systém žádost odmítne

### Requirement: Viditelné označení návrhu a tón rozhraní

Uživatelské texty v rozhraní asistenta MUSÍ prezentovat výstupy jako návrh nebo oporu k myšlení, nikoli jako hodnocení, skóre nebo rozhodnutí organizace.

#### Scenario: Primární akce není formulována jako hodnocení

- **WHEN** se zobrazí výsledek druhé fáze
- **THEN** rozhraní používá formulace v češtině v duchu „návrh“ / „můžete upravit“, nikoli „vaše hodnocení“ nebo „výsledek kontroly“

### Requirement: Hlavní kontext původního záměru z přípravy při generování reflexivních otázek

Při generování reflexivních otázek ve strukturovacím asistentovi MUSÍ systém zjistit, zda je reflexe propojena s přípravou a zda záznam přípravy obsahuje po ořezání úvodních a koncových mezer **neprázdný** text pole **původního záměru** (`focusNote` / behaviorální fokus z přípravy).

Je-li tato podmínka splněna, systém MUSÍ tento text použít jako **primární** kontext pro inferenci (výrazně zvýrazněný v instrukci nebo uživatelské části promptu pro model a v textu použitém pro retrieval), tak aby otázky primárně navazovaly na záměr expert před schůzkou.

#### Scenario: Propojená příprava s neprázdným záměrem

- **WHEN** draft reflexe má platnou vazbu na přípravu a příprava má neprázdný záměr po ořezání mezer
- **THEN** generování reflexivních otázek zahrne tento záměr jako hlavní kontext podle pravidla výše

### Requirement: Kontext z reflexe při absenci použitelného záměru z přípravy

Není-li splněna podmínka neprázdného záměru z přípravy (příprava chybí, není propojena, nebo je `focusNote` prázdný), systém MUSÍ pro generování reflexivních otázek použít kontext **z aktuálně uloženého draftu reflexe**: vybrané principy z Konzultantského desatera a vybrané situační role s jejich kalibrací, doplněné o dostupný label a čas konzultace z reflexe, pokud jsou uloženy.

#### Scenario: Bez neprázdného záměru z přípravy

- **WHEN** neprázdný záměr z přípravy není k dispozici podle pravidla výše
- **THEN** generování otázek použije principy a role (a související metadata reflexe) uložené u draftu reflexe jako hlavní vstup pro personalizaci otázek

### Requirement: Konzistence kontextu ve druhé fázi asistenta

Při generování **návrhu struktury reflexe** (druhá fáze asistenta) systém MUSÍ použít **stejnou prioritu kontextu** jako při generování otázek: nejprve neprázdný původní záměr z propojené přípravy, jinak kontext z principů a rolí uložených u reflexe a odpovědí experta na otázky.

#### Scenario: Návrh po vyplnění otázek

- **WHEN** expert spustí druhou fázi asistenta po první fázi
- **THEN** inferenční vstup respektuje prioritu záměr z přípravy vs. reflexe konzistentně s první fází

### Requirement: Vizuální sjednocení s panelem reflexivních otázek přípravy

Rozhraní strukturovacího asistenta reflexe (obal sekce, primární tlačítka generování, prezentace seznamu otázek, stavy načítání) MUSÍ být **vizuálně sladěno** s panelem reflexivních otázek v přípravě (`PreparationReflectiveQuestionsPanel`), včetně použití **stejné nebo ekvivalentní ikonografie** (např. Sparkles u hlavní akce generování) a respektování **preferencí sníženého pohybu** tam, kde příprava používá animace.

#### Scenario: Expert vidí asistenta v reflexi

- **WHEN** je zobrazen strukturovací asistent v kroku poznámky k učení
- **THEN** vizuální styl primárních akcí a seznamu otázek je konzistentní s přípravou natolik, aby působil jako stejná „rodina“ komponent, bez nutnosti pixel-perfect shody
