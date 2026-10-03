#!/usr/bin/env node
/**
 * Contrôle des URLs contractuelles de synapgeek.com (CLAUDE.md, « Règles critiques »).
 *
 * Usage :
 *   node scripts/check-contract-urls.mjs              → https://synapgeek.com + https://www.synapgeek.com
 *   node scripts/check-contract-urls.mjs <baseUrl>    → une seule base (preview, http://localhost:PORT)
 *
 * Ces URLs sont référencées hors du dépôt : App Store Connect (privacy, support
 * `/#contact` et `/en#contact` : depuis la bascule, `/#contact` sert l'anglais et
 * `/en#contact` (sans `utm_*`) redirige en 308 vers lui ; la forme `utm_source=cerebrum&
 * utm_medium=app` du lien Contact des apps relève de R1, voir plus bas), formulaire Data Safety de la Play Console
 * (`/account-deletion`), config AdMob consent (UMP), QR codes imprimés
 * (`/cerebrum/play`, et `/play` ou `/jouer` pour les premiers), vérification
 * AdMob (`/app-ads.txt`). Les valeurs attendues sont écrites en clair, comme dans
 * un test, pour qu'un changement de destination se voie ici avant d'atteindre un
 * store. Elles sont le comportement OBSERVÉ en production le 2026-10-01, pas une
 * supposition — sauf pour la route des QR (paragraphe suivant).
 *
 * Route des QR : ce script encode le contrat tel qu'il est APRÈS la fusion de la
 * PR #11 (lot 0c) : `/cerebrum/play` est la route canonique, `/play` et `/jouer`
 * y redirigent en 307, query conservée. Ces attentes ont été vérifiées le
 * 2026-10-01 contre un `next start` local, pas observées en production : tant que
 * la PR #11 n'est pas fusionnée (donc déployée), un contrôle contre la production
 * signale des écarts sur ces trois URLs, ce qui est attendu. Les variantes de
 * casse (`/Play`) ne sont pas contrôlées : `next start` et Vercel ne s'accordent
 * pas sur la casse.
 *
 * Attentes de PRÉ-PRODUCTION : les lignes `/en` (redirection 308 vers la racine),
 * `/en/<page>` et `/cerebrum/play` (avec ses alias `/play` et `/jouer`) décrivent le
 * contrat des PR du lot routage. Tant que ces PR ne sont pas fusionnées puis
 * déployées, un contrôle contre la production signale des écarts sur ces lignes :
 * c'est attendu, pas une régression.
 *
 * Contrat de langue (spec §5.2, après le basculement sur l'anglais par défaut) :
 * `/` sert l'anglais et `/fr` le français, tous deux avec `id="contact"` ; les
 * pages légales SANS préfixe (`/privacy`, `/terms`, `/legal`) restent en
 * FRANÇAIS (l'app installée et les stores les ouvrent en l'attendant), leurs
 * pendants anglais vivent sous `/en/`. Chaque page légale est canonique vers
 * elle-même et déclare hreflang en/fr/x-default, x-default pointant l'anglais.
 *
 * Redirections historiques (tâche 5, next.config.ts) : `/en` redirige en 308 vers
 * `/`, query conservée, et chaque ancienne page anglaise non légale (`/en/cerebrum`…)
 * vers son pendant sans préfixe. La cible `/cerebrum` répond 200 depuis la tâche 13 ;
 * les pages de jeux (`/en/cerebrum/<jeu>`) ne sont contrôlées qu'à partir de leur
 * livraison : Sudoku (tâche 14) ouvre la série, Pandoku (tâche 141), Démineur (tâche 142),
 * Pixel Art (tâche 143), Arrow Maze (tâche 144), Mots croisés (tâche 171), Mots mêlés (tâche 172), Cross Math (tâche 173), Trace (tâche 174) et Labyrinthe (tâche 175) la suivent, chaque jeu suivant ajoute ses lignes.
 * Une page de jeu porte UNE seule `og:image`, et cette image répond 200 `image/png`
 * sans redirection (aperçu d'un lien partagé).
 * R1 (lien Contact des apps installées, next.config.ts, docs/contrat/redirections.md) :
 * la racine avec `utm_source=cerebrum&utm_medium=app` (et sans `hl`) redirige en 307 vers
 * `/fr`, `/en` avec la même paire en 307 vers `/?…&hl=en`. Ni `/en?src=…` (308), ni
 * `utm_medium=apps`, ni les pages légales ne déclenchent ces règles.
 * Seul `/fr/privacy`, `/fr/terms`, `/fr/legal` reste TRANSITOIRE :
 * ils répondent encore en 200 (canonical) et passeront en 307 dans un PR ultérieur,
 * après preuve en production.
 *
 * Toutes les requêtes partent en `redirect: "manual"` : on lit le statut et le
 * Location réels, jamais la page d'arrivée.
 *
 * Déploiement Vercel protégé (aperçu derrière Vercel Authentication) : si la variable
 * d'environnement `VERCEL_OIDC_TOKEN` est définie, elle part en en-tête
 * `x-vercel-trusted-oidc-idp-token` sur CHAQUE requête (pages, og:image, sitemap). Le jeton
 * n'est jamais affiché ni écrit dans le tableau.
 *
 * Sortie : un tableau lisible, code de sortie 1 au premier écart.
 */
