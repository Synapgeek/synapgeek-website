import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DifficultyTable } from "./DifficultyTable";
import { FaqList } from "./FaqList";
import { GameCard } from "./GameCard";
import { PhoneFrame } from "./PhoneFrame";
import { SectionBand } from "./SectionBand";
import { StepList } from "./StepList";
import { StoreBadges } from "./StoreBadges";

/**
 * Ce que les primitives promettent sans JavaScript : la sémantique (liste
 * ordonnée, tableau légendé, details/summary) et le lien d'une carte de jeu.
 * Rendu serveur pur : ce qu'un crawler ou un lecteur d'écran sans script reçoit.
 */
const html = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

const COLOR = { wash: "--game-sudoku-wash", deep: "--game-sudoku-deep" };

describe("StepList", () => {
  it("is an ordered list with one item per step", () => {
    const out = html(
      createElement(StepList, { steps: ["Un", "Deux", "Trois"] }),
    );
    expect(out).toContain("<ol");
    expect(out.match(/<li/g)).toHaveLength(3);
  });
});

describe("DifficultyTable", () => {
  it("is a table with a caption and scoped headers", () => {
    const out = html(
      createElement(DifficultyTable, {
        caption: "Niveaux",
        columns: { difficulty: "Niveau", detail: "Ce qui change" },
        rows: [{ label: "Facile", detail: "Beaucoup d'indices" }],
      }),
    );
    expect(out).toContain("<table");
    expect(out).toMatch(/<caption[^>]*>Niveaux<\/caption>/);
    expect(out).toContain('scope="col"');
    expect(out).toContain('scope="row"');
  });
});

describe("FaqList", () => {
  it("puts every answer in the HTML inside details/summary, closed by default", () => {
    const out = html(
      createElement(FaqList, {
        items: [
          { question: "Q1 ?", answer: "R1" },
          { question: "Q2 ?", answer: "R2" },
        ],
      }),
    );
    expect(out.match(/<details/g)).toHaveLength(2);
    expect(out.match(/<summary/g)).toHaveLength(2);
    expect(out).not.toContain("<details open");
    expect(out).toContain("R1");
    expect(out).toContain("R2");
  });
});

describe("GameCard", () => {
  const base = { name: "Sudoku", genre: null, icon: "/x.webp", color: COLOR };

  it("links to the game page when it is published", () => {
    const out = html(
      createElement(GameCard, { ...base, href: "/cerebrum/sudoku" }),
    );
    expect(out).toContain('href="/cerebrum/sudoku"');
    expect(out).toContain(">Sudoku</a>");
  });

  it("renders the same card without any link when the game is not published", () => {
    const out = html(createElement(GameCard, { ...base, href: null }));
    expect(out).not.toMatch(/<a[\s>]/);
    expect(out).toContain("Sudoku");
  });

  it("lists the platforms on one line when it is given some", () => {
    const out = html(
      createElement(GameCard, {
        ...base,
        platforms: ["iPhone", "iPad", "Android"],
        href: "/cerebrum/sudoku",
      }),
    );
    expect(out).toContain("iPhone · iPad · Android");
  });

  it("shows no platform line without platforms", () => {
    expect(
      html(createElement(GameCard, { ...base, href: null })),
    ).not.toContain("iPhone");
    // `<p[\s>]` : un paragraphe, pas le `<path` des paillettes SVG.
    expect(
      html(createElement(GameCard, { ...base, platforms: [], href: null })),
    ).not.toMatch(/<p[\s>]/);
  });

  it("shows the genre only when there is one", () => {
    expect(html(createElement(GameCard, { ...base, href: null }))).not.toMatch(
      /<p[\s>]/,
    );
    expect(
      html(
        createElement(GameCard, { ...base, genre: "nonogrammes", href: null }),
      ),
    ).toContain("nonogrammes");
  });

  it("wears the app look: the game's gradient, a light rim and decorative sparkles", () => {
    const out = html(createElement(GameCard, { ...base, href: null }));
    const article = /<article[^>]*class="([^"]*)"/.exec(out)?.[1] ?? "";
    expect(article).toContain("game-gradient");
    expect(article).toContain("@container");
    expect(article).toMatch(/inset-ring-canvas\//);
    expect(article).not.toMatch(/bg-\(--wash\)/);
    expect(out).toMatch(
      /<span aria-hidden="true" class="[^"]*absolute[^"]*"><svg/,
    );
  });
});

