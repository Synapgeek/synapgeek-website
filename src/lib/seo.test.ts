import { describe, expect, it } from "vitest";
import { buildOpenGraph, getAlternates } from "./seo";

describe("getAlternates", () => {
  it("l'accueil anglais est canonique à la racine, le français sous /fr", () => {
    expect(getAlternates("home", "en")).toEqual({
      canonical: "https://synapgeek.com",
      languages: {
        en: "https://synapgeek.com",
        fr: "https://synapgeek.com/fr",
        "x-default": "https://synapgeek.com",
      },
    });
    expect(getAlternates("home", "fr").canonical).toBe(
      "https://synapgeek.com/fr",
    );
  });

  it.each(["privacy", "terms", "legal"] as const)(
    "la page légale %s est canonique vers elle-même dans chaque langue",
    (page) => {
      expect(getAlternates(page, "fr").canonical).toBe(
        `https://synapgeek.com/${page}`,
      );
      expect(getAlternates(page, "en").canonical).toBe(
        `https://synapgeek.com/en/${page}`,
      );
      expect(getAlternates(page, "fr").languages).toEqual({
        en: `https://synapgeek.com/en/${page}`,
        fr: `https://synapgeek.com/${page}`,
        "x-default": `https://synapgeek.com/en/${page}`,
      });
    },
  );
});

describe("buildOpenGraph", () => {
  it("og:url égale l'URL canonique de la page", () => {
    expect(buildOpenGraph("en", "home", "t", "d").url).toBe(
      "https://synapgeek.com",
    );
    expect(buildOpenGraph("fr", "privacy", "t", "d").url).toBe(
      "https://synapgeek.com/privacy",
    );
    expect(buildOpenGraph("en", "terms", "t", "d").url).toBe(
      "https://synapgeek.com/en/terms",
    );
  });

  it("garde l'image et les locales complètes", () => {
    const og = buildOpenGraph("fr", "home", "t", "d");
    expect(og).toMatchObject({
      locale: "fr_FR",
      alternateLocale: ["en_US"],
      siteName: "Synapgeek",
    });
    expect(og.images).toEqual([
      { url: "/images/brand/og-image.jpeg", width: 1200, height: 630 },
    ]);
  });

  it("n'ajoute pas l'image du site quand la page porte la sienne (une seule og:image)", () => {
    const og = buildOpenGraph("en", "cerebrum", "t", "d", {
      ownImage: true,
    });
    expect(og).not.toHaveProperty("images");
    expect(og).toMatchObject({
      url: "https://synapgeek.com/cerebrum",
      siteName: "Synapgeek",
      locale: "en_US",
    });
  });
});
