"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Zadejte platný e-mail"),
  password: z.string().min(1, "Heslo je povinné"),
});

type LoginValues = z.infer<typeof loginSchema>;

function oauthUrlErrorMessage(error: string | null): string | null {
  if (!error) return null;
  switch (error) {
    case "OAuthCallback":
    case "OAuthCallbackError":
      return "Přihlášení přes Google se nepodařilo dokončit. Zkuste to znovu.";
    case "OAuthSignin":
    case "OAuthAccountNotLinked":
      return "Účet Google nelze propojit tímto způsobem. Použijte e-mail a heslo nebo kontaktujte správce.";
    case "Configuration":
    case "AccessDenied":
      return "Přihlášení bylo zamítnuto nebo není služba správně nastavená.";
    default:
      return "Přihlášení se nezdařilo. Zkuste to znovu.";
  }
}

type Props = { showGoogle: boolean };

export function LoginForm({ showGoogle }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/orientation";
  const urlError = searchParams.get("error");
  const urlCode = searchParams.get("code");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);

  useEffect(() => {
    if (urlError === "CredentialsSignin" && urlCode === "oauth_only") {
      setError(
        "Tento účet nemá nastavené heslo. Přihlaste se prosím přes Google.",
      );
      return;
    }
    const oauthMsg = oauthUrlErrorMessage(urlError);
    if (oauthMsg) setError(oauthMsg);
  }, [urlError, urlCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@jic.local", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });
      if (res?.error) {
        if (res.code === "oauth_only") {
          setError(
            "Tento účet nemá nastavené heslo. Přihlaste se prosím přes Google.",
          );
          return;
        }
        setError("Neplatný e-mail nebo heslo.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    });
  }

  async function onGoogleSignIn() {
    setError(null);
    setGooglePending(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-muted/40 px-4 py-16">
      <Card className="w-full max-w-md animate-step-in border-border/80 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle>Přihlášení</CardTitle>
          <CardDescription>
            Workspace pro reflexe expertů JIC. Přihlaste se e-mailem a heslem
            nebo přes Google (pokud je pro prostředí zapnuté).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showGoogle ? (
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                disabled={googlePending}
                onClick={() => void onGoogleSignIn()}
              >
                {googlePending ? "Otevírám Google…" : "Přihlásit se přes Google"}
              </Button>
              <div className="relative py-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-2 relative z-10">nebo</span>
                <span
                  className="absolute inset-x-0 top-1/2 h-px bg-border"
                  aria-hidden
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Přihlášení přes Google není v tomto prostředí nastavené (chybí
              proměnné <code className="text-[11px]">GOOGLE_CLIENT_ID</code> /{" "}
              <code className="text-[11px]">GOOGLE_CLIENT_SECRET</code>).
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email ? (
                <p
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password ? (
                <p
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            {error ? (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Přihlašování…" : "Přihlásit se e-mailem"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Lokální demo: heslo z <code className="text-[11px]">.env</code> při
            seedu (výchozí <code className="text-[11px]">buddy-dev-1</code>).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
