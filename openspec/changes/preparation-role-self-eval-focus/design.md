## Context

V aplikaci existuje dokončitelné sebeohodnocení situačních rolí (`user_consulting_role_self_evals`, stav `focus_improve`) a samostatný wizard přípravy (`PreparationWizard`, krok výběru rolí k posílení/tlumení). Tyto dva toky dnes nesdílí v UI kontext.

## Goals / Non-Goals

**Goals:**

- Na stránkách přípravy načíst pro uživatele souhrn sebeohodnocení: kompletnost, **množinu `role_id`** (ne jen názvy) pro stav `focus_improve`, v pořadí katalogu.
- V **kroku výběru rolí**, pokud je sebeohodnocení kompletní a existuje ≥1 role ve `focus_improve`, vykreslit **dvě sekce**:
  1. **Zaměření** (role k rozvoji z orientace) — **default rozbaleno**; v ní pouze tyto role.
  2. **Ostatní role** — **default sbaleno**; všechny ostatní z šestnácti.
- Na krocích **0 a 2** neopakovat celý dvousekční seznam — **stručný** panel (odkaz na `/orientation/roles`, případně jedna věta), vedle stávajícího echa z reflexe.
- Zachovat **jednosměrnost**: žádný automatický `insert` do `preparation_roles` z `focus_improve`.

**Non-Goals:**

- Neměnit limity 3–5 / 1–3 u výběru rolí v přípravě (stávající pravidla validace).
- Nepřidávat notifikace ani e-maily.
- Nevynucovat dokončení sebeohodnocení před uložením přípravy.

## Decisions

1. **Zdroj dat:** `getRoleSelfEvalSummaryForUser` rozšířit nebo doplnit o **`focusRoleIds: string[]`** (join na `consulting_roles` v stejném pořadí jako `focusRoleNames`), aby `RoleSelector` mohl filtrovat řádky bez mapování podle názvu.

2. **Kde renderovat:** RSC na `app/preparations/new` a `app/preparations/[id]` předá do `PreparationWizard` např. `roleSelfEval: { isComplete, focusRoleIds }`.

3. **Krok rolí:** Obalit nebo rozšířit `RoleSelector` / krok 1 tak, aby při `isComplete && focusRoleIds.length > 0` renderoval dva bloky s **Radix Collapsible** (nebo nativní `<details>` s CSS pro výchozí `open` jen u první sekce): nadpisy v češtině (např. „Role, ve kterých chcete růst“ / „Ostatní situační role“).

4. **Fallbacky:** `!isComplete` nebo `focusRoleIds.length === 0` při kompletním eval → současné jednosekční chování (celý katalog v jednom výpisu).

5. **Nekompletní sebeohodnocení:** Volitelná jednořádková výzva s odkazem na orientaci nad selektorem (bez falešné sekce „zaměření“).

6. **Kroky 0 a 2:** Kompaktní `PreparationRoleSelfEvalHint` (jen text + odkaz), ne plný duplikát sekcí.

## Risks / Trade-offs

- **Riziko přetížení UI** (echo + hint + dvě sekce na kroku 1) → Mitigace: druhá sekce default zavřená; stručný hint na ostatních krocích.
- **Riziko vnímání příkazu** → Copy u sekce zaměření: jasně, že jde o volby z **orientace**, ne o již uloženou přípravu; stále žádné auto-posílení.

## Migration Plan

- Pouze nasazení kódu; žádná migrace DB.

## Open Questions

- Přesné názvy sekcí doladit s copywriterem / ProductSpecification — pracovní názvy výše.
