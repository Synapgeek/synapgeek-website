import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LOCALES } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { pagePath } from "@/lib/routes";
import { LocalizedNotFound } from "./LocalizedNotFound";
import { NotFoundView, type NotFoundStrings } from "./NotFoundView";
import RootNotFound, { metadata as rootMetadata } from "@/app/not-found";

const params = vi.hoisted(() => ({ current: {} as { locale?: string } }));
// next/font ne tourne que dans le build de Next : la 404 racine n'en a besoin que pour une classe.
vi.mock("@/app/fonts", () => ({ FONT_VARIABLES: "" }));
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

const titleCount = (html: string) => html.match(/<title[ >]/g)?.length ?? 0;

describe("titre de la 404", () => {
  it.each(LOCALES)(
    "%s : la 404 localisée pose exactement un <title> localisé",
    (locale) => {
      params.current = { locale };
      const out = render().replaceAll("&amp;", "&");
      expect(titleCount(out)).toBe(1);
      expect(out).toContain(
        `<title>${getDictionary(locale).common.notFound.title} | Synapgeek</title>`,
      );
    },
  );

  it("le corps partagé ne pose aucun <title> (sinon doublon sur la 404 racine)", () => {
    const html = renderToStaticMarkup(createElement(NotFoundView, strings.en));
    expect(titleCount(html)).toBe(0);
  });

  it("la 404 racine ne rend aucun <title> : le sien vient de `metadata` (gabarit du layout racine)", () => {
    expect(titleCount(renderToStaticMarkup(createElement(RootNotFound)))).toBe(
      0,
    );
    expect(rootMetadata.title).toBe(getDictionary("en").common.notFound.title);
  });
});
