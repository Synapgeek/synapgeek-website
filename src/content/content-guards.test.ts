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
  return games
    .filter((game) => game.published && !(game.id in entry.copy.games))
    .map(
      (game) => `${labelOf(entry)}: published game "${game.id}" has no copy`,
    );
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

/** `games` remplace le registre pour prouver une garde sur une donnée que le registre n'a plus. */
function entryViolations(
  entry: CopyEntry,
  games: readonly GameEntry[] = entry.kind === "app" ? getGames(entry.app) : [],
): string[] {
  return [
    ...forbiddenViolations(entry),
    ...lengthViolations(entry),
    ...genreViolations(entry, games),
    ...androidViolations(entry, games),
    ...shapeViolations(entry, games),
    ...coverageViolations(entry, games),
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

  it("chaque module existe dans toutes les langues avec la même structure", () => {
    expect(parityViolations(REGISTERED_COPY)).toEqual([]);
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
    whereToPlay: { title: "Where to play", body: "In Cerebrum." },
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
        progress: { title: "Progress", items: ["Stars"] },
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
  definition: DEFINITION_OK,
  phoneAlt: "A screen.",
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
        items: { cerebrum: { description: "An app.", cta: "Open" } },
      },
      games: {
        title: "Games",
        categories: { "logic-numbers": "A", words: "B", paths: "C" },
      },
      facts: [{ value: "iOS", label: "Platform" }],
      studio: { title: "Studio", body: "Body.", cta: "Write" },
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
