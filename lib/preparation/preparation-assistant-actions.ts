"use server";

import { auth } from "@/auth";
import { generatePreparationReflectiveQuestionTexts } from "@/lib/ai/reflection-assistant-openrouter";
import { buildJicRagContext } from "@/lib/ai/rag-context";
import { db } from "@/lib/db";
import { consultingRoles, preparationSessions } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  serializePreparationAssistantState,
  type PreparationAssistantStateV1,
} from "@/lib/preparation/preparation-assistant-state";

const generateReflectiveQuestionsSchema = z.object({
  preparationId: z.string().min(1),
  roles: z.array(
    z.object({
      roleId: z.string().min(1),
      type: z.enum(["strengthen", "downregulate"]),
    }),
  ),
  consultationLabel: z.string().max(200).optional(),
  occurredAt: z.string().max(32).optional(),
});

function nowIso(): string {
  return new Date().toISOString();
}

function firstNonEmptyTrimmed(
  ...values: (string | null | undefined)[]
): string | null {
  for (const v of values) {
    const t = v?.trim();
    if (t) {
      return t;
    }
  }
  return null;
}

function errorMessageFromUnknown(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message;
    if (m.includes("OPENROUTER_API_KEY")) {
      return "Služba AI není nakonfigurována (chybí OPENROUTER_API_KEY). Otázky nelze vygenerovat; zbytek přípravy funguje normálně.";
    }
    if (m.startsWith("OpenRouter ")) {
      return "Služba AI je dočasně nedostupná nebo odmítla požadavek. Zkuste to později nebo zapište záměr ručně.";
    }
    if (m === "Model vrátil neplatný formát otázek" || m === "Prázdná odpověď modelu") {
      return "Odpověď AI byla nečitelná. Zkuste generování znovu nebo pokračujte bez něj.";
    }
    return m.length > 200 ? `${m.slice(0, 200)}…` : m;
  }
  return "Neočekávaná chyba při generování otázek.";
}

async function roleNamesMap(ids: string[]): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const rows = await db
    .select({ id: consultingRoles.id, name: consultingRoles.name })
    .from(consultingRoles)
    .where(inArray(consultingRoles.id, ids));
  return new Map(rows.map((r) => [r.id, r.name]));
}

function buildPreparationRoleContextDescription(params: {
  strengthenRoleIds: string[];
  downregulateRoleIds: string[];
  nameById: Map<string, string>;
}): string {
  const lines: string[] = [];

  function addLine(label: string, ids: string[]): void {
    if (ids.length === 0) {
      return;
    }
    const names = ids.map(
      (id) => `${params.nameById.get(id) ?? id} (${id})`,
    );
    lines.push(`${label}: ${names.join(", ")}`);
  }

  addLine("Role k posílení", params.strengthenRoleIds);
  addLine("Role k tlumení (nepřepálit)", params.downregulateRoleIds);

  if (lines.length === 0) {
    return "Žádné role nejsou vybrány.";
  }
  return lines.join("\n");
}

function ragQueryFromContext(params: {
  label?: string;
  strengthenRoleIds: string[];
  downregulateRoleIds: string[];
  nameById: Map<string, string>;
}): string {
  const parts: string[] = ["příprava konzultace před schůzkou záměr role"];
  if (params.label?.trim()) parts.push(params.label.trim());
  for (const id of params.strengthenRoleIds) {
    parts.push(params.nameById.get(id) ?? id);
  }
  for (const id of params.downregulateRoleIds) {
    parts.push(params.nameById.get(id) ?? id);
  }
  return parts.join(" ");
}

export async function generatePreparationReflectiveQuestions(
  raw: unknown,
): Promise<
  | { ok: true; state: PreparationAssistantStateV1 }
  | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Neautorizováno" };
  }

  const parsed = generateReflectiveQuestionsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Neplatný požadavek",
    };
  }

  const { preparationId, roles, consultationLabel, occurredAt } = parsed.data;
  if (roles.length === 0) {
    return {
      ok: false,
      error:
        "Nejdřív v kroku Role vyberte alespoň jednu roli k posílení nebo k tlumení.",
    };
  }

  const [prep] = await db
    .select()
    .from(preparationSessions)
    .where(
      and(
        eq(preparationSessions.id, preparationId),
        eq(preparationSessions.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!prep) {
    return { ok: false, error: "Příprava nebyla nalezena" };
  }

  const strengthenRoleIds = roles
    .filter((r) => r.type === "strengthen")
    .map((r) => r.roleId);
  const downregulateRoleIds = roles
    .filter((r) => r.type === "downregulate")
    .map((r) => r.roleId);
  const allIds = [...new Set(roles.map((r) => r.roleId))];

  const validRows = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles)
    .where(inArray(consultingRoles.id, allIds));
  if (validRows.length !== allIds.length) {
    return { ok: false, error: "Neplatný výběr rolí." };
  }

  const nameById = await roleNamesMap(allIds);
  const roleContextDescription = buildPreparationRoleContextDescription({
    strengthenRoleIds,
    downregulateRoleIds,
    nameById,
  });

  const labelForPrompt = firstNonEmptyTrimmed(
    consultationLabel,
    prep.consultationLabel,
  );
  const whenForPrompt = firstNonEmptyTrimmed(occurredAt, prep.occurredAt);

  let questions: string[];
  try {
    const ragQuery = ragQueryFromContext({
      label: labelForPrompt ?? undefined,
      strengthenRoleIds,
      downregulateRoleIds,
      nameById,
    });
    const ragContext = await buildJicRagContext(ragQuery);
    questions = await generatePreparationReflectiveQuestionTexts({
      ragContext,
      consultationLabel: labelForPrompt,
      plannedWhen: whenForPrompt,
      roleContextDescription,
    });
  } catch (e) {
    return { ok: false, error: errorMessageFromUnknown(e) };
  }

  const state: PreparationAssistantStateV1 = {
    version: 1,
    reflectiveQuestions: questions,
    generatedAt: nowIso(),
  };

  const t = nowIso();
  await db
    .update(preparationSessions)
    .set({
      preparationAssistantState: serializePreparationAssistantState(state),
      updatedAt: t,
    })
    .where(eq(preparationSessions.id, preparationId));

  revalidatePath("/preparations");
  revalidatePath(`/preparations/${preparationId}`);
  return { ok: true, state };
}
