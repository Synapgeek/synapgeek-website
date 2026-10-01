// Aucun import : module de données pur, partagé par le routage et le registre des jeux.
// Une valeur d'URL = une seule source, ici.

/** Slug de chaque jeu par locale ; `GameId` (src/content/apps/types.ts) en est la liste des clés. */
export const GAME_SLUGS = {
  sudoku: { en: "sudoku", fr: "sudoku" },
  pandoku: { en: "pandoku", fr: "pandoku" },
  minesweeper: { en: "minesweeper", fr: "demineur" },
  "pixel-art": { en: "pixel-art", fr: "pixel-art" },
  "cross-math": { en: "cross-math", fr: "cross-math" },
  crossword: { en: "crossword", fr: "mots-croises" },
  "word-search": { en: "word-search", fr: "mots-meles" },
  trace: { en: "trace", fr: "trace" },
  maze: { en: "maze", fr: "labyrinthe" },
  "arrow-maze": { en: "arrow-maze", fr: "arrow-maze" },
} as const;

export const SECTION_SLUGS = {
  about: { en: "about", fr: "a-propos" },
  press: { en: "press", fr: "presse" },
} as const;
