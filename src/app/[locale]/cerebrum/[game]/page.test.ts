import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { getGames, type GameEntry } from "@/content/apps";
import { getAppCopy } from "@/content/copy";
import { LOCALES, type Locale } from "@/lib/i18n";
import { absoluteUrl, pageIdForGame, pagePath } from "@/lib/routes";
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

/** Les jeux publiés du registre : les pages se suivent, jamais une liste recopiée ici. */
const PUBLISHED = getGames("cerebrum").filter((game) => game.published);
const UNPUBLISHED = getGames("cerebrum").find((game) => !game.published);
/** Un jeu dont le slug diffère d'une langue à l'autre (`minesweeper` / `demineur`), s'il y en a un. */
const BILINGUAL_SLUG = PUBLISHED.find((game) => game.slug.en !== game.slug.fr);

const CASES = PUBLISHED.flatMap((game) =>
  LOCALES.map((locale) => ({ game, locale, name: game.name.en })),
);

describe("generateStaticParams", () => {
  it("liste chaque jeu publié dans chaque langue, avec le slug de cette langue", () => {
    const params = generateStaticParams();
    expect(PUBLISHED.length).toBeGreaterThan(0);
    expect(params).toHaveLength(PUBLISHED.length * LOCALES.length);
    for (const game of PUBLISHED) {
      for (const locale of LOCALES) {
        expect(params).toContainEqual({ locale, game: game.slug[locale] });
      }
    }
  });
});

describe.each(CASES)("page $name ($locale)", ({ game, locale }) => {
  const copy = getAppCopy("cerebrum", locale).games[game.id]!;
  const dict = getDictionary(locale);
  const slug = game.slug[locale];

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale, slug));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${copy.hero.h1}</h1>`);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("annonce les badges au nom de l'app, jamais le gabarit brut {app}", async () => {
    const markup = await render(locale, slug);
    expect(markup).not.toContain("{app}");
    expect(markup).toContain("Cerebrum");
  });

  it("émet le jeu, le fil d'Ariane et la FAQ, sans aggregateRating", async () => {
    const markup = await render(locale, slug);
    expect(jsonLdNodes(markup).map((node) => node["@type"])).toEqual([
      "VideoGame",
      "BreadcrumbList",
      "FAQPage",
    ]);
    expect(markup).not.toContain("aggregateRating");
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible", async () => {
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
  });

  it("le fil d'Ariane du JSON-LD porte les mêmes noms et les mêmes liens que le fil visible", async () => {
    const markup = await render(locale, slug);
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
      game.name[locale],
    ]);
    const appHref = locale === "en" ? "/cerebrum" : "/fr/cerebrum";
    expect(nav).toContain(`href="${appHref}"`);
    expect(items[1].item).toBe(`https://synapgeek.com${appHref}`);
    expect(items[2].item).toBeUndefined();
  });

  it("porte les sections du modèle : étapes, tableau des difficultés, conseils, FAQ, badges et date", async () => {
    const markup = decode(await render(locale, slug));
    expect(markup).toContain(copy.howToPlay.title);
    expect(markup.match(/<ol role="list"/g)).toHaveLength(1);
    for (const step of copy.howToPlay.steps) expect(markup).toContain(step);
    expect(markup).toContain(`<caption`);
    expect(markup).toContain(copy.whatCerebrumAdds.difficultyTable.caption);
    for (const tip of copy.tips.items) expect(markup).toContain(tip);
    expect(markup).toContain(`<time dateTime="${copy.updatedAt}">`);
    expect(markup).toContain("apps.apple.com");
    expect(markup).toContain("play.google.com");
  });

  it("dit le modèle économique une seule fois, par le gabarit, avec le lien vers la page de l'app", async () => {
    const markup = decode(await render(locale, slug));
    const { model, premiumLink, title } = dict.common.gameGet;
    expect(markup.split(model)).toHaveLength(2);
    expect(markup).toContain(`>${title}</h2>`);
    const link = markup.match(new RegExp(`<a [^>]*>${premiumLink}</a>`))?.[0];
    expect(link).toContain(`href="${pagePath("cerebrum", locale)}"`);
  });

  it("dit le défi du jour une seule fois, par le gabarit, avec les difficultés du registre", async () => {
    const markup = decode(await render(locale, slug));
    const { difficulties } = getAppCopy("cerebrum", locale).gamePage;
    const names = game.dailyDifficulties.map((id) => difficulties[id]);
    const followsLanguage = game.contentLocales !== "all";
    const template = followsLanguage
      ? dict.common.gameDaily.lineByLanguage
      : dict.common.gameDaily.line;
    const line = template.replace("{game}", game.name[locale]).replace(
      "{difficulties}",
      new Intl.ListFormat(locale, {
        style: "long",
        type: "disjunction",
      }).format(names),
    );
    expect(markup.split(line)).toHaveLength(2);
    expect(line).not.toMatch(/[{}]/);
    expect(line).not.toContain("—");
    // La variante de langue remplace la phrase commune : jamais les deux.
    const other = followsLanguage
      ? dict.common.gameDaily.line
      : dict.common.gameDaily.lineByLanguage;
    expect(markup).not.toContain(
      other
        .replace("{game}", game.name[locale])
        .replace("{difficulties}", names.join(" ou ")),
    );
  });

  it("nomme les difficultés dans la langue de la page, jamais en identifiants", async () => {
    const markup = await render(locale, slug);
    const { difficulties } = getAppCopy("cerebrum", locale).gamePage;
    for (const { difficulty } of copy.whatCerebrumAdds.difficultyTable.rows) {
      expect(markup).toContain(`>${difficulties[difficulty]}</th>`);
    }
  });

  it("utilise la capture du jeu dans la langue de la page, avec son texte alternatif", async () => {
    const markup = decode(await render(locale, slug));
    const file = game.screenshot[locale].split("/").pop()!;
    expect(file).toContain(`-${locale}.webp`);
    expect(markup).toContain(file);
    expect(markup).toContain(`alt="${copy.hero.phoneAlt}"`);
  });

  it("canonical et hreflang viennent des aides de routes, og:image est laissée à opengraph-image", async () => {
    const pageId = pageIdForGame(game.id);
    const metadata = await generateMetadata({ params: params(locale, slug) });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(pageId, locale));
    expect(metadata.alternates?.languages).toMatchObject({
      en: absoluteUrl(pageId, "en"),
      fr: absoluteUrl(pageId, "fr"),
    });
    expect(metadata.alternates?.languages).toHaveProperty("x-default");
    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.openGraph).toMatchObject({
      url: metadata.alternates?.canonical,
      title: copy.meta.title,
    });
  });
});

