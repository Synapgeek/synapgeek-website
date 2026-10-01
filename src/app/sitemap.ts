import type { MetadataRoute } from "next";
import { LOCALES, getLocalePath, type Locale } from "@/lib/i18n";
import { X_DEFAULT_LOCALE } from "@/lib/seo";
import { getDictionary } from "@/content";

const BASE_URL = "https://synapgeek.com";

// Date de dernière modification du contenu de la home — pas de champ
// `updatedAt` dans le dictionnaire pour cette page (pas de sections légales).
// À mettre à jour quand le contenu de la home change.
const LANDING_UPDATED_AT = "2026-10-01";

const routes = ["/", "/privacy", "/terms", "/legal"];

function lastModifiedFor(locale: Locale, route: string): string {
  const dict = getDictionary(locale);
  switch (route) {
    case "/privacy":
      return dict.privacy.updatedAt;
    case "/terms":
      return dict.terms.updatedAt;
    case "/legal":
      return dict.legal.updatedAt;
    default:
      return LANDING_UPDATED_AT;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}${getLocalePath(locale, route)}`,
      lastModified: lastModifiedFor(locale, route),
      changeFrequency:
        route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.5,
      alternates: {
        languages: {
          fr: `${BASE_URL}${getLocalePath("fr", route)}`,
          en: `${BASE_URL}${getLocalePath("en", route)}`,
          "x-default": `${BASE_URL}${getLocalePath(X_DEFAULT_LOCALE, route)}`,
        },
      },
    })),
  );
}
