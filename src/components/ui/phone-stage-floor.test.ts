import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PhoneStage } from "./PhoneStage";
import { SectionBand } from "./SectionBand";

/**
 * Le téléphone du héros de /cerebrum déborde sur la bande des jeux (marge négative
 * `-mb-24` sur mobile) : la bande suivante doit lui laisser la place, sinon il mord
 * sur son titre. Aucun pixel n'est mesurable en rendu serveur ; ces assertions
 * verrouillent donc l'appariement des marges dans la page, et l'absence du ciel
 * Breeze retiré (son fichier, ses règles CSS, sa prop). La capture n'est plus
 * l'image LCP de /cerebrum : la scène photo l'est, la capture charge paresseusement.
 */
const read = (path: string) => readFileSync(path, "utf8");

const stage = (priority?: boolean) =>
  renderToStaticMarkup(
    createElement(PhoneStage, {
      screenSrc: "/images/screens/v3/homepage-en.webp",
      screenAlt: "Cerebrum",
      icon: "/images/brand/cerebrum-icon.webp",
      priority,
    }),
  );

describe("PhoneStage", () => {
  it("carries the phone and the app icon, with no sky layer behind them", () => {
    const out = stage();
    expect(out).not.toMatch(/breeze/);
    // Deux images : la capture du téléphone et l'icône de l'app.
    expect(out.match(/<img /g)).toHaveLength(2);
    expect(read("src/app/globals.css")).not.toMatch(/breeze/);
  });

  it("loads the screenshot lazily by default: the hero scene is the LCP", () => {
    const screen = /<img[^>]*homepage-en[^>]*>/.exec(stage())?.[0] ?? "";
    expect(screen).toContain('loading="lazy"');
    expect(screen).not.toContain("fetchPriority");
  });

  it("makes the screenshot high-priority only when asked", () => {
    const screen = /<img[^>]*homepage-en[^>]*>/.exec(stage(true))?.[0] ?? "";
    expect(screen).toContain('fetchPriority="high"');
    expect(screen).not.toContain('loading="lazy"');
  });

  it("keeps the 6rem overflow equal to the negative margin the app page gives the stage", () => {
    // La page d'accueil n'utilise plus PhoneStage (son héros est la photo de la table) : seule la page app le pose.
    const page = "src/app/[locale]/cerebrum/page.tsx";
    const source = read(page);
    expect(source, page).toMatch(
      /<PhoneStage[\s\S]*?className="-mb-24 sm:mb-0"/,
    );
    expect(source, page).toMatch(/\bpb-0\b[^"]*\bsm:pb-section\b/);
    // La page ne passe plus `priority` à PhoneStage : la scène photo est le LCP.
    expect(source, page).not.toMatch(/<PhoneStage[^>]*\bpriority\b/);
  });
});

describe("games band title", () => {
  const band = renderToStaticMarkup(
    createElement(SectionBand, {
      tone: "soft",
      title: "The games",
      id: "games",
    }),
  );

  it("is a plain ink H2 on the band's own ground (no gradient text, no clipping to text)", () => {
    expect(band).toMatch(
      /<section[^>]*class="[^"]*\bbg-canvas-soft\b[^"]*\btext-ink\b/,
    );
    const h2 = /<h2[^>]*class="([^"]*)"/.exec(band)?.[1] ?? "";
    expect(h2).not.toMatch(
      /text-transparent|bg-clip-text|text-gradient|opacity/,
    );
    expect(h2).not.toMatch(/\btext-(?!3xl|4xl|5xl)/);
  });
});
