import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { LOCALES } from "./i18n";
import { absoluteUrl, alternatesFor, type PageId } from "./routes";

export function getAlternates(pageId: PageId, locale: Locale) {
  return {
    canonical: absoluteUrl(pageId, locale),
    languages: alternatesFor(pageId).languages,
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
  pageId: PageId,
  title: string,
  description: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    type: "website",
    url: absoluteUrl(pageId, locale),
    siteName: "Synapgeek",
    locale: getOgLocale(locale),
    alternateLocale: getOgAlternateLocales(locale),
    images: [{ url: "/images/brand/og-image.jpeg", width: 1200, height: 630 }],
  };
}
