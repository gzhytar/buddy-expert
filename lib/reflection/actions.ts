"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  consultingRoles,
  preparationRoles,
  preparationSessions,
  principles,
  reflectionPrinciples,
  reflectionRoleCalibrations,
  reflectionSessions,
} from "@/lib/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  reflectionCompletePayloadSchema,
  reflectionDraftPayloadSchema,
} from "./validation";

function nowIso() {
  return new Date().toISOString();
}

export type PreparationPlanSummary = {
  id: string;
  consultationLabel: string | null;
  occurredAt: string | null;
  focusNote: string | null;
  strengthenRoleIds: string[];
  downregulateRoleIds: string[];
};

export async function createReflectionDraft(options?: {
  preparationId?: string;
}): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Neautorizováno");
  }

  let preparationId: string | null = null;
  let consultationLabel: string | null = null;
  let occurredAt: string | null = null;

  if (options?.preparationId?.trim()) {
    const pid = options.preparationId.trim();
    const [prep] = await db
      .select()
      .from(preparationSessions)
      .where(
        and(
          eq(preparationSessions.id, pid),
          eq(preparationSessions.userId, session.user.id),
        ),
      )
      .limit(1);
    if (!prep) {
      throw new Error("Příprava nebyla nalezena");
    }
    const [linked] = await db
      .select({ id: reflectionSessions.id })
      .from(reflectionSessions)
      .where(eq(reflectionSessions.preparationId, pid))
      .limit(1);
    if (linked) {
      throw new Error("K této přípravě už existuje reflexe");
    }
    preparationId = pid;
    consultationLabel = prep.consultationLabel;
    occurredAt = prep.occurredAt;
  }

  const id = crypto.randomUUID();
  const t = nowIso();
  await db.insert(reflectionSessions).values({
    id,
    userId: session.user.id,
    status: "draft",
    preparationId,
    consultationLabel,
    occurredAt,
    alignmentLikert: null,
    alignmentNote: null,
    learningNote: null,
    createdAt: t,
    updatedAt: t,
  });

  // Do not call revalidatePath here: createReflectionDraft runs during RSC render
  // (/reflections/new → redirect), and Next.js forbids cache mutations during render.
  return { id };
}

export type ReflectionDetail = {
  session: typeof reflectionSessions.$inferSelect;
  principleIds: string[];
  roles: { roleId: string; calibration: string }[];
  preparation: PreparationPlanSummary | null;
};

export async function getReflectionForUser(
  id: string,
): Promise<ReflectionDetail | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [row] = await db
    .select()
    .from(reflectionSessions)
    .where(
      and(
        eq(reflectionSessions.id, id),
        eq(reflectionSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!row) return null;

  const pRows = await db
    .select({ principleId: reflectionPrinciples.principleId })
    .from(reflectionPrinciples)
    .where(eq(reflectionPrinciples.reflectionId, id));

  const rRows = await db
    .select({
      roleId: reflectionRoleCalibrations.roleId,
      calibration: reflectionRoleCalibrations.calibration,
    })
    .from(reflectionRoleCalibrations)
    .where(eq(reflectionRoleCalibrations.reflectionId, id));

  let preparation: PreparationPlanSummary | null = null;
  if (row.preparationId) {
    const [prepRow] = await db
      .select()
      .from(preparationSessions)
      .where(
        and(
          eq(preparationSessions.id, row.preparationId),
          eq(preparationSessions.userId, session.user.id),
        ),
      )
      .limit(1);
    if (prepRow) {
      const prRoles = await db
        .select({
          roleId: preparationRoles.roleId,
          type: preparationRoles.type,
        })
        .from(preparationRoles)
        .where(eq(preparationRoles.preparationId, prepRow.id));
      const strengthenRoleIds: string[] = [];
      const downregulateRoleIds: string[] = [];
      for (const r of prRoles) {
        if (r.type === "strengthen") strengthenRoleIds.push(r.roleId);
        else downregulateRoleIds.push(r.roleId);
      }
      preparation = {
        id: prepRow.id,
        consultationLabel: prepRow.consultationLabel,
        occurredAt: prepRow.occurredAt,
        focusNote: prepRow.focusNote,
        strengthenRoleIds,
        downregulateRoleIds,
      };
    }
  }

  return {
    session: row,
    principleIds: pRows.map((r) => r.principleId),
    roles: rRows.map((r) => ({
      roleId: r.roleId,
      calibration: r.calibration,
    })),
    preparation,
  };
}

export async function listReflectionsForUser() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db
    .select()
    .from(reflectionSessions)
    .where(eq(reflectionSessions.userId, session.user.id))
    .orderBy(desc(reflectionSessions.updatedAt));
}

/** Poslední dokončená reflexe s neprázdným poučením — echo pro přípravu (learning loop). */
export type ReflectionLearningEcho = {
  learningNote: string;
  consultationLabel: string | null;
  /** Čas dokončení (aktuálně `updatedAt` při přechodu na complete). */
  completedAt: string;
};

