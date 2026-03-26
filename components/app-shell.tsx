import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6"
      >
        {children}
      </main>
    </div>
  );
}
