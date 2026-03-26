/**
 * Veřejné cesty k ilustracím situčních rolí (`public/…`).
 * Soubory vložte do `public/`; názvy musí odpovídat hodnotám níže.
 */
export const ROLE_IMAGE_PATHS: Record<string, string> = {
  "r-situator": "/roles_situator.png",
  "r-strazce-mandatu": "/roles_strazce-mandatu.png",
  "r-cilotvurce": "/roles_cilotvurce.png",
  "r-hlidac-zdroju": "/roles_hlidac-zdroju.png",
  "r-mapovac-dna": "/roles_mapovac-dna.png",
  "r-diagnostik-roli": "/roles_diagnostik-roli.png",
  "r-posluchac": "/roles_posluchac.png",
  "r-validator": "/roles_validator.png",
  "r-moderator-sezeni": "/roles_moderator-sezeni.png",
  "r-facilitator-dohody": "/roles_facilitator-dohody.png",
  "r-konfrontator": "/roles_konfrontator.png",
  "r-kalibrator": "/roles_kalibrator.png",
  "r-artefaktar": "/roles_artefaktar.png",
  "r-navrhar-reseni": "/roles_navrhar-reseni.png",
  "r-aktivator-klienta": "/roles_aktivator-klienta.png",
  "r-kurator-navaznosti": "/roles_kurator-navaznosti.png",
};

export function roleImagePath(roleId: string): string | null {
  return ROLE_IMAGE_PATHS[roleId] ?? null;
}
