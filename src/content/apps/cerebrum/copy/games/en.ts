import type { GameId } from "@/content/apps";
import { pandokuEn } from "./pandoku.en";
import { sudokuEn } from "./sudoku.en";
import type { GameCopy } from "@/content/copy/types";

/**
 * Copies des jeux, en anglais. Un jeu s'ajoute ici avec son propre fichier
 * (`<id>.en.ts`) : importer le module et l'inscrire sous son `GameId`.
 */
export const gamesEn: Partial<Record<GameId, GameCopy>> = {
  sudoku: sudokuEn,
  pandoku: pandokuEn,
};
