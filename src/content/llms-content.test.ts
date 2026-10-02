import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getGames } from "@/content/apps";
import {
  getAboutCopy,
  getAppCopy,
  getHubCopy,
  getPressCopy,
} from "@/content/copy";
import { LOCALES, type Locale } from "@/lib/i18n";
import { absoluteUrl, pageIdForGame, type PageId } from "@/lib/routes";

/**
 * `public/llms.txt` reste un fichier statique : cette garde l'empêche de
 * diverger des modules de copie. Chaque page y figure avec SA phrase de
 * définition, mot pour mot (les assistants la citent), et le modèle économique
 * y est celui de la page de l'app, pas une réécriture.
 */
const llms = readFileSync("public/llms.txt", "utf8");
const lines = llms.split("\n");

/** La ligne de liste qui porte l'URL de la page (`](<url>)`), ou undefined. */
const lineOf = (pageId: PageId, locale: Locale) =>
  lines.find((line) => line.includes(`](${absoluteUrl(pageId, locale)})`));

interface ExpectedLine {
  label: string;
  pageId: PageId;
  locale: Locale;
  definition: string;
}

describe("llms.txt — phrases de définition, mot pour mot", () => {
  const expected: ExpectedLine[] = LOCALES.flatMap((locale) => [
    {
      label: `home ${locale}`,
      pageId: "home",
      locale,
      definition: getHubCopy(locale).hero.definition,
    },
    {
      label: `about ${locale}`,
      pageId: "about",
      locale,
      definition: getAboutCopy(locale).hero.definition,
    },
    {
      label: `press ${locale}`,
      pageId: "press",
      locale,
      definition: getPressCopy(locale).hero.definition,
    },
    {
      label: `cerebrum ${locale}`,
      pageId: "cerebrum",
      locale,
      definition: getAppCopy("cerebrum", locale).hero.definition,
    },
    ...getGames("cerebrum")
      .filter((game) => game.published)
      .map((game): ExpectedLine => {
        const copy = getAppCopy("cerebrum", locale).games[game.id];
        if (!copy) throw new Error(`Copie manquante : ${game.id} ${locale}`);
        return {
          label: `jeu ${game.id} ${locale}`,
          pageId: pageIdForGame(game.id),
          locale,
          definition: copy.hero.definition,
        };
      }),
  ]);

  it("couvre le studio, l'app et chaque jeu publié dans les deux langues", () => {
    const published = getGames("cerebrum").filter((g) => g.published).length;
    expect(published).toBeGreaterThan(0);
    expect(expected).toHaveLength(LOCALES.length * (4 + published));
  });

  it.each(expected)("$label", ({ pageId, locale, definition }) => {
    const line = lineOf(pageId, locale);
    expect(line, `${pageId} ${locale} absente`).toBeDefined();
    expect(line!.endsWith(`: ${definition}`)).toBe(true);
  });
});

describe("llms.txt — modèle économique et précisions de l'app, mot pour mot", () => {
  it.each(LOCALES)("reprend les items de la page de l'app (%s)", (locale) => {
    const { model, goodToKnow } = getAppCopy("cerebrum", locale).sections;
    for (const item of [...model.items, ...goodToKnow.items]) {
      expect(lines, item).toContain(`- ${item}`);
    }
  });
});

describe("llms.txt — règles de rédaction", () => {
  it("n'écrit ni tiret cadratin, ni « sans pub », ni « ad-free »", () => {
    expect(llms).not.toContain("—");
    expect(llms).not.toMatch(/sans pub\b|ad-free/i);
  });

  it("ne cite ni prix, ni note, ni nombre de téléchargements", () => {
    expect(llms).not.toMatch(
      /[€$]\s?\d|\d\s?[€$]|aggregateRating|téléchargements|downloads/i,
    );
  });
});
