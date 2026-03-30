/** Hodnota pro `<input type="datetime-local" />` z ISO řetězce. */
export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** ISO pro uložení z `datetime-local`; prázdný vstup → `undefined`. */
export function isoFromDatetimeLocalInput(local: string): string | undefined {
  if (local.trim() === "") {
    return undefined;
  }
  return new Date(local).toISOString();
}
