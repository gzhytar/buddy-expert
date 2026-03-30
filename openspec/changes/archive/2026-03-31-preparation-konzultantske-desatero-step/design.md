## Context

Wizard přípravy má dnes tři kroky (Konzultace → Role → Záměr). Reflexe už odděluje principy z Konzultantského desatera do vlastního kroku před rolemi; příprava zatím principy v průběhu nekotví. Orientace nabízí plný obsah desatera na `/orientation/principles`.

## Goals / Non-Goals

**Goals:**

- Vložit mezi Role a Záměr jeden **lehký** krok: připomenutí desatera jako rámce, odkaz do orientace, podpůrný tón.
- Zachovat stávající mechanismus **Další** = uložení draftu přes `savePreparationDraft`, bez nových polí v DB.
- Sjednotit vzor odkazů s reflexí (např. `target="_blank"` + `rel="noopener noreferrer"` tam, kde dává smysl otevřít vedle rozpracované přípravy).

**Non-Goals:**

- Výběr nebo ukládání konkrétních principů v přípravě (to zůstává v doméně reflexe).
- Měnit pořadí kroků reflexe nebo obsah stránky principů.

## Decisions

1. **Název kroku v UI:** `Konzultantské desatero` — stejný řetězec jako první krok ve `reflection-wizard` pro konzistenci štítků v produktu.
2. **Implementace:** Obsah kroku přímo ve `PreparationWizard` nebo extrahovaný malý komponent, pokud by přibyla větší struktura; pro jeden blok textu + odkazy stačí sekce ve wizardu.
3. **Sebeohodnocení:** Stručný hint (`PreparationSelfEvalContextHint`) zůstává na krocích mimo výběr rolí — po přečíslování je to krok 0 (Konzultace) a krok 3 (Záměr), nikoli na novém kroku 2.

## Risks / Trade-offs

- **Další krok navíc** → mírně delší průchod; mitigace: krok bez povinných polí, krátký text.
- **Záměna s krokem reflexe** → uživatel může očekávat výběr principů; mitigace: copy vysvětlí, že jde o připomenutí a odkaz, ne o checklist.

## Migration Plan

Nasazení čistě klientské úpravy wizardu; rollback revertem komponenty.

## Open Questions

- Žádné.
