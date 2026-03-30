## ADDED Requirements

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
