import { z } from "zod";

export const calibrationSchema = z.enum(["underused", "balanced", "overused"]);

export const roleCalibrationRowSchema = z.object({
  roleId: z.string().min(1),
  calibration: calibrationSchema,
});

/** Permissive payload for autosave / draft */
export const reflectionDraftPayloadSchema = z.object({
  id: z.string().min(1),
  /** Jednorázové propojení s přípravou (jen pokud reflexe ještě nemá preparation_id) */
  preparationId: z.string().min(1).optional(),
  consultationLabel: z.string().max(200).optional(),
  occurredAt: z.string().max(32).optional(),
  principleIds: z.array(z.string()).optional(),
  roles: z.array(roleCalibrationRowSchema).optional(),
  learningNote: z.string().max(4000).optional(),
});

/** Required fields to mark complete */
export const reflectionCompletePayloadSchema = z.object({
  id: z.string().min(1),
  preparationId: z.string().min(1).optional(),
  consultationLabel: z.string().max(200).optional(),
  occurredAt: z.string().max(32).optional(),
  principleIds: z.array(z.string()).min(1, "Vyberte alespoň jeden princip"),
  roles: z
    .array(roleCalibrationRowSchema)
    .min(1, "Vyberte alespoň jednu roli a nastavte kalibraci"),
  learningNote: z
    .string()
    .min(1, "Přidejte krátkou poznámku k učení")
    .max(4000),
});

export type ReflectionDraftPayload = z.infer<typeof reflectionDraftPayloadSchema>;
export type ReflectionCompletePayload = z.infer<
  typeof reflectionCompletePayloadSchema
>;
