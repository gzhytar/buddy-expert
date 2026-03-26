import { AppShell } from "@/components/app-shell";

export default function OrientationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
