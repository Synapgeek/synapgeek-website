import type { Locale } from "@/lib/i18n";

export type AppSlug = "cerebrum";

export type GameId =
  | "sudoku"
  | "pandoku"
  | "minesweeper"
  | "pixel-art"
  | "cross-math"
  | "crossword"
  | "word-search"
  | "trace"
  | "maze"
  | "arrow-maze";

export type GameCategory = "logic-numbers" | "words" | "paths";

export type Difficulty = "easy" | "medium" | "hard" | "elite";

/** Version de l'app qui a livré le jeu ; `null` = pas disponible sur la plateforme. */
export interface PlatformAvailability {
  ios: string | null;
  android: string | null;
}

/**
 * Règle de défaite du jeu, telle que le fichier de faits 3.0.0 la décrit :
 * - `three-mistakes` : trois erreurs et la partie est perdue (Sudoku) ;
 * - `three-hearts` / `three-lives` : trois cœurs / trois vies (libellé de l'app) ;
 * - `none` : ni vies ni défaite ;
 * - `grid-defined` : le nombre de cœurs dépend de la difficulté (Arrow Maze).
 */
export type LivesRule =
  | "three-mistakes"
  | "three-hearts"
  | "three-lives"
  | "none"
  | "grid-defined";

export interface GameEntry {
  id: GameId;
  category: GameCategory;
  slug: Record<Locale, string>;
  /** Nom du jeu dans l'app, par locale. */
  name: Record<Locale, string>;
  /** Genre générique à citer à côté d'un nom maison ; `null` pour les classiques. */
  genre: Record<Locale, string | null>;
  difficulties: readonly Difficulty[];
  lives: LivesRule;
  hasTutorial: boolean;
  availability: PlatformAvailability;
  /** Langues du contenu de jeu : Mots croisés et Mots mêlés n'existent qu'en FR et EN. */
  contentLocales: "all" | readonly Locale[];
  /** Couple de couleurs de la palette Cerebrum, exposé en variables CSS (jamais en dur dans un composant). */
  color: { wash: string; deep: string };
  icon: string;
  screenshot: Record<Locale, string>;
}

export interface AppEntry {
  slug: AppSlug;
  name: string;
  publisher: "Synapgeek";
  appStoreId: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  platforms: {
    ios: { minOs: string };
    /** `null` : version Android minimale non vérifiée. */
    android: { minOs: string | null };
  };
  /** Langues d'interface de l'app (codes App Store). */
  languages: readonly string[];
  contentRating: { appStore: "4+" };
  icon: string;
  games: readonly GameId[];
}
