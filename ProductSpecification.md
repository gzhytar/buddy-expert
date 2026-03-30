# Produktová specifikace
# Adaptivní nástroj pro onboarding a continuous improvement expertů JIC

## 1. Účel dokumentu

Tento dokument popisuje kompletní produktovou specifikaci interní aplikace pro JIC, jejímž účelem je podpořit:

- onboarding expertů do způsobu konzultování pod brandem JIC,
- continuous improvement kvality konzultací,
- stotožnění experta s posláním JICu a respektem k rámci zadání nastavenému JICem,
- strukturované sebevzdělávání skrz supervizi uskutečněných konzultací, buddy a konzultační konzilium.

Tato specifikace je záměrně bez implementačních detailů. Definuje problém, kontext, cíle produktu, potřeby uživatelů, klíčové koncepty, důležité user flow a scope produktu, ale neřeší technické řešení, architekturu ani způsob implementace.

---

## 2. Vize produktu

Vytvořit adaptivní interní nástroj, který expertům JIC pomůže:

- pochopit, co znamená konzultovat pod brandem JIC,
- být v souladu s posláním JICu a rámcem zadání,
- poskytovat konzultace ve vyšší a konzistentnější kvalitě,
- zachovat si vlastní styl a individualitu,
- vědomě se připravovat na schůzky,
- reflektovat uskutečněné konzultace,
- učit se skrz supervizi, buddy a konzultační konzilium,
- rozvíjet svůj expertní judgment, chování a práci se situativními rolemi.

Produkt má fungovat jako:

- **praktický průvodce seberozvojem**,
- **kognitivní opora experta**,
- **živý nástroj pro každodenní praxi**,

a ne jako kontrolní systém, checklist nebo nástroj dohledu.

---

## 3. Kontext a výchozí situace

## 3.1 Organizační kontext

V JIC dnes existuje silné vnímání, že velká část expertů nemá společné standardy konzultací. To vede k tomu, že různí experti vytvářejí na klienty různý dojem a poskytují různě strukturovanou službu.

I když klienti mohou být spokojení, tato spokojenost sama o sobě není spolehlivým ukazatelem kvality, protože klienti často:

- nemají s čím porovnat,
- nečerpají služby od více expertů JIC,
- nedokážou vyhodnotit konzistenci kvality napříč organizací.

Vzniká tak strukturální problém:

- kvalita existuje, ale není dostatečně sjednocená,
- spokojenost existuje, ale není dostatečný benchmark,
- individualita expertů existuje, ale není vždy ukotvená ve sdílených principech.

---

## 3.2 Hlavní napětí, které produkt řeší

Základní výzva zní:

> Jak zachovat individualitu konzultantů a současně budovat značku JIC, což vyžaduje dodržování vybraných standardů.

JIC nechce standardizovat osobnost, styl nebo autenticitu expertů.  
JIC chce standardizovat:

- principy kvality,
- rámec konzultace,
- hranice služby,
- odpovědnostní model,
- sdílený jazyk,
- očekávaný profesní judgment.

---

## 3.3 Tři pilíře kvality konzultování

V JIC už existuje rámec tří pilířů kvality konzultování:

1. **Konzultantské desatero**
2. **Univerzální schéma organizace**
3. **Konzultační toolbox** (aktuálně mimo hlavní scope)

Produkt má v první řadě operacionalizovat první dva pilíře a vytvořit prostor pro to, aby se v budoucnu mohl opřít i o toolbox.

---

## 3.4 Kontext adopce nového standardu

V JIC už existují aktivity pro adopci standardu, například:

- prezentace a diskuse se segmentovými týmy a vedením,
- Expert Camp,
- zapojení dalších týmů JIC,
- workshop pro front-office,
- supervize,
- onboarding expertů i interních konzultantů,
- rozvoj konzultantů skrz debriefy a konzultační konzilia,
- etický kodex. :contentReference[oaicite:0]{index=0}

Tyto aktivity jsou důležité, ale samy o sobě mají charakter spíše jednorázových nebo event-based zásahů.

