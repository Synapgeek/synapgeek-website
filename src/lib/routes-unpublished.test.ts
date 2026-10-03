import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "./i18n";
import {
  findPublishedGame,
  pagePath,
  publishedGameParams,
  publishedPageIds,
  resolveGameSlug,
} from "./routes";

// Fichier à part : `vi.mock` s'applique à tout le module, et routes.test.ts
// a besoin du registre réel.
vi.mock("@/content/apps", async (importOriginal) => {
  const all = (
    await import("@/content/apps/publish-all.test-support")
  ).publishAllGames(await importOriginal<typeof import("@/content/apps")>());
  const unpublishPandoku = <T extends { id: string }>(game: T): T =>
    game.id === "pandoku" ? { ...game, published: false } : game;
  return {
    ...all,
    getGames: (app: Parameters<typeof all.getGames>[0]) =>
      all.getGames(app).map(unpublishPandoku),
    findGameBySlug: (...args: Parameters<typeof all.findGameBySlug>) => {
      const game = all.findGameBySlug(...args);
      return game && unpublishPandoku(game);
    },
  };
});

describe("pagePath : jeu non publié", () => {
  it("refuse un jeu dont le registre dit published: false, dans toutes les langues", () => {
    for (const locale of LOCALES) {
      expect(() => pagePath("game:pandoku", locale)).toThrow(
        /non publié ou inconnu/,
      );
    }
  });

  it("continue de servir les jeux publiés, et le retire de publishedPageIds", () => {
    expect(pagePath("game:sudoku", "en")).toBe("/cerebrum/sudoku");
    expect(publishedPageIds()).not.toContain("game:pandoku");
  });
});

describe("jeu non publié : ni route, ni résolution", () => {
  it("sort de generateStaticParams des pages jeux, dans les deux langues", () => {
    const slugs = publishedGameParams().map(({ game }) => game);
    expect(slugs).not.toContain("pandoku");
    expect(slugs).toContain("sudoku");
  });

  it("ne se résout plus par son slug, alors que l'entrée du registre existe toujours", () => {
    for (const locale of LOCALES) {
      expect(findPublishedGame(locale, "pandoku")).toBeNull();
      expect(resolveGameSlug(locale, "pandoku")).toBeNull();
    }
    expect(findPublishedGame("fr", "sudoku")?.id).toBe("sudoku");
  });
});
