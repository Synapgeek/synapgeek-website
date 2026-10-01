import { describe, expect, it } from "vitest";
import { getGames } from "@/content/apps";
import { contrast, overlay, token } from "@/design/contrast";
import { gameColorVars, TINT_CANVAS_PERCENT } from "./game-colors";

describe("gameColorVars", () => {
  it("references the game's CSS properties, never a colour value", () => {
    const vars = gameColorVars({
      wash: "--game-sudoku-wash",
      deep: "--game-sudoku-deep",
    }) as Record<string, string>;
    expect(vars["--wash"]).toBe("var(--game-sudoku-wash)");
    expect(vars["--deep"]).toBe("var(--game-sudoku-deep)");
    expect(Object.values(vars).join(" ")).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it("resolves for every registered game", () => {
    for (const game of getGames("cerebrum")) {
      const vars = gameColorVars(game.color) as Record<string, string>;
      expect(vars["--wash"]).toBe(`var(${game.color.wash})`);
    }
  });

  it("tints toward the canvas, never toward the deep tone", () => {
    const vars = gameColorVars({
      wash: "--game-sudoku-wash",
      deep: "--game-sudoku-deep",
    }) as Record<string, string>;
    expect(vars["--tint"]).toBe(
      `color-mix(in srgb, var(--color-canvas) ${TINT_CANVAS_PERCENT}%, transparent)`,
    );
  });
});

describe("GameCard hover and focus tint", () => {
  // The tint is a translucent overlay: the text then sits on the composited colour.
  const games = getGames("cerebrum");

  it("covers the whole registry", () => {
    expect(games.length).toBeGreaterThan(0);
  });

  it.each(games.map((game) => [game.id, game.color] as const))(
    "%s: deep text keeps 4.5:1 on the tinted wash, never below the untinted contrast",
    (_id, color) => {
      const wash = token(color.wash);
      const deep = token(color.deep);
      const tinted = overlay(
        token("--color-canvas"),
        wash,
        TINT_CANVAS_PERCENT / 100,
      );
      expect(contrast(deep, tinted)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(deep, tinted)).toBeGreaterThanOrEqual(
        contrast(deep, wash),
      );
    },
  );
});
