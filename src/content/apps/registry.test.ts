import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getAppCopy } from "@/content/copy";
import { GAME_SLUGS } from "@/lib/page-slugs";
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

  it("nomme pour le wordmark une propriété définie dans globals.css", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    for (const app of getApps()) {
      expect(app.wordmarkColor).toMatch(/^--color-[a-z-]+$/);
      expect(css, app.wordmarkColor).toContain(`${app.wordmarkColor}:`);
    }
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

  it("déclare les difficultés du défi du jour : Facile ou Moyen, Facile seule pour mots croisés et mots mêlés", () => {
    // Fichier de faits iOS : l'app tire la difficulté du jour parmi ces valeurs.
    const easyOnly: readonly GameId[] = ["crossword", "word-search"];
    for (const game of games) {
      expect(game.dailyDifficulties, game.id).toEqual(
        easyOnly.includes(game.id) ? ["easy"] : ["easy", "medium"],
      );
      for (const difficulty of game.dailyDifficulties) {
        expect(game.difficulties).toContain(difficulty);
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

  it("annonce iPhone, iPad et Android pour les dix jeux", () => {
    for (const game of games) {
      expect(platformsFor(game)).toEqual(["iPhone", "iPad", "Android"]);
    }
  });

  it("n'annonce pas Android pour un jeu dont availability.android est null", () => {
    const iosOnly: GameEntry = {
      ...byId("pandoku"),
      availability: { ios: "3.0.0", android: null },
    };
    expect(platformsFor(iosOnly)).toEqual(["iPhone", "iPad"]);
  });

  it("déclare les versions minimales iOS 17.0 et Android 8.0", () => {
    expect(getApp("cerebrum").platforms).toEqual({
      ios: { minOs: "17.0" },
      android: { minOs: "8.0" },
    });
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
      expect(byId(id).availability).toEqual({
        ios: "3.0.0",
        android: "3.0.0",
      });
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
    check(getApp("cerebrum").scene.wide);
    check(getApp("cerebrum").scene.narrow);
    expect(missing).toEqual([]);
  });

  it("ne publie un jeu que s'il a sa copie dans chaque langue, et inversement", () => {
    // Chaque tâche de copie livre le texte ET passe `published` à true : un
    // seul des deux serait soit une page vide, soit un texte sans route.
    const mismatched = games.filter(
      (game) =>
        game.published !==
        LOCALES.every(
          (locale) => game.id in getAppCopy("cerebrum", locale).games,
        ),
    );
    expect(mismatched.map((game) => game.id)).toEqual([]);
  });

  it("garde exactement les mêmes clés dans page-slugs et dans le registre, dans les deux sens", () => {
    // page-slugs.ts n'importe rien (next.config.ts le charge en relatif) : il ne peut pas
    // se typer sur GameId. Ce test est donc le seul garde-fou de l'égalité des deux ensembles.
    const slugKeys = Object.keys(GAME_SLUGS);
    const registryIds = games.map((game) => game.id);
    expect(
      slugKeys.filter((key) => !registryIds.includes(key as GameId)),
    ).toEqual([]);
    expect(registryIds.filter((id) => !slugKeys.includes(id))).toEqual([]);
    expect(slugKeys).toHaveLength(registryIds.length);
  });

  it("lit ses slugs dans le module partagé page-slugs", () => {
    for (const game of games) {
      expect(game.slug).toBe(GAME_SLUGS[game.id]);
    }
  });

  it("nomme les couleurs par propriété CSS, définie dans globals.css, jamais en hexadécimal", () => {
    const globals = readFileSync(
      path.join(import.meta.dirname, "../../app/globals.css"),
      "utf8",
    );
    for (const game of games) {
      expect(game.color.wash).toBe(`--game-${game.id}-wash`);
      expect(game.color.deep).toBe(`--game-${game.id}-deep`);
      for (const token of [game.color.wash, game.color.deep]) {
        expect(globals).toMatch(new RegExp(`${token}:\\s*#[0-9a-f]{6};`));
      }
    }
  });
});
