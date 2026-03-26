import Link from "next/link";
import type { ReflectionDetail } from "@/lib/reflection/actions";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import type { Principle } from "@/lib/db/schema";
import type { RolePhaseGroup } from "@/lib/queries/orientation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanVsRealitySummary } from "@/components/reflection/plan-vs-reality-summary";

const alignmentLabels: Record<string, string> = {
  strongly_aligned: "Silný soulad s rámcem JIC",
  aligned: "Převážně v souladu",
  mixed: "Smíšené / částečný soulad",
  strained: "Napjaté nebo mimo rámec",
  unsure: "Zatím nevím",
};

const calibrationLabels: Record<string, string> = {
  underused: "Podhodnocená",
  balanced: "Vyvážená",
  overused: "Přehřátá",
};

type Props = {
  data: ReflectionDetail;
  principles: Principle[];
  roleGroups: RolePhaseGroup[];
};

export function ReflectionReadOnly({ data, principles, roleGroups }: Props) {
  const { session, principleIds, roles, preparation } = data;
  const pById = Object.fromEntries(principles.map((p) => [p.id, p]));
  const roleById = Object.fromEntries(
    roleGroups.flatMap((g) => g.roles.map((r) => [r.id, r])),
  );
  const rMap = Object.fromEntries(
    roleGroups.flatMap((g) => g.roles.map((r) => [r.id, r.name])),
  );

  return (
    <div className="space-y-8">
      <nav>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reflections">← Všechny reflexe</Link>
        </Button>
      </nav>
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Dokončená reflexe
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {session.consultationLabel?.trim() || "Reflexe konzultace"}
        </h1>
        {session.occurredAt ? (
          <p className="text-sm text-muted-foreground">
            Čas konzultace:{" "}
            {new Date(session.occurredAt).toLocaleString("cs-CZ", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        ) : null}
      </header>

      {preparation && roles.length > 0 ? (
        <PlanVsRealitySummary
          preparation={preparation}
          reflectionRoles={roles}
          roleNameById={rMap}
        />
      ) : preparation ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Záměr z přípravy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {preparation.focusNote?.trim() ? (
              <p className="whitespace-pre-wrap text-foreground">
                {preparation.focusNote.trim()}
              </p>
            ) : null}
            <p>
              Pro porovnání záměru s realitou přidejte v rozpracované reflexi alespoň
              jednu roli s kalibrací.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Principy v centru pozornosti</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex list-none flex-col gap-3 p-0">
            {principleIds.map((id) => {
              const pr = pById[id];
              const title = pr?.title ?? id;
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/10 px-2 py-2"
                >
                  <PrincipleIllustration
                    src={pr?.imagePath}
                    alt={`Ilustrace: ${title}`}
                    variant="inline"
                    className="rounded-md border-0 shadow-none"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {title}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role a kalibrace</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex list-none flex-col gap-3 p-0">
            {roles.map((row) => {
              const role = roleById[row.roleId];
              const title = role?.name ?? rMap[row.roleId] ?? row.roleId;
              return (
                <li
                  key={row.roleId}
                  className="flex flex-wrap items-center gap-3 rounded-md border border-border/60 bg-muted/10 px-2 py-2"
                >
                  <PrincipleIllustration
                    src={role?.imagePath}
                    alt={`Ilustrace: ${title}`}
                    variant="inline"
                    missingFileHint={ROLE_IMAGE_MISSING_HINT}
                    className="rounded-md border-0 shadow-none"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground">
                      {title}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {calibrationLabels[row.calibration] ?? row.calibration}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Soulad s rámcem JIC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {session.alignmentLikert ? (
            <p className="text-foreground">
              {alignmentLabels[session.alignmentLikert] ??
                session.alignmentLikert}
            </p>
          ) : null}
          {session.alignmentNote ? (
            <p className="text-muted-foreground whitespace-pre-wrap">
              {session.alignmentNote}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Poznámka k učení</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {session.learningNote ?? "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
