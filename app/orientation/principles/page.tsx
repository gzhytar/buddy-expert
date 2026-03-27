import Link from "next/link";
import { OrientationPrincipleCard } from "@/components/orientation/principle-card";
import { Button } from "@/components/ui/button";
import { getPrinciplesOrdered } from "@/lib/queries/orientation";

export const dynamic = "force-dynamic";

export default async function OrientationPrinciplesPage() {
  const list = await getPrinciplesOrdered();

  return (
    <div className="space-y-8">
      <nav aria-label="Drobečková navigace">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orientation">← Orientace</Link>
        </Button>
      </nav>
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Deset principů konzultování
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Rámec kvality pro reflexi — nikoliv rigidní checklist. U každého principu
          najdete krátké tipy a ilustrativní příběh z praxe.
        </p>
      </header>
      <ol className="list-none space-y-4 p-0">
        {list.map((p, i) => (
          <li key={p.id} className="scroll-mt-20">
            <OrientationPrincipleCard principle={p} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );
}
