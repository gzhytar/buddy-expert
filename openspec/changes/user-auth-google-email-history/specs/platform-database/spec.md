# Úložiště dat (platforma)

Delta z `user-auth-google-email-history` — rozšíření pro OAuth a volitelné heslo.

## ADDED Requirements

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
