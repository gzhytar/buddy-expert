"use client";

import { Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ConsultingRole } from "@/lib/db/schema";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { roleSummaryForList } from "@/lib/consulting-roles/card-content";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Calibration = "underused" | "balanced" | "overused";

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
};

export type RoleSelectorProps = ReflectionProps | PreparationProps;

const spring = { type: "spring" as const, stiffness: 420, damping: 28 };

function RoleRowShell({
  children,
  reducedMotion,
  className,
}: {
  children: React.ReactNode;
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
                {[
                  { value: "underused" as const, label: "podhodnocená" },
                  { value: "balanced" as const, label: "vyvážená" },
                  { value: "overused" as const, label: "přehřátá" },
                ].map((opt) => (
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

export function RoleSelector(props: RoleSelectorProps) {
  const reducedMotion = useReducedMotion() ?? false;

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
