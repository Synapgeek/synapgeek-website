import { describe, expect, it } from "vitest";
import { getAppCopy } from "@/content/copy";
import { LOCALES } from "@/lib/i18n";
import { GOOD_TO_KNOW_ICONS, MODEL_ICONS } from "./cerebrum-list-icons";

/** Une icône par point, dans chaque langue : un point ajouté à la copie impose son icône. */
describe.each(LOCALES)("Cerebrum list icons (%s)", (locale) => {
  const { sections } = getAppCopy("cerebrum", locale);

  it("has one icon per « good to know » point", () => {
    expect(GOOD_TO_KNOW_ICONS).toHaveLength(sections.goodToKnow.items.length);
  });

  it("has one icon per business-model point", () => {
    expect(MODEL_ICONS).toHaveLength(sections.model.items.length);
  });
});
