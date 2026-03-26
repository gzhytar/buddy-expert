import type { Principle } from "@/lib/db/schema";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  principle: Principle;
  index: number;
  className?: string;
};

const TIPS_LABEL = "Tipy a triky";
const STORIES_LABEL = "Příběhy z praxe";

export function OrientationPrincipleCard({ principle, index, className }: Props) {
  const alt = `Ilustrace k principu: ${principle.title}`;
  const tipsHeadingId = `${principle.id}-tips-heading`;
  const storiesHeadingId = `${principle.id}-stories-heading`;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow duration-200 motion-reduce:transition-none hover:shadow-md",
        className,
      )}
    >
      <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch">
        <div className="sm:w-[min(42%,280px)] sm:shrink-0 sm:border-r sm:border-border/70 sm:bg-muted/10">
          <PrincipleIllustration
            src={principle.imagePath}
            alt={alt}
            variant="sidebar"
            className="rounded-none border-0 shadow-none"
            priority={index < 2}
          />
        </div>
        <div className="min-w-0 flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold leading-snug sm:text-lg">
              <span className="font-mono text-sm font-normal text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground"> · </span>
              {principle.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {principle.summary}
            </p>
            <div className="space-y-5 border-t border-border/70 pt-5">
              <section
                className="space-y-2"
                aria-labelledby={tipsHeadingId}
                role="region"
              >
                <h3
                  id={tipsHeadingId}
                  className="text-sm font-semibold leading-snug text-foreground"
                >
                  {TIPS_LABEL}
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {principle.learningTips}
                </p>
              </section>
              <section
                className="space-y-2"
                aria-labelledby={storiesHeadingId}
                role="region"
              >
                <h3
                  id={storiesHeadingId}
                  className="text-sm font-semibold leading-snug text-foreground"
                >
                  {STORIES_LABEL}
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {principle.fieldStories}
                </p>
              </section>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
