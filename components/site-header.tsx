"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/orientation", label: "Orientace" },
  { href: "/preparations", label: "Přípravy" },
  { href: "/reflections", label: "Reflexe" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md motion-reduce:backdrop-blur-none"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link
              href="/orientation"
              className="font-display truncate text-lg font-semibold tracking-tight text-foreground transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none"
            >
              buddY expert
            </Link>
            <nav aria-label="Hlavní navigace" className="hidden gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Odhlásit se
          </Button>
        </div>
        <nav
          aria-label="Mobilní navigace"
          className="flex gap-1 border-t border-border/80 py-2 md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 rounded-md px-2 py-2 text-center text-xs font-medium transition-colors duration-200 motion-reduce:transition-none",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
