import type { GameId } from "@/content/apps";
import { arrowMazeEn } from "./arrow-maze.en";
import { crossMathEn } from "./cross-math.en";
import { crosswordEn } from "./crossword.en";
import { mazeEn } from "./maze.en";
import { minesweeperEn } from "./minesweeper.en";
import { pandokuEn } from "./pandoku.en";
import { pixelArtEn } from "./pixel-art.en";
import { sudokuEn } from "./sudoku.en";
import { traceEn } from "./trace.en";
import { wordSearchEn } from "./word-search.en";
import type { GameCopy } from "@/content/copy/types";

/**
 * Copies des jeux, en anglais. Un jeu s'ajoute ici avec son propre fichier
 * (`<id>.en.ts`) : importer le module et l'inscrire sous son `GameId`.
 */
export const gamesEn: Partial<Record<GameId, GameCopy>> = {
  sudoku: sudokuEn,
  pandoku: pandokuEn,
  minesweeper: minesweeperEn,
  "pixel-art": pixelArtEn,
  "arrow-maze": arrowMazeEn,
  "cross-math": crossMathEn,
  crossword: crosswordEn,
  "word-search": wordSearchEn,
  trace: traceEn,
  maze: mazeEn,
};
