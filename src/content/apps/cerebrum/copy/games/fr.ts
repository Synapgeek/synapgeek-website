import type { GameId } from "@/content/apps";
import { arrowMazeFr } from "./arrow-maze.fr";
import { crossMathFr } from "./cross-math.fr";
import { crosswordFr } from "./crossword.fr";
import { mazeFr } from "./maze.fr";
import { minesweeperFr } from "./minesweeper.fr";
import { pandokuFr } from "./pandoku.fr";
import { pixelArtFr } from "./pixel-art.fr";
import { traceFr } from "./trace.fr";
import { sudokuFr } from "./sudoku.fr";
import { wordSearchFr } from "./word-search.fr";
import type { GameCopy } from "@/content/copy/types";

/**
 * Copies des jeux, en français. Un jeu s'ajoute ici avec son propre fichier
 * (`<id>.fr.ts`) : importer le module et l'inscrire sous son `GameId`.
 */
export const gamesFr: Partial<Record<GameId, GameCopy>> = {
  sudoku: sudokuFr,
  pandoku: pandokuFr,
  minesweeper: minesweeperFr,
  "pixel-art": pixelArtFr,
  "arrow-maze": arrowMazeFr,
  "cross-math": crossMathFr,
  crossword: crosswordFr,
  "word-search": wordSearchFr,
  trace: traceFr,
  maze: mazeFr,
};
