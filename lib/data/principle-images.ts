/**
 * Veřejné cesty k ilustracím principů (`public/…`).
 * Soubory vložte do `public/`; názvy musí odpovídat hodnotám níže (např. `principles_right-person.png`).
 */
export const PRINCIPLE_IMAGE_PATHS: Record<string, string> = {
  "p-1": "/principles_right-person.png",
  "p-2": "/principles_situate_first.png",
  "p-3": "/principles_agree-goal.png",
  "p-4": "/principles_client-responsibility.png",
  "p-5": "/principles_not-for-client.png",
  "p-6": "/principles_work-with-notes.png",
  "p-7": "/principles_concrete-subject.png",
  "p-8": "/principles_personal-differences.png",
  "p-9": "/principles_mutual-feedback.png",
  "p-10": "/principles_jic-systems.png",
};

export function principleImagePath(principleId: string): string | null {
  return PRINCIPLE_IMAGE_PATHS[principleId] ?? null;
}
