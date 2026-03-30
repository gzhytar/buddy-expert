## 1. Data a serverové akce

- [x] 1.1 Přidat `deleteReflection` (nebo ekvivalent) v `lib/reflection/actions.ts`: ověření session, vlastnictví záznamu, `DELETE` na `reflection_sessions`, `revalidatePath` pro `/reflections`, `/reflections/[id]` a související layouty.
- [x] 1.2 Přidat `deletePreparation` v `lib/preparation/actions.ts`: ověření vlastnictví; v transakci nejdříve `preparation_id = NULL` u reflexí stejného uživatele odkazujících na tuto přípravu (nebo migrace `ON DELETE SET NULL` podle `design.md`), poté smazání `preparation_sessions`; `revalidatePath` pro `/preparations`, `/preparations/[id]`, `/reflections` kde je potřeba.
- [x] 1.3 Zvalidovat vstup (Zod) pro ID záznamu; sjednotit české chybové hlášky (neautorizováno, nenalezeno, selhání DB).

## 2. UI — přehledy historie

- [x] 2.1 V přehledu příprav přidat akci „Smazat“ s potvrzovacím dialogem (destruktivní varianta) a voláním server action; po úspěchu obnovit seznam (router refresh / optimistic podle stávajících vzorů).
- [x] 2.2 V přehledu reflexí přidat stejný vzor pro smazání reflexe.

## 3. UI — kontext úprav / detail

- [x] 3.1 V průběhu přípravy (wizard nebo layout stránky) přidat dostupnou akci smazání s potvrzením a přesměrováním na `/preparations` po úspěchu.
- [x] 3.2 V průběhu reflexe (wizard nebo layout) přidat akci smazání s potvrzením a přesměrováním na `/reflections` po úspěchu.

## 4. Chování po smazání a přístup přes URL

- [x] 4.1 Ujistit se, že stránky `app/preparations/[id]` a `app/reflections/[id]` při neexistujícím nebo cizím záznamu vracejí `notFound()` nebo ekvivalent bez úniku dat (soulad se spec „Přímý odkaz na smazaný záznam“).

## 5. Ověření

- [x] 5.1 Ručně ověřit: smazání přípravy bez navázané reflexe; s navázanou reflexí (vazba se zruší, reflexe zůstane); smazání reflexe s a bez `preparationId`; pokus o smazání cizího ID.
