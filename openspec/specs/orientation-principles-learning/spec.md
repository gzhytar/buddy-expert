# Konzultantské desatero — výukové sekce u principů

Kanónická delta z `principles-learning-tips-stories`.

## Requirements

### Requirement: Trvalé uložení výukových sekcí u principu

Systém MUSÍ u každého záznamu konzultačního principu persistovat dva oddělené textové atributy: obsah pro sekci „Tipy a triky“ a obsah pro sekci „Příběhy z praxe“. Oba atributy MUSÍ být ve schématu databáze povinné (NOT NULL). Požadavek na neprázdný obsah v seedu je v následujícím požadavku.

#### Scenario: Schéma principu obsahuje oba bloky

- **WHEN** vývojář nebo migrace vytvoří nebo aktualizuje řádek principu
- **THEN** systém umožní uložit a načíst nezávisle hodnotu „Tipy a triky“ a hodnotu „Příběhy z praxe“ pro stejné `id` principu

### Requirement: Úplný seed pro Konzultantské desatero

Počáteční data (seed) MUSÍ pro každý z deseti principů Konzultantského desatera obsahovat neprázdný český text v obou sekcích („Tipy a triky“ i „Příběhy z praxe“).

#### Scenario: Seed dokončen bez mezer

- **WHEN** se po migraci spustí idempotentní seed principů
- **THEN** všech deset principů desatera má vyplněné oba textové bloky žádným prázdným řetězcem ani zástupným „Lorem ipsum“

### Requirement: Zobrazení výukových sekcí na stránce Konzultantského desatera

Na stránce orientace s Konzultantským desaterem systém MUSÍ u každého principu zobrazit pod stávajícím shrnutím dvě vizuálně a nadpisově oddělené sekce s přesnými štítky „Tipy a triky“ a „Příběhy z praxe“, naplněné obsahem z úložiště dat.

#### Scenario: Expert si prohlíží princip na desktopu

- **WHEN** autentizovaný expert otevře Konzultantské desatero v orientaci
- **THEN** u každé karty principu vidí shrnutí, pod ním sekci „Tipy a triky“ a sekci „Příběhy z praxe“ s textem odpovídajícím danému principu

#### Scenario: Expert si prohlíží princip na úzkém viewportu

- **WHEN** autentizovaný expert zobrazí stejnou stránku na úzkém viewportu
- **THEN** pořadí obsahu zůstává stejné (shrnutí, poté tipy, poté příběhy) a text je čitelný bez horizontálního posuvníku v těle karty

### Requirement: Přístupnost struktury výukových sekcí

Systém MUSÍ vyznačit obě výukové podsekce tak, aby byl strojově čitelný nadpis sekce (např. úroveň nadpisu nebo skupina s popiskem) a aby byl obsah svázán s tímto nadpisem pro asistivní technologie.

#### Scenario: Klávesnicí a čtečkou

- **WHEN** expert používá čtečku obrazovky na kartě principu
- **THEN** nástroj oznámí nadpisy „Tipy a triky“ a „Příběhy z praxe“ jako strukturální značky navigace v rámci karty
