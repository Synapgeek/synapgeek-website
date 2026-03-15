export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function getLocalePath(locale: Locale, path: string) {
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path}`;
}
