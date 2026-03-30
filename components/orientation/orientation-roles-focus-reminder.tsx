export function OrientationRolesFocusReminder({
  focusRoleNames,
}: {
  focusRoleNames: string[];
}) {
  if (focusRoleNames.length === 0) {
    return (
      <div
        role="note"
        className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
      >
        <p className="font-medium text-foreground">Vaše rozvojové zaměření</p>
        <p className="mt-1 leading-relaxed">
          Zatím nemáte označenou žádnou roli, na které byste chtěli{" "}
          <span className="text-foreground">záměrně pracovat</span>. Kdykoli
          můžete u karty role zvolit ikonu zaměření (crosshair).
        </p>
      </div>
    );
  }

  return (
    <div
      role="note"
      className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm"
    >
      <p className="font-medium text-foreground">Role ve kterých se chcete rozvíjet</p>
      <ul className="mt-2 list-inside list-disc space-y-0.5 text-muted-foreground marker:text-primary/70">
        {focusRoleNames.map((name) => (
          <li key={name} className="text-foreground/90">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
