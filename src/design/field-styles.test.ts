import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrast, overlay, token } from "./contrast";

/**
 * Champs du formulaire : leurs styles vivent dans globals.css, entre le titre
 * « CHAMPS DU FORMULAIRE » et « REDUCED MOTION ». Ce que le design system
 * interdit (hex, rgba, flou d'arrière-plan, `transition: all`) et ce que WCAG
 * exige (anneau de focus et bordure à 3:1, texte à 4,5:1).
 */
const CSS = readFileSync(
  path.resolve(import.meta.dirname, "../app/globals.css"),
  "utf8",
);

const START = CSS.indexOf("CHAMPS DU FORMULAIRE");
const END = CSS.indexOf("REDUCED MOTION");
const FIELDS = CSS.slice(START, END);

const NON_TEXT_MIN = 3;
const TEXT_MIN = 4.5;

describe("field styles block", () => {
  it("is found in globals.css", () => {
    expect(START).toBeGreaterThan(-1);
    expect(END).toBeGreaterThan(START);
    expect(FIELDS).toContain(".input-field");
    expect(FIELDS).toContain(".input-label");
  });

  it("holds no hex literal and no rgba/hsl literal", () => {
    expect(FIELDS).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(FIELDS).not.toMatch(/\b(?:rgba?|hsla?)\(/);
  });

  it("has no backdrop-filter", () => {
    expect(FIELDS).not.toMatch(/backdrop-filter/);
  });

  it("never transitions `all`, and every transition lasts 150 to 250 ms", () => {
    expect(FIELDS).not.toMatch(/transition:\s*all\b/);
    const durations = [...FIELDS.matchAll(/\s(\d+)ms\b/g)].map((m) =>
      Number(m[1]),
    );
    expect(durations.length).toBeGreaterThan(0);
    for (const ms of durations) {
      expect(ms).toBeGreaterThanOrEqual(150);
      expect(ms).toBeLessThanOrEqual(250);
    }
  });

  it("keeps the browser focus ring (no `outline: none`)", () => {
    expect(FIELDS).not.toMatch(/outline:\s*none/);
  });

  it("keeps a drawn arrow on the select", () => {
    expect(FIELDS).toMatch(/\.input-field:is\(select\)[^}]*background-image/);
  });
});

describe("field colour pairs", () => {
  const FIELD_BACKGROUNDS = ["--color-canvas", "--color-canvas-soft"] as const;

  it.each(FIELD_BACKGROUNDS)(
    "the resting border (text-tertiary) reaches 3:1 on %s",
    (bg) => {
      expect(
        contrast(token("--color-text-tertiary"), token(bg)),
      ).toBeGreaterThanOrEqual(NON_TEXT_MIN);
    },
  );

  it.each(FIELD_BACKGROUNDS)(
    "the focus ring and the focused border (brand-violet) reach 3:1 on %s",
    (bg) => {
      expect(
        contrast(token("--color-brand-violet"), token(bg)),
      ).toBeGreaterThanOrEqual(NON_TEXT_MIN);
    },
  );

  it.each(FIELD_BACKGROUNDS)(
    "the error colour reaches 4.5:1 on %s (text, and so border)",
    (bg) => {
      expect(
        contrast(token("--color-error"), token(bg)),
      ).toBeGreaterThanOrEqual(TEXT_MIN);
    },
  );

  it("the floating label states are readable on the canvas that sits behind them", () => {
    for (const fg of [
      "--color-text-tertiary",
      "--color-text-secondary",
      "--color-brand-violet",
      "--color-error",
    ]) {
      expect(
        contrast(token(fg), token("--color-canvas")),
        fg,
      ).toBeGreaterThanOrEqual(TEXT_MIN);
    }
  });

  it("the typed text (ink) is readable on the field", () => {
    expect(
      contrast(token("--color-ink"), token("--color-canvas")),
    ).toBeGreaterThanOrEqual(TEXT_MIN);
  });
});

describe("submit button colour pairs", () => {
  it("ink on the brand green reaches 4.5:1 at rest", () => {
    expect(
      contrast(token("--color-ink"), token("--color-brand-green")),
    ).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it("ink on the hovered green (8 % ink mixed in) still reaches 4.5:1", () => {
    const hovered = overlay(
      token("--color-ink"),
      token("--color-brand-green"),
      0.08,
    );
    expect(contrast(token("--color-ink"), hovered)).toBeGreaterThanOrEqual(
      TEXT_MIN,
    );
  });
});
