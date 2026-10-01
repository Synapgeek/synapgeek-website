import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { getRewrittenUrl, isRewrite } from "next/experimental/testing/server";
import { proxy } from "@/proxy";
import { LOCALES } from "./i18n";
import { alternatesForPathname } from "./language-alternates";
import { buildLanguageSwitchTable } from "./language-switch-table";
import { pagePath, publishedPageIds } from "./routes";

const table = buildLanguageSwitchTable();

/** Chemin que Next sert réellement (segment [locale]) pour une URL publique. */
function servedPath(publicPath: string): string {
  const response = proxy(new NextRequest(`https://synapgeek.com${publicPath}`));
  return isRewrite(response)
    ? new URL(getRewrittenUrl(response)!).pathname
    : publicPath;
}

describe("buildLanguageSwitchTable", () => {
  it("donne, pour chaque page publiée, le chemin public de chaque langue", () => {
    expect(alternatesForPathname(table, "/privacy")).toEqual({
      en: "/en/privacy",
      fr: "/privacy",
    });
    expect(alternatesForPathname(table, "/en/privacy")).toEqual({
      en: "/en/privacy",
      fr: "/privacy",
    });
    expect(alternatesForPathname(table, "/")).toEqual({
      en: "/",
      fr: "/fr",
    });
    expect(alternatesForPathname(table, "/fr")).toEqual({
      en: "/",
      fr: "/fr",
    });
    expect(alternatesForPathname(table, "/fr/cerebrum/demineur")).toEqual({
      en: "/cerebrum/minesweeper",
      fr: "/fr/cerebrum/demineur",
    });
  });

  it("couvre chaque (page, langue) par son chemin public ET par son chemin servi", () => {
    for (const id of publishedPageIds()) {
      const expected = Object.fromEntries(
        LOCALES.map((locale) => [locale, pagePath(id, locale)]),
      );
      for (const locale of LOCALES) {
        const publicPath = pagePath(id, locale);
        expect(alternatesForPathname(table, publicPath)).toEqual(expected);
        // Le rendu serveur voit le chemin interne (/fr/privacy), le navigateur
        // l'URL publique (/privacy) : les deux doivent donner le même lien.
        expect(alternatesForPathname(table, servedPath(publicPath))).toEqual(
          expected,
        );
      }
    }
  });

  it("retombe sur l'accueil de chaque langue pour un chemin inconnu", () => {
    expect(alternatesForPathname(table, "/nimporte/quoi")).toEqual({
      en: "/",
      fr: "/fr",
    });
  });
});
