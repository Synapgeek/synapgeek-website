import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { LOCALES } from "./i18n";
import { getDictionary } from "@/content";
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
 * L'image de partage du site : 1200x630, recadrée au centre de la source. Le nom
 * porte un suffixe de version, car /images/* se met en cache sept jours
 * (vercel.json) : changer l'image impose de renommer le fichier. L'alt vient du
 * Dictionnaire. Source unique du layout de langue et de `buildOpenGraph`.
 */
export const OG_IMAGE = {
  url: "/images/brand/og-image-v2.jpeg",
  width: 1200,
  height: 630,
} as const;

export function getOgImages(locale: Locale) {
  return [{ ...OG_IMAGE, alt: getDictionary(locale).common.ogImageAlt }];
}

/**
 * Construit un objet openGraph complet pour une page.
 * Next.js fusionne les métadonnées de façon superficielle : si une page
 * redéfinit `openGraph`, l'objet du layout (siteName, locale, images…) est
 * entièrement remplacé plutôt que fusionné. Ce helper reconstruit donc tout,
 * y compris l'og:image, pour que chaque page reste complète isolément.
 * `ownImage` : la page a son propre `opengraph-image` (convention de fichier de
 * Next) ; on ne pose alors pas l'image du site, sinon la page porterait deux
 * og:image.
 */
export function buildOpenGraph(
  locale: Locale,
  pageId: PageId,
  title: string,
  description: string,
  { ownImage = false }: { ownImage?: boolean } = {},
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    type: "website",
    url: absoluteUrl(pageId, locale),
    siteName: "Synapgeek",
    locale: getOgLocale(locale),
    alternateLocale: getOgAlternateLocales(locale),
    ...(!ownImage && { images: getOgImages(locale) }),
  };
}
