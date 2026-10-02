import { readFileSync } from "node:fs";
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
import { HeroSlider, type SliderLabels } from "./HeroSlider";
import { HomeHero } from "./HomeHero";

/**
 * Ce que l'accueil promet sans JavaScript : tout le texte des slides dans le
 * HTML servi, le motif carrousel (rôles, noms, `aria-hidden`, `inert`), un seul
 * H1, des icônes de jeux nommées par `aria-label`. Rendu serveur pur.
 */
const html = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

const LABELS: SliderLabels = {
  slide: "{current} of {total}",
  goTo: "Go to {current}",
  previous: "Previous",
  next: "Next",
  pause: "Pause",
  play: "Play",
};

const slider = (count = 3) =>
  html(
    createElement(HeroSlider, {
      label: "Highlights",
      labels: LABELS,
      slides: Array.from({ length: count }, (_, i) =>
        createElement("p", { key: i }, `Message ${i + 1}`),
      ),
    }),
  );

/** Le HTML rendu échappe `'`, `&` et `"` : on compare avec la même échappée. */
const escaped = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");

const tags = (out: string, pattern: RegExp) => out.match(pattern) ?? [];

describe("HeroSlider", () => {
  it("is a named carousel region", () => {
    const out = slider();
    expect(out).toMatch(/^<section[^>]*aria-roledescription="carousel"/);
    expect(out).toContain('aria-label="Highlights"');
  });

  it("renders every slide as a labelled group, all texts in the HTML", () => {
    const out = slider();
    const groups = tags(out, /<div[^>]*role="group"[^>]*>/g);
    expect(groups).toHaveLength(3);
    groups.forEach((group, index) => {
      expect(group).toContain('aria-roledescription="slide"');
      expect(group).toContain(`aria-label="${index + 1} of 3"`);
    });
    expect(out).toContain("Message 1");
    expect(out).toContain("Message 2");
    expect(out).toContain("Message 3");
  });

  it("shows the first slide and hides the others from every user, not only visually", () => {
    const groups = tags(slider(), /<div[^>]*role="group"[^>]*>/g);
    expect(groups[0]).not.toContain("aria-hidden");
    expect(groups[0]).not.toContain("inert");
    expect(groups[0]).toContain("opacity-100");
    for (const group of groups.slice(1)) {
      expect(group).toContain('aria-hidden="true"');
      expect(group).toContain('inert=""');
      expect(group).toContain("invisible");
    }
  });

  it("has previous, next and pause buttons with their names", () => {
    const out = slider();
    for (const name of ["Previous", "Next", "Pause"]) {
      expect(out).toMatch(new RegExp(`<button[^>]*aria-label="${name}"[^>]*>`));
    }
    expect(out).not.toContain('aria-label="Play"');
  });

  it("has one dot button per slide, the first one current", () => {
    const dots = tags(slider(), /<button[^>]*aria-label="Go to \d"[^>]*>/g);
    expect(dots).toHaveLength(3);
    expect(dots[0]).toContain('aria-current="true"');
    expect(dots[1]).not.toContain("aria-current");
    expect(dots[2]).not.toContain("aria-current");
  });

  it("starts without a live region announcement while it rotates", () => {
    expect(slider()).toContain('aria-live="off"');
  });

  it("every control is a typed button", () => {
    const buttons = tags(slider(), /<button[^>]*>/g);
    expect(buttons).toHaveLength(6);
    for (const button of buttons) expect(button).toContain('type="button"');
  });
});

describe.each(LOCALES)("HomeHero (%s)", (locale) => {
  const copy = getHubCopy(locale);
  const out = html(createElement(HomeHero, { locale }));

  it("carries the page's only H1, with the definition sentence as plain text", () => {
    expect(tags(out, /<h1[ >]/g)).toHaveLength(1);
    expect(out).toContain(`>${copy.hero.h1}</h1>`);
    expect(out).toContain(escaped(copy.hero.definition));
  });

  it("puts no heading in the other slides: their headlines are paragraphs", () => {
    expect(tags(out, /<h[2-6][ >]/g)).toHaveLength(0);
    for (const { headline, body } of Object.values(copy.slider.slides)) {
      expect(out).toContain(`>${escaped(headline)}</p>`);
      expect(out).toContain(escaped(body));
    }
  });

  it("has the primary action to the app page in the first slide", () => {
    const cta = new RegExp(
      `<a[^>]*href="${pagePath("cerebrum", locale)}"[^>]*>${copy.slider.cta}</a>`,
    );
    const firstGroup = out.split('role="group"')[1] ?? "";
    expect(firstGroup).toMatch(cta);
  });

  it("makes the first slide's phone the only high-priority image", () => {
    const priority = /<img[^>]*fetchPriority="high"/g;
    expect(tags(out, priority)).toHaveLength(1);
    const [firstGroup, secondGroup] = out.split('role="group"').slice(1);
    expect(firstGroup).toMatch(priority);
    expect(secondGroup).not.toMatch(priority);
  });
});

describe("slide visuals of hidden slides", () => {
  const css = readFileSync("src/app/globals.css", "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );

  it("are held back until the slider is warm, a rule the server markup leaves active", () => {
    const rule =
      /\[aria-roledescription="carousel"\]:not\(\[data-warm\]\)\s+\[aria-hidden="true"\]\s+\.slide-visual\s*\{([^}]*)\}/.exec(
        css,
      )?.[1];
    expect(rule, "the hold-back rule").toMatch(/content-visibility:\s*hidden/);
    // Rendu serveur : jamais `data-warm`, et chaque slide a sa boîte de visuel.
    const out = html(createElement(HomeHero, { locale: "en" }));
    expect(out).not.toContain("data-warm");
    expect(tags(out, /class="slide-visual /g)).toHaveLength(5);
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
