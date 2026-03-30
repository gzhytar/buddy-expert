## 1. Data a stránky přípravy

- [x] 1.1 Rozšířit dotaz sebeohodnocení (nebo wrapper) tak, aby kromě `focusRoleNames` vracel i **`focusRoleIds`** v pořadí katalogu
- [x] 1.2 Na stránkách `app/preparations/new` a `app/preparations/[id]` načíst souhrn pro přihlášeného uživatele a předat do `PreparationWizard` props: `isComplete`, `focusRoleIds` (a případně názvy pro stručné hinty)

## 2. Krok rolí — dvě sekce

- [x] 2.1 Při `isComplete && focusRoleIds.length > 0` v kroku výběru rolí vykreslit sekci **Zaměření** (jen tyto role), výchozí **otevřená**, a sekci **Ostatní role** (zbývající z 16), výchozí **zavřená** (Collapsible / `<details>` + přístupnost)
- [x] 2.2 Zachovat stávající interakci posílení/tlumení v obou sekcích; fallback jednoho seznamu při nekompletním eval nebo při nule focus rolí

## 3. Ostatní kroky a odkazy

- [x] 3.1 Na krocích 0 a 2 zobrazit jen **stručný** hint (text + odkaz na `/orientation/roles`), ne plnou dvousekci rolí
- [x] 3.2 Při nekompletním sebeohodnocení volitelně krátká výzva s odkazem na orientaci, bez blokace formuláře

## 4. Ověření

- [x] 4.1 Ručně ověřit: žádné automatické `preparation_roles` z `focus_improve`; rozbalení/sbalení ostatních rolí; klávesová ovladatelnost collapsible
- [x] 4.2 Kontrola vůči deltě `consultation-preparation` nebo `/opsx:verify` po implementaci
