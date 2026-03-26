## 1. Data a autorizace

- [ ] 1.1 Přidat dotaz (např. v `lib/queries` nebo `lib/reflection`) vracející nejnovější dokončenou reflexi přihlášeného uživatele s neprázdným `learningNote` (po trim), včetně data dokončení a volitelného `consultationLabel`
- [ ] 1.2 Ověřit, že dotaz filtruje podle `userId` ze session a stavu dokončení konzistentně se stávajícím modelem reflexí

## 2. Echo na obrazovce přípravy

- [ ] 2.1 Vložit na stránku přípravy (`/preparations/[id]` / `PreparationWizard`) komponentu panelu „poslední poučení“ (čtení pouze), skrytou pokud dotaz nic nevrátí
- [ ] 2.2 Zajistit české texty, typografii a přístupnost (nadpis sekce, datum, label, `whitespace-pre-wrap` pro poučení)

## 3. Cesta k přípravě po dokončení reflexe

- [ ] 3.1 Upravit flow po `completeReflection` tak, aby uživatel viděl výzvu a primární odkaz/tlačítko na `/preparations/new` (nebo ekvivalent), např. na `/reflections?complete=1` nebo na cílové stránce po redirectu
- [ ] 3.2 Ověřit ručně: dokončení reflexe s poučením → odkaz funguje; otevření přípravy → panel se zobrazí; uživatel bez reflexí → panel chybí

## 4. Spec a úklid

- [ ] 4.1 Po implementaci spustit `openspec verify` pro změnu `learning-loop-prep-echo` (pokud je k dispozici) a případně `openspec sync` / archivaci podle procesu projektu
