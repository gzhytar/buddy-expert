import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const showGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());

  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-muted-foreground">
          Načítání…
        </div>
      }
    >
      <LoginForm showGoogle={showGoogle} />
    </Suspense>
  );
}
