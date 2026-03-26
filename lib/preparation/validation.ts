import { z } from "zod";

export const preparationRoleRowSchema = z.object({
  roleId: z.string().min(1),
  type: z.enum(["strengthen", "downregulate"]),
});

export const preparationDraftPayloadSchema = z.object({
  id: z.string().min(1),
  consultationLabel: z.string().max(200).optional(),
  occurredAt: z.string().max(32).optional(),
  focusNote: z.string().max(4000).optional(),
  roles: z.array(preparationRoleRowSchema).optional(),
});

export const preparationCompletePayloadSchema = z.object({
  id: z.string().min(1),
  consultationLabel: z.string().max(200).optional(),
  occurredAt: z.string().max(32).optional(),
  focusNote: z.string().max(4000).optional(),
  roles: z
    .array(preparationRoleRowSchema)
    .min(1, "Vyberte alespoň jednu roli k posílení nebo tlumení"),
});

export type PreparationDraftPayload = z.infer<
  typeof preparationDraftPayloadSchema
>;
export type PreparationCompletePayload = z.infer<
  typeof preparationCompletePayloadSchema
>;
