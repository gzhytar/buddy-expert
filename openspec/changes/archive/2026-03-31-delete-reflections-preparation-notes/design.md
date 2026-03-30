## Context

Záznamy příprav a reflexí jsou v PostgreSQL (`preparation_sessions`, `reflection_sessions`) s podřízenými řádky (`preparation_roles` s `ON DELETE CASCADE`; `reflection_principles`, `reflection_role_calibrations` s `ON DELETE CASCADE` na reflexi). Volitelná vazba `reflection_sessions.preparation_id` → `preparation_sessions.id` má v migraci `ON DELETE no action`, takže přímé smazání přípravy selže, pokud na ni stále odkazuje alespoň jedna reflexe.

Dnes neexistuje veřejná akce mazání; expert může záznamy pouze vytvářet a upravovat.

## Goals / Non-Goals

**Goals:**

- Trvalé smazání vlastní přípravy a vlastní reflexe po výslovné akci uživatele a potvrzení.
- Zachování izolace dat: cizí záznamy nelze smazat ani uhodnutím ID.
- Konzistentní UI v češtině (potvrzení, chyby, úspěch).
- Po smazání aktualizované přehledy a bezpečné chování při přímém URL na smazaný záznam.

**Non-Goals:**

- Koš, obnovení po smazání, ani auditní log pro administrátory.
- Hromadné mazání nebo mazání z mobilní aplikace mimo stávající web.
- Mazání záznamů jiného uživatele (buddy, admin).

## Decisions

1. **Smazání reflexe**  
   Implementovat jako `DELETE` řádku `reflection_sessions` pro `userId` = přihlášený uživatel. Podřízené řádky smaže DB díky `ON DELETE CASCADE`. Vazba na přípravu zmizí s řádkem reflexe; příprava (pokud existuje) zůstane nedotčená.

2. **Smazání přípravy**  
   Kvůli FK `reflection_sessions.preparation_id` (`ON DELETE no action`) nejdříve v jedné transakci: pro všechny reflexe daného uživatele s `preparation_id = :id` nastavit `preparation_id` na `NULL` (pouze vlastní reflexe; přípravu i tak kontrolovat na vlastnictví), poté smazat `preparation_sessions` a nechat `preparation_roles` smazat kaskádou. Alternativa by byla migrace na `ON DELETE SET NULL` u FK — transakční update je vyvážení bez nutnosti migrace, ale migrace zjednoduší kód na jeden `DELETE`; **doporučení**: pokud už stejně měníme schéma, zvážit `ON DELETE SET NULL` pro `preparation_id` a v kódu jen `delete` přípravy po kontrole vlastnictví.

3. **Potvrzení v UI**  
   Použít stejný vzor jako jinde v aplikaci (např. AlertDialog Radix): primární destruktivní akce, sekundární zrušení, krátké vysvětlení nenávratnosti.

4. **Umístění akce**  
   Minimálně z přehledu historie (přípravy / reflexe) a konzistentně z detailu nebo záhlaví editoru, kde už uživatel pracuje se záznamem — aby nebylo mazání „schované“ jen na jedné stránce.

5. **Server actions**  
   Nové funkce v `lib/preparation/actions.ts` a `lib/reflection/actions.ts` (nebo vedle), validace ID, kontrola vlastnictví, `revalidatePath` pro `/preparations`, `/reflections` a příslušné dynamické cesty.

## Risks / Trade-offs

- [Náhodné smazání] → Potvrzovací dialog; destruktivní tlačítko vizuálně odlišené (např. variant destructive).

- [Vnímaná ztráta důvěry / „dohled“] → Kopírovat podpůrný tón; v textu zdůraznit, že jde o volbu uživatele nad vlastními daty.

- [Zaseknutí na FK bez předchozího nullnutí] → Unit nebo integrační kontrola scénáře: příprava s navázanou reflexí vlastníka → smazání přípravy musí projít.

- [Race: dvě záložky] → Idempotentní chování: druhý pokus o smazání vrátí „nenalezeno“ nebo úspěch bez chyby podle zvolené konvence (preferovat jasnou českou chybu nebo tichý no-op po kontrole).

## Migration Plan

1. Nasadit kód (a případnou migraci Drizzle, pokud zvolíme `ON DELETE SET NULL` na `reflection_sessions.preparation_id`).
2. Ověřit na stagingu smazání: příprava bez reflexe, příprava s reflexí, reflexe s vazbou na přípravu, reflexe bez vazby.
3. Rollback: revert deploye; data již smazaná nelze obnovit (mimo zálohu DB mimo rozsah této změny).

## Open Questions

- Zda přidat migraci `ON DELETE SET NULL` pro zjednodušení mazání přípravy oproti explicitnímu `UPDATE` reflexí v transakci (doporučeno při další úpravě schématu).
