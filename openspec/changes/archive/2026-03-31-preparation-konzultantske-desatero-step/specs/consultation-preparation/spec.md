## ADDED Requirements

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
