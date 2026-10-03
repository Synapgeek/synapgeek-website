export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
/** Langue du routage : l'anglais n'a pas de préfixe, le français vit sous /fr (hors pages légales figées). */
export const DEFAULT_LOCALE: Locale = "en";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
