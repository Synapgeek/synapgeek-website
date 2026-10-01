// Aucun import : next.config.ts charge ce fichier par chemin relatif.
// URLs déclarées dans App Store Connect, la Play Console (Data Safety) et le
// consentement AdMob (UMP) : le français sert sans préfixe. `/fr/<page>` reste pour
// l'instant une page 200 qui porte son canonical vers l'URL sans préfixe ; un PR
// ultérieur y posera une redirection 307 (permanent: false), après preuve en
// production. Ne jamais renommer ni retirer ces chemins.
export const FROZEN_LEGAL_PATHS = ["/privacy", "/terms", "/legal"] as const;

/** Langue servie par les chemins figés ci-dessus (l'anglais vit sous `/en/<page>`). */
export const FROZEN_LEGAL_LOCALE = "fr" as const;