Produkt má fungovat jako **vrstva mezi těmito aktivitami**, která pomůže přenést standard do každodenní praxe.

---

## 3.5 Kontext interního systému YTracker

JIC už používá interní systém / CRM s názvem **YTracker**, který slouží pro:

- zápis konzultací,
- evidenci informací o klientech,
- interní dohledatelnost a návaznost.

Tento produkt není určen k tomu, aby YTracker nahrazoval.  
Naopak má fungovat jako:

- vrstva reflexe,
- vrstva učení,
- vrstva kalibrace kvality,

nad reálnou konzultační prací, která už v JIC probíhá.

---

## 4. Definice problému

## 4.1 Hlavní problém

JIC dnes nemá dostatečně sdílený a každodenně používaný standard konzultování napříč experty.

To vede k:

- nekonzistentní zkušenosti klienta,
- různé kvalitě konzultací,
- slabé porovnatelnosti,
- omezenému institucionálnímu učení,
- složitějšímu onboardingu nových expertů.

---

## 4.2 Vedlejší problémy

### A. Slabé stotožnění experta s posláním JICu
JIC potřebuje, aby expert nebyl jen informovaný o poslání organizace, ale aby s ním byl vnitřně stotožněn a respektoval rámec zadání nastavený JICem.

### B. Slabý přenos tacitního know-how
Velká část kvality experta není uložená v dokumentech, ale v judgmentu, reflexi, chování a schopnosti situativně volit správnou roli.

### C. Převaha one-shot learningu
Workshopy, prezentace, Expert Camp nebo onboarding jsou užitečné, ale samy o sobě negenerují každodenní změnu chování.

### D. Chybějící kontinuální learning loop
Expert potřebuje jednoduchý mechanismus, který propojí:
- přípravu před konzultací,
- reflexi po konzultaci,
- peer learning,
- postupné rozpoznávání vlastních vzorců.

---

## 5. Cíle produktu

## 5.1 Hlavní cíle

Produkt má:

1. zvýšit konzistenci kvality konzultací napříč experty JIC,
2. pomoci expertům internalizovat poslání JICu a rámec zadání,
3. podpořit sebevzdělávání experta v každodenní praxi,
4. vytvořit sdílený jazyk pro kvalitu, Konzultantské desatero a situativní role,
5. zachovat individualitu experta a současně zlepšit kvalitu jeho judgmentu,
6. ukotvit continuous improvement do každodenní práce.

---

## 5.2 Vedlejší cíle

Produkt má také:

- strukturovat onboarding expertů,
- podporovat psychologické bezpečí při učení,
- zlepšit kvalitu peer diskusí,
- podpořit buddy a konzultační konzilium,
- posílit institucionální paměť kolem toho, co znamená dobré konzultování v JIC.

---

## 5.3 Co produkt není

Produkt není určen jako:

- náhrada YTrackeru nebo CRM,
- plnohodnotné LMS,
- rigidní checklist aplikace,
- nástroj manažerského dohledu,
- systém formálního hodnocení výkonu,
- plný repozitář konzultačního toolboxu v první fázi.

---

## 6. Produktové principy

Produkt se má řídit těmito principy:

### 6.1 Opora, ne kontrola
Expert má nástroj vnímat jako pomoc pro lepší práci, ne jako compliance mechanismus.

### 6.2 Reflexe místo byrokracie
Interakce mají být krátké, smysluplné a praktické. Cílem není víc administrativy, ale lepší myšlení.

### 6.3 Principy místo skriptů
Produkt má posilovat Konzultantské desatero a situativní judgment, ne přikazovat rigidní scénář schůzky.

### 6.4 Relevance pro každodenní praxi
Produkt musí přirozeně zapadat před a po reálné konzultaci.

### 6.5 Individualita uvnitř sdíleného rámce
Expert si zachovává vlastní styl, ale pracuje ve společném rámci kvality JIC.

### 6.6 Učení skrz praxi
Produkt má spojovat učení s reálnými konzultacemi, ne ho oddělovat do čistě teoretické vrstvy.

