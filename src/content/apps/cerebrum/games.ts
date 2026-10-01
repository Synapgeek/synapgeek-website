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
/**
 * Arrivés en 3.0.0 sur iOS. `android: null` tant qu'Adrien n'a pas confirmé le
 * déploiement Play : passer à "3.0.0" suffit à afficher « iPhone, iPad et Android ».
 */
const SINCE_3_IOS_ONLY: PlatformAvailability = { ios: "3.0.0", android: null };

const icon = (id: GameId) => `/images/games/${id}-v3.webp`;
const screenshot = (id: GameId) => ({
  fr: `/images/screens/v3/${id}-fr.webp`,
  en: `/images/screens/v3/${id}-en.webp`,
});

/**
 * Les dix jeux de Cerebrum 3.0.0, dans l'ordre de la fiche App Store.
 * Faits : docs/contrat/faits-cerebrum-3.0.0.md (difficultés, vies, tutoriels).
 * Couleurs : paires wash/deep données par la session Design System, d'après
 * cerebrum-ios/docs/port/game-palette.json.
 */
export const cerebrumGames: readonly GameEntry[] = [
  {
    id: "sudoku",
    category: "logic-numbers",
    slug: { fr: "sudoku", en: "sudoku" },
    name: { fr: "Sudoku", en: "Sudoku" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "three-mistakes",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "#BFD9F7", deep: "#2F6FB5" },
    icon: icon("sudoku"),
    screenshot: screenshot("sudoku"),
  },
  {
    id: "pandoku",
    category: "logic-numbers",
    slug: { fr: "pandoku", en: "pandoku" },
    name: { fr: "Pandoku", en: "Pandoku" },
    genre: {
      fr: "puzzle de logique de type Star Battle",
      en: "Star Battle logic puzzle",
    },
    difficulties: FOUR,
    lives: "three-hearts",
    hasTutorial: true,
    availability: SINCE_3_IOS_ONLY,
    contentLocales: "all",
    color: { wash: "#BFEDE4", deep: "#2A8F80" },
    icon: icon("pandoku"),
    screenshot: screenshot("pandoku"),
  },
  {
    id: "minesweeper",
    category: "logic-numbers",
    slug: { fr: "demineur", en: "minesweeper" },
    name: { fr: "Démineur", en: "Minesweeper" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "three-hearts",
    hasTutorial: true,
    availability: SINCE_3_IOS_ONLY,
    contentLocales: "all",
    color: { wash: "#C9CDF2", deep: "#4F55C8" },
    icon: icon("minesweeper"),
    screenshot: screenshot("minesweeper"),
  },
  {
    id: "pixel-art",
    category: "logic-numbers",
    slug: { fr: "pixel-art", en: "pixel-art" },
    name: { fr: "Pixel Art", en: "Pixel Art" },
    genre: { fr: "nonogrammes (logimages)", en: "nonograms" },
    difficulties: FOUR,
    lives: "three-lives",
    hasTutorial: true,
    availability: SINCE_3_IOS_ONLY,
    contentLocales: "all",
    color: { wash: "#F2C6EE", deep: "#A23A9A" },
    icon: icon("pixel-art"),
    screenshot: screenshot("pixel-art"),
  },
  {
    id: "cross-math",
    category: "logic-numbers",
    slug: { fr: "cross-math", en: "cross-math" },
    name: { fr: "Cross Math", en: "Cross Math" },
    genre: { fr: "mots croisés de calcul", en: "math crossword" },
    difficulties: FOUR,
    lives: "three-lives",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "#DCC8F5", deep: "#7C4DB8" },
    icon: icon("cross-math"),
    screenshot: screenshot("cross-math"),
  },
  {
    id: "crossword",
    category: "words",
    slug: { fr: "mots-croises", en: "crossword" },
    name: { fr: "Mots Croisés", en: "Crossword" },
    genre: { fr: null, en: null },
    difficulties: THREE,
    lives: "three-hearts",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: ["fr", "en"],
    color: { wash: "#C6EBD3", deep: "#2F8A5B" },
    icon: icon("crossword"),
    screenshot: screenshot("crossword"),
  },
  {
    id: "word-search",
    category: "words",
    slug: { fr: "mots-meles", en: "word-search" },
    name: { fr: "Mots Mêlés", en: "Word Search" },
    genre: { fr: null, en: null },
    difficulties: THREE,
    lives: "none",
    hasTutorial: false,
    availability: SINCE_2,
    contentLocales: ["fr", "en"],
    color: { wash: "#FAD9C0", deep: "#C7692F" },
    icon: icon("word-search"),
    screenshot: screenshot("word-search"),
  },
  {
    id: "trace",
    category: "paths",
    slug: { fr: "trace", en: "trace" },
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
    color: { wash: "#F7C4DA", deep: "#C2185B" },
    icon: icon("trace"),
    screenshot: screenshot("trace"),
  },
  {
    id: "maze",
    category: "paths",
    slug: { fr: "labyrinthe", en: "maze" },
    name: { fr: "Labyrinthe", en: "Maze" },
    genre: { fr: null, en: null },
    difficulties: FOUR,
    lives: "none",
    hasTutorial: true,
    availability: SINCE_2,
    contentLocales: "all",
    color: { wash: "#F6DFB5", deep: "#B8792A" },
    icon: icon("maze"),
    screenshot: screenshot("maze"),
  },
  {
    id: "arrow-maze",
    category: "paths",
    slug: { fr: "arrow-maze", en: "arrow-maze" },
    name: { fr: "Arrow Maze", en: "Arrow Maze" },
    genre: { fr: "casse-tête de flèches", en: "arrow puzzle" },
    difficulties: THREE,
    lives: "grid-defined",
    hasTutorial: true,
    availability: SINCE_3_IOS_ONLY,
    contentLocales: "all",
    color: { wash: "#DDEFC0", deep: "#5C8A1E" },
    icon: icon("arrow-maze"),
    screenshot: screenshot("arrow-maze"),
  },
];
