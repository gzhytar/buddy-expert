"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userConsultingRoleSelfEvals } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import {
  consultingRoleExists,
} from "@/lib/orientation/role-self-eval-queries";
import { roleSelfEvalSaveSchema } from "@/lib/orientation/role-self-eval-validation";

function nowIso() {
  return new Date().toISOString();
}

export type SaveRoleSelfEvalResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveConsultingRoleSelfEval(
  raw: unknown,
): Promise<SaveRoleSelfEvalResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Nejste přihlášeni." };
  }

  const parsed = roleSelfEvalSaveSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Neplatná data." };
  }

  const { roleId, sentiment } = parsed.data;
  const exists = await consultingRoleExists(roleId);
  if (!exists) {
    return { ok: false, error: "Role nebyla nalezena." };
  }

  const userId = session.user.id;
  await db
    .insert(userConsultingRoleSelfEvals)
    .values({
      userId,
      roleId,
      sentiment,
      updatedAt: nowIso(),
    })
    .onConflictDoUpdate({
      target: [
        userConsultingRoleSelfEvals.userId,
        userConsultingRoleSelfEvals.roleId,
      ],
      set: {
        sentiment,
        updatedAt: nowIso(),
      },
    });

  revalidatePath("/orientation");
  revalidatePath("/orientation/roles");

  return { ok: true };
}