import { readdirSync, readFileSync } from "node:fs";

const APEX = "https://synapgeek.com";
const WWW = "https://www.synapgeek.com";

const USER_AGENTS = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
};

// Destinations de /cerebrum/play (src/lib/app.ts : APP_STORE_QR_URL, GOOGLE_PLAY_URL).
const APP_STORE_QR_URL =
  "https://apps.apple.com/app/apple-store/id6763915130?pt=128805365&ct=plv-comptoir&mt=8";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum";

// Paramètre de campagne factice : il doit traverser les redirections et s'ajouter à
// l'URL du store, sans jamais en écraser un paramètre déjà présent.
const CAMPAIGN_PARAM = "src=contract-check";

// Query du lien « Contact » des apps installées (iOS LegalURLProvider.swift, Android
// LegalUrlProvider.kt) : celle qui déclenche les règles R1 de next.config.ts.
const APP_CONTACT_PARAM =
  "utm_source=cerebrum&utm_medium=app&utm_campaign=profile";

const SITEMAP_URL_COUNT = 34;

/** Jeton OIDC des aperçus Vercel protégés (variable d'environnement, jamais journalisé). */
const OIDC_TOKEN = process.env.VERCEL_OIDC_TOKEN;

/** En-têtes communs à toute requête du script, og:image comprise. */
function baseHeaders() {
  return OIDC_TOKEN ? { "x-vercel-trusted-oidc-idp-token": OIDC_TOKEN } : {};
}

/** Chemins qui ne doivent JAMAIS figurer au sitemap (redirections, alias, repli QR). */
const SITEMAP_FORBIDDEN = [
  /^\/en$/,
  /^\/en\/(?!privacy$|terms$|legal$)/,
  /^\/fr\/(privacy|terms|legal)$/,
  /^\/(cerebrum\/)?play$/,
  /^\/jouer$/,
  /^\/account-deletion$/,
];

/** Slug de chaque page de jeu livrée, par langue (le français de Démineur diffère). */
const SLUGS = {
  sudoku: { en: "sudoku", fr: "sudoku" },
  pandoku: { en: "pandoku", fr: "pandoku" },
  minesweeper: { en: "minesweeper", fr: "demineur" },
  pixelArt: { en: "pixel-art", fr: "pixel-art" },
  crossMath: { en: "cross-math", fr: "cross-math" },
  crossword: { en: "crossword", fr: "mots-croises" },
  wordSearch: { en: "word-search", fr: "mots-meles" },
  trace: { en: "trace", fr: "trace" },
  maze: { en: "maze", fr: "labyrinthe" },
  arrowMaze: { en: "arrow-maze", fr: "arrow-maze" },
};

/** Slug de chaque page de section livrée (À propos, Presse), par langue : copie de src/lib/page-slugs.ts (SECTION_SLUGS). */
const SECTIONS = {
  about: { en: "about", fr: "a-propos" },
  press: { en: "press", fr: "presse" },
};

const LEGAL_PAGES = ["/privacy", "/terms", "/legal"];
// Les trois variantes de chaque page légale ; sur l'hôte www, chacune redirige en 308
// vers l'apex (le 200 de `/fr${page}` est celui de l'apex, contrôlé dans contractChecks).
const LOCALIZED_LEGAL_PAGES = LEGAL_PAGES.flatMap((page) => [
  page,
  `/en${page}`,
  `/fr${page}`,
]);

const LEGAL_LANGUAGES = {
  fr: (page) => `${APEX}${page}`,
  en: (page) => `${APEX}/en${page}`,
};
const WELL_KNOWN = [
  "/.well-known/apple-app-site-association",
  "/.well-known/assetlinks.json",
];

