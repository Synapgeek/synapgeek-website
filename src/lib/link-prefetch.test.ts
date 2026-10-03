import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isPrefetchable } from "./link-prefetch";
import { LEGAL_IDS, pagePath, type PageId, type SectionId } from "./routes";
import { SECTION_SLUGS } from "./page-slugs";
import { LOCALES } from "./i18n";

describe("isPrefetchable", () => {
  it("coupe les chemins d'un seul segment que le proxy réécrit (légal figé, pages en anglais)", () => {
    for (const path of ["/privacy", "/terms", "/legal", "/about", "/press"]) {
      expect(isPrefetchable(path), path).toBe(false);
    }
    expect(isPrefetchable("/privacy#account-deletion")).toBe(false);
    expect(isPrefetchable("/about?src=nav")).toBe(false);
  });

  it("laisse précharger l'accueil, les chemins à deux segments ou plus et /cerebrum", () => {
    for (const path of [
      "/",
      "/#contact",
      "/fr",
      "/fr#contact",
      "/en/privacy",
      "/fr/a-propos",
      "/fr/cerebrum/sudoku",
      "/cerebrum",
      "/cerebrum/sudoku",
    ]) {
      expect(isPrefetchable(path), path).toBe(true);
    }
  });

  it("ne touche ni aux ancres, ni aux liens externes", () => {
    expect(isPrefetchable("#faq")).toBe(true);
    expect(isPrefetchable("https://example.com/about")).toBe(true);
    expect(isPrefetchable("mailto:contact@synapgeek.com")).toBe(true);
  });

  it("coupe exactement les liens que le routeur prédit mal, parmi les URL réelles du site", () => {
    const pages: PageId[] = [
      "home",
      "cerebrum",
      ...(Object.keys(SECTION_SLUGS) as SectionId[]),
      ...LEGAL_IDS,
    ];
    const disabled = LOCALES.flatMap((locale) =>
      pages
        .map((id) => pagePath(id, locale))
        .filter((path) => !isPrefetchable(path)),
    ).sort();
    // Les trois pages légales françaises figées, `about` et `press` anglaises, rien d'autre.
    expect(disabled).toEqual(
      ["/about", "/legal", "/press", "/privacy", "/terms"].sort(),
    );
  });

  it("garde en phase le segment statique avec la route de l'app", () => {
    expect(pagePath("cerebrum", "en")).toBe("/cerebrum");
  });
});

describe("next/link", () => {
  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return sourceFiles(path);
      return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
    });
  }

  it("n'est importé que par InternalLink, pour que le préchargement fautif ne revienne pas", () => {
    const importers = sourceFiles(join(process.cwd(), "src")).filter((file) =>
      /from\s+["']next\/link["']/.test(readFileSync(file, "utf8")),
    );
    expect(importers.map((file) => file.split("/src/")[1])).toEqual([
      "components/ui/InternalLink.tsx",
    ]);
  });
});
