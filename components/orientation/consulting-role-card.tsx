import type { ConsultingRole, RoleSelfEvalSentiment } from "@/lib/db/schema";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import { parseBulletList, phaseLeftBorderClass } from "@/lib/consulting-roles/card-content";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { RoleSelfEvalControls } from "@/components/orientation/role-self-eval-controls";
import { RoleStrengthMeters } from "@/components/orientation/role-strength-meters";
import { cn } from "@/lib/utils";

type Props = {
  role: ConsultingRole;
  className?: string;
  /** Nízké indexy = eager load ilustrace na první kartě ve fázi */
  illustrationPriority?: boolean;
  /** Zobrazit sebeohodnocení role (přihlášený expert). */
  showSelfEval?: boolean;
  initialSelfEvalSentiment?: RoleSelfEvalSentiment | null;
};

export function ConsultingRoleCard({
  role,
  className,
  illustrationPriority = false,
  showSelfEval = false,
  initialSelfEvalSentiment = null,
}: Props) {
  const useful = parseBulletList(role.usefulBullets);
  const risks = parseBulletList(role.riskBullets);

  const hasDetailBlocks = useful.length > 0 || risks.length > 0;

  return (
    <article
      aria-labelledby={`role-title-${role.id}`}
      aria-describedby={
        role.summaryLine || role.whatItDoes
          ? `role-desc-${role.id}`
          : undefined
      }
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
        {/* HEADER AREA — ilustrace jako hero pozadí */}
        <header className="relative isolate min-h-[168px] overflow-hidden border-b border-border/60 sm:min-h-[188px]">
          <div className="absolute inset-0" aria-hidden>
            <PrincipleIllustration
              src={role.imagePath}
              alt=""
              variant="hero"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="h-full min-h-[168px] w-full sm:min-h-[188px]"
              priority={illustrationPriority}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/52 via-transparent to-background/22 dark:from-background/58 dark:to-background/20" aria-hidden />
          <div className="relative z-[1] space-y-2 px-4 py-3 sm:px-5 sm:py-4">
            <div className="space-y-1.5">
              <h3
                id={`role-title-${role.id}`}
                className="font-display text-base font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-lg"
              >
                {role.name}
              </h3>
              {role.summaryLine || role.whatItDoes ? (
                <div
                  id={`role-desc-${role.id}`}
                  className="max-w-2xl space-y-1.5"
                >
                  {role.summaryLine ? (
                    <p className="text-[13px] font-medium leading-snug text-foreground/90">
                      {role.summaryLine}
                    </p>
                  ) : null}
                  {role.whatItDoes ? (
                    <p className="text-[13px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      <span className="font-medium text-foreground/80">
                        Co role dělá:{" "}
                      </span>
                      {role.whatItDoes}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <RoleStrengthMeters
              roleId={role.id}
              obsah={role.strengthObsah}
              lide={role.strengthLide}
              delivery={role.strengthDelivery}
            />
          </div>
        </header>

        {/* CONTENT AREA — užitečné projevy / rizika */}
        {hasDetailBlocks ? (
          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 lg:items-start max-w-5xl">
              {useful.length > 0 ? (
                <section
                  aria-labelledby={`useful-${role.id}`}
                  className={cn(
                    "space-y-2 rounded-xl border border-emerald-500/20 px-3 py-3 sm:px-4 sm:py-3.5",
                    "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]",
                  )}
                >
                  <h4
                    id={`useful-${role.id}`}
                    className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/85 dark:text-emerald-200/95 sm:text-[11px]"
                  >
                    Užitečné projevy
                  </h4>
                  <ul className="list-outside list-disc space-y-1 pl-4 text-[13px] leading-snug text-emerald-950/88 dark:text-emerald-50/88 marker:text-emerald-500/60 dark:marker:text-emerald-400/60">
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
          </div>
        ) : null}

        {showSelfEval ? (
          <RoleSelfEvalControls
            key={`${role.id}-${initialSelfEvalSentiment ?? "pending"}`}
            roleId={role.id}
            initialSentiment={initialSelfEvalSentiment}
          />
        ) : null}

        <footer className="border-t border-border/60 bg-muted/10 px-4 py-2 sm:px-5 dark:bg-muted/5">
          <p className="text-[10px] leading-snug text-muted-foreground">
            Konzultantské karty JIC — pracovní verze (Beáta Holá, Martin Dokoupil).
          </p>
        </footer>
      </div>
    </article>
  );
}
