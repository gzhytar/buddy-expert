import { db } from "@/lib/db";
import { consultingRoles, principles } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getPrinciplesOrdered() {
  return db
    .select()
    .from(principles)
    .orderBy(asc(principles.sortOrder));
}

export async function getRolesOrdered() {
  return db
    .select()
    .from(consultingRoles)
    .orderBy(asc(consultingRoles.phaseKey), asc(consultingRoles.sortOrder));
}

export type RolePhaseGroup = {
  phaseKey: string;
  phaseLabel: string;
  roles: (typeof consultingRoles.$inferSelect)[];
};

export async function getRolesGroupedByPhase(): Promise<RolePhaseGroup[]> {
  const rows = await getRolesOrdered();
  const order: string[] = [];
  const map = new Map<string, RolePhaseGroup>();

  for (const r of rows) {
    let g = map.get(r.phaseKey);
    if (!g) {
      g = { phaseKey: r.phaseKey, phaseLabel: r.phaseLabel, roles: [] };
      map.set(r.phaseKey, g);
      order.push(r.phaseKey);
    }
    g.roles.push(r);
  }

  return order.map((k) => map.get(k)!);
}
