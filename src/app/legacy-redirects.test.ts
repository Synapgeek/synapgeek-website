import { describe, expect, it } from "vitest";
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "../../next.config";
import { GAME_SLUGS, SECTION_SLUGS } from "@/lib/page-slugs";

/**
 * Redirections historiques de next.config.ts (spec §5.2, plan amendement 5) :
 * l'anglais a quitté `/en` pour la racine, chaque ancienne page anglaise non
 * légale redirige en 308 vers son pendant sans préfixe. Sources LITTÉRALES
 * uniquement : aucune regex ni lookahead, rien à interpréter sur Vercel.
 */

const ORIGIN = "https://synapgeek.com";

async function respond(path: string) {
  const response = await unstable_getResponseFromNextConfig({
    url: `${ORIGIN}${path}`,
    nextConfig,
  });
  return { status: response.status, location: getRedirectUrl(response) };
}

const ENGLISH_GAME_SLUGS = Object.values(GAME_SLUGS).map((slug) => slug.en);
const ENGLISH_SECTION_SLUGS = Object.values(SECTION_SLUGS).map(
  (slug) => slug.en,
);

describe("redirections /en historiques (spec §5.2)", () => {
  it("/en → 308 vers la racine", async () => {
    expect(await respond("/en")).toEqual({
      status: 308,
      location: `${ORIGIN}/`,
    });
  });

  it("/en?utm_source=x → 308 vers /?utm_source=x, query conservée", async () => {
    expect(await respond("/en?utm_source=x")).toEqual({
      status: 308,
      location: `${ORIGIN}/?utm_source=x`,
    });
  });

  it("/en/cerebrum → 308 vers /cerebrum", async () => {
    expect(await respond("/en/cerebrum")).toEqual({
      status: 308,
      location: `${ORIGIN}/cerebrum`,
    });
  });

  it.each(ENGLISH_GAME_SLUGS)(
    "/en/cerebrum/%s → 308 vers la même URL sans /en",
    async (slug) => {
      expect(await respond(`/en/cerebrum/${slug}`)).toEqual({
        status: 308,
        location: `${ORIGIN}/cerebrum/${slug}`,
      });
    },
  );

  it.each(ENGLISH_SECTION_SLUGS)(
    "/en/%s → 308 vers la même URL sans /en",
    async (slug) => {
      expect(await respond(`/en/${slug}`)).toEqual({
        status: 308,
        location: `${ORIGIN}/${slug}`,
      });
    },
  );

  it("couvre dix jeux et deux sections, rien de plus", () => {
    expect(ENGLISH_GAME_SLUGS).toHaveLength(10);
    expect(ENGLISH_SECTION_SLUGS).toEqual(["about", "press"]);
  });
});

describe("URLs qui ne redirigent PAS (contrat figé)", () => {
  it.each([
    "/en/privacy",
    "/en/terms",
    "/en/legal",
    "/fr/privacy",
    "/fr/terms",
    "/fr/legal",
    "/en/opengraph-image",
    "/en/cerebrum/opengraph-image",
    "/en/cerebrum/sudoku/opengraph-image",
    "/en/cerebrum/sudoku/opengraph-image-abc123",
  ])("%s → aucune redirection de config", async (path) => {
    expect(await respond(path)).toEqual({ status: 200, location: null });
  });
});

describe("redirections historiques conservées (contrat)", () => {
  it.each([
    ["/account-deletion", "/privacy#account-deletion"],
    ["/en/account-deletion", "/en/privacy#account-deletion"],
    ["/fr/account-deletion", "/privacy#account-deletion"],
  ])("%s → 307 vers %s", async (path, destination) => {
    expect(await respond(path)).toEqual({
      status: 307,
      location: `${ORIGIN}${destination}`,
    });
  });

  it.each(["/play", "/jouer"])("%s → 307 vers /cerebrum/play", async (path) => {
    expect(await respond(path)).toEqual({
      status: 307,
      location: `${ORIGIN}/cerebrum/play`,
    });
  });
});

const APP_UTM = "utm_source=cerebrum&utm_medium=app&utm_campaign=profile";

