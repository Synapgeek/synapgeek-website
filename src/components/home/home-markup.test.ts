import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getApp, getGames } from "@/content/apps";
import { getDictionary } from "@/content";
import { getHubCopy } from "@/content/copy";
import { LOCALES } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { storeLabelsFor } from "@/lib/store-badges";
import { AppShowcase } from "./AppShowcase";
import { BuiltByEnthusiasts } from "./BuiltByEnthusiasts";
import { HomeHero } from "./HomeHero";

/**
 * Ce que l'accueil promet sans JavaScript : le héros et sa phrase de définition en
 * texte dans le HTML servi, un seul H1, la photo de la table décorative, des icônes
 * de jeux nommées par `aria-label`. Rendu serveur pur.
 */
const html = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

/** Le HTML rendu échappe `'`, `&` et `"` : on compare avec la même échappée. */
const escaped = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");

const tags = (out: string, pattern: RegExp) => out.match(pattern) ?? [];

describe.each(LOCALES)("HomeHero (%s)", (locale) => {
  const { hero } = getHubCopy(locale);
  const out = html(createElement(HomeHero, { locale }));

  it("carries the page's only H1: the studio name then its tagline", () => {
    expect(tags(out, /<h1[ >]/g)).toHaveLength(1);
    const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(out)?.[1] ?? "";
    expect(h1).toContain(`>${hero.h1}</span>`);
    expect(h1).toContain(`>${escaped(hero.tagline)}</span>`);
  });

  it("puts the definition sentence right after the H1, as plain text", () => {
    expect(out).toMatch(
      new RegExp(`</h1><p[^>]*>${escaped(hero.definition)}</p>`),
    );
  });

  it("has the primary action to the app page, right after the definition", () => {
    const cta = new RegExp(
      `</p><a[^>]*href="${pagePath("cerebrum", locale)}"[^>]*>${hero.cta}</a>`,
    );
    expect(out).toMatch(cta);
  });

  it("has no heading but the H1 and no script of its own", () => {
    expect(tags(out, /<h[2-6][ >]/g)).toHaveLength(0);
    expect(out).not.toContain("<script");
    expect(out).not.toMatch(/role="group"|aria-roledescription/);
  });

  it("uses the table photo as the one decorative, high-priority image, one file per width", () => {
    const picture = /<picture>([\s\S]*?)<\/picture>/.exec(out)?.[1] ?? "";
    expect(tags(picture, /<source /g)).toHaveLength(2);
    expect(picture).toContain('media="(min-width: 1024px)"');
    expect(picture).toContain('media="(max-width: 1023px)"');
    const img = /<img[^>]*>/.exec(picture)?.[0] ?? "";
    expect(img).toContain('alt=""');
    expect(img).toContain('aria-hidden="true"');
    expect(img).toContain('fetchPriority="high"');
    expect(tags(out, /<img[^>]*fetchPriority="high"/g)).toHaveLength(1);
    expect(out).toContain("hero-bg-desktop.webp");
    expect(out).toContain("hero-bg-mobile.webp");
  });

  it("keeps the text readable on the photo: a page-coloured veil, never plain text on the wood", () => {
    expect(out).toMatch(/aria-hidden="true"[^>]*class="[^"]*from-canvas\/9/);
  });
});

