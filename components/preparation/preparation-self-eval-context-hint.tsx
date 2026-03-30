import Link from "next/link";

export type PreparationRoleSelfEvalSnapshot = {
  isComplete: boolean;
  focusRoleIds: string[];
  focusRoleNames: string[];
};

type Props = {
  roleSelfEval: PreparationRoleSelfEvalSnapshot;
};

/**
 * Stručný kontext sebeohodnocení rolí na krocích přípravy mimo výběr rolí.
 */
export function PreparationSelfEvalContextHint({ roleSelfEval }: Props) {
  if (!roleSelfEval.isComplete) {
    return (
      <aside
        role="note"
        className="rounded-lg border border-border/80 bg-muted/25 px-3 py-2.5 text-sm text-muted-foreground"
      >
        <span className="text-foreground/90">
          Sebeohodnocení situačních rolí v orientaci ještě není hotové.
        </span>{" "}
        Až ho doplníte, zobrazí se v kroku <strong className="text-foreground">Role</strong>{" "}
        přehledně role, ve kterých chcete růst.{" "}
        <Link
          href="/orientation/roles"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Přejít na role v orientaci
        </Link>
      </aside>
    );
  }

  if (roleSelfEval.focusRoleNames.length === 0) {
    return null;
  }

  const names = roleSelfEval.focusRoleNames;
  const preview = names.slice(0, 3).join(", ");
  const rest = names.length > 3 ? ` (+${names.length - 3})` : "";

  return (
    <aside
      role="note"
      className="rounded-lg border border-border/80 bg-muted/25 px-3 py-2.5 text-sm text-muted-foreground"
    >
      Z orientace — role k rozvoji:{" "}
      <strong className="text-foreground">{preview}</strong>
      {rest}. Celý výběr upravíte v kroku Role nebo v{" "}
      <Link
        href="/orientation/roles"
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        orientaci
      </Link>
      .
    </aside>
  );
}