/** Les 7 en-têtes de sécurité posés par vercel.json sur toutes les routes. */
function vercelSecurityHeaders() {
  const config = JSON.parse(
    readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  const catchAll = config.headers.find((rule) => rule.source === "/(.*)");
  if (!catchAll) throw new Error('vercel.json : règle "/(.*)" introuvable');
  return catchAll.headers;
}

const PLAIN_TEXT = "text/plain";

/** Clé IndexNow : le nom du seul fichier `public/<32 hex>.txt`, lu dans le dépôt (jamais recopié ici). */
const INDEXNOW_KEY = readdirSync(new URL("../public/", import.meta.url))
  .find((name) => /^[0-9a-f]{32}\.txt$/.test(name))
  ?.replace(/\.txt$/, "");
if (!INDEXNOW_KEY) throw new Error("public/<32 hex>.txt introuvable");

/**
 * Une vérification : `path`, options de requête, et la liste des attentes.
 * Chaque attente renvoie `null` si elle est tenue, sinon l'observé.
 */
function contractChecks(base) {
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base);
  const resolve = (path) => new URL(path, base).href;

  const ok = (path, extra = []) => ({
    path,
    expect: [status(200), noLocation(), ...extra],
  });
  const notFound = (path) => ({
    path,
    expect: [status(404), noLocation()],
  });
  const redirect = (path, code, target) => ({
    path,
    expect: [status(code), location(resolve(target))],
  });

  const checks = [
    ok("/", [
      contentType("text/html"),
      htmlLang("en"),
      bodyIncludes('id="contact"'),
      canonical(APEX),
      hreflangs({ en: APEX, fr: `${APEX}/fr`, "x-default": APEX }),
      noPrefetchOfRewrittenLinks(),
    ]),
    // Spec §5.2 : /en n'est plus une page, 308 vers la racine, query conservée.
    redirect("/en", 308, "/"),
    redirect("/en/", 308, "/en"),
    redirect(`/en?${CAMPAIGN_PARAM}`, 308, `/?${CAMPAIGN_PARAM}`),
    // R1 : lien Contact des apps installées. La racine avec utm d'app (français) part en
    // 307 vers /fr, `/en` avec utm d'app (autres langues) en 307 vers /?…&hl=en, qui répond
    // 200 en anglais (le marqueur `hl` empêche la règle de la racine de le reprendre).
    redirect(`/?${APP_CONTACT_PARAM}`, 307, `/fr?${APP_CONTACT_PARAM}`),
    redirect(`/en?${APP_CONTACT_PARAM}`, 307, `/?${APP_CONTACT_PARAM}&hl=en`),
    ok(`/?${APP_CONTACT_PARAM}&hl=en`, [
      htmlLang("en"),
      bodyIncludes('id="contact"'),
    ]),
    ok(`/fr?${APP_CONTACT_PARAM}`, [
      htmlLang("fr"),
      bodyIncludes('id="contact"'),
    ]),
    // Ancrage de has.value : `apps` ne doit pas être pris pour `app`.
    ok("/?utm_source=cerebrum&utm_medium=apps&utm_campaign=profile", [
      htmlLang("en"),
      bodyIncludes('id="contact"'),
    ]),
    // Les liens d'app vers les pages légales ne déclenchent aucune règle.
    ok("/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign=sign_in", [
      htmlLang("fr"),
    ]),
    ok(
      "/en/terms?utm_source=cerebrum&utm_medium=app&utm_campaign=store_subscription",
      [htmlLang("en")],
    ),
    // Image Open Graph du site (ancienne et v2) : aperçu d'un lien partagé.
    ok("/images/brand/og-image.jpeg", [contentType("image/jpeg")]),
    ok("/images/brand/og-image-v2.jpeg", [contentType("image/jpeg")]),
    redirect("/en/cerebrum", 308, "/cerebrum"),
    redirect(
      `/en/cerebrum?${CAMPAIGN_PARAM}`,
      308,
      `/cerebrum?${CAMPAIGN_PARAM}`,
    ),
    redirect(`/en/about?${CAMPAIGN_PARAM}`, 308, `/about?${CAMPAIGN_PARAM}`),
    redirect("/en/cerebrum/sudoku", 308, "/cerebrum/sudoku"),
    redirect("/en/cerebrum/pandoku", 308, "/cerebrum/pandoku"),
    redirect("/en/cerebrum/minesweeper", 308, "/cerebrum/minesweeper"),
    redirect("/en/cerebrum/pixel-art", 308, "/cerebrum/pixel-art"),
    redirect("/en/cerebrum/cross-math", 308, "/cerebrum/cross-math"),
    redirect("/en/cerebrum/crossword", 308, "/cerebrum/crossword"),
    redirect("/en/cerebrum/word-search", 308, "/cerebrum/word-search"),
    redirect("/en/cerebrum/trace", 308, "/cerebrum/trace"),
    redirect("/en/cerebrum/maze", 308, "/cerebrum/maze"),
    redirect("/en/cerebrum/arrow-maze", 308, "/cerebrum/arrow-maze"),
    // Page de l'app (tâche 13) : anglais sans préfixe, français sous /fr.
    ok("/cerebrum", [
      contentType("text/html"),
      htmlLang("en"),
      canonical(`${APEX}/cerebrum`),
      hreflangs({
        en: `${APEX}/cerebrum`,
        fr: `${APEX}/fr/cerebrum`,
        "x-default": `${APEX}/cerebrum`,
      }),
    ]),
    ok("/fr/cerebrum", [
      contentType("text/html"),
      htmlLang("fr"),
      canonical(`${APEX}/fr/cerebrum`),
      hreflangs({
        en: `${APEX}/cerebrum`,
        fr: `${APEX}/fr/cerebrum`,
        "x-default": `${APEX}/cerebrum`,
      }),
    ]),
    // Page de jeu (tâche 14) : même schéma de langue, une seule og:image qui répond.
    ok("/cerebrum/sudoku", gamePageExpectations("en", SLUGS.sudoku, resolve)),
    ok(
      "/fr/cerebrum/sudoku",
      gamePageExpectations("fr", SLUGS.sudoku, resolve),
    ),
    ok("/cerebrum/pandoku", gamePageExpectations("en", SLUGS.pandoku, resolve)),
    ok(
      "/fr/cerebrum/pandoku",
      gamePageExpectations("fr", SLUGS.pandoku, resolve),
    ),
    ok(
      "/cerebrum/minesweeper",
      gamePageExpectations("en", SLUGS.minesweeper, resolve),
    ),
    ok(
      "/fr/cerebrum/demineur",
      gamePageExpectations("fr", SLUGS.minesweeper, resolve),
    ),
    ok(
      "/cerebrum/pixel-art",
      gamePageExpectations("en", SLUGS.pixelArt, resolve),
    ),
    ok(
      "/fr/cerebrum/pixel-art",
      gamePageExpectations("fr", SLUGS.pixelArt, resolve),
    ),
    ok(
      "/cerebrum/cross-math",
      gamePageExpectations("en", SLUGS.crossMath, resolve),
    ),
    ok(
      "/fr/cerebrum/cross-math",
      gamePageExpectations("fr", SLUGS.crossMath, resolve),
    ),
    ok(
      "/cerebrum/crossword",
      gamePageExpectations("en", SLUGS.crossword, resolve),
    ),
    ok(
      "/fr/cerebrum/mots-croises",
      gamePageExpectations("fr", SLUGS.crossword, resolve),
    ),
    ok(
      "/cerebrum/word-search",
      gamePageExpectations("en", SLUGS.wordSearch, resolve),
    ),
    ok(
      "/fr/cerebrum/mots-meles",
      gamePageExpectations("fr", SLUGS.wordSearch, resolve),
    ),
    ok("/cerebrum/trace", gamePageExpectations("en", SLUGS.trace, resolve)),
    ok("/fr/cerebrum/trace", gamePageExpectations("fr", SLUGS.trace, resolve)),
    ok("/cerebrum/maze", gamePageExpectations("en", SLUGS.maze, resolve)),
    ok(
      "/fr/cerebrum/labyrinthe",
      gamePageExpectations("fr", SLUGS.maze, resolve),
    ),
    ok(
      "/cerebrum/arrow-maze",
      gamePageExpectations("en", SLUGS.arrowMaze, resolve),
    ),
    ok(
      "/fr/cerebrum/arrow-maze",
      gamePageExpectations("fr", SLUGS.arrowMaze, resolve),
    ),
    // Un slug ne se résout que dans sa langue ; un slug inconnu est un vrai 404.
    notFound("/fr/cerebrum/crossword"),
    notFound("/cerebrum/mots-croises"),
    notFound("/fr/cerebrum/word-search"),
    notFound("/cerebrum/mots-meles"),
    notFound("/fr/cerebrum/maze"),
    notFound("/cerebrum/labyrinthe"),
    notFound("/cerebrum/inconnu"),
    // Titres des 404 : la 404 racine (langue inconnue) porte exactement le sien, via
    // `metadata` ; la 404 localisée n'en rend aucun dans le HTML serveur (le sien est posé
    // côté client). Jamais deux.
    {
      path: "/de/inconnu",
      expect: [
        status(404),
        noLocation(),
        singleTitle("Page not found | Synapgeek"),
      ],
    },
    {
      path: "/fr/cerebrum/inconnu",
      expect: [status(404), noLocation(), singleTitle()],
    },
    // Pages de section (tâche 15) : anglais sans préfixe, français sous /fr avec son slug ;
    // /en/<slug> redirige, le slug de l'autre langue est un vrai 404.
    redirect("/en/about", 308, "/about"),
    redirect("/en/press", 308, "/press"),
    ...Object.values(SECTIONS).flatMap((slugs) => [
      ok(`/${slugs.en}`, sectionPageExpectations("en", slugs, resolve)),
      ok(`/fr/${slugs.fr}`, sectionPageExpectations("fr", slugs, resolve)),
    ]),
    notFound("/fr/about"),
    notFound("/fr/press"),
    notFound("/a-propos"),
    notFound("/presse"),
    ok("/fr", [
      contentType("text/html"),
      htmlLang("fr"),
      bodyIncludes('id="contact"'),
      canonical(`${APEX}/fr`),
      hreflangs({ en: APEX, fr: `${APEX}/fr`, "x-default": APEX }),
      noPrefetchOfRewrittenLinks(),
    ]),
    redirect("/fr/", 308, "/fr"),
    ...LEGAL_PAGES.flatMap((page) => [
      ok(page, legalExpectations("fr", page)),
      ok(`/en${page}`, legalExpectations("en", page)),
    ]),
    // Transitoire (PR ultérieur : 307 vers l'URL sans préfixe) : /fr/<page> répond encore 200.
    ...LEGAL_PAGES.map((page) =>
      ok(`/fr${page}`, [contentType("text/html"), htmlLang("fr")]),
    ),
    ok("/privacy", [
      bodyIncludes('id="account-deletion"'),
      bodyIncludes('id="website"'),
    ]),
    ok("/en/privacy", [
      bodyIncludes('id="account-deletion"'),
      bodyIncludes('id="website"'),
    ]),
    redirect("/account-deletion", 307, "/privacy#account-deletion"),
    redirect("/en/account-deletion", 307, "/en/privacy#account-deletion"),
    redirect("/fr/account-deletion", 307, "/privacy#account-deletion"),
    {
      path: "/cerebrum/play",
      label: "/cerebrum/play (iPhone)",
      userAgent: USER_AGENTS.iphone,
      expect: [status(307), location(APP_STORE_QR_URL)],
    },
    {
      path: `/cerebrum/play?${CAMPAIGN_PARAM}`,
      label: "/cerebrum/play?src (iPhone)",
      userAgent: USER_AGENTS.iphone,
      expect: [status(307), location(`${APP_STORE_QR_URL}&${CAMPAIGN_PARAM}`)],
    },
    {
      path: "/cerebrum/play",
      label: "/cerebrum/play (Android)",
      userAgent: USER_AGENTS.android,
      expect: [status(307), location(GOOGLE_PLAY_URL)],
    },
    {
      // Un paramètre entrant déjà présent sur la cible (?id=) ne l'écrase jamais.
      path: `/cerebrum/play?${CAMPAIGN_PARAM}&id=com.example.other`,
      label: "/cerebrum/play?src&id (Android)",
      userAgent: USER_AGENTS.android,
      expect: [status(307), location(`${GOOGLE_PLAY_URL}&${CAMPAIGN_PARAM}`)],
    },
    {
      path: "/cerebrum/play",
      label: "/cerebrum/play (desktop)",
      userAgent: USER_AGENTS.desktop,
      expect: [
        status(200),
        noLocation(),
        contentType("text/html"),
        bodyMatches(/<meta name="robots" content="noindex/),
      ],
    },
    // Repli du QR : sa langue suit Accept-Language (français si préféré, anglais sinon).
    {
      path: "/cerebrum/play",
      label: "/cerebrum/play (desktop, fr)",
      userAgent: USER_AGENTS.desktop,
      acceptLanguage: "fr-FR,fr;q=0.9,en;q=0.8",
      expect: [status(200), contentType("text/html"), htmlLang("fr")],
    },
    {
      path: "/cerebrum/play",
      label: "/cerebrum/play (desktop, en)",
      userAgent: USER_AGENTS.desktop,
      acceptLanguage: "en-US,en;q=0.9",
      expect: [status(200), contentType("text/html"), htmlLang("en")],
    },
    // Alias des premiers QR : 307 vers la route canonique, query conservée telle quelle.
    redirect("/play", 307, "/cerebrum/play"),
    redirect(
      `/play?${CAMPAIGN_PARAM}`,
      307,
      `/cerebrum/play?${CAMPAIGN_PARAM}`,
    ),
    redirect("/jouer", 307, "/cerebrum/play"),
    redirect(
      `/jouer?${CAMPAIGN_PARAM}`,
      307,
      `/cerebrum/play?${CAMPAIGN_PARAM}`,
    ),
    ...WELL_KNOWN.map((path) =>
      ok(path, [contentType("application/json"), bodyIsJson()]),
    ),
    ok("/app-ads.txt", [
      contentType(PLAIN_TEXT),
      bodyIncludes("google.com, pub-"),
    ]),
    ok("/robots.txt", [
      contentType(PLAIN_TEXT),
      bodyIncludes("Allow: /"),
      bodyExcludes(/^Disallow:/im, "aucun Disallow"),
    ]),
    ok("/sitemap.xml", [
      contentType("xml"),
      locCount(SITEMAP_URL_COUNT),
      bodyIncludes(`<loc>${APEX}</loc>`),
      bodyIncludes(`<loc>${APEX}/fr</loc>`),
    ]),
    ok("/llms.txt", [contentType(PLAIN_TEXT)]),
    // Clé IndexNow (scripts/indexnow-ping.mjs) : le fichier doit répondre et se contenir lui-même.
    ok(`/${INDEXNOW_KEY}.txt`, [
      contentType(PLAIN_TEXT),
      bodyIncludes(INDEXNOW_KEY),
    ]),
  ];

  if (isLocal) {
    // vercel.json n'est appliqué que par la plateforme Vercel, jamais par `next start`.
    return { checks, skipped: ["en-têtes vercel.json (base locale)"] };
  }
  checks.push({
    ...ok(
      "/",
      vercelSecurityHeaders().map(({ key, value }) => header(key, value)),
    ),
    label: "/ (en-têtes vercel.json)",
  });
  return { checks, skipped: [] };
}

/**
 * Hôte www : chaque URL contractuelle répond 308 vers l'apex, même chemin
 * (observé en production le 2026-10-01, /.well-known/* compris).
 */
function wwwChecks() {
  const paths = [
    "/",
    `/?${APP_CONTACT_PARAM}`,
    "/en",
    ...LOCALIZED_LEGAL_PAGES,
    "/account-deletion",
    "/en/account-deletion",
    "/fr/account-deletion",
    "/cerebrum/play",
    "/play",
    "/jouer",
    ...WELL_KNOWN,
    "/app-ads.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/llms.txt",
  ];
  return paths.map((path) => ({
    path,
    expect: [status(308), location(`${APEX}${path}`)],
  }));
}

// --- attentes -------------------------------------------------------------

/** Page légale : langue de l'URL, canonique vers elle-même, hreflang en/fr/x-default (anglais). */
function legalExpectations(language, page) {
  return [
    contentType("text/html"),
    htmlLang(language),
    canonical(LEGAL_LANGUAGES[language](page)),
    hreflangs({
      en: LEGAL_LANGUAGES.en(page),
      fr: LEGAL_LANGUAGES.fr(page),
      "x-default": LEGAL_LANGUAGES.en(page),
    }),
    noPrefetchOfRewrittenLinks(),
  ];
}
/** Page de jeu : langue, canonique, hreflang réciproques, une seule og:image qui répond en PNG. */
function gamePageExpectations(language, slugs, resolve) {
  const urls = {
    en: `${APEX}/cerebrum/${slugs.en}`,
    fr: `${APEX}/fr/cerebrum/${slugs.fr}`,
  };
  return [
    contentType("text/html"),
    htmlLang(language),
    canonical(urls[language]),
    hreflangs({ ...urls, "x-default": urls.en }),
    singleOgImage(resolve),
    noPrefetchOfRewrittenLinks(),
  ];
}
/** Page de section : même schéma de langue que les pages jeux, une seule og:image qui répond. */
function sectionPageExpectations(language, slugs, resolve) {
  const urls = {
    en: `${APEX}/${slugs.en}`,
    fr: `${APEX}/fr/${slugs.fr}`,
  };
  return [
    contentType("text/html"),
    htmlLang(language),
    canonical(urls[language]),
    hreflangs({ ...urls, "x-default": urls.en }),
    singleOgImage(resolve),
    noPrefetchOfRewrittenLinks(),
  ];
}
/**
 * Exactement une balise `og:image` (les `og:image:width` et consorts n'en sont pas),
 * et son URL répond 200 `image/png` sans redirection. L'URL de la balise porte
 * l'origine publique : on n'en garde que le chemin pour interroger la base contrôlée.
 */
function singleOgImage(resolve) {
  return {
    describe: "une og:image, 200 image/png sans redirection",
    test: async (res) => {
      const tags = [
        ...res.body.matchAll(/<meta property="og:image" content="([^"]+)"\/>/g),
      ];
      if (tags.length !== 1) return `${tags.length} balise(s) og:image`;
      const { pathname, search } = new URL(tags[0][1], APEX);
      const image = await fetch(resolve(`${pathname}${search}`), {
        redirect: "manual",
        headers: baseHeaders(),
      });
      const type = image.headers.get("content-type") ?? "";
      if (image.status !== 200) return `og:image ${pathname} : ${image.status}`;
      if (!type.includes("image/png")) return `og:image type ${type}`;
      return null;
    },
  };
}
function htmlLang(language) {
  return bodyMatches(
    new RegExp(`<html[^>]*\\blang="${language}"`),
    `<html lang="${language}">`,
  );
}
function canonical(url) {
  return bodyIncludes(`<link rel="canonical" href="${url}"/>`);
}
function hreflangs(urls) {
  const expected = Object.entries(urls).map(
    ([language, url]) =>
      `<link rel="alternate" hrefLang="${language}" href="${url}"/>`,
  );
  return {
    describe: `hreflang ${Object.keys(urls).join("/")}`,
    test: (res) => {
      const missing = expected.filter((link) => !res.body.includes(link));
      return missing.length ? `absent : ${missing.join(" ")}` : null;
    },
  };
}