### 6.7 Psychologické bezpečí
Produkt musí podporovat upřímnou sebereflexi a peer exchange bez strachu, přetvářky a pocitu hodnocení shora.

---

## 7. Cílové skupiny

## 7.1 Primární uživatelé

### Experti JIC
Interní i externí experti, kteří konzultují klienty JIC.

Patří sem:
- noví experti v onboardingu,
- zkušení experti, kteří se chtějí dál rozvíjet,
- experti zapojení do buddy nebo konzilií.

---

## 7.2 Sekundární uživatelé

### Buddy
Expert, který podporuje jiného experta v semi-strukturovaném peer vztahu.

### Účastníci konzultačního konzilia
Experti, kteří společně diskutují složité nebo důležité případy.

### Lidé podporující rozvoj expertů
Stakeholdeři, kteří formují onboarding, kvalitu a adopci standardu.

---

## 8. Potřeby uživatelů

Expert potřebuje umět:

- pochopit, co znamená kvalita konzultování pod brandem JIC,
- pochopit hranice služby a rámec zadání,
- připravit se na schůzku vědomě, ne na autopilota,
- zvolit, v jakých situativních rolích chce být,
- rozpoznat, které role má tendenci přepalovat a které naopak nepoužívá dost,
- rychle reflektovat uskutečněnou konzultaci,
- učit se z nejasných a složitých situací,
- požádat o pomoc bez stigmatizace,
- diskutovat případy ve sdíleném jazyce,
- propojovat vlastní praxi s posláním JICu a Konzultantským desaterem.

---

## 9. Koncepční základy produktu

## 9.1 Konzultantské desatero pod brandem JIC

**Konzultantské desatero** je pojmenování deseti principů konzultování JIC. Mezi ně patří mimo jiné, že expert:

- konzultuje se správným člověkem,
- na začátku situuje,
- má s klientem jasnou dohodu o cíli,
- nechává odpovědnost na klientovi,
- nepracuje za klienta,
- pracuje s poznámkami,
- vždy konzultuje „nad něčím“,
- uvědomuje si osobnostní rozdíl mezi sebou a klientem,
- uzavírá konzultaci zpětnou vazbou,
- sdílí informace o klientovi a sleduje návaznosti v systémech JIC včetně CRM / YTrackeru. :contentReference[oaicite:1]{index=1}

Tyto principy tvoří hlavní normativní páteř produktu.

Produkt je nemá chápat jako checklist „splněno / nesplněno“, ale jako:

- rámec kvality,
- čočky pro reflexi,
- oporu pro supervizi,
- jazyk pro peer diskusi.

---

## 9.2 Situativní role konzultanta

JIC má strukturovaný model **16 situativních rolí konzultanta**, rozdělených do čtyř oblastí:

### Zakázka a rámec
- Situátor
- Strážce mandátu
- Cílotvůrce
- Hlídač zdrojů

### Diagnostika firmy
- Mapovač DNA
- Diagnostik rolí
- Posluchač
- Validátor

### Vedení sezení
- Moderátor sezení
- Facilitátor dohody
- Konfrontátor
- Kalibrátor

### Tvorba řešení
- Artefaktář
- Návrhář řešení
- Aktivátor klienta
- Kurátor návaznosti :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

Každá role je popsána třemi vrstvami:

1. **Co role dělá**
2. **Užitečné projevy** — jak vypadá dobře zvládnutá role
3. **Rizika při přepálení** — jak vypadá přepálená role

Příklady:
- **Situátor** pomáhá rychle pochopit, v jaké fázi práce firma je a co je dnešní hlavní téma; při přepálení přesituovává a dlouho se nerozběhne k práci. :contentReference[oaicite:6]{index=6}
- **Posluchač** naslouchá významu, ne jen slovům; při přepálení poslouchá tak dlouho, až ztrácí tah na výstup. :contentReference[oaicite:7]{index=7}
- **Facilitátor dohody** pomáhá lidem dojít k pracovní dohodě; při přepálení uhlazuje konflikt za každou cenu a tlačí do falešného konsenzu. :contentReference[oaicite:8]{index=8}
- **Konfrontátor** pojmenovává nesoulad mezi sliby a realitou; při přepálení konfrontuje příliš brzo nebo moralizuje. :contentReference[oaicite:9]{index=9}
- **Aktivátor klienta** vrací volant klientovi; při přepálení může odmítnout potřebnou pomoc nebo naopak převzít práci a vytvořit závislost. :contentReference[oaicite:10]{index=10}
- **Kurátor návaznosti** drží čistou stopu, follow-up a napojení na JIC zdroje; při přepálení se utopí v administrativě. :contentReference[oaicite:11]{index=11}

