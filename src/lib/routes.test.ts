import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "./i18n";
import { FROZEN_LEGAL_PATHS } from "./frozen-legal-paths";
import { GAME_SLUGS, SECTION_SLUGS } from "./page-slugs";
import {
  absoluteUrl,
  alternatesFor,
  pageIdForGame,
  pagePath,
  publishedPageIds,
  renderedPageIds,
  resolveGameSlug,
  resolveSection,
  type PageId,
} from "./routes";

// Les pages jeux n'existent que pour les jeux publiés : tout le registre est
// publié ici pour vérifier le schéma d'URL de chaque jeu, quel que soit
// l'avancement des livraisons de copie.
vi.mock("@/content/apps", async (importOriginal) =>
  (await import("@/content/apps/publish-all.test-support")).publishAllGames(
    await importOriginal<typeof import("@/content/apps")>(),
  ),
);

/** Chemin attendu pour chaque page publiée : toute nouvelle page doit s'ajouter ici. */
const EXPECTED: Readonly<Record<PageId, Record<Locale, string>>> = {
  home: { en: "/", fr: "/fr" },
  cerebrum: { en: "/cerebrum", fr: "/fr/cerebrum" },
  "game:sudoku": { en: "/cerebrum/sudoku", fr: "/fr/cerebrum/sudoku" },
  "game:pandoku": { en: "/cerebrum/pandoku", fr: "/fr/cerebrum/pandoku" },
  "game:minesweeper": {
    en: "/cerebrum/minesweeper",
    fr: "/fr/cerebrum/demineur",
  },
  "game:pixel-art": {
    en: "/cerebrum/pixel-art",
    fr: "/fr/cerebrum/pixel-art",
  },
  "game:cross-math": {
    en: "/cerebrum/cross-math",
    fr: "/fr/cerebrum/cross-math",
  },
  "game:crossword": {
    en: "/cerebrum/crossword",
    fr: "/fr/cerebrum/mots-croises",
  },
  "game:word-search": {
    en: "/cerebrum/word-search",
    fr: "/fr/cerebrum/mots-meles",
  },
  "game:trace": { en: "/cerebrum/trace", fr: "/fr/cerebrum/trace" },
  "game:maze": { en: "/cerebrum/maze", fr: "/fr/cerebrum/labyrinthe" },
  "game:arrow-maze": {
    en: "/cerebrum/arrow-maze",
    fr: "/fr/cerebrum/arrow-maze",
  },
  about: { en: "/about", fr: "/fr/a-propos" },
  press: { en: "/press", fr: "/fr/presse" },
  // Schéma figé (app installée, stores, UMP, Data Safety) : FR sans préfixe, EN sous /en.
  privacy: { en: "/en/privacy", fr: "/privacy" },
  terms: { en: "/en/terms", fr: "/terms" },
  legal: { en: "/en/legal", fr: "/legal" },
};

const read = (file: string) =>
  readFileSync(path.join(import.meta.dirname, file), "utf8");

describe("pagePath : table de vérité", () => {
  it("couvre exactement les pages publiées", () => {
    expect([...publishedPageIds()].sort()).toEqual(
      (Object.keys(EXPECTED) as PageId[]).sort(),
    );
  });

  const cases = (Object.keys(EXPECTED) as PageId[]).flatMap((id) =>
    LOCALES.map((locale) => [id, locale, EXPECTED[id][locale]] as const),
  );
  it.each(cases)("%s en %s donne %s", (id, locale, expected) => {
    expect(pagePath(id, locale)).toBe(expected);
  });

  it("ne produit jamais de slash final hors de la racine anglaise", () => {
    for (const id of publishedPageIds()) {
      for (const locale of LOCALES) {
        const result = pagePath(id, locale);
        if (result !== "/") expect(result.endsWith("/")).toBe(false);
      }
    }
  });

  it("garde les chemins légaux français dans FROZEN_LEGAL_PATHS", () => {
    const legalFr = (["privacy", "terms", "legal"] as const).map((id) =>
      pagePath(id, "fr"),
    );
    expect(legalFr).toEqual([...FROZEN_LEGAL_PATHS]);
    expect(FROZEN_LEGAL_PATHS).toEqual(["/privacy", "/terms", "/legal"]);
  });

  it("refuse un identifiant de jeu inconnu, dans toutes les langues", () => {
    for (const locale of LOCALES) {
      expect(() => pagePath("game:inconnu" as PageId, locale)).toThrow(
        /non publié ou inconnu/,
      );
    }
  });

  it("ajoute les ancres sans slash parasite", () => {
    expect(pagePath("home", "en", "contact")).toBe("/#contact");
    expect(pagePath("home", "fr", "contact")).toBe("/fr#contact");
    expect(pagePath("cerebrum", "en", "games")).toBe("/cerebrum#games");
    expect(pagePath("privacy", "fr", "account-deletion")).toBe(
      "/privacy#account-deletion",
    );
    expect(pagePath("privacy", "en", "account-deletion")).toBe(
      "/en/privacy#account-deletion",
    );
    expect(pagePath("game:maze", "fr", "faq")).toBe(
      "/fr/cerebrum/labyrinthe#faq",
    );
  });
});

