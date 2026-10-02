import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { getRewrittenUrl, isRewrite } from "next/experimental/testing/server";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { posix as posixPath } from "node:path";
import nextConfig from "../../next.config";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata as playMetadata } from "@/app/cerebrum/play/page";
import { getDictionary } from "@/content";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import {
  absoluteUrl,
  alternatesFor,
  renderedPageIds,
  BASE_URL,
  type PageId,
} from "@/lib/routes";
import { proxy } from "@/proxy";

/**
 * Gardes automatiques des règles « JAMAIS / toujours » de CLAUDE.md.
 *
 * Chaque `it` nomme la règle qu'il fait respecter. Les scans sont des lectures
 * de TEXTE source (aucun AST) : une forme volontairement contournée (import
 * dynamique construit, `eval`) leur échappe — limite assumée, écrite ici plutôt
 * que silencieuse. Les fichiers `*.test.*` sont exclus de tous les scans : ce
 * fichier cite lui-même les motifs qu'il interdit.
 */

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .map((entry) => posixPath.join(dir, String(entry)))
    .filter((file) => statSync(file).isFile())
    .sort();
}

const isTestFile = (file: string) => /\.test\.[cm]?[jt]sx?$/.test(file);

const sources = listFiles("src").filter(
  (file) => /\.(ts|tsx)$/.test(file) && !isTestFile(file),
);
const sourceSet = new Set(sources);
const read = (file: string) => readFileSync(file, "utf8");

