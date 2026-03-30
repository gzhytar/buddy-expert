"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { roleSummaryForList } from "@/lib/consulting-roles/card-content";
import type { ConsultingRole } from "@/lib/db/schema";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import { cn } from "@/lib/utils";

type Calibration = "underused" | "balanced" | "overused";

const REFLECTION_CALIBRATION_OPTIONS: readonly {
  value: Calibration;
  label: string;
}[] = [
  { value: "underused", label: "podhodnocená" },
  { value: "balanced", label: "vyvážená" },
  { value: "overused", label: "přehřátá" },
];

type ReflectionProps = {
  mode: "reflection";
  roleGroups: RolePhaseGroup[];
  selectedRoleIds: string[];
  calibrationByRole: Record<string, Calibration>;
  onToggleRole: (id: string, checked: boolean) => void;
  onSetCalibration: (roleId: string, value: Calibration) => void;
};

type PreparationProps = {
  mode: "preparation";
  roleGroups: RolePhaseGroup[];
  /** Vybraná polarita pro roli; chybí = role není vybraná */
  polarityByRole: Record<string, "strengthen" | "downregulate">;
  onSetPolarity: (
    roleId: string,
    polarity: "strengthen" | "downregulate" | null,
  ) => void;
  /** Dokončené sebeohodnocení + neprázdné → dvě sekce (zaměření / ostatní). */
  focusPartition?: { focusRoleIds: string[] };
};

export type RoleSelectorProps = ReflectionProps | PreparationProps;

const spring = { type: "spring" as const, stiffness: 420, damping: 28 };

function splitGroupsByFocus(
  groups: RolePhaseGroup[],
  focusIds: Set<string>,
): { focus: RolePhaseGroup[]; other: RolePhaseGroup[] } {
  const focus: RolePhaseGroup[] = [];
  const other: RolePhaseGroup[] = [];
  for (const g of groups) {
    const fr = g.roles.filter((r) => focusIds.has(r.id));
    const or = g.roles.filter((r) => !focusIds.has(r.id));
    if (fr.length > 0) {
      focus.push({ ...g, roles: fr });
    }
    if (or.length > 0) {
      other.push({ ...g, roles: or });
    }
  }
  return { focus, other };
}

