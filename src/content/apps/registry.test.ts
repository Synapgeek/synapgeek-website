import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "@/lib/i18n";
import {
  findGameBySlug,
  gameSlug,
  getApp,
  getApps,
  getGames,
  platformsFor,
} from "./index";
import type { GameEntry, GameId } from "./types";

const PUBLISHED_ORDER: readonly GameId[] = [
  "sudoku",
  "pandoku",
  "minesweeper",
  "pixel-art",
  "cross-math",
  "crossword",
  "word-search",
  "trace",
  "maze",
  "arrow-maze",
];

const RESERVED_SLUGS = [
  "play",
  "privacy",
  "terms",
  "legal",
  "about",
  "a-propos",
  "press",
  "presse",
  "en",
  "fr",
];

const games = getGames("cerebrum");
const byId = (id: GameId): GameEntry => {
  const game = games.find((entry) => entry.id === id);
  if (!game) throw new Error(`jeu absent du registre : ${id}`);
  return game;
};

describe("registre des apps", () => {
  it("expose Cerebrum avec ses identifiants store", () => {
    expect(getApps().map((app) => app.slug)).toEqual(["cerebrum"]);
    const app = getApp("cerebrum");
    expect(app.appStoreId).toBe("6763915130");
    expect(app.appStoreUrl).toBe("https://apps.apple.com/app/id6763915130");
    expect(app.googlePlayUrl).toBe(
      "https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum",
    );
    expect(app.games).toEqual(PUBLISHED_ORDER);
  });
});

describe("registre des jeux", () => {
  it("compte dix jeux dans l'ordre publié", () => {
    expect(games.map((game) => game.id)).toEqual(PUBLISHED_ORDER);
  });

  it("donne des slugs uniques par locale, jamais réservés", () => {
    for (const locale of LOCALES) {
      const slugs = games.map((game) => game.slug[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) {
        expect(RESERVED_SLUGS).not.toContain(slug);
      }
    }
  });

  it("résout un slug dans sa propre locale uniquement", () => {
    expect(findGameBySlug("cerebrum", "fr", "crossword")).toBeNull();
    expect(findGameBySlug("cerebrum", "en", "mots-croises")).toBeNull();
    expect(findGameBySlug("cerebrum", "fr", "mots-croises")?.id).toBe(
      "crossword",
    );
    expect(findGameBySlug("cerebrum", "en", "crossword")?.id).toBe("crossword");
    expect(findGameBySlug("cerebrum", "en", "inconnu")).toBeNull();
  });

  it("fait l'aller-retour gameSlug / findGameBySlug", () => {
    for (const locale of LOCALES as readonly Locale[]) {
      for (const game of games) {
        const slug = gameSlug("cerebrum", game.id, locale);
        expect(findGameBySlug("cerebrum", locale, slug)?.id).toBe(game.id);
      }
    }
  });

  it("donne quatre difficultés sauf trois (sans élite) pour mots croisés, mots mêlés et arrow maze", () => {
    const threeLevels: readonly GameId[] = [
      "crossword",
      "word-search",
      "arrow-maze",
    ];
    for (const game of games) {
      if (threeLevels.includes(game.id)) {
        expect(game.difficulties).toEqual(["easy", "medium", "hard"]);
      } else {
        expect(game.difficulties).toEqual(["easy", "medium", "hard", "elite"]);
      }
    }
  });

  it("limite mots croisés et mots mêlés au français et à l'anglais", () => {
    expect(byId("crossword").contentLocales).toEqual(["fr", "en"]);
    expect(byId("word-search").contentLocales).toEqual(["fr", "en"]);
    expect(byId("sudoku").contentLocales).toBe("all");
  });

  it("reproduit les vies et tutoriels du fichier de faits 3.0.0", () => {
    const lives = Object.fromEntries(games.map((g) => [g.id, g.lives]));
    expect(lives).toEqual({
      sudoku: "three-mistakes",
      pandoku: "three-hearts",
      minesweeper: "three-hearts",
      "pixel-art": "three-lives",
      "cross-math": "three-lives",
      crossword: "three-hearts",
      "word-search": "none",
      trace: "none",
      maze: "none",
      "arrow-maze": "grid-defined",
    });
    const tutorials = games.filter((g) => g.hasTutorial).map((g) => g.id);
    expect(tutorials).toEqual([
      "pandoku",
      "minesweeper",
      "pixel-art",
      "trace",
      "maze",
      "arrow-maze",
    ]);
  });

  it("garde un genre pour les noms maison et null pour les classiques", () => {
    const classics: readonly GameId[] = [
      "sudoku",
      "minesweeper",
      "crossword",
      "word-search",
      "maze",
    ];
    for (const game of games) {
      for (const locale of LOCALES) {
        if (classics.includes(game.id)) {
          expect(game.genre[locale]).toBeNull();
        } else {
          expect(game.genre[locale]).toEqual(expect.any(String));
        }
      }
    }
  });

  it("annonce iPhone et iPad seulement tant qu'Android n'est pas confirmé", () => {
    const pandoku = byId("pandoku");
    expect(pandoku.availability.android).toBeNull();
    expect(platformsFor(pandoku)).toEqual(["iPhone", "iPad"]);
    const withAndroid: GameEntry = {
      ...pandoku,
      availability: { ios: "3.0.0", android: "3.0.0" },
    };
    expect(platformsFor(withAndroid)).toEqual(["iPhone", "iPad", "Android"]);
    expect(platformsFor(byId("sudoku"))).toEqual(["iPhone", "iPad", "Android"]);
  });

  it("date la sortie des dix jeux (2.0.0 ou 3.0.0)", () => {
    for (const id of [
      "sudoku",
      "crossword",
      "word-search",
      "cross-math",
      "trace",
      "maze",
    ] as const) {
      expect(byId(id).availability).toEqual({ ios: "2.0.0", android: "2.0.0" });
    }
    for (const id of [
      "pandoku",
      "minesweeper",
      "pixel-art",
      "arrow-maze",
    ] as const) {
      expect(byId(id).availability).toEqual({ ios: "3.0.0", android: null });
    }
  });

  it("référence des assets qui existent sous public/", () => {
    const missing: string[] = [];
    const check = (assetPath: string) => {
      if (!existsSync(path.join("public", assetPath))) missing.push(assetPath);
    };
    for (const game of games) {
      check(game.icon);
      for (const locale of LOCALES) check(game.screenshot[locale]);
    }
    for (const locale of LOCALES) {
      check(`/images/screens/v3/homepage-${locale}.webp`);
    }
    check(getApp("cerebrum").icon);
    expect(missing).toEqual([]);
  });

  it("n'écrit les couleurs que sous forme wash/deep hexadécimales", () => {
    for (const game of games) {
      expect(game.color.wash).toMatch(/^#[0-9A-F]{6}$/);
      expect(game.color.deep).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});
