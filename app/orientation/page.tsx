import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { OrientationRoleSelfEvalNudge } from "@/components/orientation/orientation-role-self-eval-nudge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getRoleSelfEvalSummaryForUser } from "@/lib/orientation/role-self-eval-queries";

const links = [
  {
    href: "/orientation/frame",
    title: "Mise a rámec",
    description: "Proč tento nástroj existuje a jak souvisí s konzultačním rámcem JIC.",
    whyHelpful:
      "Zorientujete se v poslání JIC a v hranicích této aplikace vůči CRM a reálné práci. Uvidíte celek — tři pilíře kvality — a snáze si spojíte vlastní konzultace s tím, co organizace považuje za standard, bez dojmu z „dalšího systému na bodování“.",
    imageSrc: "/konzultace_ramec.png",
    imageAlt:
      "Sketchnote konzultačního rámce JIC: kvalita konzultování na třech pilířích včetně Konzultantského desatera, univerzálního schématu organizace a konzultačního toolboxu.",
  },
  {
    href: "/orientation/principles",
    title: "Konzultantské desatero",
    description: "Referenční přehled Konzultantského desatera JIC pro reflexi.",
    whyHelpful:
      "Získáte společný jazyk pro kvalitu konzultace: můžete si připomenout principy před schůzkou, v reflexi je vybrat jako nejdůležitější a s kolegy o nich mluvit stejnými slovy. Slouží jako čočka pro supervizi, ne jako rigidní kontrolní seznam.",
    imageSrc: "/principles_situate_first.png",
    imageAlt:
      "Ilustrace k principu Konzultantského desatera: na začátku situuji — diagram kontextu a situace na flipchartu.",
  },
  {
    href: "/orientation/roles",
    title: "Situační role",
    description: "Šestnáct rolí ve čtyřech fázích — jazyk pro kalibraci.",
    whyHelpful:
      "Pojmenujete, v jakých „režimech“ jste ve schůzce byli — situátor, posluchač, facilitátor a další. Příprava vám pomůže záměrně něco posílit nebo stáhnout; reflexe pak spojí skutečné chování s kalibrací (málo / akorát / moc) a učení z konkrétní konzultace.",
    imageSrc: "/roles_diagnostik-roli.png",
    imageAlt:
      "Ilustrace situační role Diagnostik rolí z konzultantských karet JIC — zjednodušení organizační struktury.",
  },
] as const;

export default async function OrientationHubPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const selfEval =
    userId != null
      ? await getRoleSelfEvalSummaryForUser(userId)
      : null;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Orientace
        </h1>
        <p className="text-muted-foreground">
          Referenční materiály pro sdílený jazyk JIC. Procházejte v libovolném
          pořadí; u situačních rolí můžete volitelně uložit svůj vztah k jednotlivým
          rolím — jen pro vás, bez vlivu na přístup k reflexím.
        </p>
      </header>
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-1">
        {links.map((item, index) => {
          const showRolesNudge =
            item.href === "/orientation/roles" &&
            selfEval != null &&
            !selfEval.isComplete;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="flex flex-row items-stretch overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                  <div className="relative aspect-square w-[4.75rem] shrink-0 self-center border-r border-border/60 bg-[oklch(99%_0.01_95)] dark:bg-card/80 sm:w-24 md:w-28">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-contain object-center p-1.5 sm:p-2"
                      sizes="(max-width: 768px) 76px, 112px"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-4 py-4 sm:px-5 sm:py-5">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <div className="space-y-1.5 border-t border-border/50 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                        Proč vám to pomůže
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.whyHelpful}
                      </p>
                    </div>
                    {showRolesNudge ? (
                      <div className="border-t border-border/50 pt-3">
                        <OrientationRoleSelfEvalNudge
                          evaluatedCount={selfEval.evaluatedCount}
                          totalRoles={selfEval.totalRoles}
                        />
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
