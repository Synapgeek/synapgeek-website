import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "./i18n";
import { getApp, getGames } from "@/content/apps";
import { getAboutCopy, getAppCopy } from "@/content/copy";
import { PUBLISHER } from "@/content/publisher";
import { absoluteUrl } from "./routes";
import {
  aboutPageSchema,
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
  disambiguation: "Not the other one.",
  sections: {
    model: { items: ["Free, with ads.", "Premium means no forced ads."] },
    goodToKnow: { items: ["Offline.", "Guest play."] },
  },
} as const;
const aboutCopy = (locale: (typeof LOCALES)[number]) => getAboutCopy(locale);
const app = (locale: (typeof LOCALES)[number]) =>
  mobileApplicationSchema(cerebrum, locale, appCopy);

describe("JSON-LD — @id stables entre les langues", () => {
  it.each(LOCALES)(
    "les @id de %s sont ceux du graphe unique du site",
    (locale) => {
      expect(organizationSchema(aboutCopy(locale))["@id"]).toBe(
        `${ORIGIN}/#organization`,
      );
      expect(websiteSchema()["@id"]).toBe(`${ORIGIN}/#website`);
      expect(app(locale)["@id"]).toBe(`${ORIGIN}/cerebrum#app`);
    },
  );

  it("Organization et WebSite pointent la racine, identique dans chaque langue", () => {
    for (const locale of LOCALES) {
      expect(organizationSchema(aboutCopy(locale)).url).toBe(`${ORIGIN}/`);
      expect(websiteSchema().url).toBe(`${ORIGIN}/`);
    }
  });

  it("les références publisher/author/isPartOf visent ces @id", () => {
    for (const locale of LOCALES) {
      expect(app(locale).author["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(app(locale).publisher["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(websiteSchema().publisher["@id"]).toBe(`${ORIGIN}/#organization`);
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
  it("WebSite liste toutes les langues du site, identique dans chacune ; WebPage utilise « en » / « fr », jamais « fr_FR »", () => {
    expect(websiteSchema().inLanguage).toEqual(["en", "fr"]);
    for (const locale of LOCALES) {
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

  it("lit dans la copie l'homonymie, l'offre et la liste de fonctions, sans les réécrire", () => {
    const node = app("en");
    expect(node.disambiguatingDescription).toBe(appCopy.disambiguation);
    expect(node.offers.description).toBe(appCopy.sections.model.items[0]);
    expect(node.featureList).toBe(appCopy.sections.goodToKnow.items);
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

describe("JSON-LD — Cerebrum et sa vraie copie", () => {
  it.each(LOCALES)(
    "l'offre est la première phrase du modèle de la page, sans prix (%s)",
    (locale) => {
      const copy = getAppCopy("cerebrum", locale);
      const node = mobileApplicationSchema(cerebrum, locale, copy);
      expect(node.offers.description).toBe(copy.sections.model.items[0]);
      expect(node.offers.description).not.toMatch(/[€$]|\d\s?(€|EUR|USD)/);
      expect(node.featureList).toEqual(copy.sections.goodToKnow.items);
      expect(node.disambiguatingDescription).toBe(copy.disambiguation);
      expect(node.disambiguatingDescription).toContain(PUBLISHER.legalName);
    },
  );

  it.each(LOCALES)(
    "hasPart renvoie aux @id des jeux publiés, ceux de leurs propres nœuds (%s)",
    (locale) => {
      const published = getGames("cerebrum").filter((g) => g.published);
      const node = mobileApplicationSchema(
        cerebrum,
        locale,
        getAppCopy("cerebrum", locale),
      );
      const ids = node.hasPart.map((part) => part["@id"]);
      expect(ids).toHaveLength(published.length);
      for (const game of published) {
        const gameNode = videoGameSchema(cerebrum, game, locale, {
          hero: { definition: "d" },
          updatedAt: "2026-10-03",
        });
        // Même @id dans les deux langues : l'entité du jeu est unique.
        expect(ids).toContain(gameNode["@id"]);
        expect(gameNode["@id"]).toMatch(
          new RegExp(`^${ORIGIN}/cerebrum/[a-z-]+#game$`),
        );
      }
    },
  );
});

describe("JSON-LD — identité tirée de l'AppEntry, rien de codé pour Cerebrum", () => {
  const other = {
    ...cerebrum,
    name: "Other",
    storeTitles: ["Other: Store Title"],
    datePublished: "2027-01-02",
  };

  it("le nom, les titres de fiche et la date de première publication viennent de l'app", () => {
    const node = mobileApplicationSchema(other, "en", appCopy);
    expect(node.name).toBe("Other");
    expect(node.alternateName).toEqual(["Other: Store Title"]);
    expect(node.datePublished).toBe("2027-01-02");
    expect(JSON.stringify(node)).not.toContain("Jeux zen sans wifi");
  });

  it("l'@id est celui de la page de l'app, en anglais, dans les deux langues", () => {
    for (const locale of LOCALES) {
      expect(app(locale)["@id"]).toBe(
        `${absoluteUrl(cerebrum.slug, "en")}#app`,
      );
    }
  });

  it("Android sans version vérifiée : ni operatingSystem, ni downloadUrl, ni sameAs Play", () => {
    const iosOnly = {
      ...cerebrum,
      platforms: { ...cerebrum.platforms, android: { minOs: null } },
    };
    const node = mobileApplicationSchema(iosOnly, "en", appCopy);
    expect(node.operatingSystem).toEqual(["iOS"]);
    expect(node.downloadUrl).toEqual([cerebrum.appStoreUrl]);
    expect(node.sameAs).toEqual([cerebrum.appStoreUrl]);
  });

  it("avec Android vérifié, les deux boutiques sont annoncées partout", () => {
    const node = app("en");
    expect(node.operatingSystem).toEqual(["iOS", "Android"]);
    expect(node.downloadUrl).toEqual([
      cerebrum.appStoreUrl,
      cerebrum.googlePlayUrl,
    ]);
    expect(node.sameAs).toEqual(node.downloadUrl);
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

describe("JSON-LD — organisation et page À propos", () => {
  it("l'organisation lit son identité dans PUBLISHER", () => {
    const org = organizationSchema(aboutCopy("en"));
    expect(org.legalName).toBe(PUBLISHER.legalName);
    // Le pays seulement : la rue, le code postal et la ville ne sont que dans les mentions légales.
    expect(org.address).toEqual({
      "@type": "PostalAddress",
      addressCountry: PUBLISHER.address.countryCode,
    });
    expect(org.vatID).toBe(PUBLISHER.vat);
    expect(org.contactPoint.email).toBe(PUBLISHER.contactEmail);
  });

  it("sameAs se limite aux deux pages développeur des boutiques", () => {
    expect(organizationSchema(aboutCopy("en")).sameAs).toEqual([
      "https://apps.apple.com/fr/developer/synapgeek/id1895554771",
      "https://play.google.com/store/apps/developer?id=Synapgeek",
    ]);
  });

  it.each(LOCALES)(
    "la description de l'organisation est la définition de À propos (%s), à la troisième personne",
    (locale) => {
      const org = organizationSchema(aboutCopy(locale));
      expect(org.description).toBe(aboutCopy(locale).hero.definition);
      expect(org.description).not.toMatch(/\b(nous|we|our|notre)\b/i);
    },
  );

  it.each(LOCALES)(
    "AboutPage (%s) référence l'organisation sans en créer une seconde",
    (locale) => {
      const page = aboutPageSchema({
        locale,
        name: "n",
        dateModified: "2026-10-02",
      });
      expect(page["@type"]).toBe("AboutPage");
      expect(page.about["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(page.isPartOf["@id"]).toBe(`${ORIGIN}/#website`);
      expect(page.inLanguage).toBe(locale);
      expect(JSON.stringify(page)).not.toContain('"Organization"');
      expect(page.url).toBe(
        locale === "en" ? `${ORIGIN}/about` : `${ORIGIN}/fr/a-propos`,
      );
    },
  );
});
