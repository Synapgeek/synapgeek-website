import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { LOCALES, getLocalePath } from "./i18n";

const BASE_URL = "https://synapgeek.com";

// Locale ciblée par l'annotation hreflang "x-default" (utilisateurs sans
// préférence de langue détectée). Distincte de DEFAULT_LOCALE (fr), qui régit
// le routage sans préfixe : on ne touche qu'à l'annotation SEO, pas aux URLs.
export const X_DEFAULT_LOCALE: Locale = "en";

export function getAlternates(locale: Locale, path: string) {
  const canonical = `${BASE_URL}${getLocalePath(locale, path)}`;

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}${getLocalePath(loc, path)}`;
  }
  languages["x-default"] =
    `${BASE_URL}${getLocalePath(X_DEFAULT_LOCALE, path)}`;

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

/**
 * Construit un objet openGraph complet pour une page.
 * Next.js fusionne les métadonnées de façon superficielle : si une page
 * redéfinit `openGraph`, l'objet du layout (siteName, locale, images…) est
 * entièrement remplacé plutôt que fusionné. Ce helper reconstruit donc tout,
 * y compris l'og:image, pour que chaque page reste complète isolément.
 */
export function buildOpenGraph(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    type: "website",
    url: `${BASE_URL}${getLocalePath(locale, path)}`,
    siteName: "Synapgeek",
    locale: getOgLocale(locale),
    alternateLocale: getOgAlternateLocales(locale),
    images: [{ url: "/images/brand/og-image.jpeg", width: 1200, height: 630 }],
  };
}
