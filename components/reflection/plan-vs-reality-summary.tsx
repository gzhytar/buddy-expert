import type { PreparationPlanSummary } from "@/lib/reflection/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CircleDot, Minus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = { roleId: string; calibration: string };

type Props = {
  preparation: PreparationPlanSummary;
  reflectionRoles: Row[];
  roleNameById: Record<string, string>;
};

function labelForReflection(
  intent: "strengthen" | "downregulate",
  calibration: string,
): { text: string; tone: "ok" | "watch" | "neutral" } {
  if (intent === "strengthen") {
    if (calibration === "underused")
      return { text: "Pod plánem — roli jste málo použili oproti záměru.", tone: "watch" };
    if (calibration === "overused")
      return { text: "Nad očekáváním — roli jste posílili silněji, než byl záměr.", tone: "neutral" };
    return { text: "Soulad se záměrem posílit.", tone: "ok" };
  }
  if (calibration === "overused")
    return { text: "Riziko — chtěli jste roli tlumit, kalibrace je přehřátá.", tone: "watch" };
  if (calibration === "underused")
    return { text: "Soulad se záměrem tlumit.", tone: "ok" };
  return { text: "Vyváženo vůči záměru tlumit.", tone: "ok" };
}

function IconForTone({ tone }: { tone: "ok" | "watch" | "neutral" }) {
  if (tone === "ok")
    return (
      <CheckCircle2
        className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
    );
  if (tone === "watch")
    return (
      <AlertTriangle
        className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden
      />
    );
  return (
    <CircleDot
      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      aria-hidden
    />
  );
}

export function PlanVsRealitySummary({
  preparation,
  reflectionRoles,
  roleNameById,
}: Props) {
  const byId = Object.fromEntries(reflectionRoles.map((r) => [r.roleId, r]));
  const strengthen = preparation.strengthenRoleIds;
  const down = preparation.downregulateRoleIds;
  const plannedIds = new Set([...strengthen, ...down]);

  const rows: {
    roleId: string;
    name: string;
    intent: "strengthen" | "downregulate";
    calibration?: string;
    missingInReflection: boolean;
  }[] = [];

  for (const id of strengthen) {
    const row = byId[id];
    rows.push({
      roleId: id,
      name: roleNameById[id] ?? id,
      intent: "strengthen",
      calibration: row?.calibration,
      missingInReflection: !row,
    });
  }
  for (const id of down) {
    const row = byId[id];
    rows.push({
      roleId: id,
      name: roleNameById[id] ?? id,
      intent: "downregulate",
      calibration: row?.calibration,
      missingInReflection: !row,
    });
  }

  const extraReflectionRoles = reflectionRoles.filter(
    (r) => !plannedIds.has(r.roleId),
  );

  return (
    <Card className="border-primary/25 bg-muted/20">
      <CardHeader>
        <CardTitle className="text-lg">Záměr vs. realita</CardTitle>
        <p className="text-sm text-muted-foreground">
          Porovnání přípravy před schůzkou s kalibrací rolí v reflexi. Slouží jen
          vám — není to hodnocení výkonu.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {preparation.focusNote?.trim() ? (
          <div className="rounded-lg border border-border/80 bg-background/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Původní záměr
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {preparation.focusNote.trim()}
            </p>
          </div>
        ) : null}

        <ul className="space-y-3">
          {rows.map((r) => {
            if (r.missingInReflection || !r.calibration) {
              return (
                <li
                  key={`${r.roleId}-${r.intent}`}
                  className="flex gap-3 rounded-md border border-border/70 bg-card px-3 py-3 text-sm"
                >
                  <Minus
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-muted-foreground">
                      {r.intent === "strengthen"
                        ? "Záměr: posílit — v reflexi jste roli nevybrali."
                        : "Záměr: tlumit — v reflexi jste roli nevybrali."}
                    </p>
                  </div>
                </li>
              );
            }
            const { text, tone } = labelForReflection(r.intent, r.calibration);
            return (
              <li
                key={`${r.roleId}-${r.intent}`}
                className={cn(
                  "flex gap-3 rounded-md border px-3 py-3 text-sm",
                  tone === "watch"
                    ? "border-amber-500/35 bg-amber-500/[0.06] dark:bg-amber-500/[0.08]"
                    : "border-border/70 bg-card",
                )}
              >
                <IconForTone tone={tone} />
                <div>
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-muted-foreground">
                    {r.intent === "strengthen" ? "Záměr: posílit" : "Záměr: tlumit"}
                    {" · "}
                    Kalibrace:{" "}
                    {r.calibration === "underused"
                      ? "podhodnocená"
                      : r.calibration === "overused"
                        ? "přehřátá"
                        : "vyvážená"}
                  </p>
                  <p className="mt-1 text-foreground/90">{text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {extraReflectionRoles.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Role v reflexi mimo původní plán
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {extraReflectionRoles.map((x) => (
                <li key={x.roleId}>
                  {roleNameById[x.roleId] ?? x.roleId}
                  {" — "}
                  {x.calibration === "underused"
                    ? "podhodnocená"
                    : x.calibration === "overused"
                      ? "přehřátá"
                      : "vyvážená"}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
