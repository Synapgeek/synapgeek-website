import { describe, expect, it } from "vitest";
import {
  parseArgs,
  parseSitemap,
  resolveTarget,
  selectUrls,
} from "../../scripts/indexnow-selection.mjs";

/**
 * IndexNow ne veut que les URLs qui ont changé (consigne 4 de Bing : « Use
 * IndexNow to notify Bing when: URLs are added, Content is updated, URLs are
 * removed »). `npm run indexnow` n'envoie donc jamais le sitemap entier par
 * défaut, et jamais depuis un sitemap qui n'est pas en ligne : ces tests
 * figent la sélection.
 */
const ORIGIN = "https://synapgeek.com";
const PRODUCTION_SITEMAP = `${ORIGIN}/sitemap.xml`;
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>https://synapgeek.com</loc>
<xhtml:link rel="alternate" hreflang="fr" href="https://synapgeek.com/fr" />
<lastmod>2026-10-03</lastmod>
</url>
<url>
<loc>https://synapgeek.com/press</loc>
<lastmod>2026-10-28T00:00:00.000Z</lastmod>
</url>
<url>
<loc>https://synapgeek.com/legal</loc>
<lastmod>2026-06-04</lastmod>
</url>
</urlset>`;
const entries = parseSitemap(SITEMAP);

describe("sélection IndexNow", () => {
  it("lit chaque <url> avec son lastmod, sans compter les alternates hreflang", () => {
    expect(entries).toEqual([
      { loc: "https://synapgeek.com", lastmod: "2026-10-03" },
      {
        loc: "https://synapgeek.com/press",
        lastmod: "2026-10-28T00:00:00.000Z",
      },
      { loc: "https://synapgeek.com/legal", lastmod: "2026-06-04" },
    ]);
  });

  it("--since garde les URLs dont le lastmod est à cette date ou après, en dates calendaires", () => {
    expect(
      selectUrls({ origin: ORIGIN, entries, since: "2026-10-03" }).urls,
    ).toEqual(["https://synapgeek.com", "https://synapgeek.com/press"]);
    expect(
      selectUrls({ origin: ORIGIN, entries, since: "2026-10-28" }).urls,
    ).toEqual(["https://synapgeek.com/press"]);
  });

  it("--all garde tout le sitemap", () => {
    expect(
      selectUrls({ origin: ORIGIN, entries, all: true }).urls,
    ).toHaveLength(3);
  });

  it("ajoute les chemins donnés sans doublon", () => {
    expect(
      selectUrls({
        origin: ORIGIN,
        entries,
        since: "2026-10-28",
        targets: ["/press", "https://synapgeek.com/press/", "/legal"],
      }),
    ).toEqual({
      urls: ["https://synapgeek.com/press", "https://synapgeek.com/legal"],
      outsideSitemap: [],
    });
  });

  it("n'accepte un chemin hors sitemap (déplacée, retirée, ou faute de frappe) qu'avec --outside-sitemap", () => {
    const moved = { origin: ORIGIN, entries, targets: ["/en", "/press"] };
    expect(() => selectUrls(moved)).toThrow(/Hors sitemap.*--outside-sitemap/);
    expect(selectUrls({ ...moved, allowOutsideSitemap: true })).toEqual({
      urls: ["https://synapgeek.com/en", "https://synapgeek.com/press"],
      outsideSitemap: ["https://synapgeek.com/en"],
    });
  });

  it("écrit la racine et les chemins comme le sitemap, sans barre finale", () => {
    expect(resolveTarget("/", ORIGIN)).toBe("https://synapgeek.com");
    expect(resolveTarget("https://synapgeek.com/", ORIGIN)).toBe(
      "https://synapgeek.com",
    );
    expect(resolveTarget("/fr/presse/", ORIGIN)).toBe(
      "https://synapgeek.com/fr/presse",
    );
  });

  it.each([
    "https://www.synapgeek.com/press",
    "http://synapgeek.com/press",
    "https://synapgeek.com.example.com/press",
    "//example.com/press",
    "https://example.com/",
    "/privacy#account-deletion",
    "/?hl=en",
    "press",
  ])(
    "refuse %j : seule l'origine https://synapgeek.com passe, sans paramètre ni fragment",
    (input) => {
      expect(() => resolveTarget(input, ORIGIN)).toThrow();
    },
  );

  it("n'envoie rien sans critère, ni quand rien n'est retenu, ni sur une date fausse", () => {
    expect(() => selectUrls({ origin: ORIGIN, entries })).toThrow(
      /Rien à envoyer/,
    );
    expect(() =>
      selectUrls({ origin: ORIGIN, entries, since: "2026-11-01" }),
    ).toThrow(/Aucune URL/);
    expect(() =>
      selectUrls({ origin: ORIGIN, entries, since: "28/10/2026" }),
    ).toThrow(/AAAA-MM-JJ/);
    expect(() =>
      selectUrls({ origin: ORIGIN, entries, since: "2026-02-30" }),
    ).toThrow(/AAAA-MM-JJ/);
  });

  it("refuse --since quand une <url> n'a pas de lastmod", () => {
    const undated = parseSitemap(
      "<urlset><url><loc>https://synapgeek.com/about</loc></url></urlset>",
    );
    expect(() =>
      selectUrls({ origin: ORIGIN, entries: undated, since: "2026-10-28" }),
    ).toThrow(/sans <lastmod>/);
  });
});

describe("ligne de commande IndexNow", () => {
  it("lit les chemins, --since et --all", () => {
    expect(
      parseArgs(
        ["/press", "--since", "2026-10-28", "/fr/presse"],
        PRODUCTION_SITEMAP,
      ),
    ).toEqual({
      dryRun: false,
      all: false,
      since: "2026-10-28",
      sitemap: PRODUCTION_SITEMAP,
      targets: ["/press", "/fr/presse"],
      allowOutsideSitemap: false,
    });
    expect(parseArgs(["--all"], PRODUCTION_SITEMAP).all).toBe(true);
    expect(
      parseArgs(["/en", "--outside-sitemap"], PRODUCTION_SITEMAP)
        .allowOutsideSitemap,
    ).toBe(true);
  });

  it("exige une valeur après --since et --sitemap, jamais l'option suivante", () => {
    expect(() => parseArgs(["--since"], PRODUCTION_SITEMAP)).toThrow(
      /--since attend une valeur/,
    );
    expect(() =>
      parseArgs(["--since", "--dry-run", "2026-10-28"], PRODUCTION_SITEMAP),
    ).toThrow(/--since attend une valeur/);
    expect(() =>
      parseArgs(["--sitemap", "--dry-run"], PRODUCTION_SITEMAP),
    ).toThrow(/--sitemap attend une valeur/);
  });

  it("refuse --all combiné à un autre critère : il élargirait en silence", () => {
    expect(() =>
      parseArgs(["--all", "--since", "2026-10-28"], PRODUCTION_SITEMAP),
    ).toThrow(/--all exclut/);
    expect(() => parseArgs(["--all", "/press"], PRODUCTION_SITEMAP)).toThrow(
      /--all exclut/,
    );
  });

  it("n'envoie jamais depuis un autre sitemap que celui de production : répétition seulement", () => {
    const local = [
      "--since",
      "2026-10-28",
      "--sitemap",
      "http://localhost:3126/sitemap.xml",
    ];
    expect(() => parseArgs(local, PRODUCTION_SITEMAP)).toThrow(/--dry-run/);
    expect(parseArgs([...local, "--dry-run"], PRODUCTION_SITEMAP).dryRun).toBe(
      true,
    );
  });

  it("refuse une option inconnue", () => {
    expect(() => parseArgs(["--force"], PRODUCTION_SITEMAP)).toThrow(
      /Argument inconnu/,
    );
  });
});
