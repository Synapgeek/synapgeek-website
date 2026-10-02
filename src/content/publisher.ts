/**
 * Identité de l'éditeur : une seule source pour la page À propos, la page
 * Presse et le noeud Organization du JSON-LD. Les mentions légales (`/legal`)
 * restent le texte de référence ; `publisher.test.ts` vérifie que les deux
 * disent la même chose. Aucun import : module de données pur.
 */
export const PUBLISHER = {
  /** Nom d'usage (marque) et raison sociale. */
  brand: "Synapgeek",
  legalName: "Synapgeek SAS",
  /** Capital social, en euros. */
  capitalEur: 1000,
  address: {
    street: "185 chemin des Brosses",
    postalCode: "69620",
    locality: "Frontenas",
    /** Libellé identique dans les mentions légales FR et EN. */
    country: "France",
    /** Code ISO 3166-1 alpha-2 pour le JSON-LD. */
    countryCode: "FR",
  },
  /** Registre du commerce et des sociétés : greffe et numéro. */
  rcs: { registry: "Villefranche-Tarare", number: "102 429 826" },
  siret: "102 429 826 00013",
  ape: "62.01Z",
  vat: "FR86 102 429 826",
  publicationDirector: "Adrien Monte",
  host: "Vercel Inc.",
  contactEmail: "contact@synapgeek.com",
} as const;

/** « 185 chemin des Brosses, 69620 Frontenas, France » : l'adresse telle que les mentions légales l'écrivent. */
export function formatAddress(
  address: typeof PUBLISHER.address = PUBLISHER.address,
): string {
  return `${address.street}, ${address.postalCode} ${address.locality}, ${address.country}`;
}