Z toho plyne zásadní produktový princip:

> nejde jen o to, zda expert nějakou roli použil, ale jak dobře ji dávkoval.

Produkt proto musí podporovat nejen **volbu role**, ale i **kalibraci role**.

---

## 9.3 Sebevzdělávání skrz supervizi, buddy a konzultační konzilium

Produkt musí podporovat minimálně tři learning mechanismy:

### A. Supervize uskutečněných konzultací
Individuální reflexe nad reálně proběhlou konzultací.

### B. Buddy
Bezpečný 1:1 prostor pro sdílení pochybností, otázek a zpětné vazby.

### C. Konzultační konzilium
Skupinové sdílení případů a kolektivní hledání pohledu na složité situace.

Tyto vrstvy nejsou doplněk. Jsou jádrem continuous improvement logiky produktu.

---

## 10. Pozicování produktu

Produkt je nejlepší chápat jako:

- **adaptivní onboarding nástroj**,
- **reflection layer nad reálnou prací experta**,
- **continuous improvement engine**,
- **sdílený jazyk pro role, Konzultantské desatero a kvalitu**,
- **praktický průvodce seberozvojem**,
- **kognitivní oporu experta**.

Produkt není jen dokumentační systém, knihovna obsahu nebo doplněk workshopu.

---

## 11. Hlavní use cases

## 11.1 Onboarding use cases

### UC1: Nový expert pochopí, co znamená konzultovat pod brandem JIC
Nový expert potřebuje prakticky pochopit:
- poslání JICu,
- rámec zadání,
- Konzultantské desatero,
- situativní role,
- hranice expertovy práce.

### UC2: Nový expert se učí skrz situace a dilemata
Nový expert prochází typické situace z praxe a učí se rozpoznávat:
- co je v souladu s JIC,
- co je mimo rámec,
- jak se principy Konzultantského desatera a role projevují v reálné situaci.

### UC3: Nový expert začíná používat sdílený jazyk
Nový expert začíná o své práci mluvit skrz:
- role,
- Konzultantské desatero,
- odpovědnost,
- kalibraci,
- learning loop.

---

## 11.2 Use cases přípravy na schůzku

### UC4: Expert se před schůzkou připravuje vědomě
Před konzultací si expert zvědomí, v jakých **3–5 rolích chce být** a v jakých **1–3 rolích být nechce**, respektive je chce vědomě stáhnout.

Jde o princip:

> přidat, čeho je málo, a ubrat, čeho je moc.

### UC5: Expert si nastaví behaviorální záměr
Před schůzkou si expert formuluje krátký fokus, například:
- nechodit příliš rychle do řešení,
- víc naslouchat,
- méně brzo konfrontovat,
- držet odpovědnost na klientovi,
- lépe situovat téma.

---

## 11.3 Use cases reflexe po konzultaci

### UC6: Expert reflektuje uskutečněnou konzultaci
Po konzultaci expert zaznamená krátkou reflexi zaměřenou na:
- jaké role použil,
- které principy byly klíčové,
- zda byl v souladu s rámcem JIC,
- co se povedlo,
- co bylo slabé místo,
- co chce příště udělat jinak.

### UC7: Expert reflektuje kalibraci rolí
Expert nehodnotí jen to, zda byl v určité roli, ale i zda ji měl:
- málo,
- akorát,
- moc / přepáleně.

To je důležité, protože samotné karty rolí explicitně rozlišují dobře zvládnutou roli a přepálení role. :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13}

