"use server";

import { auth } from "@/auth";
import { buildJicRagContext } from "@/lib/ai/rag-context";
import {
  generateQuestionTexts,
  generateStructuredProposal,
} from "@/lib/ai/reflection-assistant-openrouter";
import { db } from "@/lib/db";
import {
  consultingRoles,
  preparationRoles,
  principles,
  reflectionSessions,
  userConsultingRoleSelfEvals,
} from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  emptyAssistantState,
  parseAssistantState,
  reflectionAssistantStateV1Schema,
  serializeAssistantState,
  type ReflectionAssistantStateV1,
} from "@/lib/reflection/assistant-state";

const anchorRequestSchema = z.object({
  reflectionId: z.string().min(1),
  anchorRoleIds: z.array(z.string()).max(3).optional(),
});

const saveAssistantStateSchema = z.object({
  reflectionId: z.string().min(1),
  state: z.unknown(),
});

const proposalRequestSchema = z.object({
  reflectionId: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

function nowIso() {
  return new Date().toISOString();
}

async function requireDraftReflectionForUser(
  reflectionId: string,
  userId: string,
) {
  const [row] = await db
    .select()
    .from(reflectionSessions)
    .where(
      and(
        eq(reflectionSessions.id, reflectionId),
        eq(reflectionSessions.userId, userId),
      ),
    )
    .limit(1);
  if (!row || row.status !== "draft") return null;
  return row;
}

async function loadPreparationRoleIds(preparationId: string | null) {
  if (!preparationId) {
    return { strengthenRoleIds: [] as string[], downregulateRoleIds: [] as string[] };
  }
  const rows = await db
    .select({
      roleId: preparationRoles.roleId,
      type: preparationRoles.type,
    })
    .from(preparationRoles)
    .where(eq(preparationRoles.preparationId, preparationId));
  const strengthenRoleIds: string[] = [];
  const downregulateRoleIds: string[] = [];
  for (const r of rows) {
    if (r.type === "strengthen") strengthenRoleIds.push(r.roleId);
    else downregulateRoleIds.push(r.roleId);
  }
  return { strengthenRoleIds, downregulateRoleIds };
}

async function loadFocusImproveRoleIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ roleId: userConsultingRoleSelfEvals.roleId })
    .from(userConsultingRoleSelfEvals)
    .where(
      and(
        eq(userConsultingRoleSelfEvals.userId, userId),
        eq(userConsultingRoleSelfEvals.sentiment, "focus_improve"),
      ),
    );
  return rows.map((r) => r.roleId);
}

async function roleNamesMap(ids: string[]): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const rows = await db
    .select({ id: consultingRoles.id, name: consultingRoles.name })
    .from(consultingRoles)
    .where(inArray(consultingRoles.id, ids));
  return new Map(rows.map((r) => [r.id, r.name]));
}

function buildRoleContextDescription(params: {
  strengthenRoleIds: string[];
  downregulateRoleIds: string[];
  anchorRoleIds: string[];
  focusImproveRoleIds: string[];
  nameById: Map<string, string>;
}): string {
  const lines: string[] = [];
  const fmt = (ids: string[], label: string) => {
    if (!ids.length) return;
    const names = ids.map(
      (id) => `${params.nameById.get(id) ?? id} (${id})`,
    );
    lines.push(`${label}: ${names.join(", ")}`);
  };
  fmt(params.strengthenRoleIds, "Role k posílení v přípravě");
  fmt(params.downregulateRoleIds, "Role k tlumení v přípravě");
  fmt(params.anchorRoleIds, "Kotvicí role zvolené expertem");
  fmt(params.focusImproveRoleIds, "Role k zaměření ze sebeohodnocení (orientace)");
  if (!lines.length) {
    lines.push(
      "Žádné konkrétní role v kontextu — ptej se obecně v rámcích JIC a korpusu.",
    );
  }
  return lines.join("\n");
}

