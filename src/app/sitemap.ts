import type { MetadataRoute } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { absoluteUrl, alternatesFor, type PageId } from "@/lib/routes";
import { getDictionary } from "@/content";

// Date de dernière modification du contenu de la home — pas de champ
// `updatedAt` dans le dictionnaire pour cette page (pas de sections légales).
// À mettre à jour quand le contenu de la home change.
const LANDING_UPDATED_AT = "2026-10-01";

const SITEMAP_PAGE_IDS = [
  "home",
  "privacy",
  "terms",
  "legal",
] as const satisfies readonly PageId[];

type SitemapPageId = (typeof SITEMAP_PAGE_IDS)[number];

function lastModifiedFor(locale: Locale, pageId: SitemapPageId): string {
  const dict = getDictionary(locale);
  switch (pageId) {
    case "privacy":
      return dict.privacy.updatedAt;
    case "terms":
      return dict.terms.updatedAt;
    case "legal":
      return dict.legal.updatedAt;
    case "home":
      return LANDING_UPDATED_AT;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PAGE_IDS.flatMap((pageId) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(pageId, locale),
      lastModified: lastModifiedFor(locale, pageId),
      changeFrequency:
        pageId === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: pageId === "home" ? 1 : 0.5,
      alternates: alternatesFor(pageId),
    })),
  );
}
