import Link from "next/link";
import { RecordDeleteButton } from "@/components/records/record-delete-button";
import {
  deletePreparation,
  listAllPreparationsForUser,
  listWaitingPreparationsForUser,
} from "@/lib/preparation/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { searchParams?: Promise<{ saved?: string }> };

function formatCsDate(iso: string) {
  return new Date(iso).toLocaleString("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function preparationDisplayLabel(
  consultationLabel: string | null | undefined,
): string {
  return consultationLabel?.trim() || "Nepojmenovaná příprava";
}

function preparationDeleteDescription(
  label: string,
  section: "waiting" | "all",
): string {
  if (section === "waiting") {
    return `Záznam „${label}“ bude trvale odstraněn včetně rolí a záměru. Pokud k němu vede navázaná reflexe, z reflexe zmizí jen odkaz na přípravu — samotná reflexe zůstane.`;
  }
  return `Záznam „${label}“ bude trvale odstraněn. Navázaná reflexe (pokud existuje) ztratí jen odkaz na tuto přípravu.`;
}

export default async function PreparationsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const all = await listAllPreparationsForUser();
  const waiting = await listWaitingPreparationsForUser();

  return (
    <div className="space-y-8">
      {params?.saved ? (
        <p
          className="rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-foreground animate-step-in"
          role="status"
        >
          Příprava byla uložena. Po schůzce můžete z ní založit reflexi a porovnat
          záměr s realitou.
        </p>
      ) : null}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Přípravy
          </h1>
          <p className="text-muted-foreground">
            Historie vašich příprav před konzultacemi — rozpracované i dokončené.
            Sekce níže zvýrazní přípravy, ke kterým ještě nemáte reflexi.
          </p>
        </div>
        <Button asChild>
          <Link href="/preparations/new">Nová příprava</Link>
        </Button>
      </header>

      {waiting.length > 0 ? (
        <section className="space-y-3" aria-labelledby="waiting-preparations">
          <h2
            id="waiting-preparations"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Čekají na reflexi
          </h2>
          <p className="text-sm text-muted-foreground">
            Dokončená nebo rozpracovaná příprava bez navázané reflexe — po schůzce
            založte reflexi a porovnejte záměr s realitou.
          </p>
          <ul className="space-y-3">
            {waiting.map((p) => {
              const label = preparationDisplayLabel(p.consultationLabel);
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between"
                >
                  <Link
                    href={`/preparations/${p.id}`}
                    className="block min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card className="h-full border-primary/20 transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                      <CardHeader className="space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">
                          {label}
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Aktualizováno {formatCsDate(p.updatedAt)}
                          {" · "}
                          <span className="capitalize">
                            {p.status === "draft" ? "rozpracováno" : "dokončeno"}
                          </span>
                          {p.occurredAt?.trim() ? (
                            <>
                              {" · "}
                              Schůzka {formatCsDate(p.occurredAt)}
                            </>
                          ) : null}
                        </p>
                      </CardHeader>
                    </Card>
                  </Link>
                  <div className="flex shrink-0 flex-col gap-2 self-start sm:self-center sm:justify-center">
                    <RecordDeleteButton
                      recordId={p.id}
                      deleteAction={deletePreparation}
                      title="Smazat přípravu?"
                      description={preparationDeleteDescription(label, "waiting")}
                      confirmLabel="Smazat přípravu"
                    />
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <Link
                        href={`/reflections/new?preparationId=${encodeURIComponent(p.id)}`}
                      >
                        Zahájit reflexi
                      </Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3" aria-labelledby="all-preparations">
        <h2
          id="all-preparations"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Všechny přípravy
        </h2>
        {all.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zatím žádné přípravy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vytvořte přípravu před schůzkou — role k posílení a tlumení a
                krátký záměr. Po konzultaci z ní snadno založíte reflexi.
              </p>
              <Button asChild>
                <Link href="/preparations/new">Vytvořit přípravu</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {all.map((p) => {
              const label = preparationDisplayLabel(p.consultationLabel);
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3"
                >
                  <Link
                    href={`/preparations/${p.id}`}
                    className="block min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card className="h-full transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                      <CardHeader className="space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">
                          {label}
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Aktualizováno {formatCsDate(p.updatedAt)}
                          {" · "}
                          <span className="capitalize">
                            {p.status === "draft" ? "rozpracováno" : "dokončeno"}
                          </span>
                          {p.hasLinkedReflection ? (
                            <span> · Reflexe založena</span>
                          ) : (
                            <span> · Bez reflexe</span>
                          )}
                          {p.occurredAt?.trim() ? (
                            <>
                              {" · "}
                              Schůzka {formatCsDate(p.occurredAt)}
                            </>
                          ) : null}
                        </p>
                      </CardHeader>
                    </Card>
                  </Link>
                  <div className="flex shrink-0 items-start sm:items-center">
                    <RecordDeleteButton
                      recordId={p.id}
                      deleteAction={deletePreparation}
                      title="Smazat přípravu?"
                      description={preparationDeleteDescription(label, "all")}
                      confirmLabel="Smazat přípravu"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
