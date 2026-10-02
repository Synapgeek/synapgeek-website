import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { LOCALES } from "@/lib/i18n";
import { PUBLISHER, formatAddress } from "./publisher";

/** Le texte brut de la page des mentions légales, dans une langue. */
function legalText(locale: (typeof LOCALES)[number]): string {
  return getDictionary(locale)
    .legal.sections.map(({ title, content }) => `${title}\n${content}`)
    .join("\n\n");
}

describe.each(LOCALES)(
  "identité de l'éditeur et mentions légales (%s)",
  (locale) => {
    const text = legalText(locale);

    it("l'adresse est celle des mentions légales", () => {
      expect(text).toContain(formatAddress());
    });

    it.each([
      ["SIRET", PUBLISHER.siret],
      ["numéro RCS", PUBLISHER.rcs.number],
      ["greffe", PUBLISHER.rcs.registry],
      ["code APE", PUBLISHER.ape],
      ["TVA intracommunautaire", PUBLISHER.vat],
      ["directeur de la publication", PUBLISHER.publicationDirector],
      ["hébergeur", PUBLISHER.host],
      ["email de contact", PUBLISHER.contactEmail],
    ])("%s est celui des mentions légales", (_label, value) => {
      expect(text).toContain(value);
    });

    it("le capital est celui des mentions légales", () => {
      const digits = new Intl.NumberFormat(locale).format(PUBLISHER.capitalEur);
      // « 1 000 » (espace) en français, « 1,000 » en anglais : on compare les chiffres.
      const spaced = digits.replace(/\s/g, " ");
      expect(text.replace(/\s/g, " ")).toContain(spaced);
    });
  },
);
