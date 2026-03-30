import { z } from "zod";

export const recordIdPayloadSchema = z.object({
  id: z.string().min(1, "Neplatný identifikátor"),
});

export const GENERIC_DB_ERROR_CS =
  "Operace se nezdařila. Zkuste to znovu.";

/** Společná validace `{ id }` pro mazací server actions. */
export function parseRecordIdPayload(
  raw: unknown,
): { ok: true; id: string } | { ok: false; error: string } {
  const parsed = recordIdPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Neplatné",
    };
  }
  return { ok: true, id: parsed.data.id };
}
