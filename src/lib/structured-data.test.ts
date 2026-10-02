import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "./i18n";
import { getApp, getGames } from "@/content/apps";
import {
  breadcrumbSchema,
  mobileApplicationSchema,
  organizationSchema,
  videoGameSchema,
  webPageSchema,
  websiteSchema,
} from "./structured-data";

// Les pages jeux n'existent que pour les jeux publiés : on publie tout le
// registre ici pour vérifier le schéma de chaque forme de jeu (genre maison,
// grilles FR/EN, slug français), sans dépendre de l'avancement des livraisons.
vi.mock("@/content/apps", async (importOriginal) =>
  (await import("@/content/apps/publish-all.test-support")).publishAllGames(
    await importOriginal<typeof import("@/content/apps")>(),
  ),
);

const ORIGIN = "https://synapgeek.com";
const BCP_47 = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;
const cerebrum = getApp("cerebrum");
const appCopy = {
  hero: { definition: "d" },
  updatedAt: "2026-10-02",
} as const;
const app = (locale: (typeof LOCALES)[number]) =>
  mobileApplicationSchema(cerebrum, locale, appCopy);

describe("JSON-LD — @id stables entre les langues", () => {
  it.each(LOCALES)(
    "les @id de %s sont ceux du graphe unique du site",
    (locale) => {
      expect(organizationSchema()["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(websiteSchema(locale)["@id"]).toBe(`${ORIGIN}/#website`);
      expect(app(locale)["@id"]).toBe(`${ORIGIN}/cerebrum#app`);
    },
  );

  it("Organization et WebSite pointent la racine, identique dans chaque langue", () => {
    for (const locale of LOCALES) {
      expect(organizationSchema().url).toBe(`${ORIGIN}/`);
      expect(websiteSchema(locale).url).toBe(`${ORIGIN}/`);
    }
  });

  it("les références publisher/author/isPartOf visent ces @id", () => {
    for (const locale of LOCALES) {
      expect(app(locale).author["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(app(locale).publisher["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(websiteSchema(locale).publisher["@id"]).toBe(
        `${ORIGIN}/#organization`,
      );
      expect(
        webPageSchema({
          locale,
          pageId: "privacy",
          name: "n",
          dateModified: "2026-01-01",
        }).isPartOf["@id"],
      ).toBe(`${ORIGIN}/#website`);
    }
  });
});

describe("JSON-LD — inLanguage en BCP 47", () => {
  it("WebSite et WebPage utilisent « en » / « fr », jamais « fr_FR »", () => {
    for (const locale of LOCALES) {
      expect(websiteSchema(locale).inLanguage).toBe(locale);
      expect(
        webPageSchema({
          locale,
          pageId: "legal",
          name: "n",
          dateModified: "2026-01-01",
        }).inLanguage,
      ).toBe(locale);
    }
  });

  it("les 16 langues de l'app sont des balises BCP 47 valides", () => {
    const { inLanguage } = app("en");
    expect(inLanguage).toHaveLength(16);
    for (const tag of inLanguage) expect(tag).toMatch(BCP_47);
  });
});

describe("JSON-LD — application Cerebrum", () => {
  it("est co-typée MobileApplication et VideoGame", () => {
    expect(app("en")["@type"]).toEqual(["MobileApplication", "VideoGame"]);
  });

  it.each(LOCALES)(
    "l'url de %s est celle de la page, l'@id reste unique",
    (locale) => {
      const node = app(locale);
      expect(node.url).toBe(
        locale === "en" ? `${ORIGIN}/cerebrum` : `${ORIGIN}/fr/cerebrum`,
      );
      expect(node["@id"]).toBe(`${ORIGIN}/cerebrum#app`);
    },
  );

  it("reprend la phrase de définition et la date de la copie", () => {
    const node = app("fr");
    expect(node.description).toBe("d");
    expect(node.dateModified).toBe("2026-10-02");
  });

  it("déclare iOS et Android, gratuit, sans aggregateRating", () => {
    const node = app("en");
    expect(node.operatingSystem).toEqual(["iOS", "Android"]);
    expect(node.applicationCategory).toBe("GameApplication");
    expect(node.offers.price).toBe("0");
    expect(JSON.stringify(node)).not.toContain("aggregateRating");
  });

  it("n'annonce pas Android quand le registre n'a pas de version minimale vérifiée", () => {
    const iosOnly = {
      ...cerebrum,
      platforms: { ...cerebrum.platforms, android: { minOs: null } },
    };
    expect(
      mobileApplicationSchema(iosOnly, "en", appCopy).operatingSystem,
    ).toEqual(["iOS"]);
  });
});

describe("JSON-LD — page d'un jeu", () => {
  const games = getGames("cerebrum");
  const byId = (id: string) => games.find((game) => game.id === id)!;
  const gameCopy = { hero: { definition: "d" }, updatedAt: "2026-10-02" };
  const game = (id: string, locale: (typeof LOCALES)[number]) =>
    videoGameSchema(cerebrum, byId(id), locale, gameCopy);

  it.each(LOCALES)(
    "l'@id de %s suit le slug anglais, l'url suit la page de la langue",
    (locale) => {
      expect(game("minesweeper", locale)["@id"]).toBe(
        `${ORIGIN}/cerebrum/minesweeper#game`,
      );
      expect(game("minesweeper", locale).url).toBe(
        locale === "en"
          ? `${ORIGIN}/cerebrum/minesweeper`
          : `${ORIGIN}/fr/cerebrum/demineur`,
      );
    },
  );

  it("nomme le jeu comme l'app, dans la langue de la page", () => {
    expect(game("minesweeper", "en").name).toBe("Minesweeper");
    expect(game("minesweeper", "fr").name).toBe("Démineur");
  });

  it("rattache le jeu à l'app et à l'organisation par leurs @id", () => {
    const node = game("sudoku", "en");
    expect(node["@type"]).toBe("VideoGame");
    expect(node.isPartOf["@id"]).toBe(`${ORIGIN}/cerebrum#app`);
    expect(node.publisher["@id"]).toBe(`${ORIGIN}/#organization`);
  });

  it("annonce les plateformes du registre, jamais Android sans version vérifiée", () => {
    expect(game("sudoku", "en").gamePlatform).toEqual([
      "iPhone",
      "iPad",
      "Android",
    ]);
    const iosOnly = {
      ...byId("sudoku"),
      availability: { ios: "3.0.0", android: null },
    };
    expect(
      videoGameSchema(cerebrum, iosOnly, "en", gameCopy).gamePlatform,
    ).toEqual(["iPhone", "iPad"]);
  });

  it("ajoute le genre maison au genre générique, un classique n'a que le générique", () => {
    expect(game("sudoku", "en").genre).toEqual(["Puzzle"]);
    expect(game("pandoku", "fr").genre).toEqual([
      "Puzzle",
      "puzzle de logique de type Star Battle",
    ]);
  });

  it("limite les langues d'un jeu de mots à celles de ses grilles", () => {
    expect(game("crossword", "en").inLanguage).toEqual(["fr", "en"]);
    expect(game("sudoku", "en").inLanguage).toEqual(cerebrum.languages);
  });

  it("reprend la définition et la date de la copie, sans aggregateRating", () => {
    const node = game("sudoku", "fr");
    expect(node.description).toBe("d");
    expect(node.dateModified).toBe("2026-10-02");
    expect(node.image).toBe(`${ORIGIN}/images/games/sudoku-v3.webp`);
    expect(JSON.stringify(node)).not.toContain("aggregateRating");
  });
});

describe("JSON-LD — fil d'Ariane", () => {
  const items = [
    { name: "Synapgeek", href: "/" },
    { name: "Cerebrum", href: "/cerebrum" },
    { name: "Sudoku" },
  ];

  it("numérote les maillons à partir de 1 et rend les liens absolus", () => {
    expect(breadcrumbSchema(items).itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Synapgeek", item: ORIGIN },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cerebrum",
        item: `${ORIGIN}/cerebrum`,
      },
      { "@type": "ListItem", position: 3, name: "Sudoku" },
    ]);
  });

  it("garde le préfixe de langue des chemins reçus", () => {
    const [home] = breadcrumbSchema([
      { name: "Synapgeek", href: "/fr" },
      { name: "x" },
    ]).itemListElement;
    expect(home.item).toBe(`${ORIGIN}/fr`);
  });
});
