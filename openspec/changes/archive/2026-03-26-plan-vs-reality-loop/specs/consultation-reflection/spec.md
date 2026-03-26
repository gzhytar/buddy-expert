## ADDED Requirements

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