async function persistAssistantState(
  reflectionId: string,
  state: ReflectionAssistantStateV1,
) {
  const t = nowIso();
  await db
    .update(reflectionSessions)
    .set({
      assistantState: serializeAssistantState(state),
      updatedAt: t,
    })
    .where(eq(reflectionSessions.id, reflectionId));
  revalidatePath("/reflections");
  revalidatePath(`/reflections/${reflectionId}`);
}

async function validateProposalAgainstDb(data: {
  principleIds: string[];
  roles: { roleId: string; calibration: string }[];
}) {
  const pValid = await db
    .select({ id: principles.id })
    .from(principles)
    .where(inArray(principles.id, data.principleIds));
  const allowedP = new Set(pValid.map((x) => x.id));

  const rValid = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles)
    .where(inArray(consultingRoles.id, data.roles.map((r) => r.roleId)));
  const allowedR = new Set(rValid.map((x) => x.id));

  return {
    principleIds: data.principleIds.filter((id) => allowedP.has(id)),
    roles: data.roles.filter((r) => allowedR.has(r.roleId)),
  };
}

export async function saveReflectionAssistantState(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }
  const parsed = saveAssistantStateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Neplatná data" };
  }
  const stateParsed = reflectionAssistantStateV1Schema.safeParse(
    parsed.data.state,
  );
  if (!stateParsed.success) {
    return { ok: false, error: "Neplatný stav asistenta" };
  }
  const row = await requireDraftReflectionForUser(
    parsed.data.reflectionId,
    session.user.id,
  );
  if (!row) {
    return { ok: false, error: "Reflexe nebyla nalezena nebo není rozpracovaná" };
  }
  await persistAssistantState(parsed.data.reflectionId, stateParsed.data);
  return { ok: true };
}

export async function generateReflectionAssistantQuestions(
  raw: unknown,
): Promise<
  { ok: true; state: ReflectionAssistantStateV1 } | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }
  const parsed = anchorRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Neplatná data" };
  }
  const row = await requireDraftReflectionForUser(
    parsed.data.reflectionId,
    session.user.id,
  );
  if (!row) {
    return { ok: false, error: "Reflexe nebyla nalezena nebo není rozpracovaná" };
  }

  const prep = await loadPreparationRoleIds(row.preparationId);
  let anchorRoleIds = (parsed.data.anchorRoleIds ?? []).slice(0, 3);
  const validRoleIds = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles);
  const allowed = new Set(validRoleIds.map((r) => r.id));
  anchorRoleIds = anchorRoleIds.filter((id) => allowed.has(id));

  const hasPrepSignal =
    prep.strengthenRoleIds.length > 0 || prep.downregulateRoleIds.length > 0;

  let focusImproveRoleIds: string[] = [];
  if (!hasPrepSignal && anchorRoleIds.length === 0) {
    focusImproveRoleIds = await loadFocusImproveRoleIds(session.user.id);
  }

  const nameIds = [
    ...prep.strengthenRoleIds,
    ...prep.downregulateRoleIds,
    ...anchorRoleIds,
    ...focusImproveRoleIds,
  ];
  const nameById = await roleNamesMap([...new Set(nameIds)]);

  const roleContextDescription = buildRoleContextDescription({
    strengthenRoleIds: prep.strengthenRoleIds,
    downregulateRoleIds: prep.downregulateRoleIds,
    anchorRoleIds: hasPrepSignal ? [] : anchorRoleIds,
    focusImproveRoleIds:
      hasPrepSignal || anchorRoleIds.length > 0 ? [] : focusImproveRoleIds,
    nameById,
  });

  const queryParts = [
    row.consultationLabel ?? "",
    roleContextDescription,
  ].join(" ");

  try {
    const ragContext = await buildJicRagContext(queryParts);
    const questionTexts = await generateQuestionTexts({
      ragContext,
      consultationLabel: row.consultationLabel,
      roleContextDescription,
    });
    const questions = questionTexts.map((text) => ({
      id: crypto.randomUUID(),
      text,
    }));
    const next: ReflectionAssistantStateV1 = {
      v: 1,
      phase: "questions",
      questions,
      answers: Object.fromEntries(questions.map((q) => [q.id, ""])),
      anchorRoleIds: hasPrepSignal ? [] : anchorRoleIds,
      lastError: undefined,
    };
    await persistAssistantState(parsed.data.reflectionId, next);
    return { ok: true, state: next };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Generování otázek selhalo";
    const prev = parseAssistantState(row.assistantState) ?? emptyAssistantState();
    const failed: ReflectionAssistantStateV1 = {
      ...prev,
      phase: "idle",
      lastError: message,
    };
    await persistAssistantState(parsed.data.reflectionId, failed);
    return { ok: false, error: message };
  }
}