### UC8: Expert porovnává záměr vs. realitu
Expert vidí, zda se mu podařilo držet role, které si zvolil před schůzkou, a zda se naopak nechal stáhnout do rolí, které chtěl vědomě tlumit.

---

## 11.4 Peer learning use cases

### UC9: Expert chce případ probrat s buddy
Expert sdílí vybranou konzultaci nebo reflexi s buddy a přidá konkrétní otázku či dilema.

### UC10: Buddy reaguje ve sdíleném jazyce
Buddy dává zpětnou vazbu skrz:
- Konzultantské desatero,
- role,
- přepálení nebo nedostatečné využití role,
- alignment s JIC.

### UC11: Expert přináší případ do konzultačního konzilia
Expert sdílí složitou, nejasnou nebo zajímavou situaci do skupinové diskuse.

### UC12: Konzultační konzilium diskutuje případ strukturovaně
Diskuse je vedena skrz:
- kontext případu,
- zamýšlené role,
- skutečně použité role,
- napětí mezi principy,
- hranice rámce JIC,
- možné další kroky.

---

## 11.5 Organizační use cases

### UC13: JIC drží standard i mezi workshopy a eventy
Místo modelu „event → nic → event“ pomáhá produkt udržet standard živý mezi Expert Campem, workshopy, onboardingem a supervizemi.

### UC14: JIC zvyšuje kvalitu bez potlačení individuality
Organizace posiluje kvalitu a sdílený standard, aniž by tlačila všechny experty do jednoho stylu.

---

## 12. Klíčové user flow

## 12.1 Flow onboardingu experta

### Účel
Pomoci novému expertovi pochopit, co znamená konzultovat pod brandem JIC, a začít v tomto rámci opravdu fungovat.

### Průběh
1. Expert je uveden do smyslu a poslání JIC.
2. Pochopí rámec zadání a hranice služby.
3. Seznámí se s Konzultantským desaterem.
4. Projde si situativní role konzultanta.
5. Učí se skrz situace, příklady a dilemata.
6. Začíná aplikovat role a Konzultantské desatero na reálné konzultace.
7. Vstupuje do opakujícího se cyklu příprava → reflexe → peer learning.

### Požadovaný výsledek
Expert nejen rozumí obsahu, ale začíná v rámci JIC i myslet a jednat.

---

## 12.2 Flow přípravy na schůzku

### Účel
Pomoci expertovi nevstoupit do schůzky na autopilota, ale s vědomým záměrem.

### Průběh
1. Expert si připomene kontext schůzky.
2. Zváží, co je v dané situaci potřeba.
3. Vybere 3–5 rolí, které chce posílit.
4. Vybere 1–3 role, které chce stáhnout nebo nepřepálit.
5. Formuluje si krátký fokus nebo varování pro sebe.
6. Jde do schůzky s vědomě nastaveným behaviorálním profilem.

### Požadovaný výsledek
Expert je víc vědomý toho, jak chce ve schůzce být.

---

## 12.3 Flow reflexe po konzultaci

### Účel
Vytvořit krátkou, ale smysluplnou supervizi nad každou uskutečněnou konzultací.

### Průběh
1. Expert identifikuje uskutečněnou konzultaci.
2. Reflektuje ji skrz relevantní principy.
3. Pojmenuje role, které skutečně použil.
4. U vybraných rolí zhodnotí kalibraci: málo / akorát / moc.
5. Zhodnotí, jestli konzultace byla v souladu s rámcem JIC.
6. Zapíše si stručné poučení.
7. Volitelně případ pošle buddy nebo do konzultačního konzilia.

### Požadovaný výsledek
Konzultace se stává jednotkou učení, ne jen uzavřenou aktivitou.

---

## 12.4 Flow buddy

### Účel
Podpořit bezpečné 1:1 učení nad reálnými případy.

### Průběh
1. Expert vybere konzultaci nebo reflexi ke sdílení.
2. Přidá otázku nebo dilema.
3. Buddy se podívá na případ skrz sdílené koncepty.
4. Buddy dá cílenou zpětnou vazbu.
5. Expert ji využije v další přípravě nebo reflexi.

