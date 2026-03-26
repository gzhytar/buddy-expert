import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  {
    href: "/orientation/frame",
    title: "Mise a rámec",
    description: "Proč tento nástroj existuje a jak souvisí s konzultačním rámcem JIC.",
  },
  {
    href: "/orientation/principles",
    title: "Deset principů",
    description: "Referenční seznam principů konzultování JIC pro reflexi.",
  },
  {
    href: "/orientation/roles",
    title: "Situační role",
    description: "Šestnáct rolí ve čtyřech fázích — jazyk pro kalibraci.",
  },
];

export default function OrientationHubPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Orientace
        </h1>
        <p className="text-muted-foreground">
          Referenční materiály pro sdílený jazyk JIC. Nic zde není sledováno —
          můžete procházet v libovolném pořadí.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-1">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Card className="h-full transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
