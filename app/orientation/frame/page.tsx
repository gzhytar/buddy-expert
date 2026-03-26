import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrientationFramePage() {
  return (
    <article className="max-w-none space-y-6">
      <nav aria-label="Drobečková navigace">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orientation">← Orientace</Link>
        </Button>
      </nav>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Mise a konzultační rámec
      </h1>
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
        jazyk (principy a situační role), když přemýšlíte sami nebo s kolegy.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Když označíte reflexi jako dokončenou, budujete si osobní praxi
        supervize — upřímnou, s nízkým třením a orientovanou na vaši příští
        konzultaci.
      </p>
    </article>
  );
}
