import { z } from "zod";
import { calibrationSchema } from "@/lib/reflection/validation";

export const assistantPhaseSchema = z.enum(["idle", "questions", "proposal"]);

export const assistantQuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const assistantProposalSchema = z.object({
  principleIds: z.array(z.string()),
  roles: z.array(
    z.object({
      roleId: z.string(),
      calibration: calibrationSchema,
    }),
  ),
  learningNote: z.string(),
});

export const reflectionAssistantStateV1Schema = z.object({
  v: z.literal(1),
  phase: assistantPhaseSchema,
  questions: z.array(assistantQuestionSchema),
  answers: z.record(z.string(), z.string()).default({}),
  /** V JSON z API někdy chybí — bez defaultu selže parse a celý stav asistenta zmizí po obnovení. */
  anchorRoleIds: z.array(z.string()).max(3).default([]),
  proposal: assistantProposalSchema.optional(),
  lastError: z.string().optional(),
});

export type ReflectionAssistantStateV1 = z.infer<
  typeof reflectionAssistantStateV1Schema
>;

export function emptyAssistantState(): ReflectionAssistantStateV1 {
  return {
    v: 1,
    phase: "idle",
    questions: [],
    answers: {},
    anchorRoleIds: [],
  };
}

export function parseAssistantState(
  raw: string | null | undefined,
): ReflectionAssistantStateV1 | null {
  if (raw == null || raw.trim() === "") return null;
  try {
    const json: unknown = JSON.parse(raw);
    const parsed = reflectionAssistantStateV1Schema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeAssistantState(
  state: ReflectionAssistantStateV1,
): string {
  return JSON.stringify(state);
}
