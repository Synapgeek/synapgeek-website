export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function getLocalePath(locale: Locale, path: string) {
  if (locale === DEFAULT_LOCALE) return path;
  // Racine d'une locale non par défaut : "/en" sans slash final, sinon 308 vers "/en".
  if (path === "/") return `/${locale}`;
  // Ancre sur la racine ("/#features") : "/en#features", pas "/en/#features".
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}
