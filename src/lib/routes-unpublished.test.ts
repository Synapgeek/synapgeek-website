import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "./i18n";
import { pagePath, publishedPageIds } from "./routes";

// Fichier à part : `vi.mock` s'applique à tout le module, et routes.test.ts
// a besoin du registre réel.
vi.mock("@/content/apps", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/apps")>();
  return {
    ...actual,
    getGames: (app: Parameters<typeof actual.getGames>[0]) =>
      actual
        .getGames(app)
        .map((game) =>
          game.id === "pandoku" ? { ...game, published: false } : game,
        ),
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
