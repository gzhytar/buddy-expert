## ADDED Requirements

### Requirement: Produkční úložiště na PostgreSQL (Neon)

Nasazená aplikace MUST používat PostgreSQL jako jediný zdroj pravdy pro relační data uživatelů, příprav, reflexí a referenčních entit (principy, role). Připojení MUST být realizováno přes službu kompatibilní s Neon (managed Postgres) a connection string MUST být dodán prostřednictvím proměnné prostředí, nikoli natvrdo v kódu.

#### Scenario: Nasazení na Vercel

- **WHEN** aplikace běží v produkčním prostředí (např. Vercel) s platným `DATABASE_URL` ukazujícím na Neon
- **THEN** všechny zápisy a čtení doménových dat probíhají přes Postgres a aplikace se nespoléhá na lokální souborovou databázi

### Requirement: Jednotné Drizzle schéma pro Postgres

Zdrojové schéma ORM (Drizzle) MUST být definováno pro PostgreSQL (`pg-core`), MUST odpovídat verzovaným SQL migracím v repozitáři a MUST pokrývat všechny tabulky a vazby potřebné pro stávající funkce produktu (uživatelé, přípravy, reflexe, principy, role a jejich vazební tabulky).

#### Scenario: Aplikace migrace na čisté instanci

- **WHEN** provozovatel spustí schválený postup migrací Drizzle proti prázdné Postgres instanci
- **THEN** vznikne schéma konzistentní s typy a dotazy v aplikaci bez manuálních úprav tabulek mimo migrace

### Requirement: Konfigurace připojení a tajemství

`DATABASE_URL` MUST být dokumentován v `.env.example` jako povinná proměnná pro běh proti Postgresu. Tajné hodnoty connection stringu MUST NOT být commitovány do gitu. Produkční a preview prostředí MUST používat oddělené databázové instance nebo schémata tak, aby se předešlo nechtěnému smíchání dat mezi prostředími.

#### Scenario: Nový vývojář nastavuje lokální běh

- **WHEN** vývojář zkopíruje `.env.example` do `.env.local` a vyplní platný Postgres `DATABASE_URL` (Neon dev větev nebo lokální Postgres)
- **THEN** aplikace se dokáže připojit k databázi a dokončit migrace bez úprav zdrojového kódu

### Requirement: Kompatibilita runtime s Next.js na Vercelu

Vrstva `lib/db` MUST používat oficiálně podporovaný klient a Drizzle driver vhodný pro serverless běh (bez závislosti na trvalém lokálním souboru `.db`). Volba driveru MUST být konzistentní s místem použití (Node serverless funkce vs. případný Edge); pokud část kódu běží na Edge, databázové volání MUST být prováděno pouze z runtime, kde je driver podporován.

#### Scenario: Server Action uloží reflexi

- **WHEN** uživatel dokončí reflexi přes Server Action na Vercelu
- **THEN** zápis proběhne úspěšně přes zvolený Postgres driver bez nutnosti souborového SQLite
