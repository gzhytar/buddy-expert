import "server-only";

import { z } from "zod";

const questionsResponseSchema = z.object({
  questions: z.array(z.string().min(8)).min(3).max(5),
});

const proposalResponseSchema = z.object({
  principleIds: z.array(z.string()),
  roles: z.array(
    z.object({
      roleId: z.string(),
      calibration: z.enum(["underused", "balanced", "overused"]),
    }),
  ),
  learningNote: z.string().min(1).max(4000),
});

function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY není nastaven");
  }
  const model =
    process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";
  return { apiKey, model };
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  const raw = fence ? fence[1].trim() : trimmed;
  return JSON.parse(raw) as unknown;
}

async function openRouterChatJson(params: {
  system: string;
  user: string;
  timeoutMs?: number;
}): Promise<unknown> {
  const { apiKey, model } = getOpenRouterConfig();
  const timeoutMs = params.timeoutMs ?? 55_000;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.35,
      max_tokens: 2500,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `OpenRouter ${res.status}: ${errText.slice(0, 200) || res.statusText}`,
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Prázdná odpověď modelu");
  }
  return extractJsonObject(content);
}

async function completeQuestionsChat(params: {
  system: string;
  user: string;
}): Promise<string[]> {
  const json = await openRouterChatJson(params);
  const parsed = questionsResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Model vrátil neplatný formát otázek");
  }
  return parsed.data.questions;
}

export async function generateQuestionTexts(params: {
  ragContext: string;
  consultationLabel: string | null;
  roleContextDescription: string;
}): Promise<string[]> {
  const system = `Jsi asistent pro interní reflexi konzultanta JIC. Odpovídej výhradně JSON objektem ve tvaru {"questions":["...","..."]}.
Pravidla:
- 3 až 5 krátkých reflexivních otázek v češtině, vykání.
- Otázky nesmí být hodnotící ani jako kontrola výkonu; podporují uvědomění a kalibraci rolí.
- Vycházej z kontextu rolí a z dodaného korpusu JIC. Nepřidávej obecné poradenství mimo rámec JIC.`;

  const user = `Kontext konzultace (volitelný název): ${params.consultationLabel ?? "—"}

${params.roleContextDescription}

---

Korpus JIC (principy a role):

${params.ragContext}

---

Vrať JSON: {"questions":["otázka1",...]}`;

  return completeQuestionsChat({ system, user });
}

export async function generatePreparationReflectiveQuestionTexts(params: {
  ragContext: string;
  consultationLabel: string | null;
  plannedWhen: string | null;
  roleContextDescription: string;
}): Promise<string[]> {
  const system = `Jsi asistent pro přípravu konzultanta JIC před schůzkou. Odpovídej výhradně JSON objektem ve tvaru {"questions":["...","..."]}.
Pravidla:
- 3 až 5 krátkých reflexivních otázek v češtině, vykání.
- Otázky pomáhají promyslet záměr před setkáním; nesmí být hodnotící, příkazové ani jako kontrola výkonu.
- Vycházej z rolí, které expert chce posílit nebo tlumit, a z dodaného korpusu JIC. Nepřidávej obecné rady mimo rámec JIC.`;

  const user = `Kontext schůzky
Název (volitelně): ${params.consultationLabel ?? "—"}
Plánovaný čas (volitelně): ${params.plannedWhen ?? "—"}

${params.roleContextDescription}

---

Korpus JIC (principy a role):

${params.ragContext}

---

Vrať JSON: {"questions":["otázka1",...]}`;

  return completeQuestionsChat({ system, user });
}

export async function generateStructuredProposal(params: {
  ragContext: string;
  consultationLabel: string | null;
  roleContextDescription: string;
  questionsAndAnswers: { question: string; answer: string }[];
}): Promise<z.infer<typeof proposalResponseSchema>> {
  const system = `Jsi asistent pro strukturování reflexe konzultanta JIC. Odpověz pouze JSON objektem:
{"principleIds":["id",...],"roles":[{"roleId":"...","calibration":"underused|balanced|overused"},...],"learningNote":"..."}

Pravidla:
- principleIds a roleId MUSÍ být přesně z katalogu id v korpusu (žádné vymyšlené id).
- Vyber rozumný počet principů (1–6) a rolí (1–8) podle odpovědí uživatele.
- calibration: underused = málo, balanced = akorát, overused = přehřátá role.
- learningNote: jedno stručné poučení v češtině, ne hodnocení.
- Tón podpůrný, ne represivní.`;

  const qa = params.questionsAndAnswers
    .map(
      (x, i) =>
        `Otázka ${i + 1}: ${x.question}\nOdpověď: ${x.answer || "(prázdné)"}`,
    )
    .join("\n\n");

  const user = `Kontext konzultace: ${params.consultationLabel ?? "—"}

${params.roleContextDescription}

---

Odpovědi experta na reflexivní otázky:

${qa}

---

Korpus JIC (katalog id je závazný):

${params.ragContext}`;

  const json = await openRouterChatJson({ system, user });
  const parsed = proposalResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Model vrátil neplatný návrh struktury");
  }
  return parsed.data;
}
