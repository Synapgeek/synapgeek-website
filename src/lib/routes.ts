import {
  findGameBySlug,
  gameSlug,
  getGames,
  type GameId,
} from "@/content/apps";
import { FROZEN_LEGAL_LOCALE } from "./frozen-legal-paths";
import { LOCALES, type Locale } from "./i18n";
import { SECTION_SLUGS } from "./page-slugs";

export const BASE_URL = "https://synapgeek.com";
/** Langue ciblée par hreflang "x-default" (visiteurs sans préférence) : l'anglais, comme la locale par défaut du routage. */
export const X_DEFAULT_LOCALE: Locale = "en";

export type SectionId = keyof typeof SECTION_SLUGS;
export type LegalId = "privacy" | "terms" | "legal";
export type PageId =
  | "home"
  | "cerebrum"
  | `game:${GameId}`
  | SectionId
  | LegalId;

const LEGAL_IDS: readonly LegalId[] = ["privacy", "terms", "legal"];
const SECTION_IDS = Object.keys(SECTION_SLUGS) as SectionId[];

// Une seule app aujourd'hui ; le segment `/cerebrum` est celui de la page app.
const APP_SEGMENT = "cerebrum";

const isLegal = (pageId: PageId): pageId is LegalId =>
  (LEGAL_IDS as readonly string[]).includes(pageId);

const isSection = (pageId: PageId): pageId is SectionId =>
  (SECTION_IDS as readonly string[]).includes(pageId);

const isGame = (pageId: PageId): pageId is `game:${GameId}` =>
  pageId.startsWith("game:");

/** L'anglais n'a pas de préfixe, le français vit sous /fr. */
const LOCALE_PREFIX: Record<Locale, string> = { en: "", fr: "/fr" };

/** Schéma légal figé : la langue figée sans préfixe, l'autre sous son préfixe (jamais /fr/privacy). */
function legalPrefix(locale: Locale): string {
  return locale === FROZEN_LEGAL_LOCALE ? "" : `/${locale}`;
}

const isPublishedGame = (gameId: GameId): boolean =>
  getGames(APP_SEGMENT).some((game) => game.id === gameId && game.published);

function gameIdOf(pageId: `game:${GameId}`): GameId {
  return pageId.slice("game:".length) as GameId;
}

function basePath(pageId: PageId, locale: Locale): string {
  if (pageId === "home") return LOCALE_PREFIX[locale] || "/";
  if (isLegal(pageId)) return `${legalPrefix(locale)}/${pageId}`;
  const prefix = LOCALE_PREFIX[locale];
  if (pageId === "cerebrum") return `${prefix}/${APP_SEGMENT}`;
  if (isSection(pageId)) return `${prefix}/${SECTION_SLUGS[pageId][locale]}`;
  if (isGame(pageId)) {
    const gameId = gameIdOf(pageId);
    // Un jeu non publié n'a pas de page : lui fabriquer une URL ferait pointer un lien vers un 404.
    if (!isPublishedGame(gameId)) {
      throw new Error(`Jeu non publié ou inconnu : ${pageId}`);
    }
    return `${prefix}/${APP_SEGMENT}/${gameSlug(APP_SEGMENT, gameId, locale)}`;
  }
  throw new Error(`Page inconnue : ${pageId satisfies never}`);
}

/** Chemin relatif, sans slash final (sauf la racine anglaise `/`). */
export function pagePath(
  pageId: PageId,
  locale: Locale,
  hash?: string,
): string {
  const path = basePath(pageId, locale);
  if (!hash) return path;
  // "/#contact" : la racine garde son slash, "/fr#contact" n'en a pas.
  return `${path}#${hash}`;
}

export function absoluteUrl(pageId: PageId, locale: Locale): string {
  const path = pagePath(pageId, locale);
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

export function alternatesFor(pageId: PageId): {
  languages: Record<Locale | "x-default", string>;
} {
  const entries = LOCALES.map((locale) => [
    locale,
    absoluteUrl(pageId, locale),
  ]);
  return {
    languages: {
      ...(Object.fromEntries(entries) as Record<Locale, string>),
      "x-default": absoluteUrl(pageId, X_DEFAULT_LOCALE),
    },
  };
}

export function pageIdForGame(gameId: GameId): PageId {
  return `game:${gameId}`;
}

/** Toutes les pages indexables, dans l'ordre du sitemap. */
export function publishedPageIds(): PageId[] {
  const games = getGames(APP_SEGMENT)
    .filter((game) => game.published)
    .map((game) => pageIdForGame(game.id));
  return ["home", "cerebrum", ...games, ...SECTION_IDS, ...LEGAL_IDS];
}

/**
 * Pages dont la route existe et répond 200 aujourd'hui. Source unique du
 * sitemap : une page n'y entre qu'avec sa livraison, jamais avant (une URL
 * sitemapée qui répond 404 est une régression d'indexation).
 */
const RENDERED_PAGE_IDS: ReadonlySet<PageId> = new Set<PageId>([
  "home",
  ...LEGAL_IDS,
]);

/** Pages publiées ET rendues, dans l'ordre du registre : ce que le sitemap liste. */
export function renderedPageIds(): PageId[] {
  return publishedPageIds().filter((pageId) => RENDERED_PAGE_IDS.has(pageId));
}

/** `null` : slug inconnu dans cette locale (le caller décide, en général `notFound()`). */
export function resolveSection(locale: Locale, slug: string): SectionId | null {
  return SECTION_IDS.find((id) => SECTION_SLUGS[id][locale] === slug) ?? null;
}

/** `null` : slug inconnu, non publié, ou slug de l'autre locale. */
export function resolveGameSlug(locale: Locale, slug: string): GameId | null {
  const game = findGameBySlug(APP_SEGMENT, locale, slug);
  return game?.published ? game.id : null;
}
