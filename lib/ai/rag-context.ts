import "server-only";

import { parseBulletList } from "@/lib/consulting-roles/card-content";
import { db } from "@/lib/db";
import { consultingRoles, principles } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[\s,.;:!?()[\]„"“]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2),
  );
}

function scoreOverlap(text: string, queryTokens: Set<string>): number {
  const t = tokenize(text);
  let n = 0;
  for (const q of queryTokens) {
    if (t.has(q)) n++;
  }
  return n;
}

/**
 * Sestaví textový kontext pro prompt: top úryvky podle jednoduché shody slov + kompaktní katalog id (RAG fallback bez pgvector).
 */
export async function buildJicRagContext(query: string): Promise<string> {
  const queryTokens = tokenize(query || "konzultace reflexe role principy");

  const [allPrinciples, allRoles] = await Promise.all([
    db.select().from(principles).orderBy(asc(principles.sortOrder)),
    db.select().from(consultingRoles).orderBy(asc(consultingRoles.sortOrder)),
  ]);

  const principleChunks = allPrinciples.map((p) => ({
    id: p.id,
    score: scoreOverlap(
      `${p.title} ${p.summary} ${p.learningTips}`.slice(0, 1200),
      queryTokens,
    ),
    body: `Princip [${p.id}]: ${p.title}\n${p.summary}`,
  }));

  const roleChunks = allRoles.map((r) => {
    const usefulJoined = parseBulletList(r.usefulBullets).join(" · ");
    const riskJoined = parseBulletList(r.riskBullets).join(" · ");
    const desc = [
      r.name,
      r.summaryLine ?? "",
      r.description ?? "",
      r.whatItDoes ?? "",
      usefulJoined,
      riskJoined,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 2500);
    const bulletBlock = [
      usefulJoined &&
        `Užitečné projevy: ${usefulJoined}`,
      riskJoined && `Rizika při přepálení: ${riskJoined}`,
    ]
      .filter(Boolean)
      .join("\n");
    const core = [
      `Role [${r.id}]: ${r.name}`,
      r.summaryLine ?? r.description ?? "",
      r.whatItDoes ?? "",
      bulletBlock,
    ]
      .filter(Boolean)
      .join("\n");
    return {
      id: r.id,
      score: scoreOverlap(desc, queryTokens),
      body: core.slice(0, 2200),
    };
  });

  principleChunks.sort((a, b) => b.score - a.score);
  roleChunks.sort((a, b) => b.score - a.score);

  const topP = principleChunks.slice(0, 5);
  const topR = roleChunks.slice(0, 6);

  const catalogP = allPrinciples
    .map((p) => `- ${p.id}: ${p.title}`)
    .join("\n");
  const catalogR = allRoles.map((r) => `- ${r.id}: ${r.name}`).join("\n");

  const sections = [
    "## Nejvíce související principy (úryvky)",
    topP.map((c) => c.body).join("\n\n---\n\n") || "(žádné)",
    "## Nejvíce související role (úryvky)",
    topR.map((c) => c.body).join("\n\n---\n\n") || "(žádné)",
    "## Úplný katalog principů (id a název — vybírejte pouze odtud)",
    catalogP,
    "## Úplný katalog rolí (id a název — vybírejte pouze odtud)",
    catalogR,
  ];

  return sections.join("\n\n");
}
