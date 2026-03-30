## 1. Databáze a doménová vrstva

- [x] 1.1 Přidat do Drizzle schématu tabulku (a případně enum) pro sebeohodnocení rolí: `user_id`, `role_id`, stav `love` | `focus_improve` | `dislike` | `neutral_defer`, unikátní pár uživatel–role
- [x] 1.2 Vygenerovat a zkontrolovat SQL migraci; ověřit `npm run db:migrate` v dokumentovaném flow

## 2. Server: načítání a zápis

- [x] 2.1 Implementovat dotazy: načíst mapu stavů pro přihlášeného uživatele, spočítat pokrytí 16 rolí, vyfiltrovat role ve stavu `focus_improve`
- [x] 2.2 Implementovat Server Action (nebo API) s validací Zod: uložení stavu pro jednu roli, kontrola existence `role_id` v katalogu šestnácti rolí, odmítnutí bez session

## 3. UI: karty rolí

- [x] 3.1 Přidat na `ConsultingRoleCard` (nebo související client wrapper) skupinu čtyř přepínačů s ikonami (srdce, fokus/zlepšení, neoblíbené, bez preference) a českými `aria-label` / tooltipy
- [x] 3.2 Propojit s akcí ukládání; optimistický nebo okamžitý refresh dat po úspěchu; ošetřit chybu uživatelsky

## 4. UI: orientace — výzvy a připomínky

- [x] 4.1 Na `/orientation` zobrazit neblokující banner s výzvou k dokončení sebeohodnocení, pokud není kompletní (odkaz na `/orientation/roles`)
- [x] 4.2 Na `/orientation/roles` zobrazit stejnou výzvu v hlavičce, pokud nekompletní; po dokončení zobrazit kompaktní připomínku názvů rolí ve stavu `focus_improve` nebo neutrální zprávu, pokud žádné nejsou

## 5. Ověření a spec

- [x] 5.1 Ručně ověřit: nepřihlášený uživatel nevidí/u neukládá; reflexe zůstane dostupná s neúplným ohodnocením; klávesová ovladatelnost přepínačů
- [x] 5.2 Po implementaci spustit `/opsx:verify` nebo ruční kontrolu proti deltě `orientation-role-self-evaluation` a `orientation-basics`; po schválení sync/archiv dle workflow
