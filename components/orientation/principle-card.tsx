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

/** Sjednoceno s `ConsultingRoleCard` — stejná skořápka karty, hero hlavička a typografie */
export function OrientationPrincipleCard({ principle, index, className }: Props) {
  const tipsHeadingId = `${principle.id}-tips-heading`;
  const storiesHeadingId = `${principle.id}-stories-heading`;

  return (
    <article
      aria-labelledby={`principle-title-${principle.id}`}
      aria-describedby={
        principle.summary ? `principle-desc-${principle.id}` : undefined
      }
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 motion-reduce:transition-none",
        "border-l-4 border-l-primary/45",
        "hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:focus-within:ring-0 motion-reduce:focus-within:ring-offset-0",
        className,
      )}
    >
      <div className="flex flex-col">
        <header className="relative isolate min-h-[168px] overflow-hidden border-b border-border/60 sm:min-h-[188px]">
          <div className="absolute inset-0" aria-hidden>
            <PrincipleIllustration
              src={principle.imagePath}
              alt=""
              variant="hero"
              className="h-full min-h-[168px] w-full sm:min-h-[188px]"
              priority={index < 2}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-black/10 dark:bg-black/17"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background from-[22%] via-background/93 via-[40%] to-background/78 dark:via-background/95 dark:to-background/82"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-background/54 to-transparent to-[48%] dark:from-background/62"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/52 via-transparent to-background/22 dark:from-background/58 dark:to-background/20"
            aria-hidden
          />
          <div className="relative z-[1] space-y-2 px-4 py-3 sm:px-5 sm:py-4">
            <div className="space-y-1.5">
              <h3
                id={`principle-title-${principle.id}`}
                className="font-display text-base font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-lg"
              >
                {principle.title}
              </h3>
              {principle.summary ? (
                <p
                  id={`principle-desc-${principle.id}`}
                  className="max-w-2xl text-[13px] font-medium leading-snug text-foreground/90"
                >
                  {principle.summary}
                </p>
              ) : null}
            </div>
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
            Konzultantské desatero JIC - pracovní verze (Martin Dokoupil).
          </p>
        </footer>
      </div>
    </article>
  );
}