/** Résout un import local (`@/…`, `./…`, `../…`) vers un fichier de `src/`. */
function resolveLocalImport(
  fromFile: string,
  specifier: string,
): string | null {
  let base: string;
  if (specifier.startsWith("@/")) base = `src/${specifier.slice(2)}`;
  else if (specifier.startsWith(".")) {
    base = posixPath.join(posixPath.dirname(fromFile), specifier);
  } else return null;
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`];
  return candidates.find((candidate) => sourceSet.has(candidate)) ?? null;
}

const IMPORT_SPECIFIER =
  /(?:from\s+|import\s*\(\s*|^\s*import\s+)["']([^"']+)["']/gm;

function directLocalImports(file: string): string[] {
  return [...read(file).matchAll(IMPORT_SPECIFIER)]
    .map((match) => resolveLocalImport(file, match[1]))
    .filter((resolved): resolved is string => resolved !== null);
}

describe("rendu — SSG pur (CLAUDE.md, « Structure des routes »)", () => {
  // « Trois fichiers seulement exportent `dynamic` — /cerebrum/play en
  // force-dynamic et les deux route handlers .well-known en force-static. Aucun
  // fichier n'exporte revalidate, dynamicParams, "use cache" ni cacheComponents. »
  const SEGMENT_NAMES = "dynamic|revalidate|dynamicParams|runtime";
  // Déclaration simple, avec ou sans annotation de type
  // (`export const revalidate: number = 3600`).
  const SEGMENT_CONFIG_EXPORT = new RegExp(
    String.raw`export\s+(?:const|let|var)\s+(${SEGMENT_NAMES})\b(?:\s*:[^=;]+)?\s*=\s*([^;\n]+)`,
    "g",
  );
  // Formes que la déclaration simple ne voit pas : réexport
  // (`export { x as revalidate }`, `export { revalidate } from …`),
  // déstructuration (`export const { dynamic } = cfg`), déclarateur non initial
  // (`export const a = 1, revalidate = 60`), objet de config à l'ancienne
  // (`export const config = { runtime: "edge" }`).
  const SEGMENT_CONFIG_OTHER_FORMS = new RegExp(
    String.raw`export\s*\{[^}]*\b(?:${SEGMENT_NAMES})\b[^}]*\}|export\s+(?:const|let|var)\b[^;]*?[,{]\s*(?:${SEGMENT_NAMES})\b`,
  );
  // `revalidate` et `dynamicParams` n'ont aucun usage légitime dans ce site (ni
  // export, ni option de fetch) : leur simple présence, sous quelque forme que
  // ce soit, est une dérive vers l'ISR ou le rendu à la demande.
  const FORBIDDEN_IDENTIFIERS = /\b(?:revalidate|dynamicParams)\b/;

  it("exactement trois fichiers exportent `dynamic`, avec les valeurs documentées ; aucun revalidate/dynamicParams/runtime", () => {
    const found = sources.flatMap((file) =>
      [...read(file).matchAll(SEGMENT_CONFIG_EXPORT)].map(
        (match) => `${file} ${match[1]}=${match[2].trim()}`,
      ),
    );
    expect(found).toEqual([
      'src/app/.well-known/apple-app-site-association/route.ts dynamic="force-static"',
      'src/app/.well-known/assetlinks.json/route.ts dynamic="force-static"',
      'src/app/cerebrum/play/page.tsx dynamic="force-dynamic"',
    ]);
    for (const file of sources) {
      expect(read(file), file).not.toMatch(SEGMENT_CONFIG_OTHER_FORMS);
      expect(read(file), file).not.toMatch(FORBIDDEN_IDENTIFIERS);
    }
  });

  it('aucun "use cache", cacheLife, cacheTag ni cacheComponents dans src/ ni next.config.ts', () => {
    for (const file of [...sources, "next.config.ts"]) {
      expect(read(file), file).not.toMatch(
        /["']use cache(?::[^"']*)?["']|\bcacheLife\b|\bcacheTag\b|\bcacheComponents\b/,
      );
    }
  });
});

describe("JSON-LD — source unique (CLAUDE.md, « SEO »)", () => {
  // « src/lib/structured-data.ts est la source unique de tout le JSON-LD du
  // site — aucun objet @type schema.org ne doit être construit ailleurs. »
  const STRUCTURED_DATA = "src/lib/structured-data.ts";
  const JSON_LD_RENDERER = "src/components/JsonLd.tsx";

  it("aucun littéral @context/@type/schema.org hors de src/lib/structured-data.ts", () => {
    for (const file of sources.filter((f) => f !== STRUCTURED_DATA)) {
      expect(read(file), file).not.toMatch(
        /["']@(?:context|type)["']|schema\.org/,
      );
    }
  });

  it("application/ld+json n'est émis que par src/components/JsonLd.tsx", () => {
    const emitters = sources.filter((file) =>
      read(file).includes("application/ld+json"),
    );
    expect(emitters).toEqual([JSON_LD_RENDERER]);
  });

  it("un seul noeud Organization : seul le layout de langue l'émet", () => {
    const callers = sources.filter(
      (file) =>
        file !== STRUCTURED_DATA && /\borganizationSchema\(/.test(read(file)),
    );
    expect(callers).toEqual(["src/app/[locale]/layout.tsx"]);
  });

  it("tout fichier qui rend <JsonLd> importe ses données de @/lib/structured-data", () => {
    // structured-data.ts cite `<JsonLd data=…>` dans un commentaire, sans le rendre.
    const renderers = sources.filter(
      (file) => file !== STRUCTURED_DATA && /<JsonLd\b/.test(read(file)),
    );
    expect(renderers.length).toBeGreaterThan(0);
    for (const file of renderers) {
      expect(read(file), file).toMatch(
        /from\s+["']@\/lib\/structured-data["']/,
      );
    }
  });
});

describe("URLs contractuelles (CLAUDE.md, « Règles critiques »)", () => {
  // « JAMAIS casser /account-deletion (+ pendants /en/, /fr/) — URL déclarée dans
  // le formulaire Data Safety de la Play Console. »
  // « #website » : cible du lien « en savoir plus » du bandeau de consentement.
  it.each(LOCALES)(
    "les ancres #account-deletion et #website existent dans la politique de confidentialité (%s)",
    (locale) => {
      const ids = getDictionary(locale).privacy.sections.map(
        (section) => section.id,
      );
      expect(ids).toContain("account-deletion");
      expect(ids).toContain("website");
    },
  );

  it("next.config.ts garde les trois redirections /account-deletion en 307 vers leurs destinations documentées", async () => {
    expect(nextConfig.redirects).toBeTypeOf("function");
    const redirects = await nextConfig.redirects!();
    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/account-deletion",
          destination: "/privacy#account-deletion",
          permanent: false,
        },
        {
          source: "/en/account-deletion",
          destination: "/en/privacy#account-deletion",
          permanent: false,
        },
        {
          source: "/fr/account-deletion",
          destination: "/privacy#account-deletion",
          permanent: false,
        },
      ]),
    );
  });

  // « /play, /jouer → 307 vers /cerebrum/play, query conservée (next.config.ts) —
  // QR historiques, JAMAIS casser. » Aucune query dans `destination` : Next la
  // fusionne à la query entrante en lui donnant priorité, et la page transmet
  // ensuite tout ce qu'elle reçoit à l'URL du store.
  it.each(["/play", "/jouer"])(
    "next.config.ts garde l'alias %s en 307 vers /cerebrum/play, sans query dans la destination",
    async (source) => {
      expect(nextConfig.redirects).toBeTypeOf("function");
      const redirects = await nextConfig.redirects!();
      const alias = redirects.find((redirect) => redirect.source === source);
      expect(alias, `aucune redirection pour ${source}`).toBeDefined();
      expect(alias!.destination, `destination de ${source}`).not.toContain("?");
      expect(alias).toEqual({
        source,
        destination: "/cerebrum/play",
        permanent: false,
      });
    },
  );

  // « /cerebrum/play (cible des QR), /play et /jouer (redirections) ne doivent
  // jamais changer ni disparaître » ; « robots.txt : aucun noindex dans src/
  // (sauf /cerebrum/play, marquée robots: { index: false }) ».
  it("/cerebrum/play reste noindex", () => {
    expect(playMetadata.robots).toMatchObject({ index: false });
  });

  // Spec §5.2 : l'anglais est la langue par défaut (racine sans préfixe), le
  // français vit sous /fr, sauf les trois pages légales figées (français sans
  // préfixe, anglais sous /en). x-default pointe toujours vers l'anglais.
  it("sitemap() renvoie exactement les 18 URLs du schéma courant, x-default anglais", () => {
    const entries = sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://synapgeek.com",
      "https://synapgeek.com/fr",
      "https://synapgeek.com/cerebrum",
      "https://synapgeek.com/fr/cerebrum",
      "https://synapgeek.com/cerebrum/sudoku",
      "https://synapgeek.com/fr/cerebrum/sudoku",
      "https://synapgeek.com/cerebrum/pandoku",
      "https://synapgeek.com/fr/cerebrum/pandoku",
      "https://synapgeek.com/cerebrum/minesweeper",
      "https://synapgeek.com/fr/cerebrum/demineur",
      "https://synapgeek.com/cerebrum/pixel-art",
      "https://synapgeek.com/fr/cerebrum/pixel-art",
      "https://synapgeek.com/en/privacy",
      "https://synapgeek.com/privacy",
      "https://synapgeek.com/en/terms",
      "https://synapgeek.com/terms",
      "https://synapgeek.com/en/legal",
      "https://synapgeek.com/legal",
    ]);
    const homeLanguages = {
      en: "https://synapgeek.com",
      fr: "https://synapgeek.com/fr",
      "x-default": "https://synapgeek.com",
    };
    expect(entries[0].alternates?.languages).toEqual(homeLanguages);
    expect(entries[1].alternates?.languages).toEqual(homeLanguages);
    const cerebrumLanguages = {
      en: "https://synapgeek.com/cerebrum",
      fr: "https://synapgeek.com/fr/cerebrum",
      "x-default": "https://synapgeek.com/cerebrum",
    };
    expect(entries[2].alternates?.languages).toEqual(cerebrumLanguages);
    expect(entries[3].alternates?.languages).toEqual(cerebrumLanguages);
    const sudokuLanguages = {
      en: "https://synapgeek.com/cerebrum/sudoku",
      fr: "https://synapgeek.com/fr/cerebrum/sudoku",
      "x-default": "https://synapgeek.com/cerebrum/sudoku",
    };
    expect(entries[4].alternates?.languages).toEqual(sudokuLanguages);
    expect(entries[5].alternates?.languages).toEqual(sudokuLanguages);
    const pandokuLanguages = {
      en: "https://synapgeek.com/cerebrum/pandoku",
      fr: "https://synapgeek.com/fr/cerebrum/pandoku",
      "x-default": "https://synapgeek.com/cerebrum/pandoku",
    };
    expect(entries[6].alternates?.languages).toEqual(pandokuLanguages);
    expect(entries[7].alternates?.languages).toEqual(pandokuLanguages);
    const minesweeperLanguages = {
      en: "https://synapgeek.com/cerebrum/minesweeper",
      fr: "https://synapgeek.com/fr/cerebrum/demineur",
      "x-default": "https://synapgeek.com/cerebrum/minesweeper",
    };
    expect(entries[8].alternates?.languages).toEqual(minesweeperLanguages);
    expect(entries[9].alternates?.languages).toEqual(minesweeperLanguages);
    const pixelArtLanguages = {
      en: "https://synapgeek.com/cerebrum/pixel-art",
      fr: "https://synapgeek.com/fr/cerebrum/pixel-art",
      "x-default": "https://synapgeek.com/cerebrum/pixel-art",
    };
    expect(entries[10].alternates?.languages).toEqual(pixelArtLanguages);
    expect(entries[11].alternates?.languages).toEqual(pixelArtLanguages);
    for (const page of ["privacy", "terms", "legal"]) {
      const languages = {
        en: `https://synapgeek.com/en/${page}`,
        fr: `https://synapgeek.com/${page}`,
        "x-default": `https://synapgeek.com/en/${page}`,
      };
      const pair = entries.filter((entry) => entry.url.endsWith(`/${page}`));
      expect(pair).toHaveLength(2);
      for (const entry of pair) {
        expect(entry.alternates?.languages).toEqual(languages);
      }
    }
  });

  // /cerebrum/play est une « page de service, sans contenu propre : hors index et
  // hors sitemap » (src/app/cerebrum/play/page.tsx). Un slug qui commence par
  // « play- » (/blog/play-sudoku-online) n'est pas cette page.
  it("sitemap() n'expose aucune URL /play ni /cerebrum/play", () => {
    for (const entry of sitemap()) {
      const languages = entry.alternates?.languages ?? {};
      for (const url of [entry.url, ...Object.values(languages)]) {
        expect(url, entry.url).not.toMatch(/\/play(?![\w-])/);
      }
    }
  });
});

