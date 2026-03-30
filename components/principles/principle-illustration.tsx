"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_MISSING_FILE_HINT =
  "Do public/ vložte soubor podle mapování v lib/data/principle-images.ts.";

type Props = {
  src: string | null | undefined;
  alt: string;
  /** card = samostatný blok; sidebar = úzký sloupec u textu; inline = náhled ve wizardu; hero = plocha na pozadí (object-cover) */
  variant?: "card" | "sidebar" | "inline" | "hero";
  /** Nižší min. výška u sidebar — kompaktní karty (např. role) */
  density?: "default" | "compact";
  className?: string;
  priority?: boolean;
  /** Text náhrady, když není nastavena cesta k souboru (např. role vs. principy). */
  missingFileHint?: string;
};

export function PrincipleIllustration({
  src,
  alt,
  variant = "card",
  density = "default",
  className,
  priority = false,
  missingFileHint = DEFAULT_MISSING_FILE_HINT,
}: Props) {
  const [broken, setBroken] = useState(false);
  const sidebarMin =
    density === "compact"
      ? "min-h-[132px] sm:min-h-[176px]"
      : "min-h-[160px] sm:min-h-[220px]";
  const sidebarPlaceholderMin =
    density === "compact"
      ? "min-h-[132px] sm:min-h-[176px]"
      : "min-h-[160px] sm:min-h-[200px]";

  if (!src || broken) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-center text-muted-foreground",
          variant === "card" &&
            "aspect-[4/3] w-full min-h-[140px] sm:min-h-[180px]",
          variant === "sidebar" && cn("h-full w-full", sidebarPlaceholderMin),
          variant === "inline" && "size-20 shrink-0 sm:size-24",
          variant === "hero" &&
            "h-full w-full min-h-0 rounded-none border-0 bg-gradient-to-br from-muted/70 via-muted/45 to-muted/25 dark:from-muted/50 dark:via-muted/30 dark:to-muted/15",
          className,
        )}
        role={variant === "hero" ? undefined : "img"}
        aria-hidden={variant === "hero" ? true : undefined}
        aria-label={variant === "hero" ? undefined : alt}
      >
        {variant === "hero" ? null : (
          <>
            <ImageIcon className="size-8 opacity-40" aria-hidden />
            <span className="max-w-[12rem] px-2 text-[11px] leading-snug">
              {src && broken
                ? "Obrázek se nepodařilo načíst."
                : missingFileHint}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/80 bg-[oklch(99%_0.01_95)] shadow-sm dark:bg-card",
        variant === "card" && "relative aspect-[4/3] w-full",
        variant === "sidebar" &&
          cn("flex w-full items-center justify-center", sidebarMin),
        variant === "inline" &&
          "flex size-20 shrink-0 items-center justify-center sm:size-24",
        variant === "hero" &&
          "relative h-full w-full rounded-none border-0 bg-muted/25 shadow-none dark:bg-card/20",
        className,
      )}
      aria-hidden={variant === "hero" ? true : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- potřebujeme spolehlivý onError bez optimalizátoru */}
      <img
        src={src}
        alt={variant === "hero" ? "" : alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setBroken(true)}
        className={cn(
          variant === "card" &&
            "absolute inset-0 h-full w-full object-contain object-center p-0",
          variant === "sidebar" && "max-h-full w-full object-contain object-center p-2",
          variant === "inline" &&
            "max-h-[5.5rem] w-full object-contain object-center p-1",
          variant === "hero" && "h-full w-full object-cover object-center",
        )}
      />
    </div>
  );
}
