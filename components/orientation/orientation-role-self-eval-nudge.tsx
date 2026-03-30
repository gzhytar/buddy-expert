import { Crosshair, Heart, MinusCircle, ThumbsDown } from "lucide-react";

function rolesRemainingLabel(n: number): string {
  if (n === 1) return "1 roli";
  if (n >= 2 && n <= 4) return `${n} role`;
  return `${n} rolí`;
}

const ICON_GUIDE: { Icon: typeof Heart; text: string }[] = [
  {
    Icon: Heart,
    text: "Miluji tuto roli — rád/a v ní jsem a chci ji používat.",
  },
  {
    Icon: Crosshair,
    text: "Chci se v této roli zlepšovat — chci na ní cíleně pracovat.",
  },
  {
    Icon: ThumbsDown,
    text: "V této roli se necítím dobře — vyhýbám se jí nebo mi nevyhovuje.",
  },
  {
    Icon: MinusCircle,
    text: "Teď nechci vyjadřovat preferenci — zatím bez hodnocení.",
  },
];

export function OrientationRoleSelfEvalNudge({
  evaluatedCount,
  totalRoles,
}: {
  evaluatedCount: number;
  totalRoles: number;
}) {
  if (totalRoles === 0 || evaluatedCount >= totalRoles) return null;
  const left = totalRoles - evaluatedCount;
  return (
    <div
      role="status"
      className="rounded-lg border border-primary/20 bg-primary/[0.06] px-4 py-3 text-sm text-foreground shadow-sm dark:bg-primary/10"
    >
      <p className="font-medium">Doplňte sebeohodnocení situačních rolí</p>
      <p className="mt-1 leading-relaxed text-muted-foreground">
        U každé z {totalRoles} rolí můžete jedním klepnutím nastavit, jak k ní
        přistupujete — podpoří vědomí silných stránek i oblastí k rozvoji.
        Zbývá označit {rolesRemainingLabel(left)}.
      </p>
      <div className="mt-3 border-t border-primary/15 pt-3">
        <p
          id="role-self-eval-icon-guide"
          className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]"
        >
          Ikony u karet rolí
        </p>
        <ul
          className="mt-2 grid list-none gap-x-4 gap-y-3 p-0 sm:grid-cols-2 sm:items-start"
          aria-labelledby="role-self-eval-icon-guide"
        >
          {ICON_GUIDE.map(({ Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-2.5 text-muted-foreground"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-background/80 text-primary dark:bg-background/70"
                aria-hidden
              >
                <Icon className="size-4" strokeWidth={2} />
              </span>
              <span className="min-w-0 max-w-none text-[13px] leading-snug text-muted-foreground">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