describe("proxy i18n (CLAUDE.md, « Architecture i18n »)", () => {
  // Next lit `config.matcher` par analyse STATIQUE : une constante importée ou
  // calculée est ignorée en silence. D'où une comparaison sur le texte source.
  const DOCUMENTED_MATCHER = String.raw`/((?!_next|api|favicon\\.ico|.*\\..*).*)`;

  it("src/proxy.ts exporte un matcher littéral inline égal au matcher documenté", () => {
    const match = read("src/proxy.ts").match(
      /export const config = \{\s*matcher:\s*\[\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\],?\s*\};?/,
    );
    expect(
      match,
      'export const config = { matcher: ["…"] } introuvable',
    ).not.toBeNull();
    expect(match![1]).toBe(DOCUMENTED_MATCHER);
  });

  // « LOCALE_FREE_ROUTES exclut en plus les routes servies hors du segment
  // [locale] : il vaut ["/cerebrum/play"] et ne couvre PAS /cerebrum. » Le proxy
  // exempte une route ET ses sous-chemins : y ajouter /cerebrum sortirait tout ce
  // sous-arbre du rewrite vers /fr/…
  it('LOCALE_FREE_ROUTES vaut exactement ["/cerebrum/play"], jamais /cerebrum seul', () => {
    const match = read("src/proxy.ts").match(
      /const LOCALE_FREE_ROUTES\s*=\s*(\[[^\]]*\])\s*;/,
    );
    expect(match, "const LOCALE_FREE_ROUTES = […] introuvable").not.toBeNull();
    expect(match![1]).toBe('["/cerebrum/play"]');
  });
});

