import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { OG_IMAGE, buildOpenGraph, getAlternates } from "./seo";

/** Dimensions d'un JPEG, lues dans son premier segment SOFn (aucune dépendance d'image). */
function jpegSize(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  let offset = 2;
  while (offset < bytes.length) {
    const marker = bytes[offset + 1];
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isSof) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error(`Aucun segment SOF dans ${path}`);
}

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
      {
        url: "/images/brand/og-image-v2.jpeg",
        width: 1200,
        height: 630,
        alt: "Synapgeek, studio français indépendant",
      },
    ]);
  });

  it("l'alt de l'image suit la langue, et le fichier a les dimensions annoncées et pèse moins de 300 Ko", () => {
    expect(buildOpenGraph("en", "home", "t", "d").images).toEqual([
      expect.objectContaining({ alt: "Synapgeek, independent French studio" }),
    ]);
    const { width, height } = jpegSize(`public${OG_IMAGE.url}`);
    expect({ width, height }).toEqual({
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
    });
    expect(readFileSync(`public${OG_IMAGE.url}`).length).toBeLessThan(300_000);
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