describe("absoluteUrl", () => {
  it("préfixe https://synapgeek.com sans slash final sur la racine anglaise", () => {
    expect(absoluteUrl("home", "en")).toBe("https://synapgeek.com");
    expect(absoluteUrl("home", "fr")).toBe("https://synapgeek.com/fr");
    expect(absoluteUrl("cerebrum", "en")).toBe(
      "https://synapgeek.com/cerebrum",
    );
    expect(absoluteUrl("privacy", "fr")).toBe("https://synapgeek.com/privacy");
  });
});

describe("alternatesFor", () => {
  it("pointe x-default vers l'anglais, mentions légales comprises", () => {
    expect(alternatesFor("privacy").languages).toEqual({
      en: "https://synapgeek.com/en/privacy",
      fr: "https://synapgeek.com/privacy",
      "x-default": "https://synapgeek.com/en/privacy",
    });
  });

  it("pointe x-default vers l'anglais pour un jeu et pour l'accueil", () => {
    expect(alternatesFor("game:minesweeper").languages).toEqual({
      en: "https://synapgeek.com/cerebrum/minesweeper",
      fr: "https://synapgeek.com/fr/cerebrum/demineur",
      "x-default": "https://synapgeek.com/cerebrum/minesweeper",
    });
    expect(alternatesFor("home").languages["x-default"]).toBe(
      "https://synapgeek.com",
    );
  });
});

describe("pageIdForGame", () => {
  it("préfixe l'identifiant du jeu", () => {
    expect(pageIdForGame("crossword")).toBe("game:crossword");
  });
});

describe("resolveGameSlug", () => {
  it("résout un slug dans sa propre locale", () => {
    expect(resolveGameSlug("fr", "mots-croises")).toBe("crossword");
    expect(resolveGameSlug("en", "crossword")).toBe("crossword");
    expect(resolveGameSlug("fr", "labyrinthe")).toBe("maze");
    expect(resolveGameSlug("en", "sudoku")).toBe("sudoku");
  });

  it("renvoie null pour le slug de l'autre locale ou un slug inconnu", () => {
    expect(resolveGameSlug("fr", "crossword")).toBeNull();
    expect(resolveGameSlug("en", "mots-croises")).toBeNull();
    expect(resolveGameSlug("en", "demineur")).toBeNull();
    expect(resolveGameSlug("fr", "inconnu")).toBeNull();
  });
});

describe("resolveSection", () => {
  it("résout about et press dans leur locale uniquement", () => {
    expect(resolveSection("en", "about")).toBe("about");
    expect(resolveSection("fr", "a-propos")).toBe("about");
    expect(resolveSection("en", "press")).toBe("press");
    expect(resolveSection("fr", "presse")).toBe("press");
    expect(resolveSection("fr", "about")).toBeNull();
    expect(resolveSection("en", "a-propos")).toBeNull();
    expect(resolveSection("en", "cerebrum")).toBeNull();
  });
});

describe("slugs réservés", () => {
  const SECTION_RESERVED = [
    "cerebrum",
    "privacy",
    "terms",
    "legal",
    "account-deletion",
    "play",
    "jouer",
    "api",
    "en",
    "fr",
  ];

  it("n'attribue aucun slug de section à un chemin réservé", () => {
    for (const slugs of Object.values(SECTION_SLUGS)) {
      for (const locale of LOCALES) {
        expect(SECTION_RESERVED).not.toContain(slugs[locale]);
      }
    }
  });

  it("n'attribue jamais « play » à un jeu et garde des slugs uniques par locale", () => {
    for (const locale of LOCALES) {
      const slugs = Object.values(GAME_SLUGS).map((s) => s[locale]);
      expect(slugs).not.toContain("play");
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("modules sans dépendance", () => {
  it.each(["page-slugs.ts", "frozen-legal-paths.ts"])(
    "%s n'importe rien (next.config.ts l'importe en relatif)",
    (file) => {
      expect(read(file)).not.toMatch(/^\s*(import|export\s.*\sfrom)\s/m);
    },
  );
});

describe("renderedPageIds", () => {
  it("ne liste que des pages publiées, dans l'ordre du registre", () => {
    const published = publishedPageIds();
    const rendered = renderedPageIds();
    for (const pageId of rendered) expect(published).toContain(pageId);
    expect(rendered).toEqual(published.filter((id) => rendered.includes(id)));
  });

  it("ne contient aujourd'hui que l'accueil, la page de l'app, Sudoku, Pandoku, Démineur, Pixel Art, Cross Math, Mots croisés, Mots mêlés, Trace, Arrow Maze et les trois pages légales", () => {
    expect(renderedPageIds()).toEqual([
      "home",
      "cerebrum",
      "game:sudoku",
      "game:pandoku",
      "game:minesweeper",
      "game:pixel-art",
      "game:cross-math",
      "game:crossword",
      "game:word-search",
      "game:trace",
      "game:arrow-maze",
      "privacy",
      "terms",
      "legal",
    ]);
  });
});
