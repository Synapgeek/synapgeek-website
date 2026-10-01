import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { metadata as rootMetadata } from "@/app/layout";
import { getDictionary } from "@/content";
import { LOCALES } from "@/lib/i18n";

const read = (file: string) => readFileSync(file, "utf8");

describe("shell du site", () => {
  it("le Smart App Banner n'est plus posé par le layout de langue (réservé aux pages Cerebrum)", () => {
    expect(read("src/app/[locale]/layout.tsx")).not.toMatch(/\bitunes\b/);
  });

  it("le titre par défaut du layout racine est anglais, sans tiret cadratin", () => {
    const title = rootMetadata.title;
    expect(title).toMatchObject({ default: expect.any(String) });
    const fallback = (title as { default: string }).default;
    expect(fallback).not.toContain("—");
    expect(fallback).toBe(
      `${getDictionary("en").common.siteName}: ${getDictionary("en").common.tagline}`,
    );
  });

  it.each(LOCALES)(
    "les textes du shell sont renseignés et sans tiret cadratin (%s)",
    (locale) => {
      const { nav, footer, a11y, breadcrumb, languageSuggestion, notFound } =
        getDictionary(locale).common;
      const strings = [
        ...Object.values(nav),
        ...Object.values(footer),
        ...Object.values(a11y),
        ...Object.values(breadcrumb),
        ...Object.values(languageSuggestion),
        ...Object.values(notFound),
      ];
      for (const text of strings) {
        expect(text.trim()).not.toBe("");
        expect(text).not.toContain("—");
      }
    },
  );

  it("la 404 racine et la 404 localisée mènent à l'accueil de leur langue, jamais à « / » nu", () => {
    expect(read("src/app/not-found.tsx")).not.toMatch(/href=["']\/["']/);
    expect(read("src/app/[locale]/not-found.tsx")).not.toMatch(
      /href=["']\/["']/,
    );
    expect(read("src/components/site/NotFoundView.tsx")).not.toMatch(
      /href=["']\/["']/,
    );
  });
});
