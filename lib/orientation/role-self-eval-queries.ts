import "server-only";

import { db } from "@/lib/db";
import {
  consultingRoles,
  userConsultingRoleSelfEvals,
  type RoleSelfEvalSentiment,
} from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";

export type RoleSelfEvalSummary = {
  /** Počet rolí v katalogu (očekává se 16). */
  totalRoles: number;
  /** Kolik rolí má uložené sebeohodnocení. */
  evaluatedCount: number;
  isComplete: boolean;
  /** Názvy rolí ve stavu „chci se zlepšovat“, seřazené jako katalog. */
  focusRoleNames: string[];
  mapByRoleId: Record<string, RoleSelfEvalSentiment>;
};

export async function getRoleSelfEvalSummaryForUser(
  userId: string,
): Promise<RoleSelfEvalSummary> {
  const catalog = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles)
    .orderBy(asc(consultingRoles.phaseKey), asc(consultingRoles.sortOrder));

  const totalRoles = catalog.length;
  const ids = catalog.map((r) => r.id);

  const rows = await db
    .select({
      roleId: userConsultingRoleSelfEvals.roleId,
      sentiment: userConsultingRoleSelfEvals.sentiment,
    })
    .from(userConsultingRoleSelfEvals)
    .where(eq(userConsultingRoleSelfEvals.userId, userId));

  const mapByRoleId = Object.fromEntries(
    rows.map((r) => [r.roleId, r.sentiment]),
  ) as Record<string, RoleSelfEvalSentiment>;

  const evaluatedCount = ids.filter((id) => mapByRoleId[id] !== undefined).length;
  const isComplete = totalRoles > 0 && evaluatedCount === totalRoles;

  const focusRoleNames =
    totalRoles === 0
      ? []
      : (
          await db
            .select({ name: consultingRoles.name })
            .from(userConsultingRoleSelfEvals)
            .innerJoin(
              consultingRoles,
              eq(userConsultingRoleSelfEvals.roleId, consultingRoles.id),
            )
            .where(
              and(
                eq(userConsultingRoleSelfEvals.userId, userId),
                eq(userConsultingRoleSelfEvals.sentiment, "focus_improve"),
              ),
            )
            .orderBy(asc(consultingRoles.phaseKey), asc(consultingRoles.sortOrder))
        ).map((r) => r.name);

  return {
    totalRoles,
    evaluatedCount,
    isComplete,
    focusRoleNames,
    mapByRoleId,
  };
}

/** Ověří, že roleId patří do katalogu konzultantských rolí. */
export async function consultingRoleExists(roleId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: consultingRoles.id })
    .from(consultingRoles)
    .where(eq(consultingRoles.id, roleId))
    .limit(1);
  return !!row;
}
