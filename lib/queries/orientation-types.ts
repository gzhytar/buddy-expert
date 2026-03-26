import type { ConsultingRole } from "@/lib/db/schema";

/** Seskupení rolí podle fáze — typ bez importu `lib/db` runtime (jen schéma typy). */
export type RolePhaseGroup = {
  phaseKey: string;
  phaseLabel: string;
  roles: ConsultingRole[];
};
