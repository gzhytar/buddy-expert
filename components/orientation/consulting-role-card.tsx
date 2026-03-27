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

  const hasDetailBlocks = useful.length > 0 || risks.length > 0;

  return (
    <article
      aria-labelledby={`role-title-${role.id}`}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 motion-reduce:transition-none",
        "border-l-4",
        "hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:focus-within:ring-0 motion-reduce:focus-within:ring-offset-0",
        phaseLeftBorderClass(role.phaseKey),
        className,
      )}
    >
      <div className="flex flex-col">
        {/* HEADER AREA */}
        <header className="flex flex-row items-center justify-between gap-4 sm:gap-5 border-b border-border/60 bg-muted/10 px-4 py-3 sm:px-5 sm:py-4 dark:bg-muted/5">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3
              id={`role-title-${role.id}`}
              className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg"
            >
              {role.name}
            </h3>
            {role.summaryLine ? (
              <p className="text-[13px] font-medium leading-snug text-foreground/80 sm:max-w-xl">
                {role.summaryLine}
              </p>
            ) : null}
          </div>

          {/* IMAGE */}
          <div className="w-[160px] sm:w-[180px] lg:w-[200px] shrink-0">
            <PrincipleIllustration
              src={role.imagePath}
              alt={alt}
              variant="card"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="rounded-lg border-border/50 shadow-sm"
              priority={illustrationPriority}
            />
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
          {role.whatItDoes ? (
            <section aria-labelledby={`what-${role.id}`} className="space-y-1.5 max-w-4xl">
              <h4
                id={`what-${role.id}`}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
              >
                Co role dělá
              </h4>
              <p className="text-[13px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {role.whatItDoes}
              </p>
            </section>
          ) : null}

          {hasDetailBlocks ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 lg:items-start max-w-5xl">
              {useful.length > 0 ? (
                <section
                  aria-labelledby={`useful-${role.id}`}
                  className="space-y-2"
                >
                  <h4
                    id={`useful-${role.id}`}
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
                  >
                    Užitečné projevy
                  </h4>
                  <ul className="list-outside list-disc space-y-1 pl-4 text-[13px] leading-snug text-foreground/88 marker:text-primary/70">
                    {useful.map((line) => (
                      <li key={line} className="pl-0.5">
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {risks.length > 0 ? (
                <section
                  aria-labelledby={`risks-${role.id}`}
                  className={cn(
                    "space-y-2 rounded-xl border border-amber-500/20 px-3 py-3 sm:px-4 sm:py-3.5",
                    "bg-amber-500/[0.04] dark:bg-amber-500/[0.08]",
                  )}
                >
                  <h4
                    id={`risks-${role.id}`}
                    className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/85 dark:text-amber-200/95 sm:text-[11px]"
                  >
                    Rizika při přepálení
                  </h4>
                  <ul className="list-outside list-disc space-y-1 pl-4 text-[13px] leading-snug text-amber-950/88 dark:text-amber-50/88 marker:text-amber-500/60 dark:marker:text-amber-400/60">
                    {risks.map((line) => (
                      <li key={line} className="pl-0.5">
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className="border-t border-border/60 bg-muted/10 px-4 py-2 sm:px-5 dark:bg-muted/5">
          <p className="text-[10px] leading-snug text-muted-foreground">
            Konzultantské karty JIC — pracovní verze (líc / rub). Síla role: obsah,
            lidé, delivery.
          </p>
        </footer>
      </div>
    </article>
  );
}
