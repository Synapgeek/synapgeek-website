import type { GameId } from "@/content/apps";
import { pandokuFr } from "./pandoku.fr";
import { sudokuFr } from "./sudoku.fr";
import type { GameCopy } from "@/content/copy/types";

/**
 * Copies des jeux, en français. Un jeu s'ajoute ici avec son propre fichier
 * (`<id>.fr.ts`) : importer le module et l'inscrire sous son `GameId`.
 */
export const gamesFr: Partial<Record<GameId, GameCopy>> = {
  sudoku: sudokuFr,
  pandoku: pandokuFr,
};
