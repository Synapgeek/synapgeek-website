/**
 * Choix des URLs que `indexnow-ping.mjs` envoie à IndexNow, sans aucune
 * entrée-sortie (testé par `src/lib/indexnow-selection.test.ts`).
 *
 * IndexNow ne veut que les URLs qui ont changé : ajoutées, modifiées, déplacées
 * ou retirées (consigne 4 de Bing : « Use IndexNow to notify Bing when: URLs are
 * added, Content is updated, URLs are removed »). Le sitemap entier ne part donc
 * que sur demande explicite (`--all`), jamais par défaut.
 */

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_LENGTH = "AAAA-MM-JJ".length;

/**
 * Lit la ligne de commande. `--all` exclut tout autre critère : combiné, il
 * élargirait en silence à tout le sitemap. Un autre sitemap que celui de
 * production ne sert qu'à répéter : ses lastmod sont ceux d'un build qui n'est
 * pas en ligne, et un envoi préviendrait Bing de pages pas encore publiées.
 * `--dry-run` y est donc obligatoire.
 * @param {string[]} argv
 * @param {string} productionSitemap
 * @returns {{ dryRun: boolean, all: boolean, since: string | null, sitemap: string, targets: string[], allowOutsideSitemap: boolean }}
 */
export function parseArgs(argv, productionSitemap) {
  /** @type {{ dryRun: boolean, all: boolean, since: string | null, sitemap: string, targets: string[], allowOutsideSitemap: boolean }} */
  const options = {
    dryRun: false,
    all: false,
    since: null,
    sitemap: productionSitemap,
    targets: [],
    allowOutsideSitemap: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    /** La valeur d'une option, jamais l'option suivante (`--since --dry-run`). */
    const value = () => {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        throw new Error(`${arg} attend une valeur.`);
      }
      i += 1;
      return next;
    };
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--all") options.all = true;
    else if (arg === "--outside-sitemap") options.allowOutsideSitemap = true;
    else if (arg === "--since") options.since = value();
    else if (arg === "--sitemap") options.sitemap = value();
    else if (!arg.startsWith("--")) options.targets.push(arg);
    else throw new Error(`Argument inconnu : ${arg}`);
  }
  if (options.all && (options.since !== null || options.targets.length > 0)) {
    throw new Error("--all exclut tout autre critère (chemins, --since).");
  }
  if (options.sitemap !== productionSitemap && !options.dryRun) {
    throw new Error(
      `${options.sitemap} n'est pas le sitemap de production : une répétition se lance avec --dry-run.`,
    );
  }
  return options;
}

/**
 * Les `<url>` du sitemap, chacune avec SON `<loc>` et SON `<lastmod>` (les
 * alternates hreflang sont des `<xhtml:link>` et ne comptent pas).
 * @param {string} xml
 * @returns {{ loc: string, lastmod: string | null }[]}
 */
export function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
    if (!loc)
      throw new Error(`<url> sans <loc> : ${block.trim().slice(0, 120)}`);
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim();
    return { loc, lastmod: lastmod ?? null };
  });
}

/**
 * Un chemin (`/press`) ou une URL dont l'origine est exactement `origin`,
 * écrit comme le sitemap : sans barre finale, la racine sans `/`. Tout le reste
 * est refusé (autre hôte, `www`, `http:`, paramètre, fragment) : une seule URL
 * étrangère ferait rejeter tout le lot.
 * @param {string} input
 * @param {string} origin
 * @returns {string}
 */
export function resolveTarget(input, origin) {
  if (/[?#]/.test(input)) {
    throw new Error(`Ni paramètre ni fragment : ${input}`);
  }
  if (!input.startsWith("/") && !/^https?:\/\//.test(input)) {
    throw new Error(`Ni chemin ni URL : ${input}`);
  }
  const url = new URL(input, origin);
  if (url.origin !== origin) {
    throw new Error(`URL hors de ${origin} : ${input}`);
  }
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

/**
 * Vrai pour une date calendaire AAAA-MM-JJ qui existe (pas de 2026-02-30).
 * @param {string} value
 */
function isCalendarDate(value) {
  if (!DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/**
 * Les URLs à envoyer, dédupliquées : les chemins donnés, puis les `<url>` du
 * sitemap retenues par `since` (lastmod à cette date ou après, en dates
 * calendaires) ou par `all`. Un chemin donné absent du sitemap est une URL
 * déplacée ou retirée, ou une faute de frappe : il n'est accepté qu'avec
 * `allowOutsideSitemap`, et `outsideSitemap` le liste. Sans critère, ou si rien
 * n'est retenu, rien ne part.
 * @param {{
 *   origin: string,
 *   entries: { loc: string, lastmod: string | null }[],
 *   targets?: string[],
 *   since?: string | null,
 *   all?: boolean,
 *   allowOutsideSitemap?: boolean,
 * }} selection
 * @returns {{ urls: string[], outsideSitemap: string[] }}
 */
export function selectUrls({
  origin,
  entries,
  targets = [],
  since = null,
  all = false,
  allowOutsideSitemap = false,
}) {
  if (targets.length === 0 && since === null && !all) {
    throw new Error(
      "Rien à envoyer : donner des chemins, --since AAAA-MM-JJ ou --all.",
    );
  }
  if (since !== null && !isCalendarDate(since)) {
    throw new Error(
      `--since attend une date AAAA-MM-JJ qui existe, reçu : ${since}`,
    );
  }
  const undated = entries.filter(({ lastmod }) => lastmod === null);
  if (since !== null && undated.length > 0) {
    throw new Error(
      `<url> sans <lastmod>, --since ne peut pas trancher : ${undated.map(({ loc }) => loc).join(", ")}`,
    );
  }

  const explicit = targets.map((target) => resolveTarget(target, origin));
  const fromSitemap = entries
    .filter(
      ({ lastmod }) =>
        all ||
        (since !== null &&
          lastmod !== null &&
          lastmod.slice(0, DATE_LENGTH) >= since),
    )
    .map(({ loc }) => resolveTarget(loc, origin));
  const urls = [...new Set([...explicit, ...fromSitemap])];
  if (urls.length === 0) {
    throw new Error(
      all
        ? "Le sitemap ne contient aucune <url>."
        : `Aucune URL du sitemap n'a un lastmod au ${since} ou après.`,
    );
  }
  const known = new Set(entries.map(({ loc }) => resolveTarget(loc, origin)));
  const outsideSitemap = [...new Set(explicit)].filter(
    (url) => !known.has(url),
  );
  if (outsideSitemap.length > 0 && !allowOutsideSitemap) {
    throw new Error(
      `Hors sitemap : ${outsideSitemap.join(", ")}. Une URL déplacée ou retirée s'envoie avec --outside-sitemap.`,
    );
  }
  return { urls, outsideSitemap };
}
