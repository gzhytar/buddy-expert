# Autentizace uživatele

Delta z `user-auth-google-email-history`.

## ADDED Requirements

### Requirement: Přihlášení přes Google

Systém MUST umožnit přihlášení registrovaného uživatele prostřednictvím OAuth poskytovatele Google tak, že po úspěšném souhlasu u Google přihlásí uživatele do aplikace a vytvoří nebo propojí záznam uživatele v souladu s pravidly aplikace pro identitu.

#### Scenario: Úspěšné přihlášení Google

- **WHEN** uživatel na přihlašovací stránce zvolí přihlášení přes Google a dokončí OAuth tok u Google
- **THEN** systém vytvoří relaci přihlášeného uživatele a přesměruje ho do chráněné části aplikace (např. orientace nebo návratová URL)

#### Scenario: Odmítnutí nebo chyba u Google

- **WHEN** uživatel OAuth tok zruší nebo Google vrátí chybu
- **THEN** systém uživatele nepřihlásí a zobrazí srozumitelnou českou hlášku bez úniku technických tajemství

### Requirement: Přihlášení e-mailem a heslem

Systém MUST nadále umožnit přihlášení uživateli, který má v databázi uložený platný hash hesla, zadáním e-mailu a hesla na přihlašovací stránce.

#### Scenario: Platné heslo

- **WHEN** uživatel zadá e-mail a heslo odpovídající existujícímu účtu s uloženým heslem
- **THEN** systém vytvoří relaci a přesměruje uživatele do chráněné části aplikace

#### Scenario: Účet bez hesla

- **WHEN** uživatel zadá e-mail účtu založeného pouze přes OAuth bez lokálního hesla
- **THEN** systém přihlášení heslem zamítne a zobrazí českou hlášku, která uživatele navede na přihlášení přes Google (nebo jiný povolený způsob)

### Requirement: Odhlášení

Systém MUST umožnit přihlášenému uživateli odhlášení tak, že relace přestane platit a další požadavky na chráněný obsah vyžadují nové přihlášení.

#### Scenario: Odhlášení z aplikace

- **WHEN** uživatel zvolí odhlášení
- **THEN** systém ukončí relaci a přesměruje uživatele na veřejnou přihlašovací stránku nebo jiný dohodnutý vstupní bod

### Requirement: České texty přihlášení

Viditelné štítky tlačítek, nadpisy přihlašovací stránky a běžné chybové hlášky související s přihlášením MUST být v češtině.

#### Scenario: Přihlašovací obrazovka

- **WHEN** nepřihlášený uživatel otevře přihlašovací stránku
- **THEN** nabídka způsobů přihlášení a formulář e-mail/heslo jsou česky popsány

### Requirement: Tajné klíče a konfigurace OAuth

Konfigurace přihlášení přes Google MUST číst klient ID a klient secret z proměnných prostředí; tyto hodnoty se MUST nedostávat do veřejného klienta v nešifrované podobě. `AUTH_SECRET` (nebo ekvivalent) MUST být nastaven pro podpis relace.

#### Scenario: Nasazení bez Google secret

- **WHEN** v prostředí chybí platná konfigurace Google OAuth nebo `AUTH_SECRET`
- **THEN** build nebo běh MUST selhat bezpečně (např. chyba konfigurace) nebo musí být Google přihlášení v daném prostředí vypnuto explicitním rozhodnutím dokumentovaným v kódu — nesmí vzniknout tichý únik tajemství do klienta