function status(code) {
  return {
    describe: `${code}`,
    test: (res) => (res.status === code ? null : `${res.status}`),
  };
}
function noLocation() {
  return {
    describe: "sans Location",
    test: (res) => (res.location ? `Location ${res.location}` : null),
  };
}
function location(expected) {
  return {
    describe: `→ ${expected}`,
    test: (res) =>
      res.location === expected ? null : `→ ${res.location ?? "(aucun)"}`,
  };
}
function contentType(fragment) {
  return {
    describe: `type ${fragment}`,
    test: (res) =>
      res.contentType.includes(fragment)
        ? null
        : `type ${res.contentType || "(aucun)"}`,
  };
}
function header(key, value) {
  return {
    describe: `${key}: ${value}`,
    test: (res) => {
      const observed = res.headers.get(key);
      return observed === value ? null : `${key}: ${observed ?? "(absent)"}`;
    },
  };
}
function bodyIncludes(fragment) {
  return {
    describe: `contient ${fragment}`,
    test: (res) => (res.body.includes(fragment) ? null : `${fragment} absent`),
  };
}
/** Au plus un `<title>` dans le HTML servi : un second est ignoré par les navigateurs et invalide le document. */
function singleTitle(text) {
  return {
    describe: text
      ? `un seul <title> : ${text}`
      : "au plus un <title> dans le HTML servi",
    test: (res) => {
      const titles = [...res.body.matchAll(/<title>([^<]*)<\/title>/g)].map(
        (match) => match[1],
      );
      if (titles.length > 1)
        return `${titles.length} <title> : ${titles.join(" / ")}`;
      if (text && titles[0] !== text)
        return `<title> observé : ${titles[0] ?? "aucun"}`;
      return null;
    },
  };
}
/**
 * Aucun `next/link` vers un chemin d'un seul segment (`/privacy`, `/about`...) ne se
 * précharge. Depuis une page `/fr/...` ou `/privacy`, le routeur client prédit un tel
 * chemin comme l'accueil d'une locale, demande `/$d$locale/__PAGE__` que le proxy a
 * réécrit ailleurs, et reçoit un 404 (console en erreur, préchargement perdu). Le
 * HTML serveur embarque les props de chaque lien dans la charge utile RSC :
 * `"href":"/privacy","prefetch":false`. Un lien sans `"prefetch":false` y est la
 * régression. Les chemins `/fr` (une locale) et `/cerebrum` (dossier statique) sont
 * bien prédits : même règle que src/lib/link-prefetch.ts. Les liens des composants
 * client (sélecteur de langue, bandeau) n'y figurent pas : un test vitest garantit
 * qu'ils passent tous par le même composant.
 */
