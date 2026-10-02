import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppCard } from "./AppCard";
import { DifficultyTable } from "./DifficultyTable";
import { FaqList } from "./FaqList";
import { GameCard } from "./GameCard";
import { PhoneFrame } from "./PhoneFrame";
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
    expect(
      html(createElement(GameCard, { ...base, platforms: [], href: null })),
    ).not.toContain("<p");
  });

  it("shows the genre only when there is one", () => {
    expect(
      html(createElement(GameCard, { ...base, href: null })),
    ).not.toContain("<p");
    expect(
      html(
        createElement(GameCard, { ...base, genre: "nonogrammes", href: null }),
      ),
    ).toContain("nonogrammes");
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

describe("AppCard", () => {
  it("has a single link, the button, named by its label", () => {
    const out = html(
      createElement(AppCard, {
        name: "Cerebrum",
        description: "Des puzzles.",
        note: "Gratuite.",
        platforms: "iPhone, iPad et Android",
        icon: "/icon.png",
        href: "/cerebrum",
        ctaLabel: "Découvrir Cerebrum",
      }),
    );
    expect(out.match(/<a /g)).toHaveLength(1);
    expect(out).toContain(">Découvrir Cerebrum</a>");
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
