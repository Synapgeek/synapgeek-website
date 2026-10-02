import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { SECTION_SLUGS } from "@/lib/page-slugs";
import Image, {
  generateImageMetadata,
  generateStaticParams,
} from "./opengraph-image";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;

const params = (locale: string, slug: string) =>
  Promise.resolve({ locale, slug });

describe("opengraph-image d'une page de section", () => {
  it("génère les mêmes paramètres que la page, une entrée par section et par langue", async () => {
    const page = await import("./page");
    expect(generateStaticParams()).toEqual(page.generateStaticParams());
    expect(generateStaticParams()).toHaveLength(
      Object.keys(SECTION_SLUGS).length * LOCALES.length,
    );
  });

  it.each(
    Object.values(SECTION_SLUGS).flatMap((slugs) =>
      LOCALES.map((locale) => [locale, slugs[locale]] as const),
    ),
  )("rend un PNG de 1200×630 (%s, %s)", async (locale, slug) => {
    const response = await Image({ params: params(locale, slug) });
    expect(response.headers.get("content-type")).toBe("image/png");
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect([...bytes.slice(0, 8)]).toEqual(PNG_SIGNATURE);
    const view = new DataView(bytes.buffer);
    expect([view.getUint32(16), view.getUint32(20)]).toEqual([1200, 630]);
  });

  it("donne le titre de la page, dans sa langue, comme texte alternatif", async () => {
    expect(
      await generateImageMetadata({ params: params("fr", "a-propos") }),
    ).toEqual([
      {
        id: "default",
        alt: "À propos de Synapgeek",
        size: { width: 1200, height: 630 },
        contentType: "image/png",
      },
    ]);
  });

  it("répond à la sonde sans paramètre de Next par l'unique identifiant", async () => {
    expect(
      await generateImageMetadata({
        params: Promise.resolve({ locale: "en" } as never),
      }),
    ).toHaveLength(1);
  });

  it("refuse un slug inconnu, ou celui de l'autre langue", async () => {
    for (const [locale, slug] of [
      ["en", "inconnu"],
      ["fr", "about"],
      ["en", "a-propos"],
    ] as const) {
      await expect(Image({ params: params(locale, slug) })).rejects.toThrow(
        NOT_FOUND,
      );
    }
  });
});
