/**
 * Support de test : le registre réel avec TOUS les jeux publiés. Les pages jeux
 * n'existent que pour les jeux publiés, et chaque livraison de copie publie le
 * sien ; les tests qui vérifient une forme de jeu (slug français, genre maison,
 * langues des grilles) ne doivent pas dépendre de cet avancement.
 *
 * Usage, en tête du fichier de test (`vi.mock` est hissé, l'import dynamique
 * évite la référence circulaire) :
 *
 *   vi.mock("@/content/apps", async (importOriginal) =>
 *     (await import("@/content/apps/publish-all.test-support")).publishAllGames(
 *       await importOriginal<typeof import("@/content/apps")>(),
 *     ),
 *   );
 */
import type * as Apps from "./index";

export function publishAllGames(actual: typeof Apps): typeof Apps {
  return {
    ...actual,
    getGames: (app) =>
      actual.getGames(app).map((game) => ({ ...game, published: true })),
    findGameBySlug: (app, locale, slug) => {
      const game = actual.findGameBySlug(app, locale, slug);
      return game && { ...game, published: true };
    },
  };
}