describe("proxy i18n — comportement (spec §5.2)", () => {
  const rewriteOf = (pathname: string) => {
    const response = proxy(new NextRequest(`https://synapgeek.com${pathname}`));
    return isRewrite(response)
      ? new URL(getRewrittenUrl(response)!).pathname
      : null;
  };

  it("l'anglais est la locale par défaut", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect([...LOCALES]).toEqual(["en", "fr"]);
  });

  it.each([
    ["/", "/en"],
    ["/cerebrum", "/en/cerebrum"],
    ["/about", "/en/about"],
    // Les pages légales sans préfixe gardent leur langue historique : le français.
    ["/privacy", "/fr/privacy"],
    ["/terms", "/fr/terms"],
    ["/legal", "/fr/legal"],
    // Seuls les chemins exacts sont figés, pas les préfixes de chaîne.
    ["/privacy-notes", "/en/privacy-notes"],
    ["/legal/archive", "/en/legal/archive"],
  ])("réécrit %s vers %s", (pathname, target) => {
    expect(rewriteOf(pathname)).toBe(target);
  });

  it.each([
    "/en",
    "/fr",
    "/en/privacy",
    "/fr/privacy",
    "/en/cerebrum",
    "/fr/cerebrum",
    "/cerebrum/play",
    "/cerebrum/play/qr",
  ])("laisse passer %s sans réécriture", (pathname) => {
    expect(rewriteOf(pathname)).toBeNull();
  });
});

