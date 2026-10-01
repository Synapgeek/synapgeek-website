import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cerebrumGames } from "@/content/apps/cerebrum/games";
import { THEME_COLOR } from "./theme-color";

/**
 * Contrast guard for every foreground/background pair the design system uses
 * for text. The hex values are read from globals.css, the single source of
 * colour: nothing is duplicated here.
 */

const CSS = readFileSync(
  path.resolve(import.meta.dirname, "../app/globals.css"),
  "utf8",
);

const HEX = /^#[0-9a-f]{6}$/i;

/** Value of `--name`, following `var(--other)` aliases. */
function token(name: string): string {
  const match = new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(CSS);
  if (!match) throw new Error(`Token ${name} is not defined in globals.css`);
  const value = match[1].trim();
  const alias = /^var\((--[\w-]+)\)$/.exec(value);
  if (alias) return token(alias[1]);
  if (!HEX.test(value)) {
    throw new Error(`Token ${name} is not a #rrggbb colour: ${value}`);
  }
  return value.toLowerCase();
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

/** WCAG 2.1 contrast ratio between two #rrggbb colours. */
export function contrast(foreground: string, background: string): number {
  const [hi, lo] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (hi + 0.05) / (lo + 0.05);
}

const BODY_TEXT_MIN = 4.5;

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
