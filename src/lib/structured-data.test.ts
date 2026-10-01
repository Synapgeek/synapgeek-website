import { describe, expect, it } from "vitest";
import { LOCALES } from "./i18n";
import {
  organizationSchema,
  softwareApplicationSchema,
  webPageSchema,
  websiteSchema,
} from "./structured-data";

const ORIGIN = "https://synapgeek.com";
const BCP_47 = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

describe("JSON-LD — @id stables entre les langues", () => {
  it.each(LOCALES)(
    "les @id de %s sont ceux du graphe unique du site",
    (locale) => {
      expect(organizationSchema()["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(websiteSchema(locale)["@id"]).toBe(`${ORIGIN}/#website`);
      expect(
        softwareApplicationSchema(locale, { description: "d" })["@id"],
      ).toBe(`${ORIGIN}/cerebrum#app`);
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
      const app = softwareApplicationSchema(locale, { description: "d" });
      expect(app.author["@id"]).toBe(`${ORIGIN}/#organization`);
      expect(app.publisher["@id"]).toBe(`${ORIGIN}/#organization`);
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
    const { inLanguage } = softwareApplicationSchema("en", {
      description: "d",
    });
    expect(inLanguage).toHaveLength(16);
    for (const tag of inLanguage) expect(tag).toMatch(BCP_47);
  });
});
