## Why

Krok „Soulad s rámcem“ ve flow reflexe přidává zátěž a duplicitní signál vůči principům a rolím; produkt chce zjednodušit dokončení reflexe bez povinného hodnocení souladu s rámcem jako samostatného kroku.

## What Changes

- Odstranění kroku 4 „Soulad s rámcem“ z průvodce reflexí (wizard); zbývající kroky se přečíslují logicky v UI.
- Zrušení povinného sběru `alignmentLikert` (Likert) a volitelné poznámky `alignmentNote` při dokončení reflexe; odstranění z validace dokončení a z autosave payloadu tam, kde už nejsou potřeba.
- Úprava zobrazení dokončené reflexe: sekce „Soulad s rámcem JIC“ se nezobrazuje (nebo se zobrazí jen pro historická data — viz design).
- Aktualizace kanonického specu `consultation-reflection`: zrušení požadavku na zachycení souladu s rámcem JIC jako povinné části reflexe.

## Capabilities

### New Capabilities

- *(žádné)*

### Modified Capabilities

- `consultation-reflection`: Odstranit požadavek „JIC frame alignment“ a související scénář; reflexe už nemusí ukládat strukturovaný soulad s rámcem ani volitelný text k němu u nových dokončení.

## Impact

- UI: `components/reflection/reflection-wizard.tsx`, `components/reflection/reflection-readonly.tsx` (a případně sdílené typy importované z validace).
- Doménová logika: `lib/reflection/validation.ts`, `lib/reflection/actions.ts`.
- Databáze: sloupce `alignment_likert` / `alignment_note` v tabulce reflexí — rozhodnutí v designu (ponechat nullable pro historii vs. migrace).
- Případně `ProductSpecification.md` jen pokud má být sjednocen popis flow s produktem (mimo OpenSpec delta, pokud není součástí úkolů).
