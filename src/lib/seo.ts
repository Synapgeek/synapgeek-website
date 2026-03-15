import type { Locale } from "./i18n";
import { LOCALES, DEFAULT_LOCALE, getLocalePath } from "./i18n";

const BASE_URL = "https://synapgeek.com";

export function getAlternates(locale: Locale, path: string) {
  const canonical = `${BASE_URL}${getLocalePath(locale, path)}`;

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}${getLocalePath(loc, path)}`;
  }
  languages["x-default"] = `${BASE_URL}${getLocalePath(DEFAULT_LOCALE, path)}`;

  return {
    canonical,
    languages,
  };
}

export function getOgLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    fr: "fr_FR",
    en: "en_US",
  };
  return map[locale];
}

export function getOgAlternateLocales(locale: Locale): string[] {
  return LOCALES.filter((l) => l !== locale).map((l) => {
    const map: Record<Locale, string> = {
      fr: "fr_FR",
      en: "en_US",
    };
    return map[l];
  });
}
