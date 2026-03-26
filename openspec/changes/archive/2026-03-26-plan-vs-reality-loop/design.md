## Context

V současném stavu aplikace může expert reflektovat již proběhlou konzultaci. Chybí však možnost vědomého nastavení záměru před schůzkou, což je klíčové pro uzavření učební smyčky (§12.6 ProductSpec). Tento design řeší implementaci "přípravy" a její funkční i vizuální propojení s následnou reflexí.

## Goals / Non-Goals

**Goals:**
- Vytvořit lehký a intuitivní workflow pro přípravu před konzultací (UC4, UC5).
- Propojit entitu přípravy s následnou reflexí (1:1 vztah).
- Implementovat vizuální porovnání "Záměr vs. Realita" v detailu reflexe.
- Využít principy moderního interaction designu (plynulé přechody, okamžitá zpětná vazba).
- Zachovat technickou kompatibilitu s Drizzle ORM a SQLite/Postgres.

**Non-Goals:**
- Automatické propojování s YTrackerem (stále používáme pouze labely).
- Skupinová příprava (pouze individuální).
- Komplexní analytika progresu (pouze historie 1:1).

## Decisions

### 1. Rozšíření datového modelu (Drizzle)
- **Rozhodnutí**: Vytvořit tabulku `preparation_sessions` a propojovací tabulku `preparation_roles`.
- **Rationale**: Oddělení přípravy od reflexe umožňuje expertovi mít "otevřené" přípravy, které ještě nebyly zreflektovány. Tabulka `preparation_roles` bude obsahovat pole `type` (např. `strengthen` pro posílení a `downregulate` pro tlumení).
- **Alternativy**: Ukládat záměr přímo do reflexe (zamítnuto: expert potřebuje přípravu vytvořit dříve, než existuje reflexe).

### 2. UI komponenta pro výběr rolí (Role Selector)
- **Rozhodnutí**: Refaktorovat stávající výběr rolí do univerzální komponenty `RoleSelector`.
- **Rationale**: Komponenta bude podporovat dva módy:
  - `PreparationMode`: Výběr s polaritou (+ / -).
  - `ReflectionMode`: Výběr s následnou kalibrací (underused / balanced / overused).
- **Alternativy**: Dvě separátní komponenty (zamítnuto: duplikace vizuální logiky karet).

### 3. Flow propojení (Bridge logic)
- **Rozhodnutí**: V seznamu reflexí přibude sekce "Čekající přípravy". Kliknutím na přípravu se otevře předvyplněný formulář reflexe.
- **Rationale**: Minimalizuje tření. Expert nemusí znovu zadávat label nebo datum schůzky.

### 4. Interaction Design (Framer Motion)
- **Rozhodnutí**: Použít `Framer Motion` pro micro-interactions.
- **Rationale**: 
  - **Layout Transitions**: Plynulé rozbalení karty při výběru priority v přípravě.
  - **Feedback**: Jemná spring animace (`stiffness: 400, damping: 25`) při přidání role do seznamu záměrů.
  - **Contextual Aids**: Tooltipy vysvětlující, co znamená "tlumit" roli (prevence přepálení).

## Risks / Trade-offs

- **[Risk] Administrativní zátěž** → **Mitigation**: Příprava je omezena na 1-2 kroky. Výběr rolí je klikací, psaní záměru je volitelné.
- **[Risk] Fragmentace dat (osiřelé přípravy)** → **Mitigation**: UI bude explicitně nabízet smazání nebo archivaci starých, nereflektovaných příprav.
- **[Trade-off] Technická složitost propojování** → Volíme jednoduchou vazbu `reflection.preparationId`. Pokud uživatel začne reflexi "na zelenej louce", může dodatečně připojit přípravu (nebo ji nechat být).