function noPrefetchOfRewrittenLinks() {
  const PREDICTED_RIGHT = new Set(["fr", "en", "cerebrum"]);
  return {
    describe: "aucun lien d'un seul segment ne se précharge (prefetch false)",
    test: (res) => {
      const offenders = [
        ...res.body.matchAll(
          /\\"href\\":\\"(\/[^"\\/?#]+)[^"\\]*\\",\\"prefetch\\":([^,}]+)/g,
        ),
      ]
        .filter(
          ([, path, prefetch]) =>
            !PREDICTED_RIGHT.has(path.slice(1)) && prefetch !== "false",
        )
        .map(([, path]) => path);
      return offenders.length === 0
        ? null
        : `liens préchargés : ${[...new Set(offenders)].join(", ")}`;
    },
  };
}
function bodyMatches(pattern, description = `${pattern}`) {
  return {
    describe: description,
    test: (res) => (pattern.test(res.body) ? null : `${description} : non`),
  };
}
function bodyExcludes(pattern, description) {
  return {
    describe: description,
    test: (res) => (pattern.test(res.body) ? `${description} : non` : null),
  };
}
function bodyIsJson() {
  return {
    describe: "JSON valide",
    test: (res) => {
      try {
        JSON.parse(res.body);
        return null;
      } catch (error) {
        return `JSON invalide (${error.message})`;
      }
    },
  };
}
function locCount(expected) {
  return {
    describe: `${expected} <loc>`,
    test: (res) => {
      const count = (res.body.match(/<loc>/g) ?? []).length;
      return count === expected ? null : `${count} <loc>`;
    },
  };
}

