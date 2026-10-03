import { describe, expect, it, vi } from "vitest";
import { LOCALES } from "./i18n";
import { getApp, getGames } from "@/content/apps";
import { mobileApplicationSchema, videoGameSchema } from "./structured-data";

// Toutes les pages de jeux publiées, comme au déploiement final.
vi.mock("@/content/apps", async (importOriginal) =>
  (await import("@/content/apps/publish-all.test-support")).publishAllGames(
    await importOriginal<typeof import("@/content/apps")>(),
  ),
);

/**
 * Maître-étalon du JSON-LD de Cerebrum (app et dix jeux, deux langues) : les
 * builders sont génériques (ils reçoivent une `AppEntry`), mais leur sortie pour
 * Cerebrum ne doit pas bouger d'un octet. Mettre à jour l'étalon n'est légitime
 * que pour un changement voulu du JSON-LD publié.
 */
const cerebrum = getApp("cerebrum");
const copy = {
  hero: { definition: "d" },
  updatedAt: "2026-10-02",
  disambiguation: "Not the other one.",
  sections: {
    model: { items: ["Free, with ads.", "Premium means no forced ads."] },
    goodToKnow: { items: ["Offline.", "Guest play."] },
  },
} as const;

describe("JSON-LD de Cerebrum (étalon)", () => {
  it.each(LOCALES)("application, %s", (locale) => {
    expect(
      JSON.stringify(mobileApplicationSchema(cerebrum, locale, copy), null, 2),
    ).toMatchSnapshot();
  });

  it.each(
    getGames("cerebrum").flatMap((game) =>
      LOCALES.map((l) => [game.id, l] as const),
    ),
  )("jeu %s, %s", (id, locale) => {
    const game = getGames("cerebrum").find((entry) => entry.id === id)!;
    expect(
      JSON.stringify(videoGameSchema(cerebrum, game, locale, copy), null, 2),
    ).toMatchSnapshot();
  });
});
