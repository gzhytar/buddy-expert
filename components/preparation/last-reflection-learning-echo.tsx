import type { ReflectionLearningEcho } from "@/lib/reflection/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { echo: ReflectionLearningEcho };

export function LastReflectionLearningEcho({ echo }: Props) {
  const dateLabel = new Date(echo.completedAt).toLocaleString("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card className="border-primary/20 bg-muted/15">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base font-semibold">
          Vaše poslední poučení z reflexe
        </CardTitle>
        <p className="text-xs font-normal text-muted-foreground">
          Jen pro vás — připomeňte si, co vám z minulé konzultace zůstalo. Není to
          hodnocení ani úkol.
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="sr-only">Dokončeno </span>
          {dateLabel}
          {echo.consultationLabel?.trim() ? (
            <>
              {" · "}
              <span className="text-foreground/90">
                {echo.consultationLabel.trim()}
              </span>
            </>
          ) : null}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {echo.learningNote}
        </p>
      </CardContent>
    </Card>
  );
}
