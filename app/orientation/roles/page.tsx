import Link from "next/link";
import { auth } from "@/auth";
import { ConsultingRoleCard } from "@/components/orientation/consulting-role-card";
import { OrientationRoleSelfEvalNudge } from "@/components/orientation/orientation-role-self-eval-nudge";
import { OrientationRolesFocusReminder } from "@/components/orientation/orientation-roles-focus-reminder";
import { Button } from "@/components/ui/button";
import { getRoleSelfEvalSummaryForUser } from "@/lib/orientation/role-self-eval-queries";
import { getRolesGroupedByPhase } from "@/lib/queries/orientation";

export const dynamic = "force-dynamic";

export default async function OrientationRolesPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [groups, selfEval] = await Promise.all([
    getRolesGroupedByPhase(),
    userId
      ? getRoleSelfEvalSummaryForUser(userId)
      : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orientation">← Orientace</Link>
        </Button>
      </nav>
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Situční role — konzultantské karty
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Šestnáct rolí ve čtyřech fázích podle pracovní verze JIC karet.
        </p>
        {selfEval && !selfEval.isComplete ? (
          <OrientationRoleSelfEvalNudge
            evaluatedCount={selfEval.evaluatedCount}
            totalRoles={selfEval.totalRoles}
          />
        ) : null}
        {selfEval?.isComplete ? (
          <OrientationRolesFocusReminder
            focusRoleNames={selfEval.focusRoleNames}
          />
        ) : null}
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
            </div>
            <ul className="grid list-none gap-4 p-0 sm:grid-cols-1">
              {g.roles.map((r, i) => (
                <li key={r.id}>
                  <ConsultingRoleCard
                    role={r}
                    illustrationPriority={i < 2}
                    showSelfEval={userId != null}
                    initialSelfEvalSentiment={
                      userId && selfEval
                        ? selfEval.mapByRoleId[r.id] ?? null
                        : null
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
