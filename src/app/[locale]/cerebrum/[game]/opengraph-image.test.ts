import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getGames } from "@/content/apps";
import { LOCALES } from "@/lib/i18n";
import Image, {
  generateImageMetadata,
  generateStaticParams,
} from "./opengraph-image";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;

const params = (locale: string, game: string) =>
  Promise.resolve({ locale, game });

const PUBLISHED = getGames("cerebrum").filter((game) => game.published);
const UNPUBLISHED = getGames("cerebrum").find((game) => !game.published);

describe("opengraph-image d'un jeu", () => {
  it("génère les mêmes paramètres que la page, un par jeu publié et par langue", async () => {
    const page = await import("./page");
    expect(generateStaticParams()).toEqual(page.generateStaticParams());
    expect(generateStaticParams()).toHaveLength(
      PUBLISHED.length * LOCALES.length,
    );
  });

  it.each(LOCALES)(
    "rend un PNG de 1200×630 pour le premier jeu publié (%s)",
    async (locale) => {
      const response = await Image({
        params: params(locale, PUBLISHED[0].slug[locale]),
      });
      expect(response.headers.get("content-type")).toBe("image/png");
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect([...bytes.slice(0, 8)]).toEqual(PNG_SIGNATURE);
      const view = new DataView(bytes.buffer);
      expect([view.getUint32(16), view.getUint32(20)]).toEqual([1200, 630]);
    },
  );

  it("a une icône PNG pour chaque jeu du registre (satori ne lit pas le webp)", () => {
    const missing = getGames("cerebrum")
      .filter(
        (game) =>
          !existsSync(
            path.join(process.cwd(), "src/assets/og-icons", `${game.id}.png`),
          ),
      )
      .map((game) => game.id);
    expect(missing).toEqual([]);
  });

  it.each(LOCALES)(
    "donne le nom du jeu, dans la langue de la page, comme texte alternatif (%s)",
    async (locale) => {
      const game = PUBLISHED[0];
      expect(
        await generateImageMetadata({
          params: params(locale, game.slug[locale]),
        }),
      ).toEqual([
        {
          id: "default",
          alt: game.name[locale],
          size: { width: 1200, height: 630 },
          contentType: "image/png",
        },
      ]);
    },
  );

  it("refuse un slug inconnu", async () => {
    await expect(Image({ params: params("en", "inconnu") })).rejects.toThrow(
      NOT_FOUND,
    );
  });

  it.skipIf(!UNPUBLISHED)(
    "refuse un jeu non publié, dans chaque langue",
    async () => {
      for (const locale of LOCALES) {
        await expect(
          Image({ params: params(locale, UNPUBLISHED!.slug[locale]) }),
        ).rejects.toThrow(NOT_FOUND);
      }
    },
  );
});
