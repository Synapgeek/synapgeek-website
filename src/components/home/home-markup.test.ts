import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getApp, getGames } from "@/content/apps";
import { getDictionary } from "@/content";
import { getHubCopy } from "@/content/copy";
import { LOCALES } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
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

describe("AppShowcase", () => {
  const labels = getDictionary("en").common.stores;
  const cerebrum = getApp("cerebrum");
  const games = getGames("cerebrum");
  const out = html(
    createElement(AppShowcase, {
      app: cerebrum,
      games,
      locale: "en",
      pitch: "A pitch.",
      iconsLabel: "Cerebrum's games",
      ctaLabel: "Discover Cerebrum",
      phoneSrc: "/images/screens/v3/pandoku-en.webp",
      phoneAlt: "A grid",
      storeLabels: labels,
    }),
  );

  it("is one article with the app as its only H3", () => {
    expect(tags(out, /<article/g)).toHaveLength(1);
    expect(tags(out, /<h[1-6][ >]/g)).toEqual(["<h3 "]);
  });

  it("lists every game as an icon named by aria-label, linking to its page, with no visible game name", () => {
    const list =
      /<ul[^>]*aria-label="Cerebrum&#x27;s games"[^>]*>([\s\S]*?)<\/ul>/.exec(
        out,
      )?.[1];
    expect(list, "the icon row").toBeDefined();
    const links = tags(list ?? "", /<a [^>]*>/g);
    expect(links).toHaveLength(games.length);
    for (const game of games) {
      const name = game.name.en;
      const href = pagePath(`game:${game.id}`, "en");
      expect(list).toContain(`aria-label="${name}"`);
      expect(list).toContain(`href="${href}"`);
    }
    // Le nom n'est jamais du texte visible : aucune balise ne contient que lui.
    expect(list).not.toMatch(/>\s*Sudoku\s*</);
    expect(list).toContain('alt=""');
  });

  it("has the store badges and the primary button to the app page", () => {
    expect(out).toContain(`aria-label="${labels.appStoreLabel}"`);
    expect(out).toContain(`aria-label="${labels.googlePlayLabel}"`);
    expect(out).toMatch(/<a[^>]*href="\/cerebrum"[^>]*>Discover Cerebrum<\/a>/);
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
});
