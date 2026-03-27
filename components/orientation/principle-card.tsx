import type { Principle } from "@/lib/db/schema";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { cn } from "@/lib/utils";

type Props = {
  principle: Principle;
  index: number;
  className?: string;
};

const TIPS_LABEL = "Tipy a triky";
const STORIES_LABEL = "Příběhy z praxe";

/** Sjednoceno s `ConsultingRoleCard` — stejná skořápka karty a typografie */
export function OrientationPrincipleCard({ principle, index, className }: Props) {
  const alt = `Ilustrace k principu: ${principle.title}`;
  const tipsHeadingId = `${principle.id}-tips-heading`;
  const storiesHeadingId = `${principle.id}-stories-heading`;

  return (
    <article
      aria-labelledby={`principle-title-${principle.id}`}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 motion-reduce:transition-none",
        "border-l-4 border-l-primary/45",
        "hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:focus-within:ring-0 motion-reduce:focus-within:ring-offset-0",
        className,
      )}
    >
      <div className="flex flex-col">
        <header className="flex flex-row items-center justify-between gap-4 sm:gap-5 border-b border-border/60 bg-muted/10 px-4 py-3 sm:px-5 sm:py-4 dark:bg-muted/5">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3
              id={`principle-title-${principle.id}`}
              className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg"
            >
              {principle.title}
            </h3>
            {principle.summary ? (
              <p className="text-[13px] font-medium leading-snug text-foreground/80 sm:max-w-xl">
                {principle.summary}
              </p>
            ) : null}
          </div>

          <div className="w-[160px] sm:w-[180px] lg:w-[200px] shrink-0">
            <PrincipleIllustration
              src={principle.imagePath}
              alt={alt}
              variant="card"
              className="rounded-lg border-border/50 shadow-sm"
              priority={index < 2}
            />
          </div>
        </header>

        <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 lg:items-start max-w-5xl">
            <section
              className="space-y-2"
              aria-labelledby={tipsHeadingId}
              role="region"
            >
              <h4
                id={tipsHeadingId}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
              >
                {TIPS_LABEL}
              </h4>
              <p className="whitespace-pre-line text-[13px] leading-snug text-foreground/88">
                {principle.learningTips}
              </p>
            </section>

            <section
              className={cn(
                "space-y-2 rounded-xl border border-muted-foreground/15 px-3 py-3 sm:px-4 sm:py-3.5",
                "bg-muted/25 dark:bg-muted/15",
              )}
              aria-labelledby={storiesHeadingId}
              role="region"
            >
              <h4
                id={storiesHeadingId}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
              >
                {STORIES_LABEL}
              </h4>
              <p className="whitespace-pre-line text-[13px] leading-snug text-foreground/88">
                {principle.fieldStories}
              </p>
            </section>
          </div>
        </div>

        <footer className="border-t border-border/60 bg-muted/10 px-4 py-2 sm:px-5 dark:bg-muted/5">
          <p className="text-[10px] leading-snug text-muted-foreground">
            Principy konzultování JIC — referenční materiál pro reflexi.
          </p>
        </footer>
      </div>
    </article>
  );
}
