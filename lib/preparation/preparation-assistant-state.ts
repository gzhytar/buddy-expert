import { z } from "zod";

export const preparationAssistantStateV1Schema = z.object({
  version: z.literal(1),
  reflectiveQuestions: z.array(z.string()),
  generatedAt: z.string().optional(),
});

export type PreparationAssistantStateV1 = z.infer<
  typeof preparationAssistantStateV1Schema
>;

export function emptyPreparationAssistantState(): PreparationAssistantStateV1 {
  return { version: 1, reflectiveQuestions: [] };
}

export function parsePreparationAssistantState(
  raw: string | null | undefined,
): PreparationAssistantStateV1 | null {
  if (raw == null || raw.trim() === "") {
    return null;
  }
  try {
    const data = JSON.parse(raw) as unknown;
    const parsed = preparationAssistantStateV1Schema.safeParse(data);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function serializePreparationAssistantState(
  state: PreparationAssistantStateV1,
): string {
  return JSON.stringify(state);
}
