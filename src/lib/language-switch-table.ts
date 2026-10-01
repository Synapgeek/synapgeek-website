import { LOCALES, type Locale } from "./i18n";
import type {
  LanguageAlternates,
  LanguageSwitchTable,
} from "./language-alternates";
import { pagePath, publishedPageIds } from "./routes";

/**
 * Chemin servi par le segment `[locale]` pour une URL publique : celui que voit
 * le rendu serveur (le proxy réécrit `/privacy` en `/fr/privacy`), alors que le
 * navigateur voit l'URL publique. Indexer les deux garde le lien de langue
 * identique au rendu statique et à l'hydratation.
 */
function servedPath(publicPath: string, locale: Locale): string {
  const prefix = `/${locale}`;
  if (publicPath === prefix || publicPath.startsWith(`${prefix}/`)) {
    return publicPath;
  }
  return publicPath === "/" ? prefix : `${prefix}${publicPath}`;
}

/**
 * Table « chemin → même page dans chaque langue » de toutes les pages publiées,
 * construite côté serveur : le sélecteur de langue rend de vrais liens présents
 * dans le HTML initial, sans deviner un chemin à partir du pathname.
 */
export function buildLanguageSwitchTable(): LanguageSwitchTable {
  const pages: Record<string, LanguageAlternates> = {};
  for (const pageId of publishedPageIds()) {
    const alternates = Object.fromEntries(
      LOCALES.map((locale) => [locale, pagePath(pageId, locale)]),
    ) as Record<Locale, string>;
    for (const locale of LOCALES) {
      pages[alternates[locale]] = alternates;
      pages[servedPath(alternates[locale], locale)] = alternates;
    }
  }
  return {
    pages,
    fallback: Object.fromEntries(
      LOCALES.map((locale) => [locale, pagePath("home", locale)]),
    ) as Record<Locale, string>,
  };
}
