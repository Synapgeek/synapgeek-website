import type { Locale } from "@/lib/i18n";
import { cerebrum } from "./cerebrum/app";
import { cerebrumGames } from "./cerebrum/games";
import type { AppEntry, AppSlug, GameEntry, GameId } from "./types";

export type * from "./types";

const APPS: Readonly<Record<AppSlug, AppEntry>> = { cerebrum };
const GAMES: Readonly<Record<AppSlug, readonly GameEntry[]>> = {
  cerebrum: cerebrumGames,
};

export function getApps(): readonly AppEntry[] {
  return Object.values(APPS);
}

export function getApp(slug: AppSlug): AppEntry {
  return APPS[slug];
}

/** Les jeux d'une app, dans l'ordre publié. */
export function getGames(app: AppSlug): readonly GameEntry[] {
  return GAMES[app];
}

export function gameSlug(app: AppSlug, game: GameId, locale: Locale): string {
  const entry = GAMES[app].find((candidate) => candidate.id === game);
  if (!entry) throw new Error(`Jeu inconnu pour ${app} : ${game}`);
  return entry.slug[locale];
}

/** Un slug ne se résout que dans sa propre locale (`crossword` n'existe pas en FR). */
export function findGameBySlug(
  app: AppSlug,
  locale: Locale,
  slug: string,
): GameEntry | null {
  return GAMES[app].find((game) => game.slug[locale] === slug) ?? null;
}

/** Plateformes où le jeu est annoncé ; Android seulement une fois la version confirmée. */
export function platformsFor(
  game: GameEntry,
): Array<"iPhone" | "iPad" | "Android"> {
  const platforms: Array<"iPhone" | "iPad" | "Android"> = [];
  if (game.availability.ios !== null) platforms.push("iPhone", "iPad");
  if (game.availability.android !== null) platforms.push("Android");
  return platforms;
}
