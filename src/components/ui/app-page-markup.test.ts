import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getGames } from "@/content/apps";
import { Languages, WifiOff } from "lucide-react";
import { IconList } from "./IconList";
import { GameGrid } from "./GameGrid";
import { ProseList } from "./ProseList";

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

describe("ProseList", () => {
  const out = html(
    createElement(ProseList, { items: ["Un", "Deux", "Trois"] }),
  );

  it("is a list with one item per fact, kept a list for Safari", () => {
    expect(out).toContain('<ul role="list"');
    expect(out.match(/<li/g)).toHaveLength(3);
  });

  it("sets facts as prose, never as cards", () => {
    expect(out).not.toMatch(/bg-wash|rounded-card|shadow/);
  });
});

/** Un couple de couleurs de jeu, comme ceux que passent les pages. */
const COLORS = [{ wash: "--game-sudoku-wash", deep: "--game-sudoku-deep" }];

describe("IconList", () => {
  it("hides the icon from assistive technology and keeps the text", () => {
    const out = html(
      createElement(IconList, { colors: COLORS, items: ["Hors ligne"] }),
    );
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain("Hors ligne");
    expect(out).toContain('<ul role="list"');
  });

  it("gives each point its own icon, in order", () => {
    const out = html(
      createElement(IconList, {
        colors: COLORS,
        items: ["Hors ligne", "Langues"],
        icons: [WifiOff, Languages],
      }),
    );
    const icons = [...out.matchAll(/class="lucide lucide-([a-z-]+)/g)].map(
      (match) => match[1],
    );
    expect(icons).toEqual(["wifi-off", "languages"]);
  });

  it("falls back to a sparkle for every point when no icons are given", () => {
    const out = html(
      createElement(IconList, { colors: COLORS, items: ["A", "B"] }),
    );
    const icons = [...out.matchAll(/class="lucide lucide-([a-z-]+)/g)].map(
      (match) => match[1],
    );
    expect(icons).toEqual(["sparkle", "sparkle"]);
  });

  it("wears the app look on light bands and a translucent tile on the deep band", () => {
    const light = html(
      createElement(IconList, { colors: COLORS, items: ["A"] }),
    );
    expect(light).toMatch(/class="[^"]*game-gradient[^"]*"/);
    const dark = html(
      createElement(IconList, {
        colors: COLORS,
        items: ["A"],
        surface: "dark",
      }),
    );
    expect(dark).not.toContain("game-gradient");
    expect(dark).toMatch(/class="[^"]*bg-canvas\/10[^"]*"/);
  });
});

describe("IconList, icons and items out of step", () => {
  it("throws instead of silently falling back to the default icon", () => {
    expect(() =>
      html(
        createElement(IconList, {
          colors: COLORS,
          items: ["Hors ligne", "Langues"],
          icons: [WifiOff],
        }),
      ),
    ).toThrow(/1 icônes pour 2 points/);
    expect(() =>
      html(
        createElement(IconList, {
          colors: COLORS,
          items: ["Hors ligne"],
          icons: [WifiOff, Languages],
        }),
      ),
    ).toThrow(/2 icônes pour 1 points/);
  });

  it("accepts one icon per item and no icons at all", () => {
    expect(() =>
      html(
        createElement(IconList, {
          colors: COLORS,
          items: ["A", "B"],
          icons: [WifiOff, Languages],
        }),
      ),
    ).not.toThrow();
    expect(() =>
      html(createElement(IconList, { colors: COLORS, items: ["A", "B"] })),
    ).not.toThrow();
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

  it("without families, puts every game in one grid, each card an h3", () => {
    const out = html(createElement(GameGrid, { games, locale: "en" }));
    expect(out.match(/<ul/g)).toHaveLength(1);
    expect(out.match(/<h3/g)).toHaveLength(games.length);
    expect(out).not.toMatch(/<h4/);
  });

  it("turns the sparkle pattern from one card to the next", () => {
    const out = html(createElement(GameGrid, { games, locale: "en" }));
    const firstSparkle = (card: string) =>
      /<svg[^>]*style="([^"]*)"/.exec(card)?.[1];
    const cards = out.split("<li>").slice(1);
    expect(firstSparkle(cards[0])).not.toEqual(firstSparkle(cards[1]));
  });
});
