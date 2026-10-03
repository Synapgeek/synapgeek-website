import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { LOCALES } from "@/lib/i18n";

const LEGAL_KEYS = ["privacy", "terms", "legal"] as const;

/**
 * Règle de copie 11 (aucun tiret cadratin dans le texte visible) appliquée aux
 * seules meta descriptions des pages légales : leurs corps sont des documents
 * juridiques figés, hors de cette règle.
 */
describe("meta descriptions des pages légales", () => {
  it.each(LOCALES.flatMap((l) => LEGAL_KEYS.map((k) => [l, k] as const)))(
    "%s / %s : renseignée, sans tiret cadratin",
    (locale, key) => {
      const description = getDictionary(locale)[key].metaDescription;
      expect(description.length).toBeGreaterThan(40);
      expect(description).not.toContain("—");
    },
  );
});