describe("R1 : lien Contact des apps installées (307 conditionnels)", () => {
  it("racine avec utm d'app → 307 vers /fr, query conservée", async () => {
    expect(await respond(`/?${APP_UTM}`)).toEqual({
      status: 307,
      location: `${ORIGIN}/fr?${APP_UTM}`,
    });
  });

  it("/en avec utm d'app → 307 vers /?…&hl=en", async () => {
    expect(await respond(`/en?${APP_UTM}`)).toEqual({
      status: 307,
      location: `${ORIGIN}/?${APP_UTM}&hl=en`,
    });
  });

  it("/?hl=en avec utm d'app → aucune redirection (pas de boucle)", async () => {
    expect(await respond(`/?hl=en&${APP_UTM}`)).toEqual({
      status: 200,
      location: null,
    });
    expect(await respond(`/?${APP_UTM}&hl=en`)).toEqual({
      status: 200,
      location: null,
    });
  });

  it.each([
    [
      "utm_medium=apps (ancrage de has.value)",
      "utm_source=cerebrum&utm_medium=apps",
    ],
    [
      "utm_source=cerebrum2 (ancrage de has.value)",
      "utm_source=cerebrum2&utm_medium=app",
    ],
    ["utm_source=x", "utm_source=x&utm_medium=app&utm_campaign=profile"],
    ["utm_medium absent", "utm_source=cerebrum"],
  ])("racine avec %s → aucune redirection", async (_label, query) => {
    expect(await respond(`/?${query}`)).toEqual({
      status: 200,
      location: null,
    });
  });

  it("/en?utm_source=x → toujours 308 vers /?utm_source=x", async () => {
    expect(await respond("/en?utm_source=x")).toEqual({
      status: 308,
      location: `${ORIGIN}/?utm_source=x`,
    });
  });

  it("/en avec utm_medium=apps → 308 (le 307 R1 ne le capte pas)", async () => {
    expect(await respond("/en?utm_source=cerebrum&utm_medium=apps")).toEqual({
      status: 308,
      location: `${ORIGIN}/?utm_source=cerebrum&utm_medium=apps`,
    });
  });

  it.each([
    "/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign=sign_in",
    "/en/terms?utm_source=cerebrum&utm_medium=app&utm_campaign=store_subscription",
    `/fr?${APP_UTM}`,
  ])("%s → aucune redirection", async (path) => {
    expect(await respond(path)).toEqual({ status: 200, location: null });
  });
});

describe("forme de redirects()", () => {
  it("garde l'ordre : suppression de compte, alias QR, R1, puis /en", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects.slice(0, 5).map((rule) => rule.source)).toEqual([
      "/account-deletion",
      "/en/account-deletion",
      "/fr/account-deletion",
      "/play",
      "/jouer",
    ]);
    // R1 occupe deux indices AVANT le 308 `/en` : la première règle qui correspond l'emporte.
    expect(redirects.slice(5, 7)).toEqual([
      {
        source: "/",
        has: [
          { type: "query", key: "utm_source", value: "^cerebrum$" },
          { type: "query", key: "utm_medium", value: "^app$" },
        ],
        missing: [{ type: "query", key: "hl" }],
        destination: "/fr",
        permanent: false,
      },
      {
        source: "/en",
        has: [
          { type: "query", key: "utm_source", value: "^cerebrum$" },
          { type: "query", key: "utm_medium", value: "^app$" },
        ],
        destination: "/?hl=en",
        permanent: false,
      },
    ]);
    expect(redirects[7]).toEqual({
      source: "/en",
      destination: "/",
      permanent: true,
    });
  });

  it("toute source est un chemin littéral, toute règle /en inconditionnelle est permanente, R1 est temporaire", async () => {
    const redirects = await nextConfig.redirects!();
    for (const rule of redirects) {
      expect(rule.source, rule.source).toMatch(/^\/[A-Za-z0-9/_-]*$/);
      expect(rule.source, rule.source).not.toMatch(/[:(*]/);
    }
    // R1 s'identifie par son `has` ; seules ces deux règles portent une condition.
    const conditional = redirects.filter((rule) => "has" in rule);
    expect(conditional.map((rule) => rule.source)).toEqual(["/", "/en"]);
    for (const rule of conditional) {
      expect(rule.permanent, rule.source).toBe(false);
    }
    const legacy = redirects.slice(5).filter((rule) => !("has" in rule));
    expect(legacy.length).toBeGreaterThan(0);
    for (const rule of legacy) {
      expect(rule.permanent, rule.source).toBe(true);
    }
  });

  it("aucune règle ne vise les pages légales ni leurs images OpenGraph", async () => {
    const redirects = await nextConfig.redirects!();
    for (const rule of redirects) {
      expect(rule.source, rule.source).not.toMatch(
        /^\/(en|fr)\/(privacy|terms|legal)$/,
      );
      expect(rule.source, rule.source).not.toContain("opengraph-image");
    }
  });
});
