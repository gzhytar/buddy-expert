# Konzultační reflexe

Kanónické požadavky sloučené z delt `refine-mvp-ux-slice` (MVP slice 1, EN), `plan-vs-reality-loop` (záměr vs. realita, CS) a `learning-loop-prep-echo` (cesta k přípravě po reflexi). Pořadí: nejdřív základ reflexe, potom rozšíření o vazbu na přípravu a navigaci smyčky učení.

## Requirements

### Requirement: Start a new reflection

The system SHALL allow an authenticated expert to start a new post-consultation reflection session.

#### Scenario: Create draft reflection

- **WHEN** the expert chooses to create a new reflection
- **THEN** the system creates a reflection session owned by that expert and presents the reflection capture flow

### Requirement: Consultation context (non-CRM)

The system SHALL let the expert attach optional consultation context consisting of a free-text label or title and an optional consultation date-time, without requiring integration to YTracker or client identifiers.

#### Scenario: Expert names a consultation informally

- **WHEN** the expert enters a label such as an internal nickname or topic and saves the session
- **THEN** the system stores that label with the reflection and does not require a CRM identifier

### Requirement: Select relevant principles

The system SHALL let the expert select one or more principles from **Konzultantské desatero** (the ten JIC consulting principles) as relevant to the completed consultation.

#### Scenario: Principles multi-select

- **WHEN** the expert selects a subset of principles and continues
- **THEN** the system persists those selections on the reflection session

### Requirement: Select roles used and calibrate intensity

The system SHALL let the expert select one or more situational roles they used in the consultation and, for each selected role, record a calibration of `underused`, `balanced`, or `overused`.

#### Scenario: Role calibration per selected role

- **WHEN** the expert selects two roles and sets calibration for each
- **THEN** the system persists both roles with their respective calibration values

### Requirement: Learning note

The system SHALL let the expert record a short learning note capturing takeaway for future consultations.

#### Scenario: Save learning note

- **WHEN** the expert enters a learning note within configured length limits and saves
- **THEN** the system persists the note on the reflection session

### Requirement: Complete and persist reflection

The system SHALL let the expert submit or save the reflection session as complete, persisting all captured fields atomically for that session.

#### Scenario: Successful completion

- **WHEN** the expert completes required fields per application validation rules and submits
- **THEN** the system stores the reflection and confirms success to the expert

### Requirement: List own reflections

The system SHALL let the expert view a list of their own reflection sessions with enough summary (e.g. label, date, last updated) to reopen or review.

#### Scenario: Expert sees history

- **WHEN** the expert opens their reflections list
- **THEN** the system shows only that expert’s sessions ordered by recency

### Requirement: Privacy of reflections

The system SHALL restrict read and write access to a reflection session to the owning authenticated expert only in MVP slice 1.

#### Scenario: Another user cannot access reflection

- **WHEN** a different authenticated user attempts to open a reflection session they do not own
- **THEN** the system denies access

### Requirement: Links to orientation from reflection

The system SHALL provide navigation from the reflection flow to orientation content (Konzultantské desatero and roles) so experts can refresh the shared language without losing in-progress work where technically feasible.

#### Scenario: Open roles reference mid-reflection

- **WHEN** the expert opens roles reference from the reflection UI
- **THEN** the system opens orientation roles content in a way that avoids unintended data loss of the draft reflection

### Requirement: Zahájení reflexe z existující přípravy

Systém MUSÍ umožnit zahájení reflexe přímo z konkrétního záznamu přípravy. V takovém případě MUSÍ systém do reflexe automaticky přenést kontext (label, datum) a zobrazit expertovi jeho původní záměr (fokus a vybrané role k posílení/tlumení) jako referenci.

#### Scenario: Reflexe se záměrem

- **WHEN** expert zvolí "Vytvořit reflexi" z detailu konkrétní přípravy
- **THEN** systém otevře formulář reflexe s předvyplněným labelem a zobrazí box "Původní záměr" s textem fokusu a seznamem naplánovaných rolí

### Requirement: Vizuální porovnání záměru s realitou (Plan vs. Reality)

V detailu reflexe a v seznamu reflexí MUSÍ systém vizuálně zobrazit shodu či rozpor mezi naplánovanými rolemi (z přípravy) a skutečně použitými rolemi (v reflexi).

#### Scenario: Zobrazení shody rolí

- **WHEN** expert v přípravě naplánoval posílit roli "Posluchač" a v reflexi ji označil jako "vyváženou"
- **THEN** systém v přehledu reflexe zobrazí roli "Posluchač" s ikonou potvrzení nebo shody se záměrem

### Requirement: Ruční propojení reflexe s přípravou

Systém MUSÍ umožnit expertovi dodatečně propojit již vytvořenou reflexi s existující přípravou (pokud ještě nemá přiřazenou jinou reflexi).

#### Scenario: Dodatečné přiřazení přípravy

- **WHEN** expert v detailu reflexe vybere ze seznamu svých nereflektovaných příprav "Strategický workshop - Alfa"
- **THEN** systém propojí tyto dva záznamy a zobrazí porovnání záměru s realitou

### Requirement: Cesta k nové přípravě po dokončení reflexe

Po úspěšném dokončení reflexe systém MUSÍ uživateli nabídnout jasnou primární navigaci k založení **nové přípravy před konzultací** (existující flow přípravy), aby byla podpořena produktová smyčka „reflexe → další příprava“. Text výzvy MUSÍ být formulovaný podpůrně, ne evaluativně.

#### Scenario: Po dokončení reflexe je k dispozici odkaz na přípravu

- **WHEN** expert dokončí reflexi a systém potvrdí úspěch
- **THEN** na následující obrazovce nebo v potvrzovacím bloku je viditelný odkaz nebo tlačítko vedoucí na vytvoření nové přípravy

#### Scenario: Dokončení bez ztráty stávajícího chování

- **WHEN** expert dokončí reflexi
- **THEN** systém stále splní všechny stávající požadavky na uložení dokončené reflexe a přístup k vlastním reflexím

### Requirement: Perzistence stavu strukturovacího asistenta

Systém MUSÍ ukládat stav volitelného strukturovacího asistenta (fáze, vygenerované otázky, odpovědi experta, poslední návrh struktury a případné kotvicí role) vázaně na konkrétní draft relace reflexe tak, aby po opuštění stránky a opětovném otevření expert pokračoval bez ztráty mezikroků.

#### Scenario: Obnovení draftu s asistentem

- **WHEN** expert uloží draft reflexe po částečném průběhu asistenta a později stejnou reflexi znovu otevře
- **THEN** systém zobrazí stejný stav asistenta včetně otázek, odpovědí a případného návrhu podle posledního uložení

### Requirement: Integrace asistenta do rozhraní reflexe

Systém MUSÍ v rozhraní rozpracované nebo nově zahájené reflexe poskytnout vstup do strukturovacího asistenta (např. sekce nebo postranní panel) bez znemožnění přístupu k existujícím krokům reflexe (kontext konzultace, principy, role, poučení) a bez porušení navigace k orientačnímu obsahu tam, kde již existuje.

#### Scenario: Asistent a ruční vyplnění vedle sebe

- **WHEN** expert otevře draft reflexe
- **THEN** systém zobrazí jak standardní prvky reflexe, tak možnost spustit nebo pokračovat v asistentovi