// --- exécution ------------------------------------------------------------

async function fetchContract(base, check) {
  const url = new URL(check.path, base);
  const response = await fetch(url, {
    redirect: "manual",
    headers: {
      ...baseHeaders(),
      ...(check.userAgent ? { "user-agent": check.userAgent } : {}),
      ...(check.acceptLanguage
        ? { "accept-language": check.acceptLanguage }
        : {}),
    },
  });
  const rawLocation = response.headers.get("location");
  return {
    status: response.status,
    headers: response.headers,
    contentType: response.headers.get("content-type") ?? "",
    // Next renvoie un Location relatif en local, Vercel un Location absolu.
    location: rawLocation ? new URL(rawLocation, url).href : null,
    body: await response.text(),
  };
}

async function runCheck(base, check) {
  const label = `${new URL(base).host}${check.label ?? check.path}`;
  const expected = check.expect.map((e) => e.describe).join(", ");
  try {
    const res = await fetchContract(base, check);
    const failures = (
      await Promise.all(check.expect.map((e) => e.test(res)))
    ).filter((f) => f !== null);
    return {
      label,
      expected,
      observed: failures.join(", ") || "conforme",
      ok: !failures.length,
    };
  } catch (error) {
    return {
      label,
      expected,
      observed: `erreur réseau : ${error.message}`,
      ok: false,
    };
  }
}

