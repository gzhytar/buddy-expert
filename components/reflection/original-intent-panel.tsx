import type { PreparationPlanSummary } from "@/lib/reflection/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  preparation: PreparationPlanSummary;
  roleNameById: Record<string, string>;
};

export function OriginalIntentPanel({ preparation, roleNameById }: Props) {
  return (
    <Card className="border-dashed border-primary/40 bg-primary/[0.04] dark:bg-primary/[0.07]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Původní záměr z přípravy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Připomeňte si, co jste před schůzkou plánovali — pomůže to při reflexi.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {preparation.focusNote?.trim() ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fokus
            </p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-foreground">
              {preparation.focusNote.trim()}
            </p>
          </div>
        ) : null}
        {preparation.strengthenRoleIds.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Posílit
            </p>
            <ul className="mt-1 list-inside list-disc text-foreground">
              {preparation.strengthenRoleIds.map((id) => (
                <li key={id}>{roleNameById[id] ?? id}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {preparation.downregulateRoleIds.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tlumit
            </p>
            <ul className="mt-1 list-inside list-disc text-foreground">
              {preparation.downregulateRoleIds.map((id) => (
                <li key={id}>{roleNameById[id] ?? id}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
