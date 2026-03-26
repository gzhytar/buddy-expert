/**
 * Idempotent seed: demo user, 10 principles, 16 roles (JIC karty).
 * Run: npm run db:seed
 * Password: SEED_DEMO_PASSWORD env or default `buddy-dev-1`
 */
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { PRINCIPLE_IMAGE_PATHS } from "../lib/data/principle-images";
import { ROLE_IMAGE_PATHS } from "../lib/data/role-images";
import { JIC_ROLE_CARDS } from "../lib/data/jic-role-cards";
import { db } from "../lib/db";
import {
  consultingRoles,
  principles,
  users,
} from "../lib/db/schema";

const DEMO_USER_ID = "user_demo";
const DEMO_EMAIL = "demo@jic.local";

const principleRows = [
  {
    id: "p-1",
    sortOrder: 1,
    title: "Pracujte se správnou osobou",
    summary:
      "Zajistěte přítomnost klíčových stakeholderů, aby rozhodnutí a návazné kroky zůstaly věrohodné.",
    learningTips:
      "Na začátku si ověřte, kdo má mandát rozhodovat a kdo pouze přináší informace.\nŘekněte otevřeně, pokud bez klíčové osoby ztrácí smysl pokračovat v plné šíři.\nKrátká přestávka nebo náhradní termín bývá lepší než „pro forma“ sezení.",
    fieldStories:
      "U stolu seděli tři lidé z týmu, ale chyběl někdo, komu firma přezdívala „ten, kdo to stejně musí odchválit“. Schůzka proběhla přátelsky, ale závěry zůstaly viset — tým se vrátil až s jednatelem a teprve tehdy šlo domluvit konkrétní kroky.",
  },
  {
    id: "p-2",
    sortOrder: 2,
    title: "Situujte konzultaci",
    summary:
      "Rámujte kontext firmy, fázi a skutečné téma dnešního dne, aby práce zůstala ukotvená.",
    learningTips:
      "Během prvních minut pojmenujte fázi firmy a faktické téma dnešního setkání.\nPřipomeňte rámec spolupráce — co patří do konzultace a co spadá jinam.\nDomluvte se, jak poznáte, že byl čas u stolu užitečný.",
    fieldStories:
      "Klient začal obecnou „strategií“, ale po upřesnění vyšlo najevo, že urgentní je cashflow na šedesát dnů. Zúžení tématu uvolnilo energii — místo slidů o vizi šlo řešit konkrétní zdržení v platbách.",
  },
  {
    id: "p-3",
    sortOrder: 3,
    title: "Jasně se shodněte na cíli",
    summary:
      "Budujte společné porozumění výstupům dříve, než se ponoříte do řešení.",
    learningTips:
      "Než půjdete do detailů, shrňte nahlas: „Dnes chceme dojít k…“ a nechte klienta doplnit.\nRozlišujte výstup schůzky od dlouhodobého cíle firmy — obojí může být správně, ale plní jinou roli.\nKdyž se názory rozcházejí, zpomalte a přepište cíl tak, aby seděl oběma stranám.",
    fieldStories:
      "Polovina sezení proběhla v brainstormingu, pak někdo řekl: „Já jsem čekal, že dnes vybereme dodavatele.“ Najednou bylo jasné, že se tým díval na jiný „cíl dne“. Pět minut na srovnání očekávání ušetřilo zbytečnou frustraci.",
  },
  {
    id: "p-4",
    sortOrder: 4,
    title: "Ponechte odpovědnost na klientovi",
    summary:
      "Zachovejte vlastnictví rozhodnutí na straně klienta; konzultant umožňuje, nenahrazuje.",
    learningTips:
      "Když klient žádá radu „co byste udělali vy“, vraťte otázku: „Co dává smysl vám vzhledem k rizikům, která znáte?“\nShrnujte varianty a trade-offy, ale nechte u klienta volbu.\nPozor na jazyk „my to uděláme“ — i nechtěně může přenést vlastnictví na vás.",
    fieldStories:
      "Expert navrhl jasný postup a klient odcházel uvolněný — ale za týden volal, že „to stejně nefunguje“. V debriefu vyšlo najevo, že rozhodnutí nebylo nikdy opravdu přijato v týmu; klient očekával, že „JIC to vezme za ně“.",
  },
  {
    id: "p-5",
    sortOrder: 5,
    title: "Vyhněte se dělání práce za klienta",
    summary:
      "S výjimkou úzkých rozvojových případů odolejte přebírání úkolů, které by měl vlastnit klient.",
    learningTips:
      "Když vás někdo poprosí o „rychlý návrh“, zkuste nejdřív domluvit, kdo ho před klienty obhájí a kdo ho dotáhne.\nRozvojové cvičení může být výjimka — ale měla by být krátce pojmenovaná jako učení, ne jako trvalý převzetí role.\nDejte si pozor na skryté úkoly v chatu po schůzce.",
    fieldStories:
      "Po workshopu přistálo v mailu deset drobných úprav prezentace. Expert je udělal v dobré víře — a měsíc na to stejný tým čekal další „jen drobnosti“. Hranice se posunula tiše, bez domluvy.",
  },
  {
    id: "p-6",
    sortOrder: 6,
    title: "Pracujte s poznámkami",
    summary:
      "Udržujte užitečnou dohledatelnost bez toho, abyste se utopili v administrativě.",
    learningTips:
      "Domluvte na začátku, zda budete sdílet zápis a kdo ho uloží do systému.\nPište jen to, co pomůže při dalším kroku — ne přepis celé konverzace.\nKrátká struktura (domluva / otevřené body / další krok) často stačí.",
    fieldStories:
      "V jedné firmě vznikly tři různé verze „co jsme se domluvili“ — jedna v mailu, jedna v poznámkovém bloku, jedna v hlavě jednatele. Příště stačilo na konci přečíst nahlas tři věty a nechat je potvrdit.",
  },
  {
    id: "p-7",
    sortOrder: 7,
    title: "Konzultujte nad něčím konkrétním",
    summary:
      "Ukotvěte dialog v reálném materiálu, aby sezení zůstalo věcné.",
    learningTips:
      "Požádejte o ukázku reálného artefaktu — čísla, e-mail klientovi, návrh procesu.\nKdyž materiál chybí, vytvořte společně minimální ukázku ještě během sezení.\nAbstraktní debata je signál: „Potřebujeme něco, na co se podívat.“",
    fieldStories:
      "Hodinová debata o „komunikaci“ skončila až ve chvíli, kdy někdo otevřel skutečný dopis, který firma posílá odběratelům. Text na obrazovce změnil tón celé diskuse — najednou šlo o konkrétní slova, ne o obecné principy.",
  },
  {
    id: "p-8",
    sortOrder: 8,
    title: "Buďte si vědomi osobních rozdílů",
    summary:
      "Vnímejte dynamiku mezi vámi a klientem — pozici, styl a předpoklady.",
    learningTips:
      "Zpomalte, když cítíte velký rozdíl v tempu, přímosti nebo ochotě riskovat.\nPojmenujte rozdíl neutrálně: „Já mám tendenci… vy zníte spíš…“\nNe všechno musíte srovnat — někdy stačí ho vědomě řídit.",
    fieldStories:
      "Expert zvyklý na rychlé rozhodování tlačil na termíny; klient potřeboval čas na vnitřní alignment. Když to jeden z nich pojmenoval jako rozdíl stylů, ne jako „lenost vs. efektivita“, šlo dál domluvit mezikrok s menším odporem.",
  },
  {
    id: "p-9",
    sortOrder: 9,
    title: "Uzavřete vzájemnou zpětnou vazbou",
    summary:
      "Zakončete explicitní reflexí toho, jak sezení fungovalo pro obě strany.",
    learningTips:
      "Vyhraďte posledních pět minut: co bylo užitečné, co by příště mohlo jinak — z obou stran.\nOtázka „Co pro vás dávalo smysl?“ často otevře víc než hodnocení stupněm.\nZpětnou vazbu berete jako data pro příští spolupráci, ne jako osobní hodnocení.",
    fieldStories:
      "Schůzka působila hladce, ale klient na konci řekl: „Bál jsem se říct, že mi chyběl kontext z minula.“ Krátká věta otevřela téma, které by jinak zůstalo v hlavě a příště by narostlo.",
  },
  {
    id: "p-10",
    sortOrder: 10,
    title: "Sdílejte informace skrze JIC systémy",
    summary:
      "Používejte CRM / YTracker a související kanály vhodným způsobem s jasnými hranicemi.",
    learningTips:
      "Domluvte s klientem, co patří do oficiálního záznamu a co zůstane jen v poznámkách.\nPište tak, aby kolega po vás rozuměl kontextu bez nutnosti být u stolu.\nRespektujte citlivé informace — méně detailů v systému někdy znamená víc důvěry.",
    fieldStories:
      "V týmu JIC se dva lidé dívali na stejný případ s jiným kontextem — jeden měl v hlavě call z minula, druhý ne. Krátký, faktický záznam v YTrackeru sjednotil obraz a ušetřil zbytečný vnitřní ping-pong.",
  },
];

