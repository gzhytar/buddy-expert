## Why

Příprava vedla experta přímo z výběru rolí do kroku Záměr, aniž by ho systém navedl k osvěžení rámcových principů. Reflexe už má samostatný krok k principům z Konzultantského desatera; stejná kotva před formulací záměru posílí kontinuitu smyčky příprava → konzultace → reflexe a připomene desatero jako podpůrný rámec, ne kontrolu.

## What Changes

- Ve wizardu přípravy přibude **nový krok** mezi **Role** a **Záměr** s názvem v souladu s produktem (např. **Konzultantské desatero**).
- Krok **pouze připomene a povzbudí** k promýšlení s principy: stručný text v češtině a **jasná navigace** na stránku principů v orientaci (`/orientation/principles`), včetně možnosti otevřít v novém panelu (konzistence s hlavičkou reflexe).
- **Žádný nový povinný vstup** ani ukládání výběru principů do přípravy — krok je průchozí po stejném uložení draftu jako ostatní kroky.
- Pořadí kroků: Konzultace → Role → Konzultantské desatero → Záměr.

## Capabilities

### New Capabilities

- *(žádná)*

### Modified Capabilities

- `consultation-preparation`: rozšíření o požadavek na samostatný informační krok Konzultantské desatero mezi výběrem rolí a záměrem.

## Impact

- `PreparationWizard` a případně malý sdílený nebo lokální UI blok pro text + odkazy.
- Žádná změna schématu databáze ani server actions nad rámec stávajícího ukládání draftu mezi kroky.
