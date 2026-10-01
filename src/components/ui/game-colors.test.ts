import { describe, expect, it } from "vitest";
import { getGames } from "@/content/apps";
import { gameColorVars } from "./game-colors";

describe("gameColorVars", () => {
  it("references the game's CSS properties, never a colour value", () => {
    const vars = gameColorVars({
      wash: "--game-sudoku-wash",
      deep: "--game-sudoku-deep",
    }) as Record<string, string>;
    expect(vars["--wash"]).toBe("var(--game-sudoku-wash)");
    expect(vars["--deep"]).toBe("var(--game-sudoku-deep)");
    expect(vars["--tint"]).toContain("var(--game-sudoku-deep)");
    expect(Object.values(vars).join(" ")).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it("resolves for every registered game", () => {
    for (const game of getGames("cerebrum")) {
      const vars = gameColorVars(game.color) as Record<string, string>;
      expect(vars["--wash"]).toBe(`var(${game.color.wash})`);
    }
  });
});
