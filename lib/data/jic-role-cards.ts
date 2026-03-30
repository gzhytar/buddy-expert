/**
 * Content aligned with JIC „Konzultantské karty“ (pracovní verze) — líc + rub.
 * Source: konzultantske_karty_JIC_duplex_long_edge.pdf
 */

export type JicRoleCardSeed = {
  id: string;
  phaseKey: "contract-frame" | "company-diagnosis" | "leading-session" | "solution-creation";
  phaseLabel: string;
  sortOrder: number;
  cardCode: string;
  cardIndex: number;
  name: string;
  /** Krátká definice z líce karty */
  summaryLine: string;
  /** Odstavec „Co role dělá“ */
  whatItDoes: string;
  /** Body „Užitečné projevy“ */
  usefulBullets: string[];
  /** Body „Rizika při přepálení“ */
  riskBullets: string[];
  /** Síla role 1–5 podle karet JIC (obsah / lidé / delivery) */
  strengthObsah: number;
  strengthLide: number;
  strengthDelivery: number;
};

export const JIC_ROLE_CARDS: JicRoleCardSeed[] = [
  {
    id: "r-situator",
    phaseKey: "contract-frame",
    phaseLabel: "Zakázka a rámec",
    sortOrder: 1,
    cardCode: "SI",
    cardIndex: 1,
    name: "Situátor",
    summaryLine:
      "Usazuje firmu a téma do fáze spolupráce, kontextu a hlavní otázky dne.",
    whatItDoes:
      "Pomáhá klientovi i sobě rychle pochopit, v jaké fázi práce firma právě je, co je dnes opravdu tématem a co zatím patří na parkoviště.",
    usefulBullets: [
      "rychle propojí dnešní téma s širším příběhem firmy",
      "umí pojmenovat fázi spolupráce a zvolit správný fokus",
      "hlídá, aby sezení nezačalo v chaosu",
    ],
    riskBullets: [
      "přesituovává a dlouho se nerozběhne k práci",
      "uzavře výklad příliš brzo a přehlédne nová data",
      "drží se původního rámce, i když se téma už posunulo",
    ],
    strengthObsah: 4,
    strengthLide: 2,
    strengthDelivery: 3,
  },
  {
    id: "r-strazce-mandatu",
    phaseKey: "contract-frame",
    phaseLabel: "Zakázka a rámec",
    sortOrder: 2,
    cardCode: "SM",
    cardIndex: 2,
    name: "Strážce mandátu",
    summaryLine:
      "Hlídá, zda u tématu sedí správní lidé a zda mají právo rozhodovat.",
    whatItDoes:
      "Nenechá konzultaci běžet s člověkem, který téma jen zprostředkovává, ale nemá mandát rozhodnout, potvrdit nebo pohnout další lidi.",
    usefulBullets: [
      "ověřuje rozhodovací pravomoci hned na začátku",
      "rozpozná chybějící roli a umí ji přizvat",
      "citlivě eskaluje potřebu účasti majitele či CEO",
    ],
    riskBullets: [
      "je příliš tvrdý a zbytečně blokuje začátek práce",
      "podcení neformální vliv a mocenské vazby",
      "nechá se ukolébat nejdostupnějším kontaktem",
    ],
    strengthObsah: 3,
    strengthLide: 4,
    strengthDelivery: 4,
  },
  {
    id: "r-cilotvurce",
    phaseKey: "contract-frame",
    phaseLabel: "Zakázka a rámec",
    sortOrder: 3,
    cardCode: "CÍ",
    cardIndex: 3,
    name: "Cílotvůrce",
    summaryLine:
      "Překládá vágní přání do jasného cíle, výstupu a kritérií úspěchu.",
    whatItDoes:
      "Dává zakázce i jednotlivému sezení podobu, která se dá ověřit: co má vzniknout, podle čeho poznáme úspěch a co už je mimo rozsah.",
    usefulBullets: [
      "umí z mlhavého zadání vytáhnout konkrétní cíl",
      "dohlédne na měřítka úspěchu, milníky a DoD",
      "udržuje shodu účastníků na tom, kam míří",
    ],
    riskBullets: [
      "překlopí vše do technokratického SMARTu bez smyslu",
      "nadeklaruje cíl, který není reálně dosažitelný",
      "zamění živou práci za formulářové cvičení",
    ],
    strengthObsah: 5,
    strengthLide: 2,
    strengthDelivery: 5,
  },
  {
    id: "r-hlidac-zdroju",
    phaseKey: "contract-frame",
    phaseLabel: "Zakázka a rámec",
    sortOrder: 4,
    cardCode: "HZ",
    cardIndex: 4,
    name: "Hlídač zdrojů",
    summaryLine:
      "Ověřuje, zda na změnu existuje čas, kapacita, kompetence a peníze.",
    whatItDoes:
      "Vrací řešení z roviny nápadů do reality. Ptá se, zda firma má kapacitu, zdroje a governance, aby navržený krok vůbec unesla.",
    usefulBullets: [
      "včas pojmenuje kapacitní a rozpočtové limity",
      "pomáhá prioritizovat podle skutečných možností firmy",
      "myslí i na závislosti, rizika a compliance",
    ],
    riskBullets: [
      "působí příliš brzdivě a ubíjí energii",
      "zúží rozhovor jen na to, co je snadné",
      "nechá se stáhnout do detailu, který ještě není potřeba",
    ],
    strengthObsah: 5,
    strengthLide: 1,
    strengthDelivery: 5,
  },
  {
    id: "r-mapovac-dna",
    phaseKey: "company-diagnosis",
    phaseLabel: "Diagnostika firmy",
    sortOrder: 1,
    cardCode: "MD",
    cardIndex: 5,
    name: "Mapovač DNA",
    summaryLine:
      "Odkrývá logiku vlastnictví, historii a mocenské vazby firmy.",
    whatItDoes:
      "Sbírá a skládá to, co vysvětluje dnešní chování firmy: proč vznikla, kdo na ni má vliv, podle jaké logiky se rozhoduje a co je pro ni posvátné.",
    usefulBullets: [
      "vidí souvislosti mezi historií firmy a dnešní realitou",
      "mapuje vlastníky, hodnoty, vlivy a rozhodovací práva",
      "umí z více vstupů vytvořit srozumitelný obraz firmy",
    ],
    riskBullets: [
      "zahltí klienta mapováním bez jasného účelu",
      "sbírá zajímavosti, které nepomáhají rozhodnutí",
      "přecení příběh a podcení současná data",
    ],
    strengthObsah: 5,
    strengthLide: 3,
    strengthDelivery: 3,
  },
  {
    id: "r-diagnostik-roli",
    phaseKey: "company-diagnosis",
    phaseLabel: "Diagnostika firmy",
    sortOrder: 2,
    cardCode: "DR",
    cardIndex: 6,
    name: "Diagnostik rolí",
    summaryLine:
      "Rozlišuje, jaké role lidé formálně mají a jaké ve firmě skutečně nesou.",
    whatItDoes:
      "Odhaluje, kde je role nejasná, přetížená nebo rozštěpená. Pomáhá vidět, kdo za co opravdu rozhoduje a kde firma platí za zmatek v rolích.",
    usefulBullets: [
      "odděluje pozici od skutečně nesené role",
      "umí zachytit role, které se v jedné osobě nešťastně míchají",
      "odkrývá slepé skvrny v rozhodování a odpovědnosti",
    ],
    riskBullets: [
      "personalizuje systémový problém na jednotlivce",
      "vyrábí příliš jemné nuance bez praktického dopadu",
      "vyslovuje rychlé soudy bez dostatečných důkazů",
    ],
    strengthObsah: 5,
    strengthLide: 4,
    strengthDelivery: 3,
  },
  {
    id: "r-posluchac",
    phaseKey: "company-diagnosis",
    phaseLabel: "Diagnostika firmy",
    sortOrder: 3,
    cardCode: "PO",
    cardIndex: 7,
    name: "Posluchač",
    summaryLine: "Naslouchá tak, aby rozuměl významu, ne jen slovům.",
    whatItDoes:
      "Zpřesňuje pojmy, parafrázuje, ověřuje porozumění a pomáhá klientovi sám slyšet, co vlastně říká, zamlčuje nebo plete dohromady.",
    usefulBullets: [
      "parafrázuje a kontroluje, že rozumí správně",
      "umí vytáhnout význam skrytý za vágními pojmy",
      "všímá si emocí, metafor i tichých signálů",
    ],
    riskBullets: [
      "poslouchá tak dlouho, až ztrácí tah na výstup",
      "bojí se přerušit a doprecizovat nepřesnost",
      "zamění empatii za souhlas s klientovou verzí reality",
    ],
    strengthObsah: 3,
    strengthLide: 5,
    strengthDelivery: 2,
  },
  {
    id: "r-validator",
    phaseKey: "company-diagnosis",
    phaseLabel: "Diagnostika firmy",
    sortOrder: 4,
    cardCode: "VA",
    cardIndex: 8,
    name: "Validátor",
    summaryLine:
      "Ověřuje potřeby, cíle a hypotézy proti datům a reálnému chování.",
    whatItDoes:
      "Nespokojí se s první verzí problému. Trianguluje zdroje, porovnává tvrzení s daty a testuje, zda klient řeší skutečnou potřebu, ne jen symptom.",
    usefulBullets: [
      "odděluje fakta, interpretace a hypotézy",
      "umí testovat deklarované cíle proti realitě firmy",
      "vnáší do rozhovoru benchmarky a minimální testy hodnoty",
    ],
    riskBullets: [
      "působí příliš skepticky a ubírá klientovi odvahu",
      "rozbije tempo sezení neustálým dokazováním",
      "ověřuje i tam, kde už je potřeba přejít k akci",
    ],
    strengthObsah: 5,
    strengthLide: 2,
    strengthDelivery: 4,
  },
  {
    id: "r-moderator-sezeni",
    phaseKey: "leading-session",
    phaseLabel: "Vedení sezení",
    sortOrder: 1,
    cardCode: "MS",
    cardIndex: 9,
    name: "Moderátor sezení",
    summaryLine:
      "Drží strukturu, tempo, agendu a energii společného sezení.",
    whatItDoes:
      "Pečuje o průběh práce ve skupině. Hlídá čas, přechody mezi bloky, parkoviště, dominance v hovoru i to, aby diskuse nepřetekla.",
    usefulBullets: [
      "udržuje rytmus sezení a jasně přepíná fáze práce",
      "dává hlas i tichým lidem a krotí odbočky",
      "pracuje s parkovištěm, timeboxem i krátkým resetem",
    ],
    riskBullets: [
      "jede mechanicky podle agendy bez čtení místnosti",
      "přereguluje skupinu a ubere jí spontaneitu",
      "příliš hlídá čas a zapomene na kvalitu rozhodnutí",
    ],
    strengthObsah: 3,
    strengthLide: 4,
    strengthDelivery: 5,
  },
  {
    id: "r-facilitator-dohody",
    phaseKey: "leading-session",
    phaseLabel: "Vedení sezení",
    sortOrder: 2,
    cardCode: "FD",
    cardIndex: 10,
    name: "Facilitátor dohody",
    summaryLine:
      "Pomáhá lidem dojít k pracovní dohodě a posunout sporná témata.",
    whatItDoes:
      "Pracuje s rozpory mezi lidmi tak, aby z nich vznikla dohoda, rozhodnutí nebo alespoň poctivě pojmenovaný nesouhlas s dalším krokem.",
    usefulBullets: [
      "umí pracovat se zájmy, ne jen s tvrdými pozicemi",
      "vytváří bezpečí pro nesouhlas a zároveň drží tah",
      "překládá konfliktní debatu do konkrétní dohody",
    ],
    riskBullets: [
      "uhlazuje konflikt za každou cenu",
      "nutí skupinu do falešného konsenzu",
      "vyhne se těžkému rozhodnutí ve jménu pohody",
    ],
    strengthObsah: 2,
    strengthLide: 5,
    strengthDelivery: 4,
  },
  {
    id: "r-konfrontator",
    phaseKey: "leading-session",
    phaseLabel: "Vedení sezení",
    sortOrder: 3,
    cardCode: "KO",
    cardIndex: 11,
    name: "Konfrontátor",
    summaryLine:
      "Citlivě, ale jasně pojmenovává nesoulad mezi sliby a realitou.",
    whatItDoes:
      "V pravý čas upozorní na rozpor mezi deklarovaným cílem, závazkem nebo identitou klienta a tím, co se ve firmě ve skutečnosti děje.",
    usefulBullets: [
      "kotví konfrontaci v datech a konkrétních situacích",
      "odděluje člověka od chování a systému",
      "pomáhá vracet integritu a odpovědnost do hry",
    ],
    riskBullets: [
      "konfrontuje příliš brzo a zavře vztah",
      "moralizuje nebo si dokazuje vlastní pravdu",
      "uhýbá před nepohodlným, i když je to jádro problému",
    ],
    strengthObsah: 3,
    strengthLide: 4,
    strengthDelivery: 3,
  },
  {
    id: "r-kalibrator",
    phaseKey: "leading-session",
    phaseLabel: "Vedení sezení",
    sortOrder: 4,
    cardCode: "KA",
    cardIndex: 12,
    name: "Kalibrátor",
    summaryLine:
      "Hlídá vlastní subjektivitu, polaritu a volbu konzultačního módu.",
    whatItDoes:
      "Všímá si, jakou roli sám do místnosti přináší: kdy je v poradenství, kdy ve facilitaci, kdy v koučování a co svým stylem zesiluje nebo tlumí.",
    usefulBullets: [
      "reflektuje vlastní bias a přirozenou polaritu",
      "umí vědomě volit režim práce podle situace",
      "včas si přizve kolegu s komplementárním stylem",
    ],
    riskBullets: [
      "zacyklí se v sebereflexi a ztratí rozhodnost",
      "vše relativizuje místo jasné volby přístupu",
      "nepřizná si vlastní vliv na dynamiku sezení",
    ],
    strengthObsah: 3,
    strengthLide: 3,
    strengthDelivery: 3,
  },
  {
    id: "r-artefaktar",
    phaseKey: "solution-creation",
    phaseLabel: "Tvorba řešení",
    sortOrder: 1,
    cardCode: "AR",
    cardIndex: 13,
    name: "Artefaktář",
    summaryLine:
      "Tahá debatu z abstrakce do konkrétního dokumentu, mapy či canvasu.",
    whatItDoes:
      "Nenechá tým mluvit jen v obecných pojmech. Překládá debatu do one-pageru, matice, mapy, logu, šablony nebo jiného pracovního artefaktu.",
    usefulBullets: [
      "umí přetavit rozhovor do něčeho, s čím lze dál pracovat",
      "zvyšuje srozumitelnost, dohledatelnost a návaznost",
      "spolutvoří s klientem minimální životaschopný artefakt",
    ],
    riskBullets: [
      "vyrábí hezké výstupy bez skutečné změny myšlení",
      "začne artefakt dělat za klienta místo s klientem",
      "upřednostní formu před obsahem a rozhodnutím",
    ],
    strengthObsah: 5,
    strengthLide: 3,
    strengthDelivery: 5,
  },
  {
    id: "r-navrhar-reseni",
    phaseKey: "solution-creation",
    phaseLabel: "Tvorba řešení",
    sortOrder: 2,
    cardCode: "NR",
    cardIndex: 14,
    name: "Návrhář řešení",
    summaryLine: "Formuluje proveditelné varianty, kroky a odpovědnosti.",
    whatItDoes:
      "Zjištění umí proměnit ve varianty řešení, které dávají smysl, mají rozhodovací kritéria, vlastníky, milníky a rozumný implementační plán.",
    usefulBullets: [
      "navrhuje varianty, ne jednu zázračnou cestu",
      "převádí doporučení do kroků, rolí a milníků",
      "myslí na pilot, rizika i implementovatelnost",
    ],
    riskBullets: [
      "sype obecné rady bez vazby na kontext firmy",
      "navrhne víc, než firma unese",
      "propadne vlastní oblíbené metodě a ignoruje realitu",
    ],
    strengthObsah: 5,
    strengthLide: 2,
    strengthDelivery: 5,
  },
  {
    id: "r-aktivator-klienta",
    phaseKey: "solution-creation",
    phaseLabel: "Tvorba řešení",
    sortOrder: 3,
    cardCode: "AK",
    cardIndex: 15,
    name: "Aktivátor klienta",
    summaryLine:
      "Vrací volant klientovi a posiluje jeho odpovědnost za rozhodnutí i implementaci.",
    whatItDoes:
      "Připomíná, že konzultant není náhradní manažer. Učí, ochutnává, ukazuje a pak vrací klientovi odpovědnost, rozhodnutí i vykonání.",
    usefulBullets: [
      "jasně vymezuje roli konzultanta a roli klienta",
      "dává klientovi šablony, otázky a řízenou praxi",
      "nenechá se stáhnout do interim dodávky bez dohody",
    ],
    riskBullets: [
      "odmítne potřebnou pomoc i tam, kde je ukázka na místě",
      "poučuje místo podpory a učení",
      "převezme práci a vyrobí na sobě závislost",
    ],
    strengthObsah: 2,
    strengthLide: 5,
    strengthDelivery: 4,
  },
  {
    id: "r-kurator-navaznosti",
    phaseKey: "solution-creation",
    phaseLabel: "Tvorba řešení",
    sortOrder: 4,
    cardCode: "KN",
    cardIndex: 16,
    name: "Kurátor návaznosti",
    summaryLine:
      "Udržuje strukturovanou paměť zakázky, sdílení a chytré napojení na zdroje JIC.",
    whatItDoes:
      "Dbá, aby po každém sezení zůstala čistá stopa: poznámky, rozhodnutí, YTracker, KAM, follow-up i promyšlené zapojení dalších lidí a služeb.",
    usefulBullets: [
      "zanechává po práci dohledatelný, použitelný záznam",
      "propojuje klienta s dalšími zdroji ve správný čas",
      "hlídá návaznost, handovery a institucionální paměť",
    ],
    riskBullets: [
      "utopí se v administrativě a oslabí živou práci s klientem",
      "přepojí klienta příliš brzy nebo bez dobrého briefu",
      "sbírá data, ale nevyvozuje z nich další krok",
    ],
    strengthObsah: 4,
    strengthLide: 3,
    strengthDelivery: 5,
  },
];
