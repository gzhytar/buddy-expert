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
  preparationSessions,
  principles,
  reflectionPrinciples,
  reflectionRoleCalibrations,
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
  learningNoteContext: z.string().max(4000).optional(),
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

async function loadPreparationFocusNote(
  preparationId: string | null,
): Promise<string | null> {
  if (!preparationId?.trim()) return null;
  const [row] = await db
    .select({ focusNote: preparationSessions.focusNote })
    .from(preparationSessions)
    .where(eq(preparationSessions.id, preparationId.trim()))
    .limit(1);
  return row?.focusNote ?? null;
}

const CALIBRATION_CS: Record<string, string> = {
  underused: "podhodnocená",
  balanced: "vyvážená",
  overused: "přehřátá",
};

async function loadReflectionDraftContextDescription(
  reflectionId: string,
): Promise<string> {
  const pRows = await db
    .select({ title: principles.title })
    .from(reflectionPrinciples)
    .innerJoin(
      principles,
      eq(reflectionPrinciples.principleId, principles.id),
    )
    .where(eq(reflectionPrinciples.reflectionId, reflectionId));

  const rRows = await db
    .select({
      name: consultingRoles.name,
      calibration: reflectionRoleCalibrations.calibration,
    })
    .from(reflectionRoleCalibrations)
    .innerJoin(
      consultingRoles,
      eq(reflectionRoleCalibrations.roleId, consultingRoles.id),
    )
    .where(eq(reflectionRoleCalibrations.reflectionId, reflectionId));

  const lines: string[] = [];
  if (pRows.length > 0) {
    const titles = pRows.map((x) => x.title).filter(Boolean);
    if (titles.length > 0) {
      lines.push(
        `Principy z Konzultantského desatera zapsané v reflexi: ${titles.join("; ")}`,
      );
    }
  }
  if (rRows.length > 0) {
    const parts = rRows.map(
      (r) =>
        `${r.name} (${CALIBRATION_CS[r.calibration] ?? r.calibration})`,
    );
    lines.push(
      `Situační role zapsané v reflexi s kalibrací: ${parts.join(", ")}`,
    );
  }
  return lines.join("\n");
}

type ReflectionSessionRow = NonNullable<
  Awaited<ReturnType<typeof requireDraftReflectionForUser>>
>;

async function buildReflectionAssistantInferencePack(
  row: ReflectionSessionRow,
  userId: string,
  anchorRoleIdsRaw: string[],
): Promise<{
  primaryPreparationIntent: string | null;
  roleContextDescription: string;
  ragQueryString: string;
  anchorRoleIdsForState: string[];
}> {
  const prepFocus = await loadPreparationFocusNote(row.preparationId);
  const primaryPreparationIntent =
    prepFocus?.trim() ? prepFocus.trim().slice(0, 3000) : null;

  const reflectionDraftDesc =
    await loadReflectionDraftContextDescription(row.id);
  const prep = await loadPreparationRoleIds(row.preparationId);
  const hasPrepSignal =
    prep.strengthenRoleIds.length > 0 || prep.downregulateRoleIds.length > 0;

  const validRoleRows = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles);
  const allowed = new Set(validRoleRows.map((r) => r.id));
  const anchorRoleIds = anchorRoleIdsRaw.slice(0, 3).filter((id) =>
    allowed.has(id),
  );

  let focusImproveRoleIds: string[] = [];
  if (!hasPrepSignal && anchorRoleIds.length === 0) {
    focusImproveRoleIds = await loadFocusImproveRoleIds(userId);
  }

  const nameIds = [
    ...prep.strengthenRoleIds,
    ...prep.downregulateRoleIds,
    ...anchorRoleIds,
    ...focusImproveRoleIds,
  ];
  const nameById = await roleNamesMap([...new Set(nameIds)]);

  const supplemental = buildRoleContextDescription({
    strengthenRoleIds: prep.strengthenRoleIds,
    downregulateRoleIds: prep.downregulateRoleIds,
    anchorRoleIds: hasPrepSignal ? [] : anchorRoleIds,
    focusImproveRoleIds:
      hasPrepSignal || anchorRoleIds.length > 0 ? [] : focusImproveRoleIds,
    nameById,
  });

  const mergedParts = [reflectionDraftDesc.trim() || null, supplemental].filter(
    Boolean,
  );
  const roleContextDescription = mergedParts.join("\n\n");

  const ragQueryString = [
    primaryPreparationIntent,
    row.consultationLabel ?? "",
    reflectionDraftDesc,
    supplemental,
  ]
    .filter((x) => x != null && String(x).trim() !== "")
    .join("\n");

  return {
    primaryPreparationIntent,
    roleContextDescription,
    ragQueryString,
    anchorRoleIdsForState: hasPrepSignal ? [] : anchorRoleIds,
  };
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

  const pack = await buildReflectionAssistantInferencePack(
    row,
    session.user.id,
    parsed.data.anchorRoleIds ?? [],
  );

  try {
    const ragContext = await buildJicRagContext(pack.ragQueryString);
    const questionTexts = await generateQuestionTexts({
      ragContext,
      consultationLabel: row.consultationLabel,
      roleContextDescription: pack.roleContextDescription,
      primaryPreparationIntent: pack.primaryPreparationIntent,
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
      anchorRoleIds: pack.anchorRoleIdsForState,
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
  const learningNoteContext = parsed.data.learningNoteContext?.trim() ?? "";

  const pack = await buildReflectionAssistantInferencePack(
    row,
    session.user.id,
    current.anchorRoleIds ?? [],
  );

  const questionsAndAnswers = current.questions.map((q) => ({
    question: q.text,
    answer: answers[q.id] ?? "",
  }));

  const queryParts = [
    pack.ragQueryString,
    learningNoteContext,
    ...questionsAndAnswers.flatMap((x) => [x.question, x.answer]),
  ].join("\n");

  try {
    const ragContext = await buildJicRagContext(queryParts);
    const rawProposal = await generateStructuredProposal({
      ragContext,
      consultationLabel: row.consultationLabel,
      roleContextDescription: pack.roleContextDescription,
      questionsAndAnswers,
      primaryPreparationIntent: pack.primaryPreparationIntent,
      reflectionLearningNote: learningNoteContext || null,
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
