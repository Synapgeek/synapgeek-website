import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { REGISTERED_COPY } from "@/content/copy";
import { PUBLISHER } from "@/content/publisher";
import { LOCALES } from "@/lib/i18n";
import { organizationSchema } from "@/lib/structured-data";

/**
 * Décision d'Adrien du 2026-10-02 : le site dit « France » et rien de plus précis.
 * La rue, le code postal, la ville, la région et la ville du greffe n'apparaissent
 * que dans les mentions légales, que la loi impose à une SAS (`/legal`). Cette
 * garde échoue si une copie, `llms.txt`, le JSON-LD ou un autre texte du
 * dictionnaire les redit.
 */
const PLACES = [
  PUBLISHER.address.street,
  PUBLISHER.address.postalCode,
  PUBLISHER.address.locality,
  PUBLISHER.rcs.registry,
  "Rhône",
  "Auvergne",
];

/** Toutes les chaînes d'une valeur, avec leur chemin. */
function strings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      strings(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const hits = (text: string) =>
  PLACES.filter((place) => text.toLowerCase().includes(place.toLowerCase()));

describe("le lieu du siège ne sort pas des mentions légales", () => {
  it("contrôle positif : la garde voit la ville, la région, le code postal et la rue", () => {
    expect(hits("installé à Frontenas, dans le Rhône")).toEqual([
      "Frontenas",
      "Rhône",
    ]);
    expect(hits("69620, 185 chemin des Brosses")).toEqual([
      "185 chemin des Brosses",
      "69620",
    ]);
    expect(hits("Un studio français indépendant")).toEqual([]);
  });

  it("n'est dans aucune copie de page (accueil, à propos, presse, app, jeux)", () => {
    const found = REGISTERED_COPY.flatMap((entry) =>
      strings(entry.copy).flatMap(([path, text]) =>
        hits(text).map(
          (place) => `${entry.kind}:${entry.locale} ${path}: ${place}`,
        ),
      ),
    );
    expect(found).toEqual([]);
  });

  it.each(LOCALES)(
    "n'est dans aucun texte du dictionnaire (%s) hors des mentions légales",
    (locale) => {
      const rest: Record<string, unknown> = { ...getDictionary(locale) };
      delete rest.legal;
      const found = strings(rest).flatMap(([path, text]) =>
        hits(text).map((place) => `${path}: ${place}`),
      );
      expect(found).toEqual([]);
    },
  );

  it.each(LOCALES)(
    "reste dans les mentions légales (%s), où la loi l'exige",
    (locale) => {
      const legal = JSON.stringify(getDictionary(locale).legal);
      expect(legal).toContain(PUBLISHER.address.locality);
      expect(legal).toContain(PUBLISHER.address.postalCode);
    },
  );

  it("n'est pas dans llms.txt", () => {
    expect(hits(readFileSync("public/llms.txt", "utf8"))).toEqual([]);
  });

  it("n'est pas dans le JSON-LD de l'organisation", () => {
    expect(hits(JSON.stringify(organizationSchema()))).toEqual([]);
  });
});
