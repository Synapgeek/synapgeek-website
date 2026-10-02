import { describe, expect, it } from "vitest";
import { formatUpdatedAt } from "./format-date";

describe("formatUpdatedAt", () => {
  it("écrit la date longue dans la langue de la page", () => {
    expect(formatUpdatedAt("2026-10-02", "en")).toBe("October 2, 2026");
    expect(formatUpdatedAt("2026-10-02", "fr")).toBe("2 octobre 2026");
  });

  it("ne glisse jamais d'un jour, quel que soit le fuseau du serveur", () => {
    expect(formatUpdatedAt("2026-01-01", "en")).toBe("January 1, 2026");
    expect(formatUpdatedAt("2026-12-31", "fr")).toBe("31 décembre 2026");
  });

  it("refuse une date qui n'est pas au format AAAA-MM-JJ", () => {
    expect(() => formatUpdatedAt("02/10/2026", "en")).toThrow(/AAAA-MM-JJ/);
    expect(() => formatUpdatedAt("2026-13-45", "en")).toThrow(/AAAA-MM-JJ/);
  });
});
