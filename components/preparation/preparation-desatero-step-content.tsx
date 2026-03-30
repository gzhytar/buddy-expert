"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { OrientationPrincipleCard } from "@/components/orientation/principle-card";
import type { Principle } from "@/lib/db/schema";

const detailsShell =
  "rounded-xl border border-border/80 bg-card/40 shadow-sm [&[open]>summary_.prep-desatero-chevron]:rotate-180";
const summaryShell =
  "flex cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 font-display text-base font-semibold tracking-tight text-foreground outline-none transition-colors duration-200 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:focus-visible:ring-0 motion-reduce:focus-visible:ring-offset-0 [&::-webkit-details-marker]:hidden sm:text-lg";
const chevronClassName =
  "prep-desatero-chevron size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none";

type Props = {
  principles: Principle[];
};

export function PreparationDesateroStepContent({ principles }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Než napíšete záměr, můžete si připomenout Konzultantské desatero — podpůrný rámec
        kvality, ne kontrolní seznam. Rozbalte si principy přímo zde, nebo je otevřete v{" "}
        <Link
          href="/orientation/principles"
          className="font-medium text-primary underline underline-offset-4 hover:underline"
        >
          orientaci
        </Link>
        .
      </p>

      <details className={detailsShell}>
        <summary className={summaryShell}>
          <ChevronDown className={chevronClassName} aria-hidden />
          <span>Konzultantské desatero</span>
          <span className="font-sans text-xs font-normal text-muted-foreground">
            {principles.length} principů
          </span>
        </summary>
        <div className="border-t border-border/60 px-2 pb-4 pt-4 sm:px-3">
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Deset principů konzultování JIC — krátké tipy a ilustrativní příběhy z praxe u každého
            principu.
          </p>
          <ol className="list-none space-y-4 p-0">
            {principles.map((p, i) => (
              <li key={p.id} className="scroll-mt-20">
                <OrientationPrincipleCard principle={p} index={i} />
              </li>
            ))}
          </ol>
        </div>
      </details>
    </div>
  );
}