describe("StoreBadges", () => {
  const labels = { appStoreLabel: "App Store", googlePlayLabel: "Google Play" };

  it("shows both stores, each link with an accessible name", () => {
    const out = html(createElement(StoreBadges, { locale: "en", labels }));
    expect(out).toContain('aria-label="App Store"');
    expect(out).toContain('aria-label="Google Play"');
  });
});

describe("PhoneFrame", () => {
  const frame = (priority?: boolean) =>
    html(
      createElement(PhoneFrame, {
        src: "/images/screens/v3/homepage-en.webp",
        alt: "Home screen",
        priority,
      }),
    );

  it("the LCP capture is preloaded and fetched with high priority, never lazy", () => {
    const out = frame(true);
    expect(out).toContain('fetchPriority="high"');
    expect(out).not.toContain('loading="lazy"');
  });

  it("any other capture loads lazily with the default priority", () => {
    const out = frame();
    expect(out).toContain('loading="lazy"');
    expect(out).not.toContain("fetchPriority");
  });
});

type Props = ComponentProps<typeof PhoneFrame>;

describe("PhoneFrame, screen modes", () => {
  it("in children mode, shows the HTML content and renders no image", () => {
    const out = html(
      createElement(PhoneFrame, null, createElement("p", null, "Écran HTML")),
    );
    expect(out).toContain("Écran HTML");
    expect(out).not.toContain("<img");
  });

  it("in capture mode, shows the image with its alt text and no HTML content box", () => {
    const out = html(
      createElement(PhoneFrame, {
        src: "/images/screens/v3/homepage-en.webp",
        alt: "Home screen",
      }),
    );
    expect(out).toContain("<img");
    expect(out).toContain('alt="Home screen"');
    expect(out).not.toMatch(/class="[^"]*content/);
  });

  it("refuses priority and sizes in children mode at compile time", () => {
    // Vérifié par `tsc` : sans la directive, ces deux lignes ne compilent pas.
    // @ts-expect-error `priority` n'a de sens que pour une capture
    const a: Props = { priority: true, children: null };
    // @ts-expect-error `sizes` n'a de sens que pour une capture
    const b: Props = { sizes: "100vw", children: null };
    expect([a, b]).toHaveLength(2);
  });
});

describe("SectionBand backdrop", () => {
  const band = (props: Record<string, unknown>) =>
    html(
      createElement(SectionBand, props, createElement("p", null, "Contenu")),
    );

  it("renders the backdrop before the content container, as a direct child of the section", () => {
    const out = band({
      backdrop: createElement("span", { "data-decor": "" }),
      enter: true,
    });
    const decor = out.indexOf("data-decor");
    const container = out.indexOf("band-enter");
    expect(decor).toBeGreaterThan(-1);
    expect(container).toBeGreaterThan(decor);
    // Le décor n'est pas dans le conteneur animé : son `transform` le couperait.
    expect(out.slice(container)).not.toContain("data-decor");
  });

  it("makes the section a positioning context with its own stacking context", () => {
    const section = /<section[^>]*class="([^"]*)"/.exec(
      band({ backdrop: createElement("span") }),
    )?.[1];
    expect(section).toContain("relative");
    expect(section).toContain("isolate");
  });

  it("leaves the section static without a backdrop", () => {
    const section = /<section[^>]*class="([^"]*)"/.exec(band({}))?.[1];
    expect(section).not.toContain("relative");
    expect(section).not.toContain("isolate");
  });
});