### Požadovaný výsledek
Expert získává podporu a peer pohled bez tlaku formální evaluace.

---

## 12.5 Flow konzultačního konzilia

### Účel
Využít kolektivní inteligenci expertů pro lepší judgment a šíření know-how.

### Průběh
1. Expert přinese případ.
2. Případ je popsán skrz kontext, role, Konzultantské desatero a dilema.
3. Skupina diskutuje:
   - co se dělo,
   - jaké role byly ve hře,
   - kde mohlo dojít k přepálení nebo slabému využití role,
   - které principy byly v napětí,
   - jak se na situaci dívá rámec JIC.
4. Vznikají přenositelné insighty pro další praxi.

### Požadovaný výsledek
Organizace se učí z případů, ne jen z prezentací a teorie.

---

## 12.6 Základní learning loop produktu

Základní logika produktu je:

**příprava → reálná konzultace → reflexe → buddy / konzilium → lepší další příprava**

Tento loop je jedním z nejdůležitějších vzorců, které má produkt ukotvovat.

---

## 13. Funkční scope produktu

## 13.1 Hlavní funkční oblasti

### A. Orientace a učení
Produkt má poskytovat strukturovaný přístup k:
- poslání JICu,
- rámci zadání,
- Konzultantskému desateru,
- situativním rolím,
- příkladům dobře zvládnuté role a přepálení role.

### B. Příprava před konzultací
Produkt má umožnit:
- zvolit role, které chci posílit,
- zvolit role, které chci stáhnout,
- formulovat krátký záměr pro schůzku.

### C. Reflexe po konzultaci
Produkt má umožnit:
- reflektovat konzultaci,
- pracovat s principy Konzultantského desatera,
- pracovat s rolemi,
- reflektovat kalibraci rolí,
- zaznamenat klíčové učení.

### D. Buddy
Produkt má umožnit strukturované sdílení případu a peer reflexi.

### E. Konzultační konzilium
Produkt má umožnit strukturovanou skupinovou diskusi nad případem.

### F. Návaznost na reálnou práci
Produkt má posilovat vazbu mezi konzultační praxí, institucionální pamětí a širší podporou JIC.

---

## 14. Vztah k existujícím procesům JIC

Produkt nemá stát vedle stávajících rozvojových aktivit, ale mezi nimi.

Má fungovat jako:
- průběžné lepidlo systému,
- každodenní vrstva, která propojí Expert Camp, onboarding, supervize, workshopy a debriefy s reálnou prací.

Bez produktu zůstává změna standardu převážně event-based.  
S produktem se standard dostává do každodenního chování expertů.

---

## 15. Vztah k YTrackeru

YTracker je existující interní systém JIC pro klientská data a zápis konzultací.

### Postoj produktu k YTrackeru
Nový produkt má:
- respektovat existenci YTrackeru,
- nezdvojovat zbytečně práci,
- doplňovat reálný workflow místo toho, aby mu konkuroval.

### Koncepční rozdělení rolí systémů
- **YTracker** = co se stalo, s kým, kdy, v jakém klientském kontextu
- **tento produkt** = jak kvalitně to proběhlo, jaké role jsem použil, co jsem se naučil, kde jsem byl aligned s JIC

Role **Kurátor návaznosti** navíc explicitně obsahuje práci s poznámkami, rozhodnutími, YTrackerem, KAM, follow-upem a zapojením dalších zdrojů JIC. :contentReference[oaicite:14]{index=14}

To potvrzuje, že návaznost a institucionální paměť jsou součástí samotného modelu kvality.

---

## 16. Model kvality, se kterým produkt pracuje

Produkt má pracovat s tím, že kvalita konzultace má více vrstev:

### 16.1 Kvalita vzhledem k principům
Byla konzultace vedená v souladu s Konzultantským desaterem?

### 16.2 Vhodnost zvolených rolí
Byly zvolené správné situativní role vzhledem k situaci?

### 16.3 Kalibrace rolí
Byly role použity ve správné intenzitě, nebo došlo k přepálení / nedostatečnému využití?

