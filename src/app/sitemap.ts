import type { MetadataRoute } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import {
  absoluteUrl,
  alternatesFor,
  renderedPageIds,
  type PageId,
} from "@/lib/routes";
import { getDictionary } from "@/content";
import { getAppCopy, getHubCopy } from "@/content/copy";

function lastModifiedFor(locale: Locale, pageId: PageId): string {
  const dict = getDictionary(locale);
  switch (pageId) {
    case "privacy":
      return dict.privacy.updatedAt;
    case "terms":
      return dict.terms.updatedAt;
    case "legal":
      return dict.legal.updatedAt;
    case "home":
      return getHubCopy(locale).updatedAt;
    case "cerebrum":
      return getAppCopy("cerebrum", locale).updatedAt;
    default:
      // Une page rendue sans date connue ne doit pas recevoir une date inventée :
      // l'ajouter à RENDERED_PAGE_IDS impose d'abord de lui donner la sienne.
      throw new Error(`Aucune date de modification pour ${pageId}`);
  }
}

// Hebdomadaire : le hub et la page de l'app ; mensuel pour tout le reste.
const isFrequentlyUpdated = (pageId: PageId) =>
  pageId === "home" || pageId === "cerebrum";

export default function sitemap(): MetadataRoute.Sitemap {
  return renderedPageIds().flatMap((pageId) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(pageId, locale),
      lastModified: lastModifiedFor(locale, pageId),
      changeFrequency: isFrequentlyUpdated(pageId)
        ? ("weekly" as const)
        : ("monthly" as const),
      priority: pageId === "home" ? 1 : 0.5,
      alternates: alternatesFor(pageId),
    })),
  );
}