describe("tout lien interne passe par les helpers de routes (CLAUDE.md, « Conventions de code »)", () => {
  it("getLocalePath n'existe plus nulle part dans src/", () => {
    for (const file of sources) {
      expect(read(file), file).not.toMatch(/\bgetLocalePath\b/);
    }
  });
});

describe("proxy i18n — source des chemins figés", () => {
  it("src/proxy.ts lit FROZEN_LEGAL_PATHS et FROZEN_LEGAL_LOCALE dans frozen-legal-paths, sans copie locale", () => {
    const source = read("src/proxy.ts");
    expect(source).toMatch(
      /import \{\s*FROZEN_LEGAL_LOCALE,\s*FROZEN_LEGAL_PATHS,?\s*\} from "@\/lib\/frozen-legal-paths";/,
    );
    expect(source).not.toMatch(/["']\/privacy["']/);
    expect(source).not.toMatch(/const FROZEN_LEGAL_LOCALE\b/);
  });
});

describe("pages légales sans JavaScript client (CLAUDE.md, « Règles critiques »)", () => {
  // « Les pages légales doivent rester accessibles sans JavaScript (SSG). »
  const LEGAL_ENTRY_POINTS = [
    "src/components/LegalPage.tsx",
    "src/app/[locale]/privacy/page.tsx",
    "src/app/[locale]/terms/page.tsx",
    "src/app/[locale]/legal/page.tsx",
  ];
  const USE_CLIENT_DIRECTIVE = /^\s*["']use client["'];?\s*$/m;

  it('LegalPage, les trois pages légales et leurs imports locaux directs n\'ont aucun "use client"', () => {
    const checked = new Set(
      LEGAL_ENTRY_POINTS.flatMap((file) => [file, ...directLocalImports(file)]),
    );
    expect(checked).toContain("src/components/ui/Badge.tsx");
    for (const file of checked) {
      expect(read(file), file).not.toMatch(USE_CLIENT_DIRECTIVE);
    }
  });
});

describe("portefeuille Synapgeek (CLAUDE.md, « Règles critiques » ; skill synapgeek-portfolio-rules)", () => {
  // « JAMAIS de lien vers un autre site du portefeuille Synapgeek. »
  it("aucune mention wordsearchtrove / mazefoundry / maze-foundry / drawmytattoo dans src/ ni public/", () => {
    const files = [...listFiles("src"), ...listFiles("public")].filter(
      (file) => !isTestFile(file),
    );
    for (const file of files) {
      expect(read(file), file).not.toMatch(
        /wordsearchtrove|mazefoundry|maze-foundry|drawmytattoo/i,
      );
    }
  });
});

describe("dette i18n — cliquet (CLAUDE.md, « Conventions de code »)", () => {
  // Plus aucun ternaire de locale : tout texte localisé passe par le Dictionary
  // ou un module de copie. Le plafond ne remonte jamais ; site-reviewer refuse
  // toute PR qui le fait monter.
  const MAX_LOCALE_TERNARIES = 0;
  const LOCALE_TERNARY =
    /\b\w*(?:locale|lang)\w*\s*[!=]==?\s*["'](?:fr|en)["']\s*\?|["'](?:fr|en)["']\s*[!=]==?\s*\w*(?:locale|lang)\w*\s*\?/gi;

  it(`au plus ${MAX_LOCALE_TERNARIES} ternaires de locale dans src/`, () => {
    const occurrences = sources.flatMap((file) =>
      [...read(file).matchAll(LOCALE_TERNARY)].map(
        (match) => `${file}: ${match[0].replace(/\s+/g, " ")}`,
      ),
    );
    expect(occurrences.length, occurrences.join("\n")).toBeLessThanOrEqual(
      MAX_LOCALE_TERNARIES,
    );
  });
});

describe("secrets (CLAUDE.md, « Sécurité »)", () => {
  // « Aucune process.env sans NEXT_PUBLIC_ lue hors de src/app/api/. »
  // NODE_ENV n'est lu nulle part aujourd'hui : il n'a donc aucune exemption.
  it("process.env n'est lu sans préfixe NEXT_PUBLIC_ que sous src/app/api/", () => {
    for (const file of sources.filter((f) => !f.startsWith("src/app/api/"))) {
      const offenders =
        read(file).match(/process\.env(?!\.NEXT_PUBLIC_)\S*/g) ?? [];
      expect(offenders, file).toEqual([]);
    }
  });
});

describe("sitemap — dérivé du registre de pages (spec §5, SEO)", () => {
  const LEGAL_PAGES = ["privacy", "terms", "legal"] as const;
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  const expectedUrls = renderedPageIds().flatMap((pageId) =>
    LOCALES.map((locale) => absoluteUrl(pageId, locale)),
  );

  it("liste exactement les pages rendues × les langues, sans doublon", () => {
    expect([...urls].sort()).toEqual([...expectedUrls].sort());
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("n'expose jamais /cerebrum/play ni /fr/<page légale>", () => {
    expect(urls.some((url) => url.includes("/play"))).toBe(false);
    for (const page of LEGAL_PAGES) {
      expect(urls).not.toContain(`${BASE_URL}/fr/${page}`);
    }
  });

  // L'anglais vit à la racine : sous /en, seules les trois pages légales figées
  // (schéma §5.2) ont une URL. Toute autre /en/… serait une redirection 308 listée
  // dans le sitemap.
  it("n'expose aucune URL /en… hors les trois pages légales", () => {
    const allUrls = entries.flatMap((entry) => [
      entry.url,
      ...Object.values(entry.alternates?.languages ?? {}).filter(
        (url): url is string => url !== undefined,
      ),
    ]);
    const underEn = allUrls.filter((url) => {
      const { origin, pathname } = new URL(url);
      return (
        origin === BASE_URL &&
        (pathname === "/en" || pathname.startsWith("/en/"))
      );
    });
    expect([...new Set(underEn)].sort()).toEqual(
      LEGAL_PAGES.map((page) => `${BASE_URL}/en/${page}`).sort(),
    );
  });

  it("chaque entrée porte les alternates hreflang de sa page", () => {
    const pageIdOf = new Map(
      renderedPageIds().flatMap((pageId) =>
        LOCALES.map((locale) => [absoluteUrl(pageId, locale), pageId] as const),
      ),
    );
    for (const entry of entries) {
      const pageId = pageIdOf.get(entry.url);
      expect(pageId, entry.url).toBeDefined();
      expect(entry.alternates?.languages, entry.url).toEqual(
        alternatesFor(pageId!).languages,
      );
    }
  });

  it("les pages légales gardent la date de leur dictionnaire", () => {
    for (const locale of LOCALES) {
      const dict = getDictionary(locale);
      for (const page of ["privacy", "terms", "legal"] as const) {
        const entry = entries.find(
          (candidate) => candidate.url === absoluteUrl(page, locale),
        );
        expect(entry?.lastModified, `${locale} ${page}`).toBe(
          dict[page].updatedAt,
        );
      }
    }
  });

  // Règle de fréquence (CLAUDE.md, « SEO ») : hebdomadaire pour le hub et la page
  // de l'app, mensuelle pour tout le reste. Comparée page par page, pas seulement
  // sur un sous-ensemble : une nouvelle page rendue sans règle propre est mensuelle.
  const WEEKLY_PAGE_IDS: readonly PageId[] = ["home", "cerebrum"];

  it("changeFrequency : hebdomadaire pour le hub et l'app, mensuelle pour toute autre page rendue", () => {
    const expected = new Map(
      renderedPageIds().flatMap((pageId) =>
        LOCALES.map(
          (locale) =>
            [
              absoluteUrl(pageId, locale),
              WEEKLY_PAGE_IDS.includes(pageId) ? "weekly" : "monthly",
            ] as const,
        ),
      ),
    );
    expect(
      new Map(entries.map((entry) => [entry.url, entry.changeFrequency])),
    ).toEqual(expected);
  });
});

describe("robots — crawlers IA nommés (spec §5, GEO)", () => {
  const AI_CRAWLERS = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "PerplexityBot",
    "Perplexity-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "Google-Extended",
    "Applebot-Extended",
    "Bingbot",
  ];
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it('autorise "/" pour * et pour chaque crawler IA, nommé explicitement', () => {
    for (const userAgent of ["*", ...AI_CRAWLERS]) {
      const matching = rules.filter((rule) =>
        Array.isArray(rule.userAgent)
          ? rule.userAgent.includes(userAgent)
          : rule.userAgent === userAgent,
      );
      expect(matching.length, userAgent).toBe(1);
      expect(matching[0].allow, userAgent).toBe("/");
    }
  });

  it("ne contient aucun disallow", () => {
    for (const rule of rules) expect(rule.disallow).toBeUndefined();
  });

  it("garde la ligne sitemap", () => {
    expect(result.sitemap).toBe("https://synapgeek.com/sitemap.xml");
  });
});

describe("llms.txt — cohérent avec le sitemap (spec §5, GEO)", () => {
  const llms = read("public/llms.txt");
  const sitemapUrls = new Set(sitemap().map((entry) => entry.url));
  const siteUrls = [
    ...llms.matchAll(/https:\/\/synapgeek\.com(?:\/[^\s)\]]*)?/g),
  ].map((match) => match[0]);

  it("liste des URLs du site", () => {
    expect(siteUrls.length).toBeGreaterThan(0);
  });

  it("chaque URL synapgeek.com citée est dans le sitemap", () => {
    for (const url of siteUrls) {
      expect(sitemapUrls, url).toContain(url);
    }
  });

  it("couvre chaque URL du sitemap", () => {
    for (const url of sitemapUrls) expect(siteUrls, url).toContain(url);
  });

  it("ne cite jamais la route des QR", () => {
    // Ancré sur le domaine : play.google.com/… est une fiche store légitime.
    expect(llms).not.toMatch(/synapgeek\.com\/(?:cerebrum\/play|play|jouer)\b/);
  });
});
