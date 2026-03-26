import type { ConsultingRole } from "@/lib/db/schema";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import { parseBulletList, phaseLeftBorderClass } from "@/lib/consulting-roles/card-content";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { cn } from "@/lib/utils";

type Props = {
  role: ConsultingRole;
  className?: string;
  /** Nízké indexy = eager load ilustrace na první kartě ve fázi */
  illustrationPriority?: boolean;
};

export function ConsultingRoleCard({
  role,
  className,
  illustrationPriority = false,
}: Props) {
  const useful = parseBulletList(role.usefulBullets);
  const risks = parseBulletList(role.riskBullets);
  const alt = `Ilustrace k roli: ${role.name}`;

  return (
    <article
      aria-labelledby={`role-title-${role.id}`}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 motion-reduce:transition-none",
        "border-l-4",
        phaseLeftBorderClass(role.phaseKey),
        className,
      )}
    >
      <div className="flex flex-col gap-0 sm:flex-row sm:items-stretch">
        <div className="sm:w-[min(42%,280px)] sm:shrink-0 sm:border-r sm:border-border/70 sm:bg-muted/10">
          <PrincipleIllustration
            src={role.imagePath}
            alt={alt}
            variant="sidebar"
            missingFileHint={ROLE_IMAGE_MISSING_HINT}
            className="rounded-none border-0 shadow-none"
            priority={illustrationPriority}
          />
        </div>
        <div className="min-w-0 flex-1">
          <header className="border-b border-border/70 bg-muted/25 px-5 py-4 dark:bg-muted/15">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {role.cardCode ? (
                  <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-foreground shadow-sm">
                    {role.cardCode}
                  </span>
                ) : null}
                {role.cardIndex != null ? (
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {String(role.cardIndex).padStart(2, "0")}/16
                  </span>
                ) : null}
              </div>
              <h3
                id={`role-title-${role.id}`}
                className="font-display text-lg font-semibold tracking-tight text-foreground"
              >
                {role.name}
              </h3>
              {role.summaryLine ? (
                <p className="text-sm font-medium leading-relaxed text-foreground/90">
                  {role.summaryLine}
                </p>
              ) : null}
            </div>
          </header>

          <div className="space-y-5 px-5 py-5">
            {role.whatItDoes ? (
              <section aria-labelledby={`what-${role.id}`} className="space-y-2">
                <h4
                  id={`what-${role.id}`}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Co role dělá
                </h4>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {role.whatItDoes}
                </p>
              </section>
            ) : null}

            {useful.length > 0 ? (
              <section aria-labelledby={`useful-${role.id}`} className="space-y-2">
                <h4
                  id={`useful-${role.id}`}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Užitečné projevy
                </h4>
                <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-foreground/88 marker:text-primary">
                  {useful.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {risks.length > 0 ? (
              <section
                aria-labelledby={`risks-${role.id}`}
                className={cn(
                  "space-y-2 rounded-lg border border-amber-500/30 px-4 py-3",
                  "bg-amber-500/[0.07] dark:bg-amber-500/[0.1]",
                )}
              >
                <h4
                  id={`risks-${role.id}`}
                  className="text-xs font-semibold uppercase tracking-wider text-amber-900/85 dark:text-amber-200/95"
                >
                  Rizika při přepálení
                </h4>
                <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-amber-950/88 dark:text-amber-50/88 marker:text-amber-600 dark:marker:text-amber-400">
                  {risks.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <footer className="border-t border-border/60 bg-muted/10 px-5 py-2.5 dark:bg-muted/5">
            <p className="text-[11px] leading-snug text-muted-foreground">
              Konzultantské karty JIC — pracovní verze (líc / rub). Síla role: obsah,
              lidé, delivery.
            </p>
          </footer>
        </div>
      </div>
    </article>
  );
}
