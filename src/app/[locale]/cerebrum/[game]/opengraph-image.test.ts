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

const params = (locale: string, game: string) =>
  Promise.resolve({ locale, game });

describe("opengraph-image d'un jeu", () => {
  it("génère les mêmes paramètres que la page", async () => {
    const page = await import("./page");
    expect(generateStaticParams()).toEqual(page.generateStaticParams());
    expect(generateStaticParams()).toEqual([
      { locale: "en", game: "sudoku" },
      { locale: "fr", game: "sudoku" },
      { locale: "en", game: "pandoku" },
      { locale: "fr", game: "pandoku" },
    ]);
  });

  it.each(LOCALES)(
    "rend un PNG de 1200×630 pour Sudoku (%s)",
    async (locale) => {
      const response = await Image({ params: params(locale, "sudoku") });
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

  it("donne le nom du jeu, dans la langue de la page, comme texte alternatif", async () => {
    expect(
      await generateImageMetadata({ params: params("fr", "sudoku") }),
    ).toEqual([
      {
        id: "default",
        alt: "Sudoku",
        size: { width: 1200, height: 630 },
        contentType: "image/png",
      },
    ]);
  });

  it.each([
    ["en", "maze"],
    ["en", "inconnu"],
    ["fr", "mots-croises"],
  ])("refuse %s/%s : jeu non publié ou slug inconnu", async (locale, game) => {
    await expect(Image({ params: params(locale, game) })).rejects.toThrow(
      /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/,
    );
  });
});
