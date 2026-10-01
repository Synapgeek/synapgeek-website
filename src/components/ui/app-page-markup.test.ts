import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getGames } from "@/content/apps";
import { CardList } from "./CardList";
import { CheckList } from "./CheckList";
import { GameGrid } from "./GameGrid";

// Les pages jeux n'existent que pour les jeux publiés : tout le registre est
// publié ici pour vérifier le schéma d'URL de chaque jeu, quel que soit
// l'avancement des livraisons de copie.
vi.mock("@/content/apps", async (importOriginal) =>
  (await import("@/content/apps/publish-all.test-support")).publishAllGames(
    await importOriginal<typeof import("@/content/apps")>(),
  ),
);

const html = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

describe("CardList", () => {
  const out = html(
    createElement(CardList, { items: ["Un", "Deux", "Trois"], tone: "violet" }),
  );

  it("is a list with one item per fact, kept a list for Safari", () => {
    expect(out).toContain('<ul role="list"');
    expect(out.match(/<li/g)).toHaveLength(3);
  });

  it("only goes to three columns when the caller says three cards", () => {
    expect(out).toContain("sm:grid-cols-2");
    expect(out).not.toContain("lg:grid-cols-3");
    expect(
      html(
        createElement(CardList, {
          items: ["Un", "Deux", "Trois"],
          tone: "green",
          columns: 3,
        }),
      ),
    ).toContain("lg:grid-cols-3");
  });
});

describe("CheckList", () => {
  it("hides the tick from assistive technology and keeps the text", () => {
    const out = html(createElement(CheckList, { items: ["Hors ligne"] }));
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain("Hors ligne");
    expect(out).toContain('<ul role="list"');
  });
});

describe("GameGrid", () => {
  const categories = { "logic-numbers": "A", words: "B", paths: "C" };
  const games = getGames("cerebrum");

  it("titles each family with an h3 and each game with an h4", () => {
    const out = html(
      createElement(GameGrid, { games, categories, locale: "en" }),
    );
    expect(out.match(/<h3/g)).toHaveLength(3);
    expect(out.match(/<h4/g)).toHaveLength(games.length);
  });

  it("titles only the families that have games", () => {
    const out = html(
      createElement(GameGrid, {
        games: games.filter((game) => game.category === "logic-numbers"),
        categories,
        locale: "en",
      }),
    );
    expect(out.match(/<h3/g)).toHaveLength(1);
    expect(out).toContain(`>${categories["logic-numbers"]}</h3>`);
    expect(out).not.toContain(`>${categories.words}</h3>`);
    expect(out).not.toContain(`>${categories.paths}</h3>`);
  });

  it("links a published game and leaves an unpublished one as plain text", () => {
    const [sudoku] = games;
    const out = html(
      createElement(GameGrid, {
        games: [{ ...sudoku, published: false }],
        categories,
        locale: "en",
      }),
    );
    expect(out).not.toMatch(/<a[\s>]/);
    expect(
      html(
        createElement(GameGrid, { games: [sudoku], categories, locale: "en" }),
      ),
    ).toContain('href="/cerebrum/sudoku"');
  });

  it("writes the French slug under /fr", () => {
    const minesweeper = games.find((game) => game.id === "minesweeper")!;
    expect(
      html(
        createElement(GameGrid, {
          games: [minesweeper],
          categories,
          locale: "fr",
        }),
      ),
    ).toContain('href="/fr/cerebrum/demineur"');
  });
});
