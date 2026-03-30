## Why

Reflexe po konzultaci (UC6–UC8) má být krátká a smysluplná, ale expert někdy neví, kde začít, nebo nepojmenuje kalibraci rolí a napětí mezi principy tak přesně, jak by mu pomohlo učení. **Strukturovací asistent** nabídne **reflexivní otázky** jako bezpečný vstup do myšlení a následně **navrhne strukturovaný zápis** (principy, role s kalibrací, poučení) tak, aby expert zůstal vždy autorem rozhodnutí — v souladu s principy „opora, ne kontrola“ a „reflexe místo byrokracie“ z produktové specifikace.

Důvěra: obsah reflexe a interakce s asistentem **vidí jen přihlášený expert**; **žádný manažerský dohled, sledování ani vyhodnocování výkonu** z těchto dat (MVP postoj). Technicky: inferenční volání přes **OpenRouter** (externí model) a **RAG** nad schváleným korpusem JIC (např. Konzultantské desatero, situační role), aby odpovědi byly ukotvené v rámci organizace, ne v obecné „poradenské moudrosti“.

## What Changes

### Vazba na situační role, které expert zvolil

Asistent **musí** využít signál z rolí, které expert už v kontextu reflexe zvolil nebo má k dispozici z propojené **přípravy**:

- **Primární zdroj:** u reflexe propojené s přípravou — role, které expert v přípravě označil k **posílení** a k **tlumení** (záměr před schůzkou). Tyto role slouží k **personalizaci** jednoho z klíčových vstupů do reflexe: **sady vstupních reflexivních otázek** (viz níže). Otázky mají pomoci expertovi zamyslet se např. nad tím, zda se podařilo držet záměr rolí, kde došlo k posunu a jak vnímá kalibraci.
- **Fallback / doplnění:** pokud příprava není propojená nebo role v přípravě chybí, expert může **vybrat kotvicí role** na začátku asistovaného kroku (např. 1–3 role „kolem kterých chci reflexi vést“), nebo systém použije **role označené k zaměření** ze sebeohodnocení v orientaci (pokud jsou v produktu k dispozici), jinak obecnější sadu otázek stále v rámci RAG.

Tím se plní požadavek: **využití situčních rolí, které expert zvolil, ke zlepšení jednoho ze vstupů k reflexi** — konkrétně vstupu **„reflexivní otázky před strukturováním“**.

### Dvoufázový průběh asistenta

1. **Fáze A — reflexivní otázky (vstup k reflexi)**  
   Asistent zobrazí **několik krátkých otázek** (např. 3–5), generovaných s ohledem na RAG, zvolený model (OpenRouter) a výše uvedený signál rolí (z přípravy / kotvy / zaměření). Expert odpoví volným textem (nebo zkráceně); odpovědi jsou **soukromé** stejně jako zbytek reflexe.

2. **Fáze B — strukturování**  
   Na základě odpovědí z fáze A (a minimálně stejného kontextu: label/datum konzultace, propojená příprava pokud existuje) asistent **navrhne vyplnění** polí reflexe v souladu s kanonickým modelem: relevantní **principy** z desatera, **použité role** s **kalibrací** (málo / akorát / moc), **poučení** pro příště. Expert **vždy** může návrhy upravit, zahodit nebo doplnit ručně před uložením — žádné automatické odeslání reflexe bez potvrzení.

### Volitelnost a tón

- Asistent je **volitelný** krok uvnitř flow reflexe (expert může reflexi vyplnit zcela ručně jako dnes).
- UI a copy musí komunikovat **návrh asistenta**, nikoli „hodnocení“ nebo „skóre“ od organizace.

## Capabilities

### New Capabilities

- `reflection-structuring-assistant`: Volitelný AI krok ve flow reflexe — RAG + OpenRouter, fáze reflexivních otázek personalizovaných podle zvolených situačních rolí (z přípravy nebo kotvy), následná návrhová struktura polí reflexe; explicitní model důvěry (pouze vlastník reflexe, bez kontroly ze strany JIC v tomto rozsahu).

### Modified Capabilities

- `consultation-reflection`: Integrace asistenta do existujícího draft/complete flow reflexe; persistnce mezikroků (odpovědi na otázky, návrh struktury) v rámci relace reflexe podle návrhu implementace; zachování stávajících požadavků na soukromí reflexe a vlastnictví záznamu.

## Impact

- **Backend:** nové endpointy nebo server actions pro (1) generování otázek, (2) generování návrhu struktury; bezpečné předávání kontextu jen pro vlastníka reflexe; konfigurace OpenRouter (API klíč, volitelný výběr modelu).
- **RAG:** ingest nebo dotazování schváleného textového korpusu (desatero, popisy rolí, případně další interní materiály schválené JIC).
- **Frontend:** volitelná sekce „Asistent“ v průběhu reflexe; zobrazení otázek, polí pro odpovědi, náhled návrhu struktury s editací.
- **Náklady a provoz:** závislost na externím API (OpenRouter) a na embedding / vyhledávání pro RAG; řízení rate limitů a chybových stavů (degradace na ruční reflexi).
- **Compliance / očekávání:** dokumentace pro uživatele, že jde o nástroj na podporu myšlení, ne o rozhodnutí o kvalitě; žádné sdílení obsahu reflexe s asistentem třetím stranám nad rámec technicky nutného zpracování (zpracovatelská smlouva / DPA podle politiky JIC).

## Out of Scope (tento proposal)

- Nahrazení buddy nebo konzultačního konzilia chatbotem.
- Manažerské reporty, ranking expertů nebo agregace pro HR z obsahu reflexí.
- Automatické uložení reflexe bez explicitního potvrzení expertem.
- Integrace přímo do YTrackeru (zůstává mimo; kontext reflexe zůstává ne-CRM dle stávající specifikace).
