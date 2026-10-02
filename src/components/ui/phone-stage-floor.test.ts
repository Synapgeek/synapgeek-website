import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PhoneStage } from "./PhoneStage";
import { SectionBand } from "./SectionBand";

/**
 * Le ciel aquarelle ne déborde jamais sur la bande des jeux (R3 de la revue de
 * finition) : il est découpé au bord bas de la bande du héros, tandis que le
 * téléphone, lui, déborde. Aucun pixel n'est mesurable en rendu serveur ; ces
 * assertions verrouillent donc les trois maillons du contrat (le balisage, la règle
 * CSS, l'appariement avec la marge négative des pages) et la preuve en navigateur
 * (elementFromPoint sur le titre) est consignée dans le rapport de la tâche.
 */
const read = (path: string) => readFileSync(path, "utf8");
// Les commentaires de la feuille expliquent le piège Safari et citent donc `no-clip` :
// seules les règles comptent.
const css = read("src/app/globals.css").replace(/\/\*[\s\S]*?\*\//g, "");
const rule = (selector: string) =>
  new RegExp(`(?:^|\\s)${selector}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? "";

const stage = renderToStaticMarkup(
  createElement(PhoneStage, {
    screenSrc: "/images/screens/v3/homepage-en.webp",
    screenAlt: "Cerebrum",
    icon: "/images/brand/cerebrum-icon.webp",
  }),
);

describe("PhoneStage sky clip", () => {
  it("renders the sky field inside its own clipping layer, not directly in the stage", () => {
    const clip =
      /<span[^>]*class="[^"]*\bbreeze-clip\b[^"]*"[^>]*>([\s\S]*?)<\/span><\/span>/.exec(
        stage,
      );
    expect(clip, "a .breeze-clip wrapper").not.toBeNull();
    expect(clip?.[1]).toContain("breeze-field");
    expect(clip?.[0]).toContain('aria-hidden="true"');
    // Le téléphone n'est jamais dans la couche découpée.
    expect(clip?.[0]).not.toContain("<img");
  });

  it("clips the layer at the hero band's floor: 6rem up on mobile, the band padding down from sm", () => {
    const base = rule("\\.breeze-clip");
    expect(base).toMatch(/clip-path:\s*inset\([^)]*\s6rem\s[^)]*\)/);
    const wide =
      /@media \(min-width: 40rem\)\s*\{\s*\.breeze-clip\s*\{([^}]*)\}/.exec(
        css,
      )?.[1] ?? "";
    expect(wide).toMatch(
      /clip-path:\s*inset\([^)]*calc\(-1 \* var\(--spacing-section\)\)[^)]*\)/,
    );
  });

  it("fades the sky out above that same floor, inside the field's own box", () => {
    const field = rule("\\.breeze-field");
    // Un dégradé vertical opaque -> transparent, dont le bas tombe sur le bord de la bande.
    expect(field).toMatch(
      /mask-image:\s*linear-gradient\(\s*to bottom,\s*black[^;]*transparent\s+var\(--breeze-floor\)/,
    );
    expect(field).toMatch(/--breeze-floor:\s*calc\(50%\s\+\s34\.1%\s-\s6rem\)/);
    // ...et le padding de la bande en dessous dès sm, comme le clip-path.
    const wide =
      /@media \(min-width: 40rem\)\s*\{\s*\.breeze-field\s*\{([^}]*)\}/.exec(
        css,
      )?.[1] ?? "";
    expect(wide).toMatch(
      /--breeze-floor:\s*calc\(50%\s\+\s34\.1%\s\+\svar\(--spacing-section\)\)/,
    );
  });

  it("uses no mask technique Safari lacks: no mask-clip, no oversized or repositioned mask image", () => {
    // Safari (bureau et iOS) ne supporte pas `mask-clip: no-clip` : un masque y rogne
    // son élément à sa boîte, et le champ, qui déborde de la scène, devenait un rectangle.
    expect(css).not.toMatch(/mask-clip/);
    expect(css).not.toMatch(/no-clip/);
    expect(css).not.toMatch(/mask-size/);
    expect(css).not.toMatch(/mask-position/);
    expect(css).not.toMatch(/mask-origin/);
    // Aucun masque sur la couche découpée : elle est de la taille de la scène, le champ
    // la dépasse.
    for (const body of [
      rule("\\.breeze-clip"),
      /@media \(min-width: 40rem\)\s*\{\s*\.breeze-clip\s*\{([^}]*)\}/.exec(
        css,
      )?.[1] ?? "",
    ]) {
      expect(body).not.toMatch(/mask/);
    }
  });

  it("keeps the 6rem floor equal to the negative margin both hero pages give the stage", () => {
    for (const page of [
      "src/app/[locale]/page.tsx",
      "src/app/[locale]/cerebrum/page.tsx",
    ]) {
      const source = read(page);
      expect(source, page).toMatch(
        /<PhoneStage[\s\S]*?className="-mb-24 sm:mb-0"/,
      );
      expect(source, page).toMatch(/\bpb-0\b[^"]*\bsm:pb-section\b/);
    }
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
