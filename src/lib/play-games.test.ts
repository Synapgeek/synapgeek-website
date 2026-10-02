import { describe, expect, it } from "vitest";
import { getGames } from "@/content/apps";
import { LOCALES } from "@/lib/i18n";
import { formatPublishedGameNames } from "./play-games";

describe("formatPublishedGameNames", () => {
  it("cite chaque jeu publié sous son nom de la langue, rien d'autre", () => {
    for (const locale of LOCALES) {
      const text = formatPublishedGameNames(locale);
      const published = getGames("cerebrum").filter((game) => game.published);
      expect(published.length).toBeGreaterThan(0);
      for (const game of published)
        expect(text, locale).toContain(game.name[locale]);
    }
  });

  it("joint par la conjonction de la langue", () => {
    expect(formatPublishedGameNames("fr")).toMatch(/ et [^,]+$/);
    expect(formatPublishedGameNames("en")).toMatch(/, and [^,]+$/);
  });

  it("n'annonce aucun chiffre", () => {
    for (const locale of LOCALES) {
      expect(formatPublishedGameNames(locale)).not.toMatch(/\d/);
    }
  });
});
