import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getDictionary } from "@/content";
import { getGames, type GameEntry, type GameId } from "@/content/apps";
import { REGISTERED_COPY } from "@/content/copy";
import type {
  AppCopy,
  CopyEntry,
  GameCopy,
  HubCopy,
} from "@/content/copy/types";
import { LOCALES } from "@/lib/i18n";

/**
 * Gardes éditoriales (spec §9, `.superpowers/.../copy-rules.md`).
 *
 * Deux étages. Les gardes sont des fonctions pures sur un `CopyEntry`; le
 * premier étage les applique à chaque module ENREGISTRÉ dans `REGISTERED_COPY`
 * (vide tant qu'aucun module n'est livré : la boucle tourne sur zéro entrée);
 * le second les applique à des modules fabriqués, un cas fautif par règle, pour
 * prouver que chaque garde mord. Sans le second étage, un registre vide
 * rendrait tout le fichier vacuement vert.
 */

// ---------------------------------------------------------------------------
// Règles de texte
// ---------------------------------------------------------------------------

/**
 * `\b` de JavaScript ne reconnaît que l'ASCII : « éducatif » ou « Élite »
 * échapperait à une règle ancrée par `\b`. Les bornes sont donc Unicode.
 */
const word = (body: string, flags = "iu") =>
  new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}])`, flags);

const FORBIDDEN: ReadonlyArray<{
  pattern: RegExp;
  reason: string;
  hits: readonly string[];
  misses: readonly string[];
}> = [
  {
    pattern: word("(six|dix|ten|10|6)\\s+(jeux|games|puzzles?)"),
    reason: "no number of games",
    hits: ["Ten games in one app", "10 jeux", "six jeux", "6 puzzles"],
    misses: ["games for everyone", "Sudoku games", "dix minutes"],
  },
  {
    pattern: word("\\d[\\d\\s]*\\s*(niveaux|levels|grilles|puzzles)"),
    reason: "no number of levels or puzzles",
    hits: [
      "100 niveaux",
      "1 000 puzzles",
      "3 grilles",
      "12 levels",
      "1 000 levels",
    ],
    misses: ["trois grilles", "levels of difficulty", "Niveaux de difficulté"],
  },
  {
    pattern: word(
      "(un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|douze|vingt|cent|mille|one|two|three|four|five|seven|eight|nine|ten|twelve|twenty|hundred|thousand)\\s+(?:\\p{L}+\\s+)?(niveaux|levels)",
    ),
    reason: "no number of levels, even spelled out",
    hits: [
      "deux niveaux Moyen",
      "quatre niveaux Difficile terminés",
      "two Medium levels",
      "four Hard levels",
      "Three levels",
    ],
    misses: [
      "levels of difficulty",
      "Niveaux de difficulté",
      "one level at a time",
      "progress through Medium",
    ],
  },
  {
    pattern: /—/u,
    reason: "no em dash in visible copy",
    hits: ["Cerebrum — puzzles", "a—b"],
    misses: ["Cerebrum - puzzles", "a–b"],
  },
  {
    pattern: word("sans pub|ad-free|no ads"),
    reason: "say no forced ads, never ad-free",
    hits: ["Sans pub", "ad-free", "No ads", "Jouez SANS PUB."],
    misses: ["zéro pub imposée", "no forced ads", "sans publicité imposée"],
  },
  {
    pattern: word("zip|queens|picross"),
    reason: "never Zip, Queens, Picross",
    hits: ["Zip", "queens", "Picross"],
    misses: ["zipper", "Queensland"],
  },
  {
    pattern: word(
      "enfants?|kids?|children|famille|family|éducatif|educational|pour les petits",
    ),
    reason: "never address children or families",
    hits: [
      "pour les enfants",
      "kids",
      "En famille",
      "éducatif",
      "Educational",
      "pour les petits",
      "ÉDUCATIF",
    ],
    misses: ["kidney", "familiar", "childhood", "enfantin"],
  },
  {
    pattern: word("classements?|leaderboards?"),
    reason: "leaderboards are hidden in 3.0.0",
    hits: ["Classement", "classements", "leaderboards", "Leaderboard"],
    misses: ["classic", "déclassement"],
  },
  {
    pattern: new RegExp(
      "€|\\$|(?<![\\p{L}\\p{N}])(?:USD|EUR)(?![\\p{L}\\p{N}])",
      "u",
    ),
    reason: "no price",
    hits: ["1,99 €", "$0.99", "5 USD", "9 EUR"],
    misses: ["Europe", "Eurostar", "eur"],
  },
];

const ANDROID = word("android");

/**
 * Ruling R5 : sujets de l'app entière. Une page jeu n'en parle pas (sauf dans
 * sa phrase de définition et ses balises `meta`) ; le modèle économique est
 * porté une fois, par le gabarit de page, et le reste par la page de l'app.
 */
const APP_WIDE_TOPICS: ReadonlyArray<{
  topic: string;
  pattern: RegExp;
  hits: readonly string[];
  misses: readonly string[];
}> = [
  {
    topic: "Premium",
    pattern: word("premium"),
    hits: ["With Premium", "Avec PREMIUM, les vies"],
    misses: ["premiumish"],
  },
  {
    topic: "App Store",
    pattern: word("app\\s+store"),
    hits: ["on the App Store", "dans l'app store"],
    misses: ["an app that stores data", "App Storey"],
  },
  {
    topic: "Google Play",
    pattern: word("google\\s+play"),
    hits: ["Google Play", "sur google play"],
    misses: ["Google Playground"],
  },
  {
    topic: "iPhone",
    pattern: word("iphones?"),
    hits: ["On iPhone and iPad", "sur iPhone"],
    misses: ["a phone", "téléphone"],
  },
  {
    topic: "iPad",
    pattern: word("ipads?"),
    hits: ["iPad", "sur iPad"],
    misses: ["a pad of digits", "le pavé"],
  },
  {
    topic: "Android",
    pattern: ANDROID,
    hits: ["Android 8.0", "sur android"],
    misses: ["Androids dream"],
  },
  {
    topic: "free",
    pattern: word("free|gratuit(?:e|s|es|ement)?"),
    hits: ["Is it free?", "Free to play", "Est-il gratuit ?", "gratuites"],
    misses: ["freely", "gratuité", "a freeze"],
  },
  {
    topic: "offline",
    pattern: word("offline|hors[\\s-]ligne"),
    hits: ["Works offline", "Hors ligne", "hors-ligne"],
    misses: ["in line", "online"],
  },
  {
    topic: "ads",
    pattern: word("ads?|pubs?|publicit(?:é|és|e)"),
    hits: [
      "an optional ad",
      "ads between games",
      "une pub facultative",
      "pubs",
    ],
    misses: ["add", "pubic", "ladder"],
  },
  {
    topic: "subscription",
    pattern: word("subscriptions?|abonnements?"),
    hits: ["a subscription", "l'abonnement Premium"],
    misses: ["describe"],
  },
  {
    topic: "languages",
    pattern: word("languages?|langues?"),
    hits: ["16 languages", "Quelles langues ?", "la langue"],
    misses: ["languid", "languette"],
  },
];

/** Chemins d'une copie de jeu que R5 ne contrôle pas : la définition (formule des règles de copie) et les balises `meta`. */
const APP_WIDE_EXEMPT_PATH = /^(hero\.definition|meta\..*)$/;
/**
 * Exceptions R5, par jeu et par sujet : une page jeu dont le contenu même
 * dépend du sujet. Chaque entrée se justifie par `why`, et `entryViolations`
 * échoue si une entrée ne sert plus.
 */
const APP_WIDE_ALLOWLIST: ReadonlyArray<{
  game: GameId;
  topics: readonly string[];
  why: string;
}> = [
  {
    game: "arrow-maze",
    topics: ["free"],
    // « Free piece » est le terme du jeu pour une flèche que rien ne bloque.
    why: "a free piece is Arrow Maze's own term for an unblocked arrow",
  },
  {
    game: "crossword",
    topics: ["languages"],
    // Les grilles n'existent qu'en français et en anglais, et le jeu est masqué
    // dans les autres langues de l'app : nommer ces deux langues est le contenu.
    why: "Crossword grids exist in French and English only, and the game is hidden in other interface languages",
  },
  {
    game: "word-search",
    topics: ["languages"],
    // Les grilles n'existent qu'en français et en anglais, et le jeu est masqué
    // dans les autres langues de l'app : nommer ces deux langues est le contenu.
    why: "Word Search grids exist in French and English only, and the game is hidden in other interface languages",
  },
  {
    game: "pixel-art",
    topics: ["languages"],
    // Le nom du dessin dévoilé à la victoire suit la langue de l'interface.
    why: "the revealed drawing's name follows the interface language",
  },
];

// ---------------------------------------------------------------------------
// Gardes pures
// ---------------------------------------------------------------------------

const DEFINITION_LENGTH = { min: 150, max: 250 } as const;
const META_DESCRIPTION_MAX = 155;
const GAME_SECTION_COUNTS = {
  steps: { min: 3, max: 6 },
  tips: { min: 3, max: 5 },
  faq: { min: 3, max: 6 },
} as const;
/** Tableaux dont la longueur doit être identique en FR et en EN ; les autres sont libres (le français est écrit, pas traduit). */
const COUNTED_ARRAY_PATH = /(^|\.)(faq\.items|howToPlay\.steps|tips\.items)$/;

interface Located<T> {
  path: string;
  value: T;
}

function stringsOf(
  value: unknown,
  path: string[] = [],
): Array<Located<string>> {
  if (typeof value === "string") return [{ path: path.join("."), value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      stringsOf(item, [...path, String(index)]),
    );
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      stringsOf(child, [...path, key]),
    );
  }
  return [];
}

const labelOf = (entry: CopyEntry) =>
  [entry.kind, entry.kind === "app" ? entry.app : null, entry.locale]
    .filter(Boolean)
    .join(":");

/** Les jeux d'une copie d'app, sans les emplacements vides du `Partial`. */
function gamesOf(entry: CopyEntry): Array<[GameId, GameCopy]> {
  if (entry.kind !== "app") return [];
  return (Object.keys(entry.copy.games) as GameId[]).flatMap((id) => {
    const copy = entry.copy.games[id];
    return copy ? [[id, copy] as [GameId, GameCopy]] : [];
  });
}

/** Les pages du module : lui-même, puis chacun de ses jeux. */
function pagesOf(entry: CopyEntry): Array<{
  label: string;
  page: { meta: { description: string }; hero: { definition: string } };
}> {
  return [
    { label: labelOf(entry), page: entry.copy },
    ...gamesOf(entry).map(([id, copy]) => ({
      label: `${labelOf(entry)}:${id}`,
      page: copy,
    })),
  ];
}

function forbiddenViolations(entry: CopyEntry): string[] {
  return stringsOf(entry.copy).flatMap(({ path, value }) =>
    FORBIDDEN.filter(({ pattern }) => pattern.test(value)).map(
      ({ reason }) =>
        `${labelOf(entry)} ${path}: ${reason} (${JSON.stringify(value.slice(0, 60))})`,
    ),
  );
}

function lengthViolations(entry: CopyEntry): string[] {
  return pagesOf(entry).flatMap(({ label, page }) => {
    const found: string[] = [];
    const definition = page.hero.definition.length;
    if (
      definition < DEFINITION_LENGTH.min ||
      definition > DEFINITION_LENGTH.max
    ) {
      found.push(
        `${label}: definition is ${definition} characters, expected ${DEFINITION_LENGTH.min} to ${DEFINITION_LENGTH.max}`,
      );
    }
    const description = page.meta.description.length;
    if (description > META_DESCRIPTION_MAX) {
      found.push(
        `${label}: meta.description is ${description} characters, expected at most ${META_DESCRIPTION_MAX}`,
      );
    }
    return found;
  });
}

/** Chaque jeu maison (`genre` non nul) cite son genre dans sa propre définition. */
function genreViolations(
  entry: CopyEntry,
  games: readonly GameEntry[],
): string[] {
  return gamesOf(entry).flatMap(([id, copy]) => {
    const genre = games.find((game) => game.id === id)?.genre[entry.locale];
    if (!genre) return [];
    // « nonogrammes (logimages) » : l'incise est un synonyme facultatif.
    const core = genre.replace(/\s*\(.*?\)/g, "");
    const normalize = (text: string) => text.replace(/\s+/g, " ").toLowerCase();
    return normalize(copy.hero.definition).includes(normalize(core))
      ? []
      : [`${labelOf(entry)}:${id}: definition must name its genre "${core}"`];
  });
}

/**
 * Règle 2 sur la page d'accueil : toute chaîne du hub qui nomme un jeu maison
 * (`genre` non nul) cite aussi son genre. Le hub n'a pas de `definition` par
 * jeu : `genreViolations` ne le voit pas.
 */
function hubMentionGenreViolations(
  entry: CopyEntry,
  games: readonly GameEntry[],
): string[] {
  if (entry.kind !== "hub") return [];
  const normalize = (text: string) => text.replace(/\s+/g, " ").toLowerCase();
  return stringsOf(entry.copy).flatMap(({ path, value }) =>
    games.flatMap((game) => {
      const genre = game.genre[entry.locale];
      if (!genre) return [];
      const name = game.name[entry.locale].replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const mentioned = new RegExp(`(?<!\\p{L})${name}(?!\\p{L})`, "u");
      const core = genre.replace(/\s*\(.*?\)/g, "");
      return mentioned.test(value) &&
        !normalize(value).includes(normalize(core))
        ? [
            `${labelOf(entry)} ${path}: names "${game.name[entry.locale]}" without its genre "${core}"`,
          ]
        : [];
    }),
  );
}

/**
 * L'encart d'une app à l'accueil dit en une phrase ce qu'elle est : les trois
 * plateformes et le modèle (gratuite au téléchargement). Sans cela, un visiteur ou
 * un assistant ne sait pas où l'app existe ni ce qu'elle coûte.
 */
function hubAppDescriptionViolations(entry: CopyEntry): string[] {
  if (entry.kind !== "hub") return [];
  const free = entry.locale === "fr" ? /gratuit/i : /\bfree\b/i;
  return Object.entries(entry.copy.apps.items).flatMap(([slug, item]) => [
    ...["iPhone", "iPad", "Android"]
      .filter((platform) => !item.description.includes(platform))
      .map(
        (platform) =>
          `${labelOf(entry)} apps.items.${slug}.description: must name ${platform}`,
      ),
    ...(free.test(item.description)
      ? []
      : [
          `${labelOf(entry)} apps.items.${slug}.description: must say the app is free`,
        ]),
  ]);
}

/** Un jeu absent d'Android (`availability.android` nul) ne mentionne jamais Android. */
function androidViolations(
  entry: CopyEntry,
  games: readonly GameEntry[],
): string[] {
  return gamesOf(entry).flatMap(([id, copy]) => {
    const game = games.find((candidate) => candidate.id === id);
    if (game?.availability.android !== null) return [];
    return stringsOf(copy)
      .filter(({ value }) => ANDROID.test(value))
      .map(
        ({ path }) =>
          `${labelOf(entry)}:${id} ${path}: mentions Android but the game is not on Android`,
      );
  });
}

function isInRange(count: number, range: { min: number; max: number }) {
  return count >= range.min && count <= range.max;
}

function shapeViolations(
  entry: CopyEntry,
  games: readonly GameEntry[],
): string[] {
  return gamesOf(entry).flatMap(([id, copy]) => {
    const label = `${labelOf(entry)}:${id}`;
    const found: string[] = [];
    const counts = [
      ["steps", copy.howToPlay.steps.length],
      ["tips", copy.tips.items.length],
      ["faq", copy.faq.items.length],
    ] as const;
    for (const [name, count] of counts) {
      if (!isInRange(count, GAME_SECTION_COUNTS[name])) {
        const { min, max } = GAME_SECTION_COUNTS[name];
        found.push(`${label}: ${count} ${name}, expected ${min} to ${max}`);
      }
    }
    const known = games.find((game) => game.id === id)?.difficulties ?? [];
    for (const { difficulty } of copy.whatCerebrumAdds.difficultyTable.rows) {
      if (!known.includes(difficulty)) {
        found.push(`${label}: the game has no "${difficulty}" difficulty`);
      }
    }
    return found;
  });
}

/** Chaque jeu publié du registre a sa copie, dans chaque langue où la copie de l'app existe. */
function coverageViolations(
  entry: CopyEntry,
  games: readonly GameEntry[],
): string[] {
  if (entry.kind !== "app") return [];
  const missing = games
    .filter((game) => game.published && !(game.id in entry.copy.games))
    .map(
      (game) => `${labelOf(entry)}: published game "${game.id}" has no copy`,
    );
  // Une copie dont l'identifiant n'est pas au registre : les gardes qui lisent le
  // registre (genre, plateforme, quasi-doublons) ne la verraient pas.
  const orphans = gamesOf(entry)
    .filter(([id]) => !games.some((game) => game.id === id))
    .map(
      ([id]) =>
        `${labelOf(entry)}:${id}: copy for a game that is not in the registry`,
    );
  return [...missing, ...orphans];
}

/** Différences de structure : mêmes clés partout, mêmes longueurs sur les tableaux comptés. */
function shapeDiffs(a: unknown, b: unknown, path: string[] = []): string[] {
  const here = path.join(".") || "(root)";
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b))
      return [`${here}: array vs not`];
    const diffs =
      COUNTED_ARRAY_PATH.test(path.join(".")) && a.length !== b.length
        ? [`${here}: ${a.length} items vs ${b.length}`]
        : [];
    const shared = Math.min(a.length, b.length);
    for (let index = 0; index < shared; index += 1) {
      diffs.push(...shapeDiffs(a[index], b[index], [...path, String(index)]));
    }
    return diffs;
  }
  const isObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === "object";
  if (isObject(a) || isObject(b)) {
    if (!isObject(a) || !isObject(b)) return [`${here}: object vs not`];
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].flatMap((key) => {
      if (!(key in a))
        return [`${[...path, key].join(".")}: missing on the left`];
      if (!(key in b))
        return [`${[...path, key].join(".")}: missing on the right`];
      return shapeDiffs(a[key], b[key], [...path, key]);
    });
  }
  return typeof a === typeof b ? [] : [`${here}: ${typeof a} vs ${typeof b}`];
}

/** Même module, toutes les langues, même structure. */
function parityViolations(entries: readonly CopyEntry[]): string[] {
  const groups = Map.groupBy(entries, (entry) =>
    entry.kind === "app" ? `app:${entry.app}` : entry.kind,
  );
  return [...groups].flatMap(([group, members]) => {
    const missing = LOCALES.filter(
      (locale) => !members.some((member) => member.locale === locale),
    ).map((locale) => `${group}: no ${locale} module`);
    const reference = members.find((member) => member.locale === LOCALES[0]);
    if (!reference) return missing;
    const diffs = members
      .filter((member) => member !== reference)
      .flatMap((member) =>
        shapeDiffs(reference.copy, member.copy).map(
          (diff) => `${group} ${LOCALES[0]} vs ${member.locale}: ${diff}`,
        ),
      );
    return [...missing, ...diffs];
  });
}

/** Une phrase ou une proposition de cette longueur ou plus ne se répète pas d'une page jeu à l'autre (ruling R4). */
const REPEATED_CLAUSE_MIN_LENGTH = 60;
/**
 * Formules partagées voulues, et rien d'autre. Elles sont normalisées comme les
 * propositions mesurées (espaces simples, minuscules). Chaque entrée se justifie.
 */
const SHARED_SENTENCE_ALLOWLIST: readonly string[] = [
  // Fin imposée de la phrase de définition (copy-rules 1) : l'appareil, l'éditeur
  // et l'app doivent y figurer, et les assistants la citent à l'identique.
  "play it offline in cerebrum, the puzzle games app by synapgeek, on iphone, ipad and android.",
  "il se joue hors ligne dans cerebrum, l'app de synapgeek, sur iphone, ipad et android.",
  // Même formule au pluriel (Mots croisés, Mots mêlés).
  "ils se jouent hors ligne dans cerebrum, l'app de synapgeek, sur iphone, ipad et android.",
];

function normalizeSentence(sentence: string): string {
  return sentence.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Phrases, puis propositions : on coupe aussi sur `;` et sur les deux-points,
 * sinon une phrase recopiée avec une incise de plus échappe à la garde.
 */
const CLAUSE_BOUNDARY = /(?<=[.!?…])\s+|\s*;\s*|\s*:\s+/u;

function clausesOf(text: string): string[] {
  return text.split(CLAUSE_BOUNDARY).map(normalizeSentence).filter(Boolean);
}

function longClausesOf(text: string): string[] {
  return clausesOf(text).filter(
    (clause) => clause.length >= REPEATED_CLAUSE_MIN_LENGTH,
  );
}

/**
 * Ruling R4 : un fait de l'app ne se répète pas à l'identique de page en page.
 * Signale une phrase ou une proposition longue présente deux fois dans une
 * page, ou dans deux pages jeux de la même langue.
 */
function repeatedSentenceViolations(
  pages: ReadonlyArray<{ label: string; copy: GameCopy }>,
  allowlist: readonly string[] = SHARED_SENTENCE_ALLOWLIST,
): string[] {
  const allowed = new Set(allowlist.map(normalizeSentence));
  const seen = new Map<string, string>();
  const found: string[] = [];
  for (const { label, copy } of pages) {
    for (const { path, value } of stringsOf(copy)) {
      for (const clause of longClausesOf(value)) {
        if (allowed.has(clause)) continue;
        const first = seen.get(clause);
        if (first === undefined) {
          seen.set(clause, `${label} ${path}`);
        } else {
          found.push(
            `${label} ${path}: sentence already used in ${first} (${JSON.stringify(clause.slice(0, 60))})`,
          );
        }
      }
    }
  }
  return found;
}

// ---------------------------------------------------------------------------
// Typographie française
// ---------------------------------------------------------------------------

/** Espace insécable ou fine insécable : les deux ferment une espace avant `: ; ? !` et à l'intérieur des guillemets. */
const NON_BREAKING_SPACE = /[\u00a0\u202f]/u;
/** Ponctuation haute : elle exige une espace insécable devant elle. */
const HIGH_PUNCTUATION = /[:;?!]/gu;
/** Adresses web et courriel : leurs `:`, `?` et `@` ne sont pas de la typographie. */
const LINK = /https?:\/\/\S+|\S+@\S+/gu;

/**
 * Règles de typographie française d'une chaîne : `: ; ? !` précédés d'une
 * espace insécable (jamais d'une espace simple ni collés au mot), `«` suivi et
 * `»` précédé d'une espace insécable. Exceptions : les adresses, les heures et
 * rapports du type 20:30 (deux-points entre deux chiffres), et les signes qui
 * suivent un autre signe haut (`?!`).
 */
function frenchTypographyProblems(text: string): string[] {
  const clean = text.replace(LINK, (link) => " ".repeat(link.length));
  const around = (index: number) =>
    JSON.stringify(clean.slice(Math.max(0, index - 20), index + 12).trim());
  const found: string[] = [];
  for (const { 0: sign, index } of clean.matchAll(HIGH_PUNCTUATION)) {
    const previous = clean[index - 1];
    if (previous === undefined || /[:;?!]/u.test(previous)) continue;
    if (
      sign === ":" &&
      /\d/u.test(previous) &&
      /\d/u.test(clean[index + 1] ?? "")
    ) {
      continue;
    }
    if (NON_BREAKING_SPACE.test(previous)) continue;
    found.push(
      `${previous === " " ? "plain space" : "no space"} before "${sign}" (${around(index)})`,
    );
  }
  for (const { 0: quote, index } of clean.matchAll(/[«»]/gu)) {
    const neighbour = quote === "«" ? clean[index + 1] : clean[index - 1];
    if (neighbour === undefined || NON_BREAKING_SPACE.test(neighbour)) continue;
    found.push(
      `${neighbour === " " ? "plain space" : "no space"} inside "${quote}" (${around(index)})`,
    );
  }
  return found;
}

/**
 * Portée : les modules français de `REGISTERED_COPY` (ici) et le Dictionnaire
 * `src/content/fr.ts`, qui n'est pas un module enregistré (test dédié, mêmes règles).
 */
function frenchTypographyViolations(entry: CopyEntry): string[] {
  if (entry.locale !== "fr") return [];
  return stringsOf(entry.copy).flatMap(({ path, value }) =>
    frenchTypographyProblems(value).map(
      (problem) => `${labelOf(entry)} ${path}: ${problem}`,
    ),
  );
}

// ---------------------------------------------------------------------------
// Quasi-doublons entre pages jeux
// ---------------------------------------------------------------------------

/** Une phrase de cette longueur ou plus est comparée aux phrases des autres pages jeux. */
const NEAR_DUPLICATE_MIN_LENGTH = 60;
/** Similarité de Jaccard sur les trigrammes de mots à partir de laquelle deux phrases sont des quasi-doublons. */
const NEAR_DUPLICATE_THRESHOLD = 0.6;
const GAME_NAME_PLACEHOLDER = "gamename";
/**
 * Formules partagées voulues, lues telles que la garde les compare (sans accent
 * ni ponctuation, nom du jeu remplacé par `gamename`). Elles reprennent les
 * formules exactes de la garde R4, plus la formule du titre : une seule entrée
 * de plus, parce que le nom du jeu est la seule chose qui varie dans le titre.
 */
const NEAR_DUPLICATE_ALLOWLIST: readonly string[] = [
  ...SHARED_SENTENCE_ALLOWLIST,
  // Formule du `<title>` anglais (copy-rules 12) : « <jeu> : how to play, tips and the Cerebrum app | Synapgeek ».
  "gamename: how to play, tips and the Cerebrum app | Synapgeek",
];

interface NearDuplicatePage {
  label: string;
  /** Tous les noms du jeu : nom dans l'app et slug, dans chaque langue. */
  names: readonly string[];
  copy: GameCopy;
}

/** Minuscules, sans accent, sans ponctuation : « Mots-Croisés ! » et « mots croises » se comparent égaux. */
function foldForComparison(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function replaceGameNames(text: string, names: readonly string[]): string {
  const folded = ` ${foldForComparison(text)} `;
  const longestFirst = names
    .map(foldForComparison)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  return longestFirst
    .reduce(
      (acc, name) => acc.replaceAll(` ${name} `, ` ${GAME_NAME_PLACEHOLDER} `),
      folded,
    )
    .trim();
}

function wordTrigrams(text: string): Set<string> {
  const words = text.split(" ").filter(Boolean);
  if (words.length < 3) return new Set([words.join(" ")]);
  return new Set(
    words.slice(0, -2).map((_, i) => words.slice(i, i + 3).join(" ")),
  );
}

function trigramSimilarity(a: string, b: string): number {
  const left = wordTrigrams(a);
  const right = wordTrigrams(b);
  const shared = [...left].filter((gram) => right.has(gram)).length;
  return shared / (left.size + right.size - shared);
}

/** Les phrases de 60+ caractères d'une page, avec le nom du jeu remplacé par un marqueur. */
function comparableSentencesOf(
  page: NearDuplicatePage,
): Array<{ path: string; folded: string }> {
  return stringsOf(page.copy).flatMap(({ path, value }) =>
    value
      .split(/(?<=[.!?…])\s+/u)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length >= NEAR_DUPLICATE_MIN_LENGTH)
      .map((sentence) => ({
        path,
        folded: replaceGameNames(sentence, page.names),
      })),
  );
}

/**
 * La garde R4 ne voit que les phrases identiques : recopier le passage d'un jeu
 * dans un autre en changeant son nom lui échappe. Ici chaque phrase de 60+
 * caractères est comparée à celles des autres pages jeux (jamais de la même),
 * après remplacement du nom propre à chaque jeu, et refusée à 0,6 de similarité.
 */
function nearDuplicateViolations(
  pages: readonly NearDuplicatePage[],
  allowlist: readonly string[] = NEAR_DUPLICATE_ALLOWLIST,
): string[] {
  const allowed = new Set(allowlist.map(foldForComparison));
  const sentences = pages.map((page) =>
    comparableSentencesOf(page).filter(({ folded }) => !allowed.has(folded)),
  );
  return pages.flatMap((page, i) =>
    pages.slice(0, i).flatMap((earlier, j) =>
      sentences[i].flatMap((mine) =>
        sentences[j].flatMap((theirs) => {
          const similarity = trigramSimilarity(mine.folded, theirs.folded);
          return similarity >= NEAR_DUPLICATE_THRESHOLD
            ? [
                `${page.label} ${mine.path}: ${similarity.toFixed(2)} similar to ${earlier.label} ${theirs.path} (${JSON.stringify(mine.folded.slice(0, 70))})`,
              ]
            : [];
        }),
      ),
    ),
  );
}

/** Les pages jeux d'une langue, chacune avec les noms que le jeu porte dans les deux langues et ses slugs. */
function nearDuplicatePagesOf(
  locale: string,
  entries: readonly CopyEntry[] = REGISTERED_COPY,
): NearDuplicatePage[] {
  const games = getGames("cerebrum");
  return entries.flatMap((entry) =>
    entry.locale === locale
      ? gamesOf(entry).map(([id, copy]) => {
          // Un identifiant hors registre n'a pas de noms à masquer : coverageViolations
          // le signale, cette comparaison ne doit pas planter avant.
          const game = games.find((candidate) => candidate.id === id);
          return {
            label: `${labelOf(entry)}:${id}`,
            names: game
              ? [...Object.values(game.name), ...Object.values(game.slug)]
              : [],
            copy,
          };
        })
      : [],
  );
}

/**
 * Ruling R5 : une page jeu ne parle que du jeu. Chaque chaîne de la copie d'un
 * jeu, hors définition et `meta`, est lue contre les sujets de l'app entière.
 */
function appWideTopicViolations(
  entry: CopyEntry,
  allowlist: typeof APP_WIDE_ALLOWLIST = APP_WIDE_ALLOWLIST,
): string[] {
  return gamesOf(entry).flatMap(([id, copy]) => {
    const allowedTopics = new Set(
      allowlist
        .filter(({ game }) => game === id)
        .flatMap(({ topics }) => topics),
    );
    return stringsOf(copy)
      .filter(({ path }) => !APP_WIDE_EXEMPT_PATH.test(path))
      .flatMap(({ path, value }) =>
        APP_WIDE_TOPICS.filter(
          ({ topic, pattern }) =>
            !allowedTopics.has(topic) && pattern.test(value),
        ).map(
          ({ topic }) =>
            `${labelOf(entry)}:${id} ${path}: app-wide topic "${topic}" belongs to the app page (${JSON.stringify(value.slice(0, 60))})`,
        ),
      );
  });
}

/** `games` remplace le registre pour prouver une garde sur une donnée que le registre n'a plus. */
function entryViolations(
  entry: CopyEntry,
  games: readonly GameEntry[] = entry.kind === "app" ? getGames(entry.app) : [],
): string[] {
  return [
    ...forbiddenViolations(entry),
    ...frenchTypographyViolations(entry),
    ...lengthViolations(entry),
    ...genreViolations(entry, games),
    ...hubMentionGenreViolations(entry, getGames("cerebrum")),
    ...hubAppDescriptionViolations(entry),
    ...androidViolations(entry, games),
    ...shapeViolations(entry, games),
    ...coverageViolations(entry, games),
    ...appWideTopicViolations(entry),
  ];
}

// ---------------------------------------------------------------------------
// Étage 1 : les modules enregistrés
// ---------------------------------------------------------------------------

describe("copie enregistrée (spec §9)", () => {
  it("chaque module respecte les règles de texte, de longueur, de genre et de plateforme", () => {
    expect(REGISTERED_COPY.flatMap((entry) => entryViolations(entry))).toEqual(
      [],
    );
  });

  it("aucune page jeu ne parle des sujets de l'app entière (ruling R5)", () => {
    expect(
      REGISTERED_COPY.flatMap((entry) => appWideTopicViolations(entry)),
    ).toEqual([]);
  });

  it("chaque module existe dans toutes les langues avec la même structure", () => {
    expect(parityViolations(REGISTERED_COPY)).toEqual([]);
  });

  it.each(LOCALES)(
    "aucune phrase longue ne se répète d'une page jeu à l'autre (%s, ruling R4)",
    (locale) => {
      const pages = REGISTERED_COPY.flatMap((entry) =>
        entry.locale === locale
          ? gamesOf(entry).map(([id, copy]) => ({
              label: `${labelOf(entry)}:${id}`,
              copy,
            }))
          : [],
      );
      expect(repeatedSentenceViolations(pages)).toEqual([]);
    },
  );

  it.each(LOCALES)(
    "aucune phrase d'une page jeu n'est le quasi-doublon d'une autre, au nom du jeu près (%s)",
    (locale) => {
      expect(nearDuplicateViolations(nearDuplicatePagesOf(locale))).toEqual([]);
    },
  );

  it("la typographie française est respectée dans tous les modules enregistrés", () => {
    expect(
      REGISTERED_COPY.flatMap((entry) => frenchTypographyViolations(entry)),
    ).toEqual([]);
  });

  it("la typographie française est respectée dans le Dictionnaire (src/content/fr.ts)", () => {
    // Le Dictionnaire (libellés communs, pages légales, formulaire) n'est pas dans
    // REGISTERED_COPY : sans cette garde, ses chaînes françaises échappent à la règle.
    const violations = stringsOf(getDictionary("fr")).flatMap(
      ({ path, value }) =>
        frenchTypographyProblems(value).map(
          (problem) => `dictionary:fr ${path}: ${problem}`,
        ),
    );
    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Étage 2 : contrôles positifs (chaque garde mord)
// ---------------------------------------------------------------------------

describe("contrôles positifs des règles de texte", () => {
  it.each(FORBIDDEN)(
    "$reason : attrape ses cas, laisse passer les autres",
    ({ pattern, hits, misses }) => {
      for (const text of hits) expect(pattern.test(text), text).toBe(true);
      for (const text of misses) expect(pattern.test(text), text).toBe(false);
    },
  );
});

describe("contrôles positifs des sujets de l'app entière (ruling R5)", () => {
  it.each(APP_WIDE_TOPICS)(
    "$topic : attrape ses cas, laisse passer les autres",
    ({ pattern, hits, misses }) => {
      for (const text of hits) expect(pattern.test(text), text).toBe(true);
      for (const text of misses) expect(pattern.test(text), text).toBe(false);
    },
  );
});

const DEFINITION_OK =
  "Pandoku is a Star Battle logic puzzle in Cerebrum, the offline puzzle games app by Synapgeek for iPhone and iPad: place pandas so each row, column and region holds one.";
const THREE_ITEMS = [1, 2, 3];

function fixtureGame(overrides: Partial<GameCopy> = {}): GameCopy {
  return {
    updatedAt: "2026-10-01",
    meta: { title: "Pandoku | Cerebrum", description: "Learn Pandoku." },
    hero: {
      h1: "Pandoku",
      definition: DEFINITION_OK,
      phoneAlt: "A screen.",
    },
    howToPlay: {
      title: "How to play",
      steps: THREE_ITEMS.map((n) => `Step ${n}`),
    },
    whatCerebrumAdds: {
      title: "What Cerebrum adds",
      paragraphs: ["A paragraph."],
      difficultyTable: {
        caption: "Difficulties",
        rows: [{ difficulty: "easy", detail: "Small grid." }],
      },
    },
    tips: {
      title: "Tips",
      items: THREE_ITEMS.map((n) => `Tip ${n}`),
    },
    faq: {
      title: "FAQ",
      items: THREE_ITEMS.map((n) => ({
        question: `Question ${n}?`,
        answer: `Answer ${n}.`,
      })),
    },
    ...overrides,
  };
}

function fixtureApp(
  locale: "en" | "fr",
  games: AppCopy["games"],
  overrides: Partial<AppCopy> = {},
): CopyEntry {
  return {
    kind: "app",
    app: "cerebrum",
    locale,
    copy: {
      updatedAt: "2026-10-01",
      meta: { title: "Cerebrum", description: "An app." },
      disambiguation: "Not the other one.",
      hero: {
        h1: "Cerebrum",
        definition: DEFINITION_OK,
        phoneAlt: "A screen.",
      },
      sections: {
        games: {
          title: "Games",
          categories: { "logic-numbers": "A", words: "B", paths: "C" },
        },
        daily: { title: "Daily", body: "One a day.", items: ["A streak"] },
        progress: {
          title: "Progress",
          items: ["Stars"],
          growthCaption: "A panda.",
        },
        goodToKnow: { title: "Good to know", items: ["Offline"] },
        model: { title: "Model", items: ["Free"] },
        privacy: { title: "Privacy", body: "Short.", cta: "Read" },
      },
      faq: { title: "FAQ", items: [{ question: "Q?", answer: "A." }] },
      gamePage: {
        relatedTitle: "More",
        difficultyColumns: { difficulty: "Level", detail: "Detail" },
        difficulties: {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          elite: "Elite",
        },
      },
      games,
      ...overrides,
    },
  };
}

const HUB_HERO: HubCopy["hero"] = {
  h1: "Synapgeek",
  tagline: "A tagline.",
  definition: DEFINITION_OK,
  cta: "Open",
};

function fixtureHub(overrides: Partial<HubCopy> = {}): CopyEntry {
  return {
    kind: "hub",
    locale: "en",
    copy: {
      updatedAt: "2026-10-01",
      meta: { title: "Synapgeek", description: "A studio." },
      hero: HUB_HERO,
      apps: {
        title: "Apps",
        items: {
          cerebrum: {
            genre: "Puzzle games",
            description: "A free app for iPhone, iPad and Android.",
            seeMore: "See more",
            gamesLabel: "Games",
          },
        },
      },
      about: {
        title: "About",
        description: "Body.",
        values: [{ title: "Value", description: "Text." }],
        cta: "Read",
      },
      contact: { title: "Contact" },
      ...overrides,
    },
  };
}

const GAMES = getGames("cerebrum");
const pandoku = GAMES.find((game) => game.id === "pandoku")!;

describe("contrôles positifs des gardes structurelles", () => {
  it("un module valide ne lève aucune violation", () => {
    const entry = fixtureApp("en", { pandoku: fixtureGame() });
    expect([
      ...forbiddenViolations(entry),
      ...lengthViolations(entry),
      ...genreViolations(entry, GAMES),
      ...shapeViolations(entry, GAMES),
    ]).toEqual([]);
    expect(forbiddenViolations(fixtureHub())).toEqual([]);
    expect(lengthViolations(fixtureHub())).toEqual([]);
  });

  it("les règles de texte parcourent chaque chaîne du module, jeux compris", () => {
    const entry = fixtureApp("en", {
      pandoku: fixtureGame({
        faq: {
          title: "FAQ",
          items: [{ question: "Is it for kids?", answer: "Fine." }],
        },
      }),
    });
    expect(forbiddenViolations(entry)).toEqual([
      expect.stringContaining("games.pandoku.faq.items.0.question"),
    ]);
  });

  it.each([
    ["trop courte", "Too short."],
    ["trop longue", "x".repeat(251)],
  ])("la définition %s est refusée", (_name, definition) => {
    const entry = fixtureHub({
      hero: { ...HUB_HERO, definition },
    });
    expect(lengthViolations(entry)).toHaveLength(1);
  });

  it("les bornes 150 et 250 sont incluses", () => {
    for (const length of [150, 250]) {
      const entry = fixtureHub({
        hero: { ...HUB_HERO, definition: "x".repeat(length) },
      });
      expect(lengthViolations(entry), String(length)).toEqual([]);
    }
  });

  it("une meta description de 156 caractères est refusée, 155 passe", () => {
    const tooLong = fixtureHub({
      meta: { title: "Synapgeek", description: "x".repeat(156) },
    });
    const exact = fixtureHub({
      meta: { title: "Synapgeek", description: "x".repeat(155) },
    });
    expect(lengthViolations(tooLong)).toHaveLength(1);
    expect(lengthViolations(exact)).toEqual([]);
  });

  it("la meta description d'un jeu est contrôlée comme celle de la page", () => {
    const entry = fixtureApp("en", {
      pandoku: fixtureGame({
        meta: { title: "Pandoku", description: "x".repeat(156) },
      }),
    });
    expect(lengthViolations(entry)).toEqual([
      expect.stringContaining("cerebrum:en:pandoku"),
    ]);
  });

  it("un jeu maison dont la définition n'a pas son genre est refusé", () => {
    const entry = fixtureApp("en", {
      pandoku: fixtureGame({
        hero: {
          h1: "Pandoku",
          phoneAlt: "A screen.",
          definition: DEFINITION_OK.replace(
            "Star Battle logic puzzle",
            "puzzle",
          ),
        },
      }),
    });
    expect(genreViolations(entry, GAMES)).toHaveLength(1);
  });

  it("le genre se lit dans la langue du module, espaces insécables compris", () => {
    const entry = fixtureApp("fr", {
      pandoku: fixtureGame({
        hero: {
          h1: "Pandoku",
          phoneAlt: "A screen.",
          definition: `Pandoku est un ${pandoku.genre.fr!.replace(/ /g, "\u00a0")}.`,
        },
      }),
    });
    expect(genreViolations(entry, GAMES)).toEqual([]);
  });

  it("un classique (genre nul) n'a pas à citer de genre", () => {
    const entry = fixtureApp("en", { sudoku: fixtureGame() });
    expect(genreViolations(entry, GAMES)).toEqual([]);
  });

  it("la page d'accueil ne nomme un jeu maison qu'avec son genre", () => {
    const bare = fixtureHub({
      apps: {
        title: "Apps",
        items: {
          cerebrum: {
            genre: "Puzzle games",
            description: "Pandoku, Pixel Art and Trace sit in one app.",
            seeMore: "See more",
            gamesLabel: "Games",
          },
        },
      },
    });
    expect(hubMentionGenreViolations(bare, GAMES)).toEqual([
      expect.stringContaining(
        'apps.items.cerebrum.description: names "Pandoku"',
      ),
      expect.stringContaining('names "Pixel Art"'),
      expect.stringContaining('names "Trace"'),
    ]);
    const named = fixtureHub({
      apps: {
        title: "Apps",
        items: {
          cerebrum: {
            genre: "Puzzle games",
            description:
              "Pandoku (a Star Battle logic puzzle), Pixel Art (nonograms) and Trace (a one-line path puzzle) sit in one app.",
            seeMore: "See more",
            gamesLabel: "Games",
          },
        },
      },
    });
    expect(hubMentionGenreViolations(named, GAMES)).toEqual([]);
    // Un mot courant n'est pas un nom de jeu, un classique n'a pas de genre.
    const common = fixtureHub({
      hero: { ...HUB_HERO, tagline: "A trace of Sudoku and Crossword." },
    });
    expect(hubMentionGenreViolations(common, GAMES)).toEqual([]);
  });

  it("la description de l'encart d'une app nomme iPhone, iPad et Android et dit qu'elle est gratuite", () => {
    const withDescription = (locale: "en" | "fr", description: string) => {
      const entry = fixtureHub();
      if (entry.kind !== "hub") throw new Error("fixture hub attendue");
      const [slug, item] = Object.entries(entry.copy.apps.items)[0];
      return {
        ...entry,
        locale,
        copy: {
          ...entry.copy,
          apps: {
            ...entry.copy.apps,
            items: { [slug]: { ...item, description } },
          },
        },
      } as CopyEntry;
    };
    expect(
      hubAppDescriptionViolations(
        withDescription("en", "An offline puzzle app for iPhone and iPad."),
      ),
    ).toEqual([
      expect.stringContaining("must name Android"),
      expect.stringContaining("must say the app is free"),
    ]);
    expect(
      hubAppDescriptionViolations(
        withDescription("fr", "Une app pour iPhone, iPad et Android."),
      ),
    ).toEqual([expect.stringContaining("must say the app is free")]);
    expect(
      hubAppDescriptionViolations(
        withDescription("fr", "Une app gratuite pour iPhone, iPad et Android."),
      ),
    ).toEqual([]);
    expect(
      entryViolations(withDescription("en", "A puzzle app.")),
    ).toContainEqual(expect.stringContaining("must name iPhone"));
  });

  it("le garde du genre à l'accueil fait partie de entryViolations", () => {
    const entry = fixtureHub({
      hero: { ...HUB_HERO, tagline: "A screen with Pandoku." },
    });
    expect(entryViolations(entry)).toEqual([
      expect.stringContaining('names "Pandoku" without its genre'),
    ]);
  });

  it("un jeu absent d'Android ne mentionne jamais Android, même dans une FAQ", () => {
    const withAndroid = fixtureGame({
      faq: {
        title: "FAQ",
        items: [
          { question: "Is it on Android?", answer: "Soon." },
          { question: "B?", answer: "B." },
          { question: "C?", answer: "C." },
        ],
      },
    });
    const gameOnAndroid = {
      ...pandoku,
      availability: { ios: "3.0.0", android: "3.0.0" },
    };
    const gameOffAndroid = {
      ...pandoku,
      availability: { ios: "3.0.0", android: null },
    };
    const entry = fixtureApp("en", { pandoku: withAndroid });
    expect(androidViolations(entry, [gameOffAndroid])).toEqual([
      expect.stringContaining("faq.items.0.question"),
    ]);
    expect(androidViolations(entry, [gameOnAndroid])).toEqual([]);
  });

  it.each([
    ["2 étapes", { howToPlay: { title: "t", steps: ["a", "b"] } }],
    ["7 étapes", { howToPlay: { title: "t", steps: Array(7).fill("a") } }],
    ["2 conseils", { tips: { title: "t", items: ["a", "b"] } }],
    ["6 conseils", { tips: { title: "t", items: Array(6).fill("a") } }],
    [
      "2 questions",
      {
        faq: {
          title: "t",
          items: Array(2).fill({ question: "q", answer: "a" }),
        },
      },
    ],
    [
      "7 questions",
      {
        faq: {
          title: "t",
          items: Array(7).fill({ question: "q", answer: "a" }),
        },
      },
    ],
  ] satisfies Array<[string, Partial<GameCopy>]>)(
    "%s : refusé",
    (_name, overrides) => {
      const entry = fixtureApp("en", { pandoku: fixtureGame(overrides) });
      expect(shapeViolations(entry, GAMES)).toHaveLength(1);
    },
  );

  it("une difficulté que le jeu n'a pas est refusée (Élite sur un jeu sans Élite)", () => {
    const threeLevels = {
      ...pandoku,
      difficulties: ["easy", "medium", "hard"] as const,
    };
    const entry = fixtureApp("en", {
      pandoku: fixtureGame({
        whatCerebrumAdds: {
          title: "t",
          paragraphs: [],
          difficultyTable: {
            caption: "c",
            rows: [{ difficulty: "elite", detail: "d" }],
          },
        },
      }),
    });
    expect(shapeViolations(entry, [threeLevels])).toEqual([
      expect.stringContaining('no "elite" difficulty'),
    ]);
  });

  it("un jeu publié sans copie est refusé, un jeu non publié n'en a pas besoin", () => {
    const entry = fixtureApp("en", {});
    expect(
      coverageViolations(entry, [{ ...pandoku, published: true }]),
    ).toHaveLength(1);
    expect(
      coverageViolations(entry, [{ ...pandoku, published: false }]),
    ).toEqual([]);
  });

  it("une copie de jeu hors registre est signalée, sans faire planter les autres gardes", () => {
    // `GameId` est une union fermée : l'identifiant hors registre ne s'écrit qu'avec un cast.
    const orphan = fixtureApp("en", {
      ["unregistered" as GameId]: fixtureGame(),
    });
    expect(coverageViolations(orphan, GAMES)).toContainEqual(
      expect.stringContaining(
        "unregistered: copy for a game that is not in the registry",
      ),
    );
    expect(() => nearDuplicatePagesOf("en", [orphan])).not.toThrow();
    expect(nearDuplicatePagesOf("en", [orphan])[0].names).toEqual([]);
  });

  describe("phrases répétées (ruling R4)", () => {
    const SHARED =
      "Une même phrase de plus de soixante caractères, recopiée mot pour mot.";
    /** `name` rend la définition de chaque page unique : seule la phrase testée peut se répéter. */
    const withTip = (tip: string, name = "Game") =>
      fixtureGame({
        hero: {
          h1: name,
          phoneAlt: "A screen.",
          definition: DEFINITION_OK.replace("Pandoku", name),
        },
        tips: { title: "Tips", items: [tip, "Tip 2", "Tip 3"] },
      });

    it("refuse une phrase de 60 caractères ou plus partagée par deux pages", () => {
      expect(SHARED.length).toBeGreaterThanOrEqual(60);
      const violations = repeatedSentenceViolations([
        { label: "en:sudoku", copy: withTip(`Intro. ${SHARED}`, "Sudoku") },
        { label: "en:pandoku", copy: withTip(SHARED, "Pandoku") },
      ]);
      expect(violations).toEqual([
        expect.stringContaining("en:pandoku tips.items.0"),
      ]);
    });

    it("refuse une phrase longue présente deux fois dans une même page", () => {
      const page = fixtureGame({
        tips: { title: "Tips", items: [SHARED, SHARED, "Tip 3"] },
      });
      expect(
        repeatedSentenceViolations([{ label: "en:sudoku", copy: page }]),
      ).toHaveLength(1);
    });

    it("laisse passer une phrase courte partagée, et la même phrase à 59 caractères", () => {
      const short = SHARED.slice(0, 58) + ".";
      expect(short).toHaveLength(59);
      expect(
        repeatedSentenceViolations([
          { label: "en:sudoku", copy: withTip(short, "Sudoku") },
          { label: "en:pandoku", copy: withTip(short, "Pandoku") },
        ]),
      ).toEqual([]);
    });

    it("ignore la casse et les espaces, et lit chaque phrase d'une chaîne", () => {
      const violations = repeatedSentenceViolations([
        { label: "en:sudoku", copy: withTip(`First. ${SHARED}`, "Sudoku") },
        {
          label: "en:pandoku",
          copy: withTip(`Other.   ${SHARED.toUpperCase()}`, "Pandoku"),
        },
      ]);
      expect(violations).toHaveLength(1);
    });

    it("coupe aussi sur le point-virgule et les deux-points : une proposition recopiée dans une autre phrase est refusée", () => {
      const violations = repeatedSentenceViolations([
        {
          label: "en:sudoku",
          copy: withTip(`Sudoku rule: ${SHARED}`, "Sudoku"),
        },
        {
          label: "en:pandoku",
          copy: withTip(`Other idea; ${SHARED}`, "Pandoku"),
        },
      ]);
      expect(violations).toEqual([
        expect.stringContaining("en:pandoku tips.items.0"),
      ]);
    });

    it("coupe sur les deux-points français précédés d'une espace insécable", () => {
      const violations = repeatedSentenceViolations([
        {
          label: "fr:sudoku",
          copy: withTip(`Règle\u00a0: ${SHARED}`, "Sudoku"),
        },
        { label: "fr:pandoku", copy: withTip(SHARED, "Pandoku") },
      ]);
      expect(violations).toHaveLength(1);
    });

    it("une proposition de 59 caractères reste libre, 60 est refusée", () => {
      const sixty =
        "Une proposition qui compte exactement soixante caractères ok";
      expect(sixty).toHaveLength(60);
      const fiftyNine = sixty.slice(0, 58) + "k";
      const pages = (clause: string) => [
        { label: "en:sudoku", copy: withTip(`A: ${clause}`, "Sudoku") },
        { label: "en:pandoku", copy: withTip(`B; ${clause}`, "Pandoku") },
      ];
      expect(repeatedSentenceViolations(pages(fiftyNine))).toEqual([]);
      expect(repeatedSentenceViolations(pages(sixty))).toHaveLength(1);
    });

    it("une entrée de la liste blanche est tolérée, tout le reste est refusé", () => {
      const pages = [
        { label: "en:sudoku", copy: withTip(SHARED, "Sudoku") },
        { label: "en:pandoku", copy: withTip(SHARED, "Pandoku") },
      ];
      expect(repeatedSentenceViolations(pages, [SHARED])).toEqual([]);
      expect(repeatedSentenceViolations(pages, [])).toHaveLength(1);
    });

    it("chaque entrée de la liste blanche sert encore : une formule déjà partagée par deux pages réelles", () => {
      const uses = new Map<string, number>();
      for (const entry of REGISTERED_COPY) {
        for (const [, copy] of gamesOf(entry)) {
          for (const { value } of stringsOf(copy)) {
            for (const clause of clausesOf(value)) {
              uses.set(clause, (uses.get(clause) ?? 0) + 1);
            }
          }
        }
      }
      const stale = SHARED_SENTENCE_ALLOWLIST.filter(
        (sentence) => (uses.get(normalizeSentence(sentence)) ?? 0) < 2,
      );
      expect(stale).toEqual([]);
    });
  });

  describe("quasi-doublons entre pages jeux", () => {
    /** Deux phrases de 60+ caractères qui ne diffèrent que par le nom du jeu. */
    const base = (name: string) =>
      `With ${name}, you place every piece on the board by reading the clues around it, one careful deduction after another.`;
    const page = (label: string, names: string[], tip: string) => ({
      label,
      names,
      copy: fixtureGame({
        hero: {
          h1: label,
          phoneAlt: "A screen.",
          definition: `${label} is unique. ${label} stays unique for the test.`,
        },
        tips: { title: "Tips", items: [tip, "Tip 2", "Tip 3"] },
      }),
    });

    it("refuse une phrase recopiée d'une page à l'autre avec le seul nom du jeu changé, que la garde R4 laisse passer", () => {
      const pages = [
        page("en:sudoku", ["Sudoku"], base("Sudoku")),
        page("en:pandoku", ["Pandoku"], base("Pandoku")),
      ];
      expect(repeatedSentenceViolations(pages)).toEqual([]);
      const violations = nearDuplicateViolations(pages);
      expect(violations).toEqual([
        expect.stringContaining("en:pandoku tips.items.0"),
      ]);
      expect(violations[0]).toContain("en:sudoku tips.items.0");
    });

    it("reconnaît le nom du jeu dans l'autre langue, au slug, sans accent ni casse", () => {
      const violations = nearDuplicateViolations([
        page(
          "en:crossword",
          ["Crossword", "Mots croisés", "crossword"],
          base("MOTS CROISÉS"),
        ),
        page("en:arrow-maze", ["Arrow Maze", "arrow-maze"], base("arrow-maze")),
      ]);
      expect(violations).toHaveLength(1);
    });

    it("laisse passer deux phrases qui parlent de choses différentes", () => {
      expect(
        nearDuplicateViolations([
          page(
            "en:sudoku",
            ["Sudoku"],
            "Scan the grid for a digit that already appears often, then look in each box for the one cell where it still fits.",
          ),
          page(
            "en:pandoku",
            ["Pandoku"],
            "Cross out freely, because crosses cost nothing and the more excluded cells you mark, the more forced cells appear.",
          ),
        ]),
      ).toEqual([]);
    });

    it("n'examine pas les phrases de moins de 60 caractères", () => {
      const short = "Place every piece by reading the clues around it, calmly.";
      expect(short.length).toBeLessThan(60);
      expect(
        nearDuplicateViolations([
          page("en:sudoku", ["Sudoku"], short),
          page("en:pandoku", ["Pandoku"], short),
        ]),
      ).toEqual([]);
    });

    it("la similarité est le Jaccard des trigrammes de mots : 3 trigrammes communs sur 5 donnent 0,6", () => {
      // abc bcd cde def contre abc bcd cde deg : 3 communs, 5 au total.
      expect(trigramSimilarity("a b c d e f", "a b c d e g")).toBeCloseTo(0.6);
      expect(trigramSimilarity("a b c d e f", "a b c d x y")).toBeCloseTo(
        1 / 3,
      );
      expect(trigramSimilarity("a b c d", "a b c d")).toBe(1);
    });

    it("seuil de 0,6 : la paire à 0,6 est refusée, celle à 0,43 passe", () => {
      // Six mots de douze lettres : 77 caractères, au-dessus du plancher de 60.
      const words = [
        "abcdefghijkl",
        "bcdefghijklm",
        "cdefghijklmn",
        "defghijklmno",
        "efghijklmnop",
      ];
      const sentence = (...tail: string[]) =>
        `${[...words, ...tail].join(" ")}.`;
      const pair = (a: string, b: string) => [
        page("en:sudoku", ["Sudoku"], a),
        page("en:pandoku", ["Pandoku"], b),
      ];
      const six = sentence("fghijklmnopq");
      expect(six.length).toBeGreaterThanOrEqual(60);
      expect(
        nearDuplicateViolations(pair(six, sentence("zzzzzzzzzzzz"))),
      ).toHaveLength(1); // 3 trigrammes communs sur 5 : 0,6
      expect(
        nearDuplicateViolations(
          pair(
            sentence("fghijklmnopq", "ghijklmnopqr"),
            sentence("zzzzzzzzzzzz", "yyyyyyyyyyyy"),
          ),
        ),
      ).toEqual([]); // 3 communs sur 7 : 0,43
    });

    it("une formule de la liste blanche est tolérée, tout le reste est refusé", () => {
      const pages = [
        page("en:sudoku", ["Sudoku"], base("Sudoku")),
        page("en:pandoku", ["Pandoku"], base("Pandoku")),
      ];
      // La formule s'écrit avec le marqueur à la place du nom du jeu.
      expect(nearDuplicateViolations(pages, [base("gamename")])).toEqual([]);
      expect(nearDuplicateViolations(pages, [])).toHaveLength(1);
    });

    it("ne compare pas une page à elle-même", () => {
      const twice = page("en:sudoku", ["Sudoku"], base("Sudoku"));
      expect(nearDuplicateViolations([twice])).toEqual([]);
    });

    it("chaque entrée de la liste blanche sert encore : une formule déjà partagée par deux pages réelles", () => {
      const uses = new Map<string, number>();
      for (const locale of LOCALES) {
        for (const page of nearDuplicatePagesOf(locale)) {
          for (const { folded } of comparableSentencesOf(page)) {
            uses.set(folded, (uses.get(folded) ?? 0) + 1);
          }
        }
      }
      const stale = NEAR_DUPLICATE_ALLOWLIST.filter(
        (formula) => (uses.get(foldForComparison(formula)) ?? 0) < 2,
      );
      expect(stale).toEqual([]);
    });
  });

  describe("typographie française", () => {
    /** Une définition française de la bonne longueur et sans ponctuation haute : seul `h1` est fautif. */
    const FR_DEFINITION =
      "Pandoku est un puzzle de logique de type Star Battle dans Cerebrum, l'app de puzzles de Synapgeek pour iPhone et iPad. Placez un panda par ligne, par colonne et par région.";
    const NB = "\u00a0";
    const NNB = "\u202f";

    it.each([
      ["espace simple avant deux-points", "Bloqué : voyez l'indice", 1],
      ["deux-points collé", "Bloqué: voyez l'indice", 1],
      ["espace simple avant point-virgule", "Un ; deux", 1],
      ["point-virgule collé", "Un; deux", 1],
      ["espace simple avant point d'interrogation", "Bloqué ?", 1],
      ["point d'exclamation collé", "Bravo!", 1],
      ["espace simple avant point d'exclamation", "Bravo !", 1],
      ["espace simple après guillemet ouvrant", "« mot\u00a0»", 1],
      ["guillemet fermant collé", "«\u00a0mot»", 1],
      ["guillemets collés", "«mot»", 2],
      ["guillemets à espace simple", "« mot »", 2],
    ])("refuse : %s", (_name, text, count) => {
      expect(frenchTypographyProblems(text)).toHaveLength(count);
    });

    it.each([
      ["espace insécable avant deux-points", `Bloqué${NB}: voyez`],
      ["espace fine insécable avant point-virgule", `Un${NNB}; deux`],
      ["espace insécable avant point d'interrogation", `Bloqué${NB}?`],
      ["espace insécable avant point d'exclamation", `Bravo${NB}!`],
      ["guillemets insécables", `«${NB}mot${NB}»`],
      ["guillemets à espace fine insécable", `«${NNB}mot${NNB}»`],
      ["point d'interrogation suivi d'un point d'exclamation", `Quoi${NB}?!`],
      ["heure avec deux-points", "Rendez-vous à 20:30 ce soir"],
      ["heure écrite 20 h", "Avant 20 h, jouez"],
      [
        "URL avec deux-points et point d'interrogation",
        "Voir https://synapgeek.com/play?src=qr",
      ],
      [
        "adresse avec deux-points seul en fin de lien",
        "Voir http://exemple.fr",
      ],
      ["texte sans ponctuation haute", "Un texte simple."],
      ["deux-points en début de chaîne", ": suite"],
    ])("laisse passer : %s", (_name, text) => {
      expect(frenchTypographyProblems(text)).toEqual([]);
    });

    it("ne vérifie que les modules français et nomme le chemin de la chaîne fautive", () => {
      const hub = (locale: "en" | "fr") => ({
        ...fixtureHub({
          hero: { ...HUB_HERO, h1: "Bloqué : oui", definition: FR_DEFINITION },
        }),
        locale,
      });
      expect(frenchTypographyViolations(hub("en"))).toEqual([]);
      expect(frenchTypographyViolations(hub("fr"))).toEqual([
        expect.stringContaining("hero.h1"),
      ]);
    });

    it("fait partie de entryViolations", () => {
      const base = fixtureHub({
        hero: { ...HUB_HERO, h1: "Bloqué : oui", definition: FR_DEFINITION },
      });
      if (base.kind !== "hub") throw new Error("fixture hub attendue");
      const entry = {
        ...base,
        copy: {
          ...base.copy,
          apps: {
            ...base.copy.apps,
            items: {
              cerebrum: {
                ...base.copy.apps.items.cerebrum,
                description: "Une app gratuite pour iPhone, iPad et Android.",
              },
            },
          },
        },
        locale: "fr" as const,
      };
      expect(entryViolations(entry)).toEqual([
        expect.stringContaining("hero.h1"),
      ]);
    });
  });

  describe("sujets de l'app entière (ruling R5)", () => {
    const withFaq = (question: string, answer = "Answer.") =>
      fixtureApp("en", {
        pandoku: fixtureGame({
          faq: {
            title: "FAQ",
            items: [
              { question, answer },
              { question: "B?", answer: "B." },
              { question: "C?", answer: "C." },
            ],
          },
        }),
      });

    it("refuse une question sur le prix, les appareils ou le hors ligne", () => {
      for (const question of [
        "Is Pandoku free?",
        "Can I play on Android?",
        "Can I play offline?",
      ]) {
        expect(
          appWideTopicViolations(withFaq(question)),
          question,
        ).toHaveLength(1);
      }
    });

    it("refuse un sujet d'app glissé dans une réponse, un conseil ou une étape", () => {
      const entry = fixtureApp("en", {
        pandoku: fixtureGame({
          howToPlay: {
            title: "How to play",
            steps: ["Step 1", "Step 2", "Watch an ad to continue."],
          },
          tips: {
            title: "Tips",
            items: ["Tip 1", "Go Premium for more.", "Tip 3"],
          },
          whatCerebrumAdds: {
            title: "What Cerebrum adds",
            paragraphs: ["Subscribe to the monthly subscription."],
            difficultyTable: {
              caption: "Difficulties",
              rows: [{ difficulty: "easy", detail: "Small grid." }],
            },
          },
        }),
      });
      expect(appWideTopicViolations(entry)).toEqual([
        expect.stringContaining("howToPlay.steps.2"),
        expect.stringContaining("whatCerebrumAdds.paragraphs.0"),
        expect.stringContaining("tips.items.1"),
      ]);
    });

    it("laisse passer la définition et les balises meta, qui portent l'appareil et le hors ligne", () => {
      const entry = fixtureApp("en", {
        pandoku: fixtureGame({
          meta: {
            title: "Pandoku | Cerebrum",
            description: "Free and offline on iPhone, iPad and Android.",
          },
          hero: {
            h1: "Pandoku",
            phoneAlt: "A screen.",
            definition: `${DEFINITION_OK} Play it offline on iPhone, iPad and Android, for free.`,
          },
        }),
      });
      expect(appWideTopicViolations(entry)).toEqual([]);
    });

    it("lit la phoneAlt, qui n'est pas exemptée", () => {
      const entry = fixtureApp("en", {
        pandoku: fixtureGame({
          hero: {
            h1: "Pandoku",
            definition: DEFINITION_OK,
            phoneAlt: "Pandoku on an iPhone.",
          },
        }),
      });
      expect(appWideTopicViolations(entry)).toEqual([
        expect.stringContaining("hero.phoneAlt"),
      ]);
    });

    it("une exception de la liste blanche vaut pour son jeu et son sujet, pas pour un autre", () => {
      const entry = withFaq("Is Pandoku free?");
      const allow = (game: GameId, topic: string) => [
        { game, topics: [topic], why: "test" },
      ];
      expect(appWideTopicViolations(entry, allow("pandoku", "free"))).toEqual(
        [],
      );
      expect(
        appWideTopicViolations(entry, allow("sudoku", "free")),
      ).toHaveLength(1);
      expect(
        appWideTopicViolations(entry, allow("pandoku", "offline")),
      ).toHaveLength(1);
    });

    it("chaque entrée de la liste blanche sert encore : le jeu cité dit réellement ce sujet", () => {
      const live = REGISTERED_COPY.flatMap((entry) =>
        appWideTopicViolations(entry, []),
      );
      const stale = APP_WIDE_ALLOWLIST.flatMap(({ game, topics }) =>
        topics
          .filter(
            (topic) =>
              !live.some(
                (violation) =>
                  violation.includes(`:${game} `) &&
                  violation.includes(`app-wide topic "${topic}"`),
              ),
          )
          .map((topic) => `${game}:${topic}`),
      );
      expect(stale).toEqual([]);
    });
  });

  it("entryViolations (la composition appliquée aux modules enregistrés) lève une violation par règle", () => {
    // Un seul module fautif sur toutes les règles à la fois : si une garde
    // quitte la composition, sa violation disparaît et ce test échoue.
    const entry = fixtureApp("en", {
      pandoku: fixtureGame({
        meta: { title: "Pandoku | Cerebrum", description: "x".repeat(156) },
        hero: {
          h1: "Pandoku",
          phoneAlt: "A screen.",
          definition: DEFINITION_OK.replace(
            "Star Battle logic puzzle",
            "puzzle",
          ),
        },
        howToPlay: { title: "How to play", steps: ["Only one step."] },
        tips: {
          title: "Tips",
          items: ["Also on Android soon.", "Tip 2", "Tip 3"],
        },
        faq: {
          title: "FAQ",
          items: [
            { question: "Is it for kids?", answer: "Fine." },
            { question: "B?", answer: "B." },
            { question: "C?", answer: "C." },
          ],
        },
      }),
    });
    const expectedByRule: ReadonlyArray<[string, RegExp]> = [
      [
        "forbiddenViolations",
        /faq\.items\.0\.question: never address children/,
      ],
      ["lengthViolations", /meta\.description is 156 characters/],
      [
        "genreViolations",
        /cerebrum:en:pandoku: definition must name its genre/,
      ],
      ["androidViolations", /tips\.items\.0: mentions Android/],
      ["appWideTopicViolations", /tips\.items\.0: app-wide topic "Android"/],
      ["shapeViolations", /cerebrum:en:pandoku: 1 steps, expected/],
      ["coverageViolations", /published game "sudoku" has no copy/],
    ];
    // Tous les jeux réels sont sur Android : Pandoku n'y est qu'ici, en fixture.
    const pandokuIosOnly: GameEntry = {
      ...pandoku,
      availability: { ios: "3.0.0", android: null },
    };
    // Tous les jeux publiés, quel que soit l'avancement des livraisons : seul
    // Pandoku a une copie, Sudoku publié sans copie déclenche la couverture.
    const violations = entryViolations(
      entry,
      [
        pandokuIosOnly,
        ...getGames("cerebrum").filter((game) => game.id !== "pandoku"),
      ].map((game) => ({ ...game, published: true })),
    );
    for (const [rule, expected] of expectedByRule) {
      expect(
        violations.some((violation) => expected.test(violation)),
        `${rule} absent de entryViolations: ${violations.join(" | ")}`,
      ).toBe(true);
    }
  });

  it("entryViolations s'applique aussi à un module sans jeux (hub)", () => {
    const entry = fixtureHub({
      hero: {
        ...HUB_HERO,
        definition: `${DEFINITION_OK} Cerebrum \u2014 puzzles.`,
      },
    });
    expect(entryViolations(entry)).toEqual([
      expect.stringContaining("no em dash in visible copy"),
    ]);
  });

  it("la parité attrape une langue absente", () => {
    const en = fixtureHub();
    expect(parityViolations([en])).toEqual(["hub: no fr module"]);
  });

  it("la parité attrape une clé manquante et un nombre de questions différent", () => {
    const en = fixtureApp("en", { pandoku: fixtureGame() });
    const missingKey = fixtureApp("fr", { pandoku: fixtureGame() });
    delete (missingKey.copy as Partial<AppCopy>).faq;
    expect(parityViolations([en, missingKey])).toEqual([
      "app:cerebrum en vs fr: faq: missing on the right",
    ]);

    const fewerFaq = fixtureApp("fr", {
      pandoku: fixtureGame({
        faq: { title: "FAQ", items: [{ question: "Q?", answer: "A." }] },
      }),
    });
    expect(parityViolations([en, fewerFaq])).toEqual([
      "app:cerebrum en vs fr: games.pandoku.faq.items: 3 items vs 1",
    ]);
  });

  it("la parité laisse libre le nombre de paragraphes (le français est écrit, pas traduit)", () => {
    const en = fixtureApp("en", {
      pandoku: fixtureGame(),
    });
    const fr = fixtureApp("fr", {
      pandoku: fixtureGame({
        whatCerebrumAdds: {
          title: "t",
          paragraphs: ["un", "deux", "trois"],
          difficultyTable: {
            caption: "c",
            rows: [{ difficulty: "easy", detail: "d" }],
          },
        },
      }),
    });
    expect(parityViolations([en, fr])).toEqual([]);
  });

  it("la parité attrape un jeu présent dans une seule langue", () => {
    const en = fixtureApp("en", { pandoku: fixtureGame() });
    const fr = fixtureApp("fr", {});
    expect(parityViolations([en, fr])).toEqual([
      "app:cerebrum en vs fr: games.pandoku: missing on the right",
    ]);
  });
});

// ---------------------------------------------------------------------------
// Formulaire de contact : un seul jeu de sujets, côté client et côté serveur
// ---------------------------------------------------------------------------

describe("sujets du formulaire de contact (amendement 18)", () => {
  /** `CONTACT_TOPICS` n'est pas exporté : un route handler ne peut exporter que ce que Next autorise. */
  const route = readFileSync("src/app/api/contact/route.ts", "utf8");
  const serverTopics = [
    ...(
      route.match(/const CONTACT_TOPICS[^{]*\{([^}]*)\}/)?.[1] ?? ""
    ).matchAll(/^\s*(\w+):/gm),
  ].map((match) => match[1]);

  it("la table du serveur est lisible", () => {
    expect(serverTopics.length).toBeGreaterThan(0);
  });

  it.each(LOCALES)(
    "les valeurs du Dictionary (%s) sont exactement celles de CONTACT_TOPICS, dans le même ordre",
    (locale) => {
      const values = getDictionary(locale).common.contactForm.topics.map(
        (topic) => topic.value,
      );
      expect(values).toEqual(serverTopics);
    },
  );
});
