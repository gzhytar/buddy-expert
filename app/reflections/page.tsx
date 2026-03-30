import Link from "next/link";
import { listReflectionsForUser } from "@/lib/reflection/actions";
import { listWaitingPreparationsForUser } from "@/lib/preparation/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { searchParams?: Promise<{ complete?: string }> };

export default async function ReflectionsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const rows = await listReflectionsForUser();
  const waitingPreps = await listWaitingPreparationsForUser();

  return (
    <div className="space-y-8">
      {params?.complete ? (
        <Card
          className="border-primary/25 bg-muted/30 animate-step-in"
          role="status"
        >
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-base font-semibold">
              Reflexe je uložená
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Až budete připraveni na další schůzku, můžete si záměr znovu
              nastavit v přípravě — vaše poučení uvidíte tam jako připomínku
              jen pro vás.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild>
              <Link href="/preparations/new">Nová příprava</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/reflections">Zpět na seznam reflexí</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Reflexe
          </h1>
          <p className="text-muted-foreground">
            Vaše poznámky po konzultaci — viditelné pouze pro vás.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/preparations/new">Nová příprava</Link>
          </Button>
          <Button asChild>
            <Link href="/reflections/new">Nová reflexe</Link>
          </Button>
        </div>
      </header>

      {waitingPreps.length > 0 ? (
        <section className="space-y-3" aria-labelledby="waiting-prep-heading">
          <h2
            id="waiting-prep-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Čekající přípravy
          </h2>
          <p className="text-sm text-muted-foreground">
            Přípravy bez navázané reflexe — zahajte reflexi a porovnejte záměr s
            realitou.
          </p>
          <ul className="space-y-2">
            {waitingPreps.map((p) => (
              <li key={p.id}>
                <Card className="border-primary/20">
                  <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 py-4">
                    <div className="min-w-0">
                      <CardTitle className="text-base font-medium">
                        {p.consultationLabel?.trim() || "Nepojmenovaná příprava"}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Upraveno{" "}
                        {new Date(p.updatedAt).toLocaleString("cs-CZ", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link
                        href={`/reflections/new?preparationId=${encodeURIComponent(p.id)}`}
                      >
                        Reflexe z přípravy
                      </Link>
                    </Button>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zatím žádné reflexe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Začněte krátkou reflexí konzultace, kterou jste právě dokončili. Při psaní si můžete v novém panelu otevřít{" "}
              <Link
                href="/orientation/principles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Konzultantské desatero
              </Link>{" "}
              nebo{" "}
              <Link
                href="/orientation/roles"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                role
              </Link>.
            </p>
            <Button asChild>
              <Link href="/reflections/new">Vytvořit první reflexi</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/reflections/${r.id}`}
                className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium">
                        {r.consultationLabel?.trim() || "Nepojmenovaná konzultace"}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {r.status === "complete" ? (
                          <>
                            Dokončeno{" "}
                            {new Date(r.updatedAt).toLocaleString("cs-CZ", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </>
                        ) : (
                          <>
                            Upraveno{" "}
                            {new Date(r.updatedAt).toLocaleString("cs-CZ", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </>
                        )}
                        {" · "}
                        <span className="capitalize">
                          {r.status === "draft" ? "rozpracováno" : "dokončeno"}
                        </span>
                        {r.occurredAt?.trim() ? (
                          <>
                            {" · "}
                            Konzultace{" "}
                            {new Date(r.occurredAt).toLocaleString("cs-CZ", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
