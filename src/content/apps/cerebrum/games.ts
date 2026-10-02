import { GAME_SLUGS } from "@/lib/page-slugs";
import type {
  Difficulty,
  GameEntry,
  GameId,
  PlatformAvailability,
} from "../types";

const FOUR: readonly Difficulty[] = ["easy", "medium", "hard", "elite"];
// Pas d'Élite : Mots croisés, Mots mêlés et Arrow Maze.
const THREE: readonly Difficulty[] = ["easy", "medium", "hard"];

/** Les six jeux de la 2.x, présents sur les deux plateformes. */
const SINCE_2: PlatformAvailability = { ios: "2.0.0", android: "2.0.0" };
/** Les quatre jeux arrivés avec la 3.0.0, publiée sur l'App Store et sur Google Play. */
const SINCE_3: PlatformAvailability = { ios: "3.0.0", android: "3.0.0" };

const icon = (id: GameId) => `/images/games/${id}-v3.webp`;
const screenshot = (id: GameId) => ({
  fr: `/images/screens/v3/${id}-fr.webp`,
  en: `/images/screens/v3/${id}-en.webp`,
});

/**
 * Les dix jeux de Cerebrum 3.0.0, dans l'ordre de la fiche App Store.
 * Faits : docs/contrat/faits-cerebrum-3.0.0.md (difficultés, vies, tutoriels).
 * Couleurs : noms de propriétés CSS (--game-<id>-wash/-deep), valeurs dans
 * src/app/globals.css, données par la session Design System d'après
 * cerebrum-ios/docs/port/game-palette.json.
 *
 * `published` : un jeu n'est publié qu'avec sa copie (`copy/games/<id>.<locale>.ts`) ;
 * la tâche qui livre son texte passe son drapeau à `true`. Tant qu'il est à
 * `false`, le jeu n'a ni route, ni entrée de sitemap, ni lien (sa carte reste affichée).
 */
export const cerebrumGames: readonly GameEntry[] = [
  {
    id: "sudoku",
    category: "logic-numbers",
    slug: GAME_SLUGS["sudoku"],
    name: { fr: "Sudoku", en: "Sudoku" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "three-mistakes",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "--game-sudoku-wash", deep: "--game-sudoku-deep" },
    published: true,
    icon: icon("sudoku"),
    screenshot: screenshot("sudoku"),
  },
  {
    id: "pandoku",
    category: "logic-numbers",
    slug: GAME_SLUGS["pandoku"],
    name: { fr: "Pandoku", en: "Pandoku" },
    genre: {
      fr: "puzzle de logique de type Star Battle",
      en: "Star Battle logic puzzle",
    },
    difficulties: FOUR,
    lives: "three-hearts",
    hasTutorial: true,
    availability: SINCE_3,
    contentLocales: "all",
    color: { wash: "--game-pandoku-wash", deep: "--game-pandoku-deep" },
    published: true,
    icon: icon("pandoku"),
    screenshot: screenshot("pandoku"),
  },
  {
    id: "minesweeper",
    category: "logic-numbers",
    slug: GAME_SLUGS["minesweeper"],
    name: { fr: "Démineur", en: "Minesweeper" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "three-hearts",
    hasTutorial: true,
    availability: SINCE_3,
    contentLocales: "all",
    color: { wash: "--game-minesweeper-wash", deep: "--game-minesweeper-deep" },
    published: true,
    icon: icon("minesweeper"),
    screenshot: screenshot("minesweeper"),
  },
  {
    id: "pixel-art",
    category: "logic-numbers",
    slug: GAME_SLUGS["pixel-art"],
    name: { fr: "Pixel Art", en: "Pixel Art" },
    genre: { fr: "nonogrammes (logimages)", en: "nonograms" },
    difficulties: FOUR,
    lives: "three-lives",
    hasTutorial: true,
    availability: SINCE_3,
    contentLocales: "all",
    color: { wash: "--game-pixel-art-wash", deep: "--game-pixel-art-deep" },
    published: true,
    icon: icon("pixel-art"),
    screenshot: screenshot("pixel-art"),
  },
  {
    id: "cross-math",
    category: "logic-numbers",
    slug: GAME_SLUGS["cross-math"],
    name: { fr: "Cross Math", en: "Cross Math" },
    genre: { fr: "mots croisés de calcul", en: "math crossword" },
    difficulties: FOUR,
    lives: "three-lives",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "--game-cross-math-wash", deep: "--game-cross-math-deep" },
    published: true,
    icon: icon("cross-math"),
    screenshot: screenshot("cross-math"),
  },
  {
    id: "crossword",
    category: "words",
    slug: GAME_SLUGS["crossword"],
    name: { fr: "Mots Croisés", en: "Crossword" },
    genre: { fr: null, en: null },
    difficulties: THREE,
    lives: "three-hearts",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: ["fr", "en"],
    color: { wash: "--game-crossword-wash", deep: "--game-crossword-deep" },
    published: true,
    icon: icon("crossword"),
    screenshot: screenshot("crossword"),
  },
  {
    id: "word-search",
    category: "words",
    slug: GAME_SLUGS["word-search"],
    name: { fr: "Mots Mêlés", en: "Word Search" },
    genre: { fr: null, en: null },
    difficulties: THREE,
    lives: "none",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: ["fr", "en"],
    color: { wash: "--game-word-search-wash", deep: "--game-word-search-deep" },
    published: true,
    icon: icon("word-search"),
    screenshot: screenshot("word-search"),
  },
  {
    id: "trace",
    category: "paths",
    slug: GAME_SLUGS["trace"],
    name: { fr: "Trace", en: "Trace" },
    genre: {
      fr: "puzzle à tracer d'un seul trait",
      en: "one-line path puzzle",
    },
    difficulties: FOUR,
    lives: "none",
    hasTutorial: true,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "--game-trace-wash", deep: "--game-trace-deep" },
    published: true,
    icon: icon("trace"),
    screenshot: screenshot("trace"),
  },
  {
    id: "maze",
    category: "paths",
    slug: GAME_SLUGS["maze"],
    name: { fr: "Labyrinthe", en: "Maze" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "none",
    hasTutorial: true,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "--game-maze-wash", deep: "--game-maze-deep" },
    published: true,
    icon: icon("maze"),
    screenshot: screenshot("maze"),
  },
  {
    id: "arrow-maze",
    category: "paths",
    slug: GAME_SLUGS["arrow-maze"],
    name: { fr: "Arrow Maze", en: "Arrow Maze" },
    genre: { fr: "casse-tête de flèches", en: "arrow puzzle" },
    difficulties: THREE,
    lives: "grid-defined",
    hasTutorial: true,
    availability: SINCE_3,
    contentLocales: "all",
    color: { wash: "--game-arrow-maze-wash", deep: "--game-arrow-maze-deep" },
    published: true,
    icon: icon("arrow-maze"),
    screenshot: screenshot("arrow-maze"),
  },
];
