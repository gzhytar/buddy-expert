import Link from "next/link";
import { ConsultingRoleCard } from "@/components/orientation/consulting-role-card";
import { Button } from "@/components/ui/button";
import { getRolesGroupedByPhase } from "@/lib/queries/orientation";

export const dynamic = "force-dynamic";

export default async function OrientationRolesPage() {
  const groups = await getRolesGroupedByPhase();

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orientation">← Orientation</Link>
        </Button>
      </nav>
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Situční role — konzultantské karty
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Šestnáct rolí ve čtyřech fázích podle pracovní verze JIC karet (líc:
          stručná definice; rub: co role dělá, užitečné projevy a rizika při
          přepálení). Při reflexi zaznamenáváte, zda byla role{" "}
          <strong className="text-foreground">podužitá</strong>,{" "}
          <strong className="text-foreground">vyvážená</strong> nebo{" "}
          <strong className="text-foreground">přepálená</strong>.
        </p>
      </header>
      <div className="space-y-12">
        {groups.map((g) => (
          <section
            key={g.phaseKey}
            aria-labelledby={`phase-${g.phaseKey}`}
            className="space-y-5"
          >
            <div className="border-b border-border pb-2">
              <h2
                id={`phase-${g.phaseKey}`}
                className="font-display text-xl font-semibold tracking-tight"
              >
                {g.phaseLabel}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fáze podle sady karet JIC
              </p>
            </div>
            <ul className="grid list-none gap-6 p-0 sm:grid-cols-1">
              {g.roles.map((r) => (
                <li key={r.id}>
                  <ConsultingRoleCard role={r} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