async function main() {
  const passwordPlain =
    process.env.SEED_DEMO_PASSWORD?.trim() || "buddy-dev-1";
  const passwordHash = await bcrypt.hash(passwordPlain, 12);

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, DEMO_USER_ID))
    .limit(1);

  if (!existing.length) {
    await db.insert(users).values({
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      name: "Demo expert",
      passwordHash,
    });
    console.log(`Created demo user ${DEMO_EMAIL} (password from env or default).`);
  } else {
    console.log(`Demo user ${DEMO_EMAIL} already exists; skipping user insert.`);
  }

  for (const p of principleRows) {
    const imagePath = PRINCIPLE_IMAGE_PATHS[p.id] ?? null;
    await db
      .insert(principles)
      .values({ ...p, imagePath })
      .onConflictDoUpdate({
        target: principles.id,
        set: {
          title: p.title,
          summary: p.summary,
          sortOrder: p.sortOrder,
          imagePath,
          learningTips: p.learningTips,
          fieldStories: p.fieldStories,
        },
      });
  }
  console.log(`Seeded/Updated ${principleRows.length} principles.`);

  for (const c of JIC_ROLE_CARDS) {
    const imagePath = ROLE_IMAGE_PATHS[c.id] ?? null;
    await db
      .insert(consultingRoles)
      .values({
        id: c.id,
        phaseKey: c.phaseKey,
        phaseLabel: c.phaseLabel,
        sortOrder: c.sortOrder,
        cardCode: c.cardCode,
        cardIndex: c.cardIndex,
        name: c.name,
        description: null,
        summaryLine: c.summaryLine,
        whatItDoes: c.whatItDoes,
        usefulBullets: JSON.stringify(c.usefulBullets),
        riskBullets: JSON.stringify(c.riskBullets),
        imagePath,
      })
      .onConflictDoUpdate({
        target: consultingRoles.id,
        set: {
          phaseKey: c.phaseKey,
          phaseLabel: c.phaseLabel,
          sortOrder: c.sortOrder,
          cardCode: c.cardCode,
          cardIndex: c.cardIndex,
          name: c.name,
          description: null,
          summaryLine: c.summaryLine,
          whatItDoes: c.whatItDoes,
          usefulBullets: JSON.stringify(c.usefulBullets),
          riskBullets: JSON.stringify(c.riskBullets),
          imagePath,
        },
      });
  }
  console.log(`Seeded/Updated ${JIC_ROLE_CARDS.length} roles (JIC karty).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
