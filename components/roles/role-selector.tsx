"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ConsultingRole } from "@/lib/db/schema";
import { ROLE_IMAGE_MISSING_HINT } from "@/lib/data/role-images";
import type { RolePhaseGroup } from "@/lib/queries/orientation-types";
import { PrincipleIllustration } from "@/components/principles/principle-illustration";
import { roleSummaryForList } from "@/lib/consulting-roles/card-content";
import { Checkbox } from "@/components/ui/checkbox";
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
      const checked = props.selectedRoleIds.includes(r.id);
      const roleBlurb = roleSummaryForList(r);
      return (
        <RoleRowShell key={r.id} reducedMotion={reducedMotion}>
          <div className="flex items-start gap-3">
            <Checkbox
              id={`r-${r.id}`}
              checked={checked}
              onCheckedChange={(v) => props.onToggleRole(r.id, v === true)}
              aria-labelledby={`r-label-${r.id}`}
            />
            <PrincipleIllustration
              src={r.imagePath}
              alt={`Ilustrace k roli: ${r.name}`}
              variant="inline"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="rounded-md border-0 shadow-none"
            />
            <div className="min-w-0 flex-1">
              <Label
                id={`r-label-${r.id}`}
                htmlFor={`r-${r.id}`}
                className="cursor-pointer font-medium"
              >
                {r.name}
              </Label>
              {roleBlurb ? (
                <p className="mt-1 text-sm text-muted-foreground">{roleBlurb}</p>
              ) : null}
            </div>
          </div>
          {checked ? (
            <motion.div
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
              className="mt-3 border-t border-border/60 pt-3"
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
    const selected = polarity != null;
    const roleBlurb = roleSummaryForList(r);
    return (
      <RoleRowShell key={r.id} reducedMotion={reducedMotion}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Checkbox
              id={`prep-r-${r.id}`}
              checked={selected}
              onCheckedChange={(v) =>
                props.onSetPolarity(r.id, v === true ? "strengthen" : null)
              }
              aria-labelledby={`prep-r-label-${r.id}`}
            />
            <PrincipleIllustration
              src={r.imagePath}
              alt={`Ilustrace k roli: ${r.name}`}
              variant="inline"
              missingFileHint={ROLE_IMAGE_MISSING_HINT}
              className="rounded-md border-0 shadow-none"
            />
            <div className="min-w-0">
              <Label
                id={`prep-r-label-${r.id}`}
                htmlFor={`prep-r-${r.id}`}
                className="cursor-pointer font-medium"
              >
                {r.name}
              </Label>
              {roleBlurb ? (
                <p className="mt-1 text-sm text-muted-foreground">{roleBlurb}</p>
              ) : null}
            </div>
          </div>
          {selected ? (
            <motion.div
              layout={!reducedMotion}
              className="flex shrink-0 flex-wrap gap-2"
              role="group"
              aria-label={`Priorita role ${r.name}`}
            >
              <Button
                type="button"
                size="sm"
                variant={polarity === "strengthen" ? "default" : "outline"}
                className="min-h-9"
                aria-pressed={polarity === "strengthen"}
                aria-label={`Posílit roli ${r.name}`}
                onClick={() => props.onSetPolarity(r.id, "strengthen")}
              >
                Posílit
              </Button>
              <Button
                type="button"
                size="sm"
                variant={polarity === "downregulate" ? "secondary" : "outline"}
                className="min-h-9"
                aria-pressed={polarity === "downregulate"}
                aria-label={`Tlumit roli ${r.name}`}
                onClick={() => props.onSetPolarity(r.id, "downregulate")}
              >
                Tlumit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="min-h-9 text-muted-foreground"
                aria-label={`Zrušit výběr role ${r.name}`}
                onClick={() => props.onSetPolarity(r.id, null)}
              >
                Zrušit
              </Button>
            </motion.div>
          ) : null}
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
          <ul className="space-y-3">
            {renderRoleRows(g.roles, props, reducedMotion)}
          </ul>
        </div>
      ))}
    </div>
  );
}
