import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getAppCopy } from "@/content/copy";
import { LOCALES } from "@/lib/i18n";
import GamePage, { generateMetadata, generateStaticParams } from "./page";

const params = (locale: string, game: string) =>
  Promise.resolve({ locale, game });

async function render(locale: (typeof LOCALES)[number], game: string) {
  const element = await GamePage({ params: params(locale, game) });
  return renderToStaticMarkup(createElement(() => element));
}

function jsonLdNodes(markup: string): Array<Record<string, unknown>> {
  return [
    ...markup.matchAll(
      /<script type="application\/ld\+json">([^<]*)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1].replace(/\\u003c/g, "<")));
}

const decode = (text: string) =>
  text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

describe("generateStaticParams", () => {
  it("liste chaque jeu publié dans chaque langue, avec le slug de cette langue", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en", game: "sudoku" },
      { locale: "fr", game: "sudoku" },
      { locale: "en", game: "pandoku" },
      { locale: "fr", game: "pandoku" },
      { locale: "en", game: "minesweeper" },
      { locale: "fr", game: "demineur" },
      { locale: "en", game: "pixel-art" },
      { locale: "fr", game: "pixel-art" },
      { locale: "en", game: "arrow-maze" },
      { locale: "fr", game: "arrow-maze" },
    ]);
  });
});

describe.each(LOCALES)("page Sudoku (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale).games.sudoku!;

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale, "sudoku"));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("émet le jeu, le fil d'Ariane et la FAQ, sans aggregateRating", async () => {
    const markup = await render(locale, "sudoku");
    expect(jsonLdNodes(markup).map((node) => node["@type"])).toEqual([
      "VideoGame",
      "BreadcrumbList",
      "FAQPage",
    ]);
    expect(markup).not.toContain("aggregateRating");
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible", async () => {
    const markup = await render(locale, "sudoku");
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
  });

  it("le fil d'Ariane du JSON-LD porte les mêmes noms et les mêmes liens que le fil visible", async () => {
    const markup = await render(locale, "sudoku");
    const crumbs = jsonLdNodes(markup).find(
      (node) => node["@type"] === "BreadcrumbList",
    )!;
    const items = crumbs.itemListElement as Array<{
      name: string;
      item?: string;
    }>;
    const nav = markup.match(/<nav[^>]*><ol[\s\S]*?<\/ol><\/nav>/)![0];
    for (const { name } of items) expect(nav).toContain(name);
    expect(items.map((entry) => entry.name)).toEqual([
      "Synapgeek",
      "Cerebrum",
      "Sudoku",
    ]);
    const appHref = locale === "en" ? "/cerebrum" : "/fr/cerebrum";
    expect(nav).toContain(`href="${appHref}"`);
    expect(items[1].item).toBe(`https://synapgeek.com${appHref}`);
    expect(items[2].item).toBeUndefined();
  });

  it("porte les sections du modèle : étapes, tableau des difficultés, conseils, FAQ, badges et date", async () => {
    const markup = decode(await render(locale, "sudoku"));
    expect(markup).toContain(copy.howToPlay.title);
    expect(markup.match(/<ol role="list"/g)).toHaveLength(1);
    for (const step of copy.howToPlay.steps) expect(markup).toContain(step);
    expect(markup).toContain(`<caption`);
    expect(markup).toContain(copy.whatCerebrumAdds.difficultyTable.caption);
    for (const tip of copy.tips.items) expect(markup).toContain(tip);
    expect(markup).toContain(copy.whereToPlay.body);
    expect(markup).toContain(`<time dateTime="${copy.updatedAt}">`);
    expect(markup).toContain("apps.apple.com");
    expect(markup).toContain("play.google.com");
  });

  it("nomme les difficultés dans la langue de la page, jamais en identifiants", async () => {
    const markup = await render(locale, "sudoku");
    const { difficulties } = getAppCopy("cerebrum", locale).gamePage;
    for (const { difficulty } of copy.whatCerebrumAdds.difficultyTable.rows) {
      expect(markup).toContain(`>${difficulties[difficulty]}</th>`);
    }
  });

  it("utilise la capture du jeu dans la langue de la page, avec son texte alternatif", async () => {
    const markup = decode(await render(locale, "sudoku"));
    expect(markup).toContain(`sudoku-${locale}.webp`);
    expect(markup).toContain(`alt="${copy.hero.phoneAlt}"`);
  });

  it("canonical et hreflang viennent des aides de routes, og:image est laissée à opengraph-image", async () => {
    const metadata = await generateMetadata({
      params: params(locale, "sudoku"),
    });
    expect(metadata.alternates?.canonical).toBe(
      locale === "en"
        ? "https://synapgeek.com/cerebrum/sudoku"
        : "https://synapgeek.com/fr/cerebrum/sudoku",
    );
    expect(metadata.alternates?.languages).toMatchObject({
      en: "https://synapgeek.com/cerebrum/sudoku",
      fr: "https://synapgeek.com/fr/cerebrum/sudoku",
      "x-default": "https://synapgeek.com/cerebrum/sudoku",
    });
    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.openGraph).toMatchObject({
      url: metadata.alternates?.canonical,
      title: copy.meta.title,
    });
  });
});

