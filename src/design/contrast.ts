import { readFileSync } from "node:fs";
import path from "node:path";
import { parseToken } from "./css-token";

/**
 * Helpers de contraste partagés par les tests. Les couleurs sont lues dans
 * globals.css, source unique : rien n'est dupliqué dans les tests.
 */

const CSS = readFileSync(
  path.resolve(import.meta.dirname, "../app/globals.css"),
  "utf8",
);

/** Value of `--name`, following `var(--other)` aliases. */
export function token(name: string): string {
  return parseToken(CSS, name);
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

/** `top` laid over `bottom` at `alpha` (0..1), as the browser composites it in sRGB. */
export function overlay(top: string, bottom: string, alpha: number): string {
  const t = parseInt(top.slice(1), 16);
  const b = parseInt(bottom.slice(1), 16);
  const mixed = [16, 8, 0].map((shift) =>
    Math.round(
      ((t >> shift) & 255) * alpha + ((b >> shift) & 255) * (1 - alpha),
    )
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${mixed.join("")}`;
}
