import Link from "next/link";
import { listWaitingPreparationsForUser } from "@/lib/preparation/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { searchParams?: Promise<{ saved?: string }> };

export default async function PreparationsListPage({ searchParams }: Props) {
  const params = await searchParams;
  const rows = await listWaitingPreparationsForUser();

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
            Schůzky bez navázané reflexe — dokončete přípravu a po konzultaci
            začněte reflexi z tohoto seznamu nebo z&nbsp;Reflexí.
          </p>
        </div>
        <Button asChild>
          <Link href="/preparations/new">Nová příprava</Link>
        </Button>
      </header>

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zatím žádné volné přípravy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vytvořte přípravu před schůzkou — role k posílení a tlumení a krátký
              záměr. Po konzultaci z ní snadno založíte reflexi.
            </p>
            <Button asChild>
              <Link href="/preparations/new">Vytvořit přípravu</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/preparations/${p.id}`}
                className="block min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {p.consultationLabel?.trim() || "Nepojmenovaná příprava"}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Aktualizováno{" "}
                      {new Date(p.updatedAt).toLocaleString("cs-CZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {" · "}
                      <span className="capitalize">
                        {p.status === "draft" ? "rozpracováno" : "dokončeno"}
                      </span>
                    </p>
                  </CardHeader>
                </Card>
              </Link>
              <Button asChild variant="secondary" className="shrink-0 self-start sm:self-center">
                <Link href={`/reflections/new?preparationId=${encodeURIComponent(p.id)}`}>
                  Zahájit reflexi
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