describe.each(LOCALES)("page Pandoku (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale).games.pandoku!;

  it("a un seul H1, suivi de la phrase de définition qui nomme le genre", async () => {
    const markup = decode(await render(locale, "pandoku"));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
    expect(copy.hero.definition).toContain(
      locale === "en"
        ? "Star Battle logic puzzle"
        : "puzzle de logique de type",
    );
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible, la capture est celle de la langue", async () => {
    const markup = await render(locale, "pandoku");
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
    expect(visible).toContain(`pandoku-${locale}.webp`);
    expect(visible).toContain(`alt="${copy.hero.phoneAlt}"`);
  });
});

describe.each(LOCALES)("page Démineur (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale).games.minesweeper!;
  const slug = locale === "en" ? "minesweeper" : "demineur";

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale, slug));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible, la capture est celle de la langue", async () => {
    const markup = await render(locale, slug);
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
    expect(visible).toContain(`minesweeper-${locale}.webp`);
    expect(visible).toContain(`alt="${copy.hero.phoneAlt}"`);
  });
});

describe.each(LOCALES)("page Pixel Art (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale).games["pixel-art"]!;
  const slug = "pixel-art";

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale, slug));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible, la capture est celle de la langue", async () => {
    const markup = await render(locale, slug);
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
    expect(visible).toContain(`pixel-art-${locale}.webp`);
    expect(visible).toContain(`alt="${copy.hero.phoneAlt}"`);
  });
});

describe.each(LOCALES)("page Arrow Maze (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale).games["arrow-maze"]!;
  const slug = "arrow-maze";

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale, slug));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible, la capture est celle de la langue", async () => {
    const markup = await render(locale, slug);
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
    expect(visible).toContain(`arrow-maze-${locale}.webp`);
    expect(visible).toContain(`alt="${copy.hero.phoneAlt}"`);
  });
});

describe("page jeu : slugs refusés", () => {
  it.each([
    ["en", "mots-croises", "slug d'une autre langue"],
    ["fr", "crossword", "slug d'une autre langue"],
    ["en", "maze", "jeu non publié"],
    ["fr", "cross-math", "jeu non publié"],
    ["en", "inconnu", "slug inconnu"],
  ])(
    "%s/%s (%s) donne notFound(), page et métadonnées",
    async (locale, game) => {
      const notFound = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;
      await expect(GamePage({ params: params(locale, game) })).rejects.toThrow(
        notFound,
      );
      await expect(
        generateMetadata({ params: params(locale, game) }),
      ).rejects.toThrow(notFound);
    },
  );
});
