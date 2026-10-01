import { describe, expect, it } from "vitest";
import { LOCALES } from "./i18n";
import { getApp } from "@/content/apps";
import {
  breadcrumbSchema,
  mobileApplicationSchema,
  organizationSchema,
  webPageSchema,
  websiteSchema,
} from "./structured-data";

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
