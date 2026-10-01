import type { GameId } from "@/content/apps";
import type { GameCopy } from "@/content/copy/types";

/**
 * Copies des jeux, en français. Un jeu s'ajoute ici avec son propre fichier
 * (`<id>.fr.ts`) : importer le module et l'inscrire sous son `GameId`.
 */
export const gamesFr: Partial<Record<GameId, GameCopy>> = {};
