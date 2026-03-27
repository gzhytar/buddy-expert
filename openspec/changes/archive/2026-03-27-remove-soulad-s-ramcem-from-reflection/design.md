## Context

V aplikaci existuje pět kroků průvodce novou reflexí (`reflection-wizard.tsx`): konzultace, principy, role, soulad s rámcem (Likert + volitelná poznámka), poznámka k učení. Data se ukládají do `reflection_sessions` (`alignment_likert`, `alignment_note`) a validuje se přes Zod (`reflectionCompletePayloadSchema` vyžaduje `alignmentLikert`). Kanonický spec `consultation-reflection` obsahuje samostatný požadavek na zachycení souladu s rámcem JIC.

## Goals / Non-Goals

**Goals:**

- Odstranit krok UI č. 4 a související stav/komponenty z průvodce; snížit počet kroků na čtyři (poslední zůstane poznámka k učení).
- Zrušit povinnost vyplnit soulad s rámcem při dokončení reflexe; dokončení musí stačit s principy, rolemi a poznámkou k učení dle stávajících pravidel.
- Zachovat čitelnost starších reflexí, které už mají uložený soulad s rámcem (historická data v DB).

**Non-Goals:**

- Mazání sloupců z databáze v této změně (nepovinné; viz rozhodnutí níže).
- Úpravy ProductSpecification.md nebo marketingového popisu mimo to, co vyplývá z implementačních úkolů.
- Změna principů, rolí ani Plan vs. Reality.

## Decisions

1. **Validace dokončení**  
   Z `reflectionCompletePayloadSchema` odstranit `alignmentLikert` jako povinné pole. Z `reflectionDraftPayloadSchema` odstranit pole související se souladem (nebo je ponechat volitelná prázdná jen kvůli zpětné kompatibilitě klienta — preferováno: úplně vynechat z payloadu a server nebude přepisovat existující hodnoty při draftu, pokud klient neposílá; u nového dokončení explicitně nastavit `alignmentLikert` / `alignmentNote` na `null` při zápisu dokončení, aby se starý draft „neočekávaně“ neukládal).  
   **Rozhodnutí**: Při `completeReflection` po validaci bez alignment polí nastavit v DB `alignment_likert` a `alignment_note` na `null` pro danou session (jednorázově při dokončení), aby dokončená reflexe odpovídala novému produktovému stavu. Při rozpracovaném ukládání (`saveReflectionDraft`) už neposílat alignment z klienta — server při update nenastavuje alignment na základě chybějících klíčů: buď vynechat z `.set()`, nebo vždy zapisovat `null` pro konzistenci. Jednodušší varianta: z klienta nikdy neposílat; v `saveReflectionDraft` odstranit mapování alignment z payloadu a **nepřepisovat** existující sloupce (ponechat starý draft), dokud uživatel nedokončí — pak na complete vyčistit.  
   **Upřesnění pro implementaci**: Minimalizovat riziko: u draft save odstranit zápis alignment z payloadu; sloupce se nemění při autosave. U `completeReflection` po úspěšné validaci před nastavením `status: complete` nastavit `alignmentLikert`/`alignmentNote` na `null` (clear legacy draft values on complete).

2. **Read-only zobrazení**  
   Sekci „Soulad s rámcem JIC“ v `reflection-readonly.tsx` zobrazovat **pouze pokud** je vyplněn alespoň jeden z údajů (`alignmentLikert` nebo `alignmentNote`) — pro čistě nové dokončené reflexe se sekce nevykreslí; pro staré záznamy zůstane.

3. **Typy a sdílené importy**  
   `AlignmentLikert` a schémata v `validation.ts` lze odstranit, pokud už nikde nejsou potřeba; pokud zůstanou pro čtení DB enumu v readonly, ponechat typ jen pro mapování labelů historických hodnot.

4. **Alternativy zvažované a zamítnuté**  
   - *Migrace DROP COLUMN*: zbytečná složitost pro MVP; sloupce lze nechat nullable.  
   - *Ponechat nepovinný krok*: neodpovídá zadání.

## Risks / Trade-offs

- [Ztráta historického draftu alignment při dokončení bez nového kroku] → Mitigace: při dokončení vynulovat alignment v DB jen v okamžiku complete; rozpracované drafty si stará data drží až do dokončení.  
- [Staré rozpracované reflexe s vyplněným alignment] → Po nasazení uživatel alignment v UI nevidí; při dokončení se data smažou. Akceptovatelné jako zjednodušení produktu; případně krátká poznámka v Open Questions.

## Migration Plan

1. Nasadit kód (validace, UI, akce, spec delta).  
2. Spustit testy / manuálně ověřit novou reflexi end-to-end a otevření staré reflexe s historickým souladem.  
3. Rollback: obnovit předchozí verzi aplikace; data v DB zůstávají nullable — bez DDL rollbacku.

## Open Questions

- Zda interně aktualizovat ProductSpecification.md u pasáží o „souladu s rámcem“ v kroku reflexe (mimo scope této OpenSpec změny, pokud to úkoly nevyžadují).
