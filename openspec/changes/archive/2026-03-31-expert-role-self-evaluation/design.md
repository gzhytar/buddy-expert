## Context

Orientace už zobrazuje šestnáct situačních rolí z kanonického katalogu (`consulting_roles` / Drizzle). Chybí způsob, jak si expert uloží vlastní vztah k rolím a záměr rozvoje. Produkt používá Next.js App Router, Auth.js, Drizzle + Neon PostgreSQL; uživatelská identita je `users.id` (text).

## Goals / Non-Goals

**Goals:**

- Perzistentní uložení jedné volby sebeohodnocení na roli a uživatele (šestnáct rolí = šestnáct záznamů nebo ekvivalent).
- Jednoznačná definice „sebeohodnocení dokončeno“: každá z šestnácti rolí má nastavený jeden ze čtyř stavů.
- UI na kartách rolí (nebo těsně u nich) s ikonami a českými popisky / `aria-label`.
- Měkké výzvy k dokončení v orientaci (např. přehled `/orientation`, stránka rolí) bez blokace reflexe.
- Po dokončení stručný blok s připomínkou rolí ve stavu „chci se zlepšovat“.

**Non-Goals:**

- Sdílení sebeohodnocení s buddy nebo supervizí, reporty pro management, notifikace e-mailem.
- Vynucení pořadí rolí nebo průvodce krok za krokem (kromě volitelného CTA).
- Změna kalibrace rolí v reflexi konzultace (podužitá / vyváženo / přepálená) — to zůstává oddělené.

## Decisions

1. **Model dat:** Nová tabulka `user_consulting_role_self_eval` (název lze zkrátit podle konvence repo) s `(user_id, role_id)` unikátním klíčem, sloupec `sentiment` nebo `evaluation` jako enum/string s hodnotami `love` | `focus_improve` | `dislike` | `unmarked` (poslední odpovídá „zatím nechci označit jinak“ / explicitní neutrál). Alternativa JSON na `users` — zamítnuto kvůli dotazům, migracím a typové bezpečnosti.

2. **Autorizace:** Čtení i zápis jen pro přihlášeného uživatele; `role_id` musí patřit do kanonického seznamu šestnácti rolí (validace na serveru).

3. **Server vs klient:** Mutace přes Server Action nebo route handler se Zod schématem; stránky orientace mohou zůstat RSC s načtením stavu na serveru a interaktivním podstromem na kartě (client component pro přepínače).

4. **„Relevantní míst“ pro CTA:** Minimálně `/orientation` (přehled) a `/orientation/roles` pokud sebeohodnocení není kompletní; jednotná komponenta banneru s odkazem na `/orientation/roles` (kotva `#` není nutná, scroll na stránce rolí stačí).

5. **Připomínka fokusu:** Na `/orientation/roles` pod nadpisem nebo v postranním bloku: seznam názvů rolí se stavem `focus_improve` (prázdný stav = krátká věta typu „Zatím jste neoznačili žádnou roli k posílení“).

6. **Ikony (UI):** Lucide: `Heart`, `Crosshair` nebo `Focus` (preferovat konzistenci s názvem „fokus“ — např. `Crosshair`), `ThumbsDown`, `CircleDashed` nebo `Ban` pro „nechci označit“ — lépe `MinusCircle` / `CircleOff` pro „bez označení preference“; finální mapa v implementaci sjednotit s copy.

## Risks / Trade-offs

- **Riziko vnímání „dohledu“** kvůli bannerům → Mitigace: neutrální tón, zdůraznění dobrovolnosti, žádná blokace.
- **Riziko únavy z notifikací** → Mitigace: banner jen na vybraných orientačních stránkách, ne globálně na každé URL.
- **Duplicita stavu v klientovi** → Optimistický update s návratem při chybě serveru.

## Migration Plan

- Drizzle migrace: vytvoření tabulky + enumu (nebo check constraint).
- Deploy: migrace před nasazením (Vercel build již spouští `db:migrate` dle dokumentace projektu).
- Rollback: drop tabulky (ztráta dat sebeohodnocení akceptovatelná pro rollback).

## Open Questions

- Zda zobrazit CTA i na úvodní stránce aplikace po přihlášení — ponecháno na implementaci v rámci „relevantní místa“, minimum je orientace.