export async function getLatestReflectionLearningEchoForUser(): Promise<ReflectionLearningEcho | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [row] = await db
    .select({
      learningNote: reflectionSessions.learningNote,
      consultationLabel: reflectionSessions.consultationLabel,
      completedAt: reflectionSessions.updatedAt,
    })
    .from(reflectionSessions)
    .where(
      and(
        eq(reflectionSessions.userId, session.user.id),
        eq(reflectionSessions.status, "complete"),
        sql`length(trim(coalesce(${reflectionSessions.learningNote}, ''))) > 0`,
      ),
    )
    .orderBy(desc(reflectionSessions.updatedAt))
    .limit(1);

  const note = row?.learningNote?.trim();
  if (!row || !note) return null;

  return {
    learningNote: note,
    consultationLabel: row.consultationLabel,
    completedAt: row.completedAt,
  };
}

export async function saveReflectionDraft(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }

  const parsed = reflectionDraftPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatné" };
  }

  const data = parsed.data;
  const [existing] = await db
    .select()
    .from(reflectionSessions)
    .where(
      and(
        eq(reflectionSessions.id, data.id),
        eq(reflectionSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Reflexe nebyla nalezena" };
  }

  let preparationId = existing.preparationId;
  const incomingPrep = data.preparationId?.trim();
  if (incomingPrep && !existing.preparationId) {
    const [prep] = await db
      .select()
      .from(preparationSessions)
      .where(
        and(
          eq(preparationSessions.id, incomingPrep),
          eq(preparationSessions.userId, session.user.id),
        ),
      )
      .limit(1);
    if (!prep) {
      return { ok: false, error: "Příprava nebyla nalezena" };
    }
    const [other] = await db
      .select({ id: reflectionSessions.id })
      .from(reflectionSessions)
      .where(eq(reflectionSessions.preparationId, incomingPrep))
      .limit(1);
    if (other && other.id !== data.id) {
      return { ok: false, error: "K této přípravě už existuje jiná reflexe" };
    }
    preparationId = incomingPrep;
  }

  const t = nowIso();
  await db
    .update(reflectionSessions)
    .set({
      preparationId,
      consultationLabel: data.consultationLabel?.trim() || null,
      occurredAt: data.occurredAt?.trim() || null,
      alignmentLikert: data.alignmentLikert?.trim() || null,
      alignmentNote: data.alignmentNote?.trim() || null,
      learningNote: data.learningNote?.trim() || null,
      updatedAt: t,
    })
    .where(eq(reflectionSessions.id, data.id));

  await db
    .delete(reflectionPrinciples)
    .where(eq(reflectionPrinciples.reflectionId, data.id));
  if (data.principleIds?.length) {
    const valid = await db
      .select({ id: principles.id })
      .from(principles)
      .where(inArray(principles.id, data.principleIds));
    const ids = valid.map((v) => v.id);
    if (ids.length) {
      await db.insert(reflectionPrinciples).values(
        ids.map((principleId) => ({
          reflectionId: data.id,
          principleId,
        })),
      );
    }
  }

  await db
    .delete(reflectionRoleCalibrations)
    .where(eq(reflectionRoleCalibrations.reflectionId, data.id));
  if (data.roles?.length) {
    const validRoles = await db
      .select({ id: consultingRoles.id })
      .from(consultingRoles)
      .where(inArray(consultingRoles.id, data.roles.map((r) => r.roleId)));
    const allowed = new Set(validRoles.map((r) => r.id));
    const rows = data.roles.filter((r) => allowed.has(r.roleId));
    if (rows.length) {
      await db.insert(reflectionRoleCalibrations).values(
        rows.map((r) => ({
          reflectionId: data.id,
          roleId: r.roleId,
          calibration: r.calibration,
        })),
      );
    }
  }

  revalidatePath("/reflections");
  revalidatePath(`/reflections/${data.id}`);
  return { ok: true };
}

export async function completeReflection(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }

  const parsed = reflectionCompletePayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Neplatné" };
  }

  const data = parsed.data;
  const [existing] = await db
    .select()
    .from(reflectionSessions)
    .where(
      and(
        eq(reflectionSessions.id, data.id),
        eq(reflectionSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Reflexe nebyla nalezena" };
  }

  const draft = await saveReflectionDraft({
    id: data.id,
    preparationId: data.preparationId,
    consultationLabel: data.consultationLabel,
    occurredAt: data.occurredAt,
    principleIds: data.principleIds,
    roles: data.roles,
    alignmentLikert: data.alignmentLikert,
    alignmentNote: data.alignmentNote,
    learningNote: data.learningNote,
  });

  if (!draft.ok) return draft;

  const t = nowIso();
  await db
    .update(reflectionSessions)
    .set({ status: "complete", updatedAt: t })
    .where(eq(reflectionSessions.id, data.id));

  revalidatePath("/reflections");
  revalidatePath(`/reflections/${data.id}`);
  revalidatePath("/preparations", "layout");
  return { ok: true };
}
