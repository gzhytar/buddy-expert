## 1. Databáze a konfigurace

- [x] 1.1 Přidat do `reflection_sessions` sloupec pro JSON stav asistenta (`assistant_state` dle designu) a Drizzle migraci
- [x] 1.2 Zdokumentovat / přidat env proměnné: `OPENROUTER_API_KEY`, volitelně model ID a limity; bez commitu tajných hodnot

## 2. RAG a korpus

- [x] 2.1 Definovat zdroj chunků z kanonických textů principů a rolí (DB nebo export) a skript nebo build krok pro naplnění
- [x] 2.2 Implementovat vyhledávání relevantních chunků (pgvector na Neon nebo schválený fallback z designu) a sdílenou funkci sestavení kontextu pro prompt

## 3. Serverová inferenční vrstva

- [x] 3.1 Vytvořit server-only modul volající OpenRouter s RAG kontextem, timeoutem a Zod validací výstupu (otázky + návrh struktury)
- [x] 3.2 Implementovat akce nebo route handlery: generování otázek (fáze A), generování návrhu (fáze B) s kontrolou `user_id` vlastníka reflexe
- [x] 3.3 Načítání signálu rolí: z `preparation_id` (typy posílení/tlumení), jinak kotvicí role z klienta, jinak `focus_improve` ze sebeohodnocení pokud existuje
- [x] 3.4 Ukládání a čtení `assistant_state` v rámci existujících nebo nových akcí pro draft reflexe

## 4. UI reflexe — asistent

- [x] 4.1 Přidat sekci / panel asistenta do flow draft reflexe s českým copy (návrh, ne hodnocení) a volitelným vstupem
- [x] 4.2 Fáze A: zobrazení 3–5 otázek, textová pole odpovědí, uložení stavu; fallback výběr až 3 kotvicích rolí když chybí příprava
- [x] 4.3 Fáze B: indikace načítání (skeleton nebo progress), zobrazení návrhu principů / rolí s kalibrací / poučení, tlačítko „Použít návrh“ mapující do stavu formuláře reflexe
- [x] 4.4 Přechody mezi fázemi: krátké animace opacity/transform (200–300 ms), respekt `prefers-reduced-motion`
- [x] 4.5 Chybové stavy OpenRouter / validace: inline zpráva, „Zkusit znovu“, „Pokračovat bez asistenta“; `aria-busy` na primárních tlačítkách při generování

## 5. Integrace a ověření

- [x] 5.1 Zajistit, že dokončení reflexe neproběhne automaticky z asistenta a že ruční flow zůstává beze změny chování pro uživatele bez asistenta
- [x] 5.2 Projít scénáře z delt `reflection-structuring-assistant` a `consultation-reflection` (manuálně nebo E2E podle zvyku projektu)
