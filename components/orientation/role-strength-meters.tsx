import { cn } from "@/lib/utils";

type StrengthUnitProps = {
  label: string;
  /** Hodnota 1–5 */
  value: number;
};

function clampStrength(n: number): number {
  if (Number.isNaN(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function StrengthUnit({ label, value }: StrengthUnitProps) {
  const v = clampStrength(value);
  return (
    <div
      className="flex min-w-0 items-center gap-2"
      role="img"
      aria-label={`${label}: ${v} z pěti`}
    >
      <span className="w-[3.25rem] shrink-0 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2.5 rounded-[2px] sm:h-2 sm:w-3",
              i < v ? "bg-primary/85" : "bg-muted-foreground/18",
            )}
          />
        ))}
      </div>
    </div>
  );
}

type Props = {
  roleId: string;
  obsah: number;
  lide: number;
  delivery: number;
  className?: string;
};

/** Zobrazení „Síla role“ — obsah, lidé, delivery (1–5) podle konzultantských karet JIC. */
export function RoleStrengthMeters({
  roleId,
  obsah,
  lide,
  delivery,
  className,
}: Props) {
  return (
    <div
      className={cn("space-y-1.5", className)}
      aria-labelledby={`role-strength-heading-${roleId}`}
    >
      <p
        id={`role-strength-heading-${roleId}`}
        className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
      >
        Síla role
      </p>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
        <StrengthUnit label="Obsah" value={obsah} />
        <StrengthUnit label="Lidé" value={lide} />
        <StrengthUnit label="Delivery" value={delivery} />
      </div>
    </div>
  );
}
