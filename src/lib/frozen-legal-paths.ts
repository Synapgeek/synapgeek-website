// Aucun import : next.config.ts charge ce fichier par chemin relatif.
// URLs déclarées dans App Store Connect, la Play Console (Data Safety) et le
// consentement AdMob (UMP) : le français sert sans préfixe, `/fr/<page>` redirige
// en 308 vers elles. Ne jamais les renommer ni les retirer.
export const FROZEN_LEGAL_PATHS = ["/privacy", "/terms", "/legal"] as const;