### 16.4 Alignment s JIC
Byla konzultace vedena v souladu s posláním JICu a rámcem zadání?

### 16.5 Rozvojová hodnota
Vzniklo z konzultace použitelné učení pro příště?

---

## 17. Důležitá napětí, která musí produkt unést

### 17.1 Individualita vs. konzistence
Produkt nesmí mazat osobnost experta, ale má zvyšovat konzistenci kvality.

### 17.2 Opora vs. kontrola
Produkt musí působit rozvojově, ne represivně nebo evaluativně.

### 17.3 Reflexe vs. zátěž
Produkt musí být dostatečně lehký, aby ho expert používal i v reálné práci.

### 17.4 Teorie vs. praxe
Produkt musí propojit abstraktní principy a role s konkrétními konzultacemi.

### 17.5 Akce vs. přemýšlení
Produkt má podporovat uvědomění, ale nesmí experta zacyklit do nadměrné sebereflexe.

---

## 18. Rizika a guardrails

## 18.1 Hlavní rizika

### A. Vnímaná kontrola
Pokud budou experti produkt vnímat jako nástroj dohledu, zhroutí se upřímná reflexe.

### B. Přílišné tření
Pokud bude příprava nebo reflexe dlouhá a složitá, adoption bude nízká.

### C. Checklistové chování
Pokud se z produktu stane jen odklikávací rutina, nebude rozvíjet judgment.

### D. Přetížení koncepty
Pokud bude najednou příliš mnoho rolí, otázek a dimenzí, experti se odpojí.

### E. Oddělení od reálné práce
Pokud produkt nebude napojený na každodenní rytmus práce, nevznikne návyk používání.

---

## 18.2 Guardrails

Produkt má:
- být stručný v opakovaných flow,
- dávat přednost relevanci před úplností,
- zavádět sdílený jazyk postupně,
- umožnit hloubku tam, kde dává smysl,
- chránit psychologické bezpečí,
- nepoužívat formální scoring jako dominantní princip.

---

## 19. Kritéria úspěchu produktu

Produkt bude úspěšný, pokud se v čase začne dít toto:

- experti začnou přirozeně používat jazyk rolí a Konzultantského desatera,
- onboarding expertů bude konzistentnější a méně závislý na ad hoc vysvětlování,
- experti budou víc reflektovat své konzultace,
- buddy a konzultační konzilium budou strukturovanější a užitečnější,
- JIC bude schopné zvyšovat kvalitu bez potlačení individuality expertů,
- standard se přenese z prezentací do každodenní praxe.

---

## 20. MVP definice

## 20.1 Cíl MVP

Ověřit, že experti budou používat lehký nástroj pro:

- vědomou přípravu na konzultaci,
- reflexi uskutečněné konzultace,
- prací s Konzultantským desaterem a situativními rolemi.

---

## 20.2 Co musí MVP obsahovat

### 1. Základní orientaci
- poslání JICu a rámec zadání,
- Konzultantské desatero,
- situativní role konzultanta.

### 2. Přípravu před schůzkou
- výběr rolí, které chci posílit,
- výběr rolí, které chci stáhnout,
- krátký záměr pro schůzku.

### 3. Reflexi po konzultaci
- práce s relevantními principy Konzultantského desatera,
- výběr skutečně použitých rolí,
- reflexe kalibrace role,
- stručné poučení.

### 4. Jednoduché peer rozšíření
- možnost sdílet případ nebo reflexi s buddy.

---

## 20.3 Co MVP nemusí obsahovat

- plnou práci s konzultačním toolboxem,
- pokročilé organizační analýzy,
- rozsáhlou case databázi,
- těžké workflow nebo administraci,
- konkrétní implementační předpoklady integrace.

---

## 21. Možný budoucí scope

Přirozené budoucí rozšíření může zahrnovat:

- hlubší práci s univerzálním schématem organizace,
- pokročilejší formát konzultačního konzilia,
- větší knihovnu situací a dilemat,
- rozpoznávání vzorců v opakovaných reflexích,
- jemnější rozvojové insighty,
- silnější podporu institucionální paměti,
- širší napojení na konzultační toolbox.

