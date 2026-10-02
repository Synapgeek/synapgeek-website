import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage } from "./accept-language";

describe("localeFromAcceptLanguage", () => {
  it.each([
    ["fr", "fr"],
    ["fr-FR", "fr"],
    ["fr-CA,fr;q=0.9,en;q=0.8", "fr"],
    ["FR-be", "fr"],
    ["en-US,en;q=0.9,fr;q=0.8", "en"],
    ["de-DE,de;q=0.9,fr;q=0.5", "en"],
    ["en;q=0.5,fr;q=0.9", "fr"],
    ["*", "en"],
    ["fra", "en"],
    ["fr;q=0", "en"],
    ["", "en"],
  ])("%j donne %s", (header, expected) => {
    expect(localeFromAcceptLanguage(header)).toBe(expected);
  });

  it("répond en anglais sans en-tête", () => {
    expect(localeFromAcceptLanguage(null)).toBe("en");
  });

  it("ne se laisse pas tromper par un q mal formé", () => {
    expect(localeFromAcceptLanguage("fr;q=abc,en;q=0.5")).toBe("en");
  });
});