describe.each(LOCALES)("AppShowcase (%s)", (locale) => {
  const labels = getDictionary(locale).common.stores;
  const cerebrum = getApp("cerebrum");
  const games = getGames("cerebrum");
  const item = getHubCopy(locale).apps.items.cerebrum;
  const appHref = pagePath("cerebrum", locale);
  const out = html(
    createElement(AppShowcase, {
      app: cerebrum,
      games,
      locale,
      genre: item.genre,
      description: item.description,
      seeMore: item.seeMore,
      gamesLabel: item.gamesLabel,
      storeLabels: labels,
    }),
  );

  it("names the app in the store badges, never the raw {app} template", () => {
    expect(out).not.toContain("{app}");
  });

  it("is one article whose only heading, an H3, is the link to the app page", () => {
    expect(tags(out, /<article/g)).toHaveLength(1);
    expect(tags(out, /<h[1-6][ >]/g)).toEqual(["<h3 "]);
    expect(out).toMatch(
      new RegExp(`<h3[^>]*><a[^>]*href="${appHref}"[^>]*>Cerebrum<`),
    );
  });

  it("stretches that link over the whole card: the app page is the one link that covers it", () => {
    const stretched = tags(out, /<a [^>]*after:absolute after:inset-0[^>]*>/g);
    expect(stretched).toHaveLength(1);
    expect(stretched[0]).toContain(`href="${appHref}"`);
  });

  it("names the app link with its see-more prompt for screen readers, the visible prompt staying hidden from them", () => {
    expect(out).toMatch(
      new RegExp(
        `<h3[^>]*><a[^>]*>Cerebrum<span class="sr-only">, ${escaped(item.seeMore)}</span></a></h3>`,
      ),
    );
    expect(out).toMatch(
      new RegExp(`<span aria-hidden="true"[^>]*>${escaped(item.seeMore)}<svg`),
    );
  });

  it("lights the focus ring for the app link only, never for a badge or a game link", () => {
    expect(out).toContain("has-[h3_a:focus-visible]:outline-3");
    expect(out).not.toContain("has-[a:focus-visible]");
  });

  it("links every published game by name to its own page, in a named list above the stretched link", () => {
    const list =
      new RegExp(
        `<ul aria-label="${escaped(item.gamesLabel)}" class="[^"]*relative z-10[^"]*">([\\s\\S]*?)</ul>`,
      ).exec(out)?.[1] ?? "";
    expect(list, "the games list").not.toBe("");
    const published = games.filter((game) => game.published);
    expect(published.length).toBeGreaterThan(0);
    const links = tags(list, /<a [^>]*>[^<]*<\/a>/g);
    expect(links).toHaveLength(published.length);
    published.forEach((game, index) => {
      expect(links[index]).toContain(
        `href="${pagePath(`game:${game.id}`, locale)}"`,
      );
      expect(links[index]).toContain(`>${escaped(game.name[locale])}</a>`);
    });
    // Aucun séparateur « · » : il finirait une ligne quand la liste passe à la ligne.
    expect(list).not.toContain("·");
    expect(out.indexOf("<ul aria-label")).toBeLessThan(
      out.indexOf("apps.apple.com"),
    );
  });

  it("links an unpublished game nowhere", () => {
    const [first, ...rest] = games;
    const partial = html(
      createElement(AppShowcase, {
        app: cerebrum,
        games: [{ ...first, published: false }, ...rest],
        locale,
        genre: item.genre,
        description: item.description,
        seeMore: item.seeMore,
        gamesLabel: item.gamesLabel,
        storeLabels: labels,
      }),
    );
    expect(partial).not.toContain(
      `href="${pagePath(`game:${first.id}`, locale)}"`,
    );
  });

  it("shows the genre, the description and the see-more prompt as text", () => {
    expect(out).toContain(`>${escaped(item.genre)}</p>`);
    expect(out).toContain(escaped(item.description));
    expect(out).toContain(`>${escaped(item.seeMore)}<svg`);
    expect(out).toContain(escaped(item.description));
  });

  it("raises the store badges above the stretched link", () => {
    const resolved = storeLabelsFor(labels, cerebrum.name);
    expect(out).toContain(`aria-label="${escaped(resolved.appStoreLabel)}"`);
    expect(out).toContain(`aria-label="${escaped(resolved.googlePlayLabel)}"`);
    expect(out).toMatch(
      /<div class="[^"]*relative z-10[^"]*"><a [^>]*apps\.apple\.com/,
    );
  });

  it("shows every game card in the phone, as decoration: no link, hidden from screen readers", () => {
    const screen =
      /<div aria-hidden="true" class="absolute inset-0 bg-canvas-soft">([\s\S]*?)<\/ul><\/div>/.exec(
        out,
      )?.[1];
    expect(screen, "the phone screen").toBeDefined();
    expect(tags(screen ?? "", /<li /g)).toHaveLength(games.length);
    expect(screen).not.toContain("<a ");
    for (const game of games) {
      expect(screen).toContain(`>${escaped(game.name[locale])}</span>`);
    }
  });

  it("uses the scene as one decorative, lazily loaded picture, one file per width", () => {
    const picture = /<picture>([\s\S]*?)<\/picture>/.exec(out)?.[1] ?? "";
    expect(tags(picture, /<source /g)).toHaveLength(2);
    expect(picture).toContain('media="(min-width: 640px)"');
    expect(picture).toContain('media="(max-width: 639px)"');
    const img = /<img[^>]*>/.exec(picture)?.[0] ?? "";
    expect(img).toContain('alt=""');
    expect(img).toContain('aria-hidden="true"');
    expect(img).toContain('loading="lazy"');
    expect(out).not.toContain('fetchPriority="high"');
  });
});

describe.each(LOCALES)("BuiltByEnthusiasts (%s)", (locale) => {
  const { about } = getHubCopy(locale);
  const out = html(createElement(BuiltByEnthusiasts, { locale }));

  it("is the one deep violet band, titled by an H2", () => {
    expect(tags(out, /band-violet-deep/g).length).toBeGreaterThan(0);
    expect(out).toMatch(
      new RegExp(`<h2[^>]*id="about-title"[^>]*>${about.title}</h2>`),
    );
  });

  it("shows the studio description, its values and a link to /about", () => {
    expect(out).toContain(escaped(about.description));
    for (const value of about.values) {
      expect(out).toContain(`>${value.title}</h3>`);
    }
    expect(out).toContain(`href="${pagePath("about", locale)}"`);
  });

  it("shows the three celebrating Pandas as decoration", () => {
    const img = /<img[^>]*panda-celebration-v1\.webp[^>]*>/.exec(out)?.[0];
    expect(img, "the celebration image").toBeDefined();
    expect(img).toContain('alt=""');
  });

  it("lays its drifting blobs on the band itself, under the content and outside its animated entrance", () => {
    // Le décor est le premier enfant de la bande, avant le conteneur `band-enter`.
    expect(out).toMatch(
      /<section[^>]*class="[^"]*relative isolate[^"]*"[^>]*><div aria-hidden="true" class="[^"]*absolute inset-0 -z-10[^"]*">/,
    );
    expect(tags(out, /animate-blob-drift-\d/g).length).toBeGreaterThan(0);
  });
});
