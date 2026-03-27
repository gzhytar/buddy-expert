# Úložiště dat (platforma)

Provozní a vývojové požadavky na relační databázi (PostgreSQL / Neon) a Drizzle migrace. Delta z `migrate-sqlite-to-neon`.

## Requirements

### Requirement: Produkční úložiště na PostgreSQL (Neon)

Nasazená aplikace MUSÍ používat PostgreSQL jako jediný zdroj pravdy pro relační data uživatelů, příprav, reflexí a referenčních entit (principy, role). Připojení MUSÍ být realizováno přes službu kompatibilní s Neon (managed Postgres) a connection string MUSÍ být dodán prostřednictvím proměnné prostředí, nikoli natvrdo v kódu.

#### Scenario: Nasazení na Vercel

- **WHEN** aplikace běží v produkčním prostředí (např. Vercel) s platným `DATABASE_URL` ukazujícím na Neon
- **THEN** všechny zápisy a čtení doménových dat probíhají přes Postgres a aplikace se nespoléhá na lokální souborovou databázi

### Requirement: Jednotné Drizzle schéma pro Postgres

Zdrojové schéma ORM (Drizzle) MUSÍ být definováno pro PostgreSQL (`pg-core`), MUSÍ odpovídat verzovaným SQL migracím v repozitáři a MUSÍ pokrývat všechny tabulky a vazby potřebné pro stávající funkce produktu (uživatelé, přípravy, reflexe, principy, role a jejich vazební tabulky).

#### Scenario: Aplikace migrace na čisté instanci

- **WHEN** provozovatel spustí schválený postup migrací Drizzle proti prázdné Postgres instanci
- **THEN** vznikne schéma konzistentní s typy a dotazy v aplikaci bez manuálních úprav tabulek mimo migrace

### Requirement: Konfigurace připojení a tajemství

`DATABASE_URL` MUSÍ být dokumentován v `.env.example` jako povinná proměnná pro běh proti Postgresu. Tajné hodnoty connection stringu se MUSÍ nedostávat do gitu. Produkční a preview prostředí MUSÍ používat oddělené databázové instance nebo schémata tak, aby se předešlo nechtěnému smíchání dat mezi prostředími.

#### Scenario: Nový vývojář nastavuje lokální běh

- **WHEN** vývojář zkopíruje `.env.example` do `.env.local` a vyplní platný Postgres `DATABASE_URL` (Neon dev větev nebo lokální Postgres)
- **THEN** aplikace se dokáže připojit k databázi a dokončit migrace bez úprav zdrojového kódu

### Requirement: Kompatibilita runtime s Next.js na Vercelu

Vrstva `lib/db` MUSÍ používat oficiálně podporovaný klient a Drizzle driver vhodný pro serverless běh (bez závislosti na trvalém lokálním souboru `.db`). Volba driveru MUSÍ být konzistentní s místem použití (Node serverless funkce vs. případný Edge); pokud část kódu běží na Edge, databázové volání MUSÍ být prováděno pouze z runtime, kde je driver podporován.

#### Scenario: Server Action uloží reflexi

- **WHEN** uživatel dokončí reflexi přes Server Action na Vercelu
- **THEN** zápis proběhne úspěšně přes zvolený Postgres driver bez nutnosti souborového SQLite

### Requirement: Tabulky pro Auth.js a OAuth účty

Schéma Drizzle pro Postgres MUST obsahovat struktury vyžadované použitým Auth.js Drizzle adaptérem pro uložení uživatelů přihlášení, OAuth účtů (včetně vazby na poskytovatele a `providerAccountId`) a relací tak, aby bylo možné bezpečně provozovat přihlášení přes Google vedle stávajících doménových tabulek.

#### Scenario: Migrace přidá auth tabulky

- **WHEN** provozovatel aplikuje schválené migrace této změny na Postgres instanci
- **THEN** vzniknou tabulky potřebné pro adaptér a aplikace je schopna uložit záznam OAuth účtu po prvním přihlášení přes Google

### Requirement: Volitelný hash hesla u uživatele

Tabulka doménových uživatelů (nebo ekvivalentní entita používaná pro Credentials) MUST umožnit existenci řádku bez hodnoty hashe hesla pro uživatele vytvořené výhradně přes OAuth, přičemž stávající uživatelé s heslem zůstanou po migraci funkční.

#### Scenario: Uživatel pouze OAuth

- **WHEN** nový uživatel dokončí první přihlášení přes Google
- **THEN** systém může uložit záznam uživatele bez lokálního `password_hash` a přihlášení přes Google nadále funguje

#### Scenario: Stávající uživatel s heslem

- **WHEN** migrace proběhne nad databází s existujícími uživateli s uloženým hashem
- **THEN** tito uživatelé se nadále přihlásí e-mailem a heslem a jejich `user_id` v přípravách a reflexích zůstane platný
