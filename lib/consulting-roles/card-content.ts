import type { ConsultingRole } from "@/lib/db/schema";

export function parseBulletList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function roleSummaryForList(r: ConsultingRole): string {
  return (
    r.summaryLine?.trim() ||
    r.description?.trim() ||
    ""
  );
}

/** Levý akcent karty podle fáze — mapuje se na CSS tokeny v globals.css */
export const phaseCardBorder: Record<string, string> = {
  "contract-frame": "border-l-[var(--jic-phase-zakazka-border)]",
  "company-diagnosis": "border-l-[var(--jic-phase-diagnostika-border)]",
  "leading-session": "border-l-[var(--jic-phase-vedeni-border)]",
  "solution-creation": "border-l-[var(--jic-phase-tvorba-border)]",
};

export function phaseLeftBorderClass(phaseKey: string): string {
  return phaseCardBorder[phaseKey] ?? "border-l-border";
}