function renderPreparationGroups(
  groups: RolePhaseGroup[],
  props: PreparationProps,
  reducedMotion: boolean,
) {
  const nonEmpty = groups.filter((g) => g.roles.length > 0);
  if (nonEmpty.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">
        V této části zatím nejsou žádné role.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      {nonEmpty.map((g) => (
        <div key={g.phaseKey} className="space-y-3">
          <h2 className="font-display text-lg font-semibold">{g.phaseLabel}</h2>
          <ul className="list-none space-y-3 p-0">
            {renderRoleRows(g.roles, props, reducedMotion)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function RoleRowShell({
  children,
  reducedMotion,
  className,
}: {
  children: ReactNode;
  reducedMotion: boolean;
  className?: string;
}) {
  return (
    <motion.li
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : spring}
      className={cn(
        "rounded-md border border-border/80 bg-card p-3",
        className,
      )}
    >
      {children}
    </motion.li>
  );
}

function renderRoleRows(
  roles: ConsultingRole[],
  props: RoleSelectorProps,
  reducedMotion: boolean,
) {
  if (props.mode === "reflection") {
    return roles.map((r) => {
      const selected = props.selectedRoleIds.includes(r.id);
      const roleBlurb = roleSummaryForList(r);
      const labelId = `r-label-${r.id}`;
      return (
        <RoleRowShell
          key={r.id}
          reducedMotion={reducedMotion}
          className={cn(
            "overflow-hidden rounded-xl p-0 transition-colors motion-reduce:transition-none",
            selected
              ? "border-primary bg-primary/[0.08] shadow-sm ring-1 ring-primary/25 dark:bg-primary/[0.12]"
              : "border-border/80 bg-card hover:border-border hover:bg-muted/35 active:bg-muted/50",
          )}
        >
          <button
            type="button"
            onClick={() => props.onToggleRole(r.id, !selected)}
            aria-pressed={selected}
            aria-labelledby={labelId}
            className={cn(
              "flex w-full items-start gap-3 p-3 text-left transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:focus-visible:ring-0 motion-reduce:focus-visible:ring-offset-0",
            )}
          >
            <PrincipleIllustration
              src={r.imagePath}
              alt=""
              variant="inline"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="shrink-0 rounded-md border-0 shadow-none opacity-95"
            />
            <div className="min-w-0 flex-1">
              <span id={labelId} className="font-medium text-foreground">
                {r.name}
              </span>
              {roleBlurb ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {roleBlurb}
                </p>
              ) : null}
            </div>
          </button>
          {selected ? (
            <motion.div
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
              className="border-t border-border/60 px-3 pb-3 pt-3 dark:border-border/50"
            >
              <Label className="text-xs text-muted-foreground">Kalibrace</Label>
              <RadioGroup
                className="mt-2 flex flex-wrap gap-4"
                value={props.calibrationByRole[r.id] ?? "balanced"}
                onValueChange={(v) =>
                  props.onSetCalibration(r.id, v as Calibration)
                }
              >
                {REFLECTION_CALIBRATION_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`${r.id}-${opt.value}`}
                    />
                    <Label
                      htmlFor={`${r.id}-${opt.value}`}
                      className="cursor-pointer font-normal"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          ) : null}
        </RoleRowShell>
      );
    });
  }

  return roles.map((r) => {
    const polarity = props.polarityByRole[r.id];
    const roleBlurb = roleSummaryForList(r);

    return (
      <RoleRowShell
        key={r.id}
        reducedMotion={reducedMotion}
        className={cn(
          "transition-colors duration-200",
          polarity === "strengthen" && "border-primary/40 bg-primary/[0.02]",
          polarity === "downregulate" && "border-secondary-foreground/30 bg-secondary/20"
        )}
      >
        <div className="flex flex-row items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <PrincipleIllustration
              src={r.imagePath}
              alt={`Ilustrace k roli: ${r.name}`}
              variant="inline"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="rounded-md border-0 shadow-none opacity-90"
            />
            <div className="min-w-0 pr-1">
              <span
                id={`prep-r-label-${r.id}`}
                className="font-medium text-foreground"
              >
                {r.name}
              </span>
              {roleBlurb ? (
                <p className="mt-0.5 text-[13px] text-muted-foreground leading-snug">
                  {roleBlurb}
                </p>
              ) : null}
            </div>
          </div>

          <div
            className="flex shrink-0 flex-col items-end gap-0.5 rounded-lg border border-border/80 bg-muted/30 p-1"
            role="group"
            aria-label={`Priorita role ${r.name}`}
          >
            <Button
              type="button"
              size="sm"
              variant={polarity === "strengthen" ? "default" : "ghost"}
              className={cn(
                "h-7 w-min min-w-0 justify-center gap-1 px-2 text-xs font-medium transition-all",
                polarity !== "strengthen" &&
                  "text-muted-foreground hover:bg-background hover:text-foreground",
              )}
              aria-pressed={polarity === "strengthen"}
              onClick={() =>
                props.onSetPolarity(
                  r.id,
                  polarity === "strengthen" ? null : "strengthen",
                )
              }
            >
              <Plus className="size-3.5 shrink-0" aria-hidden />
              Posílit
            </Button>
            <Button
              type="button"
              size="sm"
              variant={polarity === "downregulate" ? "secondary" : "ghost"}
              className={cn(
                "h-7 w-min min-w-0 justify-center gap-1 px-2 text-xs font-medium transition-all",
                polarity !== "downregulate" &&
                  "text-muted-foreground hover:bg-background hover:text-foreground",
                polarity === "downregulate" &&
                  "bg-secondary text-secondary-foreground shadow-sm",
              )}
              aria-pressed={polarity === "downregulate"}
              onClick={() =>
                props.onSetPolarity(
                  r.id,
                  polarity === "downregulate" ? null : "downregulate",
                )
              }
            >
              <Minus className="size-3.5 shrink-0" aria-hidden />
              Tlumit
            </Button>
          </div>
        </div>
      </RoleRowShell>
    );
  });
}

const detailsShell =
  "rounded-xl border border-border/80 bg-card/40 shadow-sm [&[open]>summary_.prep-chevron]:rotate-180";
const summaryShell =
  "flex cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 font-display text-lg font-semibold tracking-tight text-foreground outline-none transition-colors duration-200 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:focus-visible:ring-0 motion-reduce:focus-visible:ring-offset-0 [&::-webkit-details-marker]:hidden";
const chevronClassName =
  "prep-chevron size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none";

function PreparationPhaseDetails({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className={detailsShell}>
      <summary className={summaryShell}>
        <ChevronDown className={chevronClassName} aria-hidden />
        <span>{title}</span>
        {subtitle ? (
          <span className="font-sans text-xs font-normal text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </summary>
      <div className="border-t border-border/60 px-2 pb-4 pt-2 sm:px-3">
        {children}
      </div>
    </details>
  );
}

export function RoleSelector(props: RoleSelectorProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (
    props.mode === "preparation" &&
    props.focusPartition &&
    props.focusPartition.focusRoleIds.length > 0
  ) {
    const focusSet = new Set(props.focusPartition.focusRoleIds);
    const { focus, other } = splitGroupsByFocus(props.roleGroups, focusSet);
    const hasOther = other.some((g) => g.roles.length > 0);

    return (
      <div className="space-y-5">
        <PreparationPhaseDetails
          defaultOpen
          title="Role, ve kterých chcete růst"
          subtitle="(z orientace)"
        >
          {renderPreparationGroups(focus, props, reducedMotion)}
        </PreparationPhaseDetails>

        {hasOther ? (
          <PreparationPhaseDetails title="Ostatní situační role">
            {renderPreparationGroups(other, props, reducedMotion)}
          </PreparationPhaseDetails>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {props.roleGroups.map((g) => (
        <div key={g.phaseKey} className="space-y-3">
          <h2 className="font-display text-lg font-semibold">{g.phaseLabel}</h2>
          <ul className="list-none space-y-3 p-0">
            {renderRoleRows(g.roles, props, reducedMotion)}
          </ul>
        </div>
      ))}
    </div>
  );
}
