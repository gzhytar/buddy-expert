import { z } from "zod";
import { roleSelfEvalSentiments } from "@/lib/db/schema";

export const roleSelfEvalSaveSchema = z.object({
  roleId: z.string().min(1),
  sentiment: z.enum(roleSelfEvalSentiments),
});

export type RoleSelfEvalSaveInput = z.infer<typeof roleSelfEvalSaveSchema>;