function printTable(rows) {
  const width = (key) => Math.max(...rows.map((row) => row[key].length));
  const labelWidth = width("label");
  for (const row of rows) {
    const verdict = row.ok ? "OK  " : "FAIL";
    console.log(`${verdict}  ${row.label.padEnd(labelWidth)}  ${row.expected}`);
    if (!row.ok)
      console.log(`      ${"".padEnd(labelWidth)}  observé : ${row.observed}`);
  }
}

/**
 * Chaque <loc> du sitemap doit répondre 200 : une page sitemapée avant d'être
 * livrée (ou une URL redirigée) est une régression d'indexation. Les <loc> sont
 * toujours en https://synapgeek.com ; on ne garde que le chemin pour interroger
 * la base contrôlée (local, preview ou production).
 */
async function sitemapChecks(base) {
  const label = `${new URL(base).host}/sitemap.xml`;
  let res;
  try {
    res = await fetchContract(base, { path: "/sitemap.xml" });
  } catch (error) {
    // Un réseau en panne ne doit pas masquer le tableau déjà calculé : l'écart est une ligne de plus.
    return [
      {
        label,
        expected: "sitemap lisible",
        observed: `erreur réseau : ${error.message}`,
        ok: false,
      },
    ];
  }
  const locs = [...res.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  if (!locs.length) {
    return [
      {
        label,
        expected: "au moins un <loc>",
        observed: "aucun <loc>",
        ok: false,
      },
    ];
  }
  const forbidden = locs
    .map((loc) => new URL(loc).pathname)
    .filter((pathname) => SITEMAP_FORBIDDEN.some((re) => re.test(pathname)));
  const exclusion = {
    label,
    expected: "aucun /en/<page>, /fr/<légale>, alias ni route /cerebrum/play",
    observed: forbidden.join(", ") || "conforme",
    ok: !forbidden.length,
  };
  const rows = await Promise.all(
    locs.map((loc) => {
      const { pathname, search } = new URL(loc);
      return runCheck(base, {
        path: `${pathname}${search}`,
        label: `${pathname} (sitemap)`,
        expect: [status(200), noLocation()],
      });
    }),
  );
  return [exclusion, ...rows];
}

async function main() {
  const [baseArgument] = process.argv.slice(2);
  const targets = [];
  const skipped = [];

  if (baseArgument) {
    const base = new URL(baseArgument).origin;
    const contract = contractChecks(base);
    targets.push(...contract.checks.map((check) => [base, check]));
    skipped.push(...contract.skipped, "hôte www (base unique)");
  } else {
    targets.push(...contractChecks(APEX).checks.map((check) => [APEX, check]));
    targets.push(...wwwChecks().map((check) => [WWW, check]));
  }

  const rows = await Promise.all(
    targets.map(([base, check]) => runCheck(base, check)),
  );
  const sitemapBase = baseArgument ? new URL(baseArgument).origin : APEX;
  rows.push(...(await sitemapChecks(sitemapBase)));
  printTable(rows);
  for (const reason of skipped) console.log(`SKIP  ${reason}`);

  const failed = rows.filter((row) => !row.ok).length;
  console.log(
    `\n${rows.length - failed}/${rows.length} conformes, ${failed} écart(s).`,
  );
  if (failed) process.exitCode = 1;
}

await main();
