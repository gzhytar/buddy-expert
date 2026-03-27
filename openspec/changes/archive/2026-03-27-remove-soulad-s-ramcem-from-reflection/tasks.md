## 1. Validace a serverové akce

- [x] 1.1 Upravit `lib/reflection/validation.ts`: odstranit `alignmentLikert` z `reflectionCompletePayloadSchema`; z `reflectionDraftPayloadSchema` odstranit pole související se souladem (nebo je ponechat jen pokud je potřeba zpětná kompatibilita — preferovaně odstranit a sladit typy).
- [x] 1.2 Upravit `saveReflectionDraft` v `lib/reflection/actions.ts`: přestat zapisovat `alignmentLikert` / `alignmentNote` z payloadu (sloupce při draftu neměnit, pokud design říká zachovat starý stav až do dokončení).
- [x] 1.3 Upravit `completeReflection`: po úspěšné validaci před nastavením `status: complete` vynulovat `alignment_likert` a `alignment_note` v DB pro danou session; odstranit předávání alignment z volání `saveReflectionDraft` uvnitř complete.
- [x] 1.4 Zkontrolovat `createReflectionDraft` — ponechat `null` pro alignment při insertu (bez změny chování).

## 2. Průvodce reflexí (UI)

- [x] 2.1 V `components/reflection/reflection-wizard.tsx` zúžit `STEPS` na čtyři položky (bez „Soulad s rámcem“); přepsat indexy kroků (`step === 3` → poznámka k učení místo souladu).
- [x] 2.2 Odstranit stav, konstanty, importy a JSX bloku pro Likert a komentář k souladu; upravit `buildPayload` a `onComplete` tak, aby neposílaly alignment.
- [x] 2.3 Odstranit nepoužívané importy (`RadioGroup`, `AlignmentLikert`, atd., pokud po úpravách přestanou být potřeba).

## 3. Zobrazení dokončené reflexe

- [x] 3.1 V `components/reflection/reflection-readonly.tsx` zobrazit kartu „Soulad s rámcem JIC“ jen pokud existuje `session.alignmentLikert` nebo neprázdný `session.alignmentNote` (historická data).

## 4. Kontrola a dokončení

- [x] 4.1 Spustit `npm run lint` / build a ručně ověřit: nová reflexe dokončitelná bez kroku souladu; stará reflexe s uloženým souladem stále čitelná v sekci, pokud data v DB zůstala.
- [x] 4.2 Po implementaci spustit `/opsx:verify` (nebo `openspec verify`) pro tuto změnu a případně archivaci dle procesu týmu.
