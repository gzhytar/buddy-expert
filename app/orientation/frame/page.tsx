import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const FRAME_IMAGE = "/konzultace_ramec.png";

const FRAME_ALT =
  "Sketchnote Konzultování pod hlavičkou JIC: chrám kvality konzultování stojící na třech pilířích — Konzultantské desatero, univerzální schéma organizace a konzultační toolbox; kolem klíčové teze (zodpovědnost klienta, mandát, zpětná vazba, sdílení informací a další) a strategický cíl.";

export default function OrientationFramePage() {
  return (
    <article className="max-w-none space-y-8">
      <nav aria-label="Drobečková navigace">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orientation">← Orientace</Link>
        </Button>
      </nav>
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Mise a konzultační rámec
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Přehledný model rámce — stejný jazyk, který v aplikaci propojujeme s Konzultantským
          desaterem a situačními rolemi.
        </p>
      </header>

      <figure className="mx-auto max-w-lg space-y-3 sm:max-w-xl">
        <div
          className="relative overflow-hidden rounded-xl border border-border/80 bg-[oklch(99%_0.01_95)] shadow-sm dark:bg-card"
          style={{ aspectRatio: "708 / 1024" }}
        >
          <Image
            src={FRAME_IMAGE}
            alt={FRAME_ALT}
            fill
            className="object-contain object-center p-2 sm:p-3"
            sizes="(max-width: 640px) 100vw, 576px"
            priority
          />
        </div>
        <figcaption className="text-center text-xs leading-snug text-muted-foreground">
          Konzultační rámec JIC — pracovní sketchnote (zdroj vizualizace v{" "}
          <code className="rounded bg-muted px-1 font-mono text-[0.7rem]">
            public/konzultace_ramec.png
          </code>
          ).
        </figcaption>
      </figure>

      <div className="mx-auto max-w-2xl space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Experti JIC pomáhají klientům prostřednictvím konzultací, které vyvažují{" "}
          <strong className="text-foreground">individuální styl</strong> se{" "}
          <strong className="text-foreground">sdíleným rámcem kvality</strong>. Tato
          aplikace je <strong className="text-foreground">vrstvou reflexe</strong>{" "}
          nad vaší reálnou prací — není náhradou za YTracker/CRM a není to systém
          pro dohled nebo bodování.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Cílem je <strong className="text-foreground">lehké učení</strong>
          : připravujte se se záměrem, reflektujte po konzultacích a používejte stejný
          jazyk (Konzultantské desatero a situační role), když přemýšlíte sami nebo s kolegy.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Když označíte reflexi jako dokončenou, budujete si osobní praxi
          supervize — upřímnou, s nízkým třením a orientovanou na vaši příští
          konzultaci.
        </p>
      </div>
    </article>
  );
}
