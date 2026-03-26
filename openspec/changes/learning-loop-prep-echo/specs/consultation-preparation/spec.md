# Delta: consultation-preparation (learning-loop-prep-echo)

## ADDED Requirements

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
