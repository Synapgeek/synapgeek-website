import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Badge et SectionHeading portaient l'ancien style (font-extrabold, amber-700)
 * et ne servaient plus qu'à LegalPage. Leur remplacement (une pastille aux
 * jetons dans LegalPage, `SectionBand` pour les titres de section) les a
 * retirés : un retour par copier-coller réintroduirait la dérive. CheckList
 * (coches vertes) est remplacée par `IconList` et `ProseList`.
 */
const UI = import.meta.dirname;

describe("retired UI primitives", () => {
  it.each(["Badge.tsx", "SectionHeading.tsx", "CheckList.tsx"])(
    "%s stays deleted",
    (file) => {
      expect(existsSync(path.join(UI, file))).toBe(false);
    },
  );
});
