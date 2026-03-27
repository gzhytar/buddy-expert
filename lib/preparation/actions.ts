"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  consultingRoles,
  preparationRoles,
  preparationSessions,
  reflectionSessions,
} from "@/lib/db/schema";
import { and, desc, eq, inArray, isNotNull, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  preparationCompletePayloadSchema,
  preparationDraftPayloadSchema,
} from "./validation";

function nowIso() {
  return new Date().toISOString();
}

export type PreparationDetail = {
  session: typeof preparationSessions.$inferSelect;
  roles: { roleId: string; type: "strengthen" | "downregulate" }[];
};

export async function createPreparationDraft(): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Neautorizováno");
  }

  const id = crypto.randomUUID();
  const t = nowIso();
  await db.insert(preparationSessions).values({
    id,
    userId: session.user.id,
    status: "draft",
    consultationLabel: null,
    occurredAt: null,
    focusNote: null,
    createdAt: t,
    updatedAt: t,
  });

  return { id };
}

export async function getPreparationForUser(
  id: string,
): Promise<PreparationDetail | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [row] = await db
    .select()
    .from(preparationSessions)
    .where(
      and(
        eq(preparationSessions.id, id),
        eq(preparationSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!row) return null;

  const rRows = await db
    .select({
      roleId: preparationRoles.roleId,
      type: preparationRoles.type,
    })
    .from(preparationRoles)
    .where(eq(preparationRoles.preparationId, id));

  return {
    session: row,
    roles: rRows.map((r) => ({
      roleId: r.roleId,
      type: r.type as "strengthen" | "downregulate",
    })),
  };
}

/** Všechny přípravy uživatele (draft i dokončené), nejnovější první. */
export async function listAllPreparationsForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const linkedRows = await db
    .select({ preparationId: reflectionSessions.preparationId })
    .from(reflectionSessions)
    .where(isNotNull(reflectionSessions.preparationId));

  const linkedIds = new Set(
    linkedRows
      .map((r) => r.preparationId)
      .filter((id): id is string => id != null),
  );

  const rows = await db
    .select()
    .from(preparationSessions)
    .where(eq(preparationSessions.userId, session.user.id))
    .orderBy(desc(preparationSessions.updatedAt));

  return rows.map((p) => ({
    ...p,
    hasLinkedReflection: linkedIds.has(p.id),
  }));
}

/** Přípravy, které ještě nejsou navázané na žádnou reflexi */
export async function listWaitingPreparationsForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const linked = await db
    .select({ preparationId: reflectionSessions.preparationId })
    .from(reflectionSessions)
    .where(isNotNull(reflectionSessions.preparationId));

  const linkedIds = linked
    .map((r) => r.preparationId)
    .filter((id): id is string => id != null);

  const whereClause = linkedIds.length
    ? and(
        eq(preparationSessions.userId, session.user.id),
        notInArray(preparationSessions.id, linkedIds),
      )
    : eq(preparationSessions.userId, session.user.id);

  const rows = await db
    .select()
    .from(preparationSessions)
    .where(whereClause)
    .orderBy(desc(preparationSessions.updatedAt));

  return rows;
}

export async function savePreparationDraft(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }

  const parsed = preparationDraftPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatné" };
  }

  const data = parsed.data;
  const [existing] = await db
    .select()
    .from(preparationSessions)
    .where(
      and(
        eq(preparationSessions.id, data.id),
        eq(preparationSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Příprava nebyla nalezena" };
  }

  const t = nowIso();
  await db
    .update(preparationSessions)
    .set({
      consultationLabel: data.consultationLabel?.trim() || null,
      occurredAt: data.occurredAt?.trim() || null,
      focusNote: data.focusNote?.trim() || null,
      updatedAt: t,
    })
    .where(eq(preparationSessions.id, data.id));

  await db
    .delete(preparationRoles)
    .where(eq(preparationRoles.preparationId, data.id));
  if (data.roles?.length) {
    const validRoles = await db
      .select({ id: consultingRoles.id })
      .from(consultingRoles)
      .where(inArray(consultingRoles.id, data.roles.map((r) => r.roleId)));
    const allowed = new Set(validRoles.map((r) => r.id));
    const rows = data.roles.filter((r) => allowed.has(r.roleId));
    if (rows.length) {
      await db.insert(preparationRoles).values(
        rows.map((r) => ({
          preparationId: data.id,
          roleId: r.roleId,
          type: r.type,
        })),
      );
    }
  }

  revalidatePath("/preparations");
  revalidatePath(`/preparations/${data.id}`);
  revalidatePath("/reflections");
  return { ok: true };
}

export async function completePreparation(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }

  const parsed = preparationCompletePayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatné" };
  }

  const data = parsed.data;
  const draft = await savePreparationDraft({
    id: data.id,
    consultationLabel: data.consultationLabel,
    occurredAt: data.occurredAt,
    focusNote: data.focusNote,
    roles: data.roles,
  });
  if (!draft.ok) return draft;

  const t = nowIso();
  await db
    .update(preparationSessions)
    .set({ status: "complete", updatedAt: t })
    .where(eq(preparationSessions.id, data.id));

  revalidatePath("/preparations");
  revalidatePath(`/preparations/${data.id}`);
  revalidatePath("/reflections");
  return { ok: true };
}
