import { describe, expect, it } from "vitest";
import { cerebrumGames } from "@/content/apps/cerebrum/games";
import { contrast, token } from "./contrast";
import { THEME_COLOR } from "./theme-color";

/**
 * Contrast guard for every foreground/background pair the design system uses
 * for text. The hex values are read from globals.css, the single source of
 * colour: nothing is duplicated here.
 */

const BODY_TEXT_MIN = 4.5;
// WCAG 1.4.3 : le grand texte (24 px et plus, ou 18,66 px en gras) n'exige que 3:1.
const LARGE_TEXT_MIN = 3;

const SYSTEM_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["--color-ink", "--color-canvas"],
  ["--color-ink", "--color-canvas-soft"],
  ["--color-ink", "--color-brand-green"],
  ["--color-brand-green-ink", "--color-canvas"],
  ["--color-brand-green-ink", "--color-canvas-soft"],
  ["--color-canvas", "--color-brand-violet-deep"],
  ["--color-canvas", "--color-brand-violet"],
  ["--color-brand-violet", "--color-canvas"],
  ["--color-canvas", "--color-ink"],
  ["--color-ink", "--color-wash-green"],
  ["--color-ink", "--color-wash-violet"],
  ["--color-brand-green-ink", "--color-wash-green"],
  ["--color-error", "--color-canvas"],
  ["--color-text-secondary", "--color-canvas"],
  ["--color-text-secondary", "--color-canvas-soft"],
  ["--color-text-tertiary", "--color-canvas"],
];

describe("contrast helper", () => {
  it("matches the WCAG reference values", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
    expect(contrast("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("system text pairs", () => {
  it.each(SYSTEM_PAIRS)("%s on %s reaches 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(
      BODY_TEXT_MIN,
    );
  });
});

// Le nom de l'app s'écrit dans la couleur de sa marque, en très grand corps : le H1 de
// /cerebrum (text-6xl et plus) et le H3 de l'encart de l'accueil (text-3xl, 30 px).
// Jamais en dessous de 24 px : ce jeton n'atteint pas 4,5:1.
const LARGE_TEXT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["--color-cerebrum", "--color-canvas"],
  ["--color-cerebrum", "--color-canvas-soft"],
];

describe("large text pairs", () => {
  it.each(LARGE_TEXT_PAIRS)("%s on %s reaches 3:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(
      LARGE_TEXT_MIN,
    );
  });
});

describe("game colour pairs", () => {
  it("covers the ten games of the registry", () => {
    expect(cerebrumGames).toHaveLength(10);
  });

  it.each(cerebrumGames.map((game) => [game.id, game.color] as const))(
    "%s: deep and ink are readable on the wash",
    (_id, color) => {
      const wash = token(color.wash);
      expect(contrast(token(color.deep), wash)).toBeGreaterThanOrEqual(
        BODY_TEXT_MIN,
      );
      expect(contrast(token("--color-ink"), wash)).toBeGreaterThanOrEqual(
        BODY_TEXT_MIN,
      );
    },
  );
});

describe("browser theme colour", () => {
  it("equals the brand green token", () => {
    expect(THEME_COLOR).toBe(token("--color-brand-green"));
  });
});
