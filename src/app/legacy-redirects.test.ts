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

describe("forme de redirects()", () => {
  it("garde l'ordre : suppression de compte, alias QR, puis /en", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects.slice(0, 5).map((rule) => rule.source)).toEqual([
      "/account-deletion",
      "/en/account-deletion",
      "/fr/account-deletion",
      "/play",
      "/jouer",
    ]);
    expect(redirects[5]).toEqual({
      source: "/en",
      destination: "/",
      permanent: true,
    });
  });

  it("toute source est un chemin littéral, toute règle /en est permanente", async () => {
    const redirects = await nextConfig.redirects!();
    for (const rule of redirects) {
      expect(rule.source, rule.source).toMatch(/^\/[A-Za-z0-9/_-]*$/);
      expect(rule.source, rule.source).not.toMatch(/[:(*]/);
    }
    const legacy = redirects.slice(5);
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