---

## 22. Shrnutí

Tento produkt má být praktickou vrstvou, skrz kterou se expert učí konzultovat pod brandem JIC.

Jeho cílem není standardizovat osobnost.  
Jeho cílem je standardizovat kvalitu.

Jeho cílem není nahradit judgment.  
Jeho cílem je judgment zlepšovat.

Jeho cílem není jen dokumentovat práci.  
Jeho cílem je proměnit práci v učení.

Produkt spojuje:

- poslání JICu a rámec zadání,
- Konzultantské desatero, :contentReference[oaicite:15]{index=15}
- model situativních rolí konzultanta, :contentReference[oaicite:16]{index=16} :contentReference[oaicite:17]{index=17} :contentReference[oaicite:18]{index=18} :contentReference[oaicite:19]{index=19}
- supervizi uskutečněných konzultací,
- buddy,
- konzultační konzilium,
- continuous improvement v každodenní praxi.

Pokud bude dobře navržený a adoptovaný, může se stát mechanismem, který promění nový standard z prezentace na živý návyk.

---

## Příloha A: Rodiny situativních rolí

### Zakázka a rámec
- Situátor
- Strážce mandátu
- Cílotvůrce
- Hlídač zdrojů

### Diagnostika firmy
- Mapovač DNA
- Diagnostik rolí
- Posluchač
- Validátor

### Vedení sezení
- Moderátor sezení
- Facilitátor dohody
- Konfrontátor
- Kalibrátor

### Tvorba řešení
- Artefaktář
- Návrhář řešení
- Aktivátor klienta
- Kurátor návaznosti  
:contentReference[oaicite:20]{index=20} :contentReference[oaicite:21]{index=21} :contentReference[oaicite:22]{index=22} :contentReference[oaicite:23]{index=23}

---

## Příloha B: Příklady kalibrace rolí

### Situátor
- dobře zvládnuté: rychle zasadí téma do kontextu a pomůže začít smysluplně pracovat
- přepálení: přesituovává, dlouho se nerozbíhá, zůstává v rámování :contentReference[oaicite:24]{index=24}

### Posluchač
- dobře zvládnuté: zpřesňuje význam, parafrázuje, všímá si emocí a nejasností
- přepálení: poslouchá příliš dlouho, ztrácí tah, bojí se přerušit nepřesnost :contentReference[oaicite:25]{index=25}

### Facilitátor dohody
- dobře zvládnuté: pomáhá dojít k pracovní dohodě a drží bezpečí i tah
- přepálení: uhlazuje konflikt za každou cenu, vytváří falešný konsenzus :contentReference[oaicite:26]{index=26}

### Konfrontátor
- dobře zvládnuté: pojmenuje rozpor v pravý čas a vrací do hry odpovědnost
- přepálení: konfrontuje příliš brzo, moralizuje, dokazuje vlastní pravdu :contentReference[oaicite:27]{index=27}

### Aktivátor klienta
- dobře zvládnuté: vrací volant klientovi a posiluje jeho odpovědnost
- přepálení / selhání kalibrace: odmítne potřebnou pomoc, poučuje, nebo naopak převezme práci a vytváří závislost :contentReference[oaicite:28]{index=28}

### Kurátor návaznosti
- dobře zvládnuté: zanechává čistou stopu a drží follow-up i návaznost
- přepálení: utopí se v administrativě nebo přepojí klienta příliš brzo :contentReference[oaicite:29]{index=29}

---

## Příloha C: Typická napětí mezi principy a rolemi

Produkt má pomáhat expertům pracovat s opakujícími se napětími, například:

- pomoc vs. odpovědnost klienta,
- naslouchání vs. tah na výstup,
- konfrontace vs. důvěra,
- struktura vs. flexibilita,
- individualita vs. konzistentní zkušenost pod brandem JIC,
- reflexe vs. akce,
- delivery vs. ownership klienta.

Tato napětí nejsou chyba systému. Jsou přirozenou součástí rozvoje experta a produktu.