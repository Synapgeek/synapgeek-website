import { describe, expect, it } from "vitest";
import { parseToken } from "./css-token";

const CSS = `
  :root {
    --color-ink: #1A1A2E;
    --color-text: var(--color-ink);
    --shadow-rest: 0 1px 2px rgb(0 0 0 / 10%);
  }
`;

describe("parseToken", () => {
  it("lit une couleur en minuscules", () => {
    expect(parseToken(CSS, "--color-ink")).toBe("#1a1a2e");
  });

  it("suit un alias var(--autre)", () => {
    expect(parseToken(CSS, "--color-text")).toBe("#1a1a2e");
  });

  it("refuse un jeton absent", () => {
    expect(() => parseToken(CSS, "--color-missing")).toThrow(/not defined/);
  });

  it("refuse un jeton qui n'est pas une couleur #rrggbb", () => {
    expect(() => parseToken(CSS, "--shadow-rest")).toThrow(/not a #rrggbb/);
  });
});
