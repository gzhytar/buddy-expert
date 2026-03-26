import { AppShell } from "@/components/app-shell";

export default function PreparationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
