import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { pagePath } from "@/lib/routes";
import { LocalizedNotFound } from "./LocalizedNotFound";
import type { NotFoundStrings } from "./NotFoundView";

const params = vi.hoisted(() => ({ current: {} as { locale?: string } }));
vi.mock("next/navigation", () => ({ useParams: () => params.current }));

const strings = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    {
      ...getDictionary(locale).common.notFound,
      href: pagePath("home", locale),
    },
  ]),
) as Record<(typeof LOCALES)[number], NotFoundStrings>;

// renderToStaticMarkup échappe l'apostrophe (&#x27;) : on compare le texte décodé.
const render = () =>
  renderToStaticMarkup(
    createElement(LocalizedNotFound, { strings }),
  ).replaceAll("&#x27;", "'");

describe("LocalizedNotFound", () => {
  beforeEach(() => {
    params.current = {};
  });

  it.each(LOCALES)(
    "affiche les textes de la langue de l'URL et mène à l'accueil de cette langue (%s)",
    (locale) => {
      params.current = { locale };
      const html = render();
      expect(html).toContain(strings[locale].title);
      expect(html).toContain(strings[locale].cta);
      expect(html).toContain(`href="${pagePath("home", locale)}"`);
    },
  );

  it("retombe sur la langue par défaut quand la langue est absente ou inconnue", () => {
    for (const locale of [undefined, "de", "wp-login.php"]) {
      params.current = { locale };
      expect(render()).toContain(strings.en.title);
    }
  });

  it("rend un seul h1 et ne lie jamais « / » nu pour le français", () => {
    params.current = { locale: "fr" };
    const html = render();
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('href="/fr"');
    expect(html).not.toContain('href="/"');
  });
});
