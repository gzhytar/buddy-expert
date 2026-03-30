# Konzultační reflexe (delta)

## ADDED Requirements

### Requirement: Perzistence stavu strukturovacího asistenta

Systém MUSÍ ukládat stav volitelného strukturovacího asistenta (fáze, vygenerované otázky, odpovědi experta, poslední návrh struktury a případné kotvicí role) vázaně na konkrétní draft relace reflexe tak, aby po opuštění stránky a opětovném otevření expert pokračoval bez ztráty mezikroků.

#### Scenario: Obnovení draftu s asistentem

- **WHEN** expert uloží draft reflexe po částečném průběhu asistenta a později stejnou reflexi znovu otevře
- **THEN** systém zobrazí stejný stav asistenta včetně otázek, odpovědí a případného návrhu podle posledního uložení

### Requirement: Integrace asistenta do rozhraní reflexe

Systém MUSÍ v rozhraní rozpracované nebo nově zahájené reflexe poskytnout vstup do strukturovacího asistenta (např. sekce nebo postranní panel) bez znemožnění přístupu k existujícím krokům reflexe (kontext konzultace, principy, role, poučení) a bez porušení navigace k orientačnímu obsahu tam, kde již existuje.

#### Scenario: Asistent a ruční vyplnění vedle sebe

- **WHEN** expert otevře draft reflexe
- **THEN** systém zobrazí jak standardní prvky reflexe, tak možnost spustit nebo pokračovat v asistentovi