export async function generateReflectionAssistantProposal(
  raw: unknown,
): Promise<
  | { ok: true; state: ReflectionAssistantStateV1 }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }
  const parsed = proposalRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Neplatná data" };
  }
  const row = await requireDraftReflectionForUser(
    parsed.data.reflectionId,
    session.user.id,
  );
  if (!row) {
    return { ok: false, error: "Reflexe nebyla nalezena nebo není rozpracovaná" };
  }

  const current =
    parseAssistantState(row.assistantState) ?? emptyAssistantState();
  if (current.phase !== "questions" || !current.questions.length) {
    return { ok: false, error: "Nejdřív vygenerujte reflexivní otázky" };
  }

  const answers = { ...current.answers, ...parsed.data.answers };
  const prep = await loadPreparationRoleIds(row.preparationId);
  const hasPrepSignal =
    prep.strengthenRoleIds.length > 0 || prep.downregulateRoleIds.length > 0;
  const anchorRoleIds = current.anchorRoleIds ?? [];
  let focusImproveRoleIds: string[] = [];
  if (!hasPrepSignal && anchorRoleIds.length === 0) {
    focusImproveRoleIds = await loadFocusImproveRoleIds(session.user.id);
  }
  const nameById = await roleNamesMap(
    [
      ...prep.strengthenRoleIds,
      ...prep.downregulateRoleIds,
      ...anchorRoleIds,
      ...focusImproveRoleIds,
    ].filter((id, i, a) => a.indexOf(id) === i),
  );
  const roleContextDescription = buildRoleContextDescription({
    strengthenRoleIds: prep.strengthenRoleIds,
    downregulateRoleIds: prep.downregulateRoleIds,
    anchorRoleIds: hasPrepSignal ? [] : anchorRoleIds,
    focusImproveRoleIds:
      hasPrepSignal || anchorRoleIds.length > 0 ? [] : focusImproveRoleIds,
    nameById,
  });

  const questionsAndAnswers = current.questions.map((q) => ({
    question: q.text,
    answer: answers[q.id] ?? "",
  }));

  const queryParts = [
    row.consultationLabel ?? "",
    ...questionsAndAnswers.flatMap((x) => [x.question, x.answer]),
  ].join(" ");

  try {
    const ragContext = await buildJicRagContext(queryParts);
    const rawProposal = await generateStructuredProposal({
      ragContext,
      consultationLabel: row.consultationLabel,
      roleContextDescription,
      questionsAndAnswers,
    });
    const cleaned = await validateProposalAgainstDb(rawProposal);
    const next: ReflectionAssistantStateV1 = {
      ...current,
      phase: "proposal",
      answers,
      proposal: {
        principleIds: cleaned.principleIds,
        roles: cleaned.roles as {
          roleId: string;
          calibration: "underused" | "balanced" | "overused";
        }[],
        learningNote: rawProposal.learningNote.slice(0, 4000),
      },
      lastError: undefined,
    };
    await persistAssistantState(parsed.data.reflectionId, next);
    return { ok: true, state: next };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Generování návrhu selhalo";
    const next: ReflectionAssistantStateV1 = {
      ...current,
      answers,
      lastError: message,
    };
    await persistAssistantState(parsed.data.reflectionId, next);
    return { ok: false, error: message };
  }
}
