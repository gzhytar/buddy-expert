import { AppShell } from "@/components/app-shell";

export default function ReflectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