describe("page jeu : slugs refusés", () => {
  const notFound = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;

  async function expectRefused(locale: Locale, slug: string) {
    await expect(GamePage({ params: params(locale, slug) })).rejects.toThrow(
      notFound,
    );
    await expect(
      generateMetadata({ params: params(locale, slug) }),
    ).rejects.toThrow(notFound);
  }

  it("un slug inconnu donne notFound(), page et métadonnées", async () => {
    await expectRefused("en", "inconnu");
  });

  it.skipIf(!UNPUBLISHED)(
    "un jeu non publié donne notFound() dans chaque langue",
    async () => {
      for (const locale of LOCALES) {
        await expectRefused(locale, UNPUBLISHED!.slug[locale]);
      }
    },
  );

  it.skipIf(!BILINGUAL_SLUG)(
    "le slug d'une autre langue donne notFound()",
    async () => {
      const game: GameEntry = BILINGUAL_SLUG!;
      await expectRefused("en", game.slug.fr);
      await expectRefused("fr", game.slug.en);
    },
  );
});

describe("défi du jour : phrases exactes", () => {
  const slugOf = (id: string, locale: Locale) =>
    PUBLISHED.find((game) => game.id === id)!.slug[locale];

  it("jeu courant : une phrase, les difficultés du registre, sans nom de jeu en français", async () => {
    const en = decode(await render("en", slugOf("sudoku", "en")));
    const fr = decode(await render("fr", slugOf("sudoku", "fr")));
    expect(en).toContain(
      "Daily challenge: pick Sudoku and the app sets the day's grid on Easy or Medium, the same for every player.",
    );
    expect(fr).toContain(
      "Défi du jour\u00a0: si vous choisissez ce jeu, l'app tire la grille du jour en difficulté Facile ou Moyen, la même pour tous.",
    );
    expect(fr).not.toContain("choisissez Sudoku");
  });

  it.each(["crossword", "word-search"])(
    "%s : une seule phrase qui dit la langue, sans note qui la contredise",
    async (id) => {
      const en = decode(await render("en", slugOf(id, "en")));
      const fr = decode(await render("fr", slugOf(id, "fr")));
      expect(en).toContain(
        "on Easy, the same for every player in your app's language, English or French.",
      );
      expect(fr).toContain(
        "en difficulté Facile, la même pour tous ceux qui jouent dans la même langue, français ou anglais.",
      );
      expect(en).not.toContain("Everyone plays the same one");
      expect(en).not.toContain("do not get the same one");
      expect(fr).not.toContain("Tout le monde reçoit la même grille");
      expect(fr).not.toContain("n'ont pas la même");
    },
  );
});
