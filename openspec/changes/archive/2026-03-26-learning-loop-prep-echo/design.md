## Context

Aplikace už ukládá dokončené reflexe včetně **poučení** (`learningNote`) a má samostatný flow **přípravy** (`plan-vs-reality-loop`). Chybí však rozhraní, které by po dokončení reflexe a při další přípravě vizuálně připomnělo poslední učení — uživatel musí paměťově přenášet mezi obrazovkami. Produktová specifikace (§12.6) očekává uzavřenou smyčku až po vstupu od peerů; tato změna řeší jen **individuální** článek „reflexe → vlastní další příprava“.

## Goals / Non-Goals

**Goals:**

- Zobrazit na obrazovce přípravy (draft i editace) **echo** z poslední dokončené reflexe: text poučení + minimální kontext (např. datum dokončení, volitelně label konzultace z reflexe).
- Po **dokončení reflexe** nabídnout jednoznačnou akci / odkaz na **novou přípravu**.
- Zachovat psychologickou bezpečnost: echo je informativní, ne hodnocení; žádný managerský přehled.

**Non-Goals:**

- Ukládat kopii poučení do entity přípravy nebo měnit schéma DB.
- Historie více reflexí, trendy, notifikace.
- Buddy, sdílení, konzilium.
- Překlad celého kanonického specu reflexe z EN do CS (mimo rozsah této změny).

## Decisions

1. **Zdroj echa**  
   - **Rozhodnutí**: „Poslední dokončená reflexe“ = záznam vlastněný uživatelem ve stavu dokončeném (`completed` nebo ekvivalent v aplikaci), řazení podle `completedAt` / `updatedAt` podle stávajícího modelu.  
   - **Rationale**: Jedna pravda v DB, bez duplicit.  
   - **Alternativa**: Agregovaná tabulka „insights“ — zamítnuto jako zbytečná složitost.

2. **Podmínka zobrazení panelu**  
   - **Rozhodnutí**: Panel se zobrazí jen pokud poslední dokončená reflexe má **neprázdné** poučení po `trim`.  
   - **Rationale**: Prázdný box by šuměl a snižoval důvěru v echo.

3. **Kontext v panelu**  
   - **Rozhodnutí**: Minimálně datum (lokalizované CS); pokud existuje uložený **label** reflexe, zobrazit ho vedle data.  
   - **Alternativa**: Odkaz na detail reflexe — zvážit jako volitelné v implementaci, pokud už existuje čitelná URL; není povinné pro splnění specu.

4. **Místo napojení v UI reflexe**  
   - **Rozhodnutí**: Po úspěšném dokončení — na **potvrzovací / redirect** obrazovce nebo v horní části detailu dokončené reflexe (kde už uživatel vidí shrnutí). Primárně **primární tlačítko / odkaz** „Nová příprava“ vedoucí na existující route vytvoření přípravy.  
   - **Alternativa**: Pouze toast — zamítnuto jako snadno přehlédnutelné.

5. **Načítání dat**  
   - **Rozhodnutí**: Server Component nebo server action / loader v App Routeru — dotaz pod `userId` z session, bez cache sdílené mezi uživateli.  
   - **Rationale**: Konzistence s ochranou vlastnictví reflexí.

## Risks / Trade-offs

- **[Riziko] Vnímání „sledování“** — panel může působit jako připomínka povinnosti.  
  - **Mitigace**: Nadpis a podnadpis v tónu podpory („Tvé poslední poučení“, „jen pro tebe“); žádné červené stavy ani skóre.

- **[Riziko] Zastaralé poučení** — uživatel dokončil novější reflexi bez textu, starší s textem by se stále zobrazovalo jako „poslední s obsahem“.  
  - **Mitigace**: Definovat pravidlo jasně: buď poslední dokončená s neprázdným note (poddotaz), nebo poslední dokončená a skrýt panel pokud note prázdný. **Preferované**: vzít poslední dokončenou reflexi; pokud `learningNote` prázdný, panel nezobrazovat (i když existuje starší s textem — trade-off: jednoduchost vs. vždy „nějaké“ echo).  
  - **Upřesnění pro implementaci**: Spec požaduje echo z poslední dokončené reflexe **s neprázdným poučením** — tedy dotaz: nejnovější dokončená, kde `learningNote` není prázdné po trim. To vyřeší případ prázdné poslední reflexe.

- **[Riziko] Výkon** — další dotaz na každé načtení přípravy.  
  - **Mitigace**: Jednoduchý indexovaný dotaz (user + status + order limit 1); SQLite/Postgres friendly.

## Migration Plan

- Žádná migrace schématu. Nasazení = deploy kódu + případně ověření indexů na tabulce reflexí (`userId`, `status`, `completedAt`), pokud ještě neexistují.

## Open Questions

- Přesné názvy routes pro „nová příprava“ — doplní implementace podle `app/` stromu.
- Zda přidat sekundární odkaz „Otevřít reflexi“ — nice-to-have podle času.
