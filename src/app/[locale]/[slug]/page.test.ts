import { existsSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { getApp, getGames } from "@/content/apps";
import { getAboutCopy, getAppCopy, getPressCopy } from "@/content/copy";
import { PUBLISHER } from "@/content/publisher";
import { formatUpdatedAt } from "@/lib/format-date";
import { LOCALES } from "@/lib/i18n";
import { SECTION_SLUGS } from "@/lib/page-slugs";
import {
  absoluteUrl,
  pageIdForGame,
  pagePath,
  sectionParams,
} from "@/lib/routes";
import SectionPage, { generateMetadata, generateStaticParams } from "./page";

const NOT_FOUND = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;

type Locale = (typeof LOCALES)[number];

async function render(locale: Locale, slug: string) {
  const element = await SectionPage({
    params: Promise.resolve({ locale, slug }),
  });
  return renderToStaticMarkup(createElement(() => element));
}

function jsonLdNodes(markup: string): Array<Record<string, unknown>> {
  return [
    ...markup.matchAll(
      /<script type="application\/ld\+json">([^<]*)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1].replace(/\\u003c/g, "<")));
}

const decode = (text: string) =>
  text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** Texte visible, balises ôtées, espaces insécables ramenés à des espaces. */
const visibleText = (markup: string) =>
  decode(markup.replace(/<[^>]+>/g, " ")).replace(/[\s  ]+/g, " ");

const flat = (text: string) => text.replace(/[\s  ]+/g, " ");

describe("routage des pages de section", () => {
  it("génère une entrée par section et par langue, avec le slug de la langue", () => {
    expect(generateStaticParams()).toEqual(sectionParams());
    expect(generateStaticParams()).toEqual([
      { locale: "en", slug: "about" },
      { locale: "fr", slug: "a-propos" },
      { locale: "en", slug: "press" },
      { locale: "fr", slug: "presse" },
    ]);
  });

  it.each([
    ["fr", "about"],
    ["en", "a-propos"],
    ["fr", "press"],
    ["en", "presse"],
    ["en", "cerebrum"],
    ["en", "privacy"],
    ["fr", "play"],
    ["en", "inconnu"],
  ] as const)("%s/%s est un vrai 404", async (locale, slug) => {
    await expect(render(locale, slug)).rejects.toThrow(NOT_FOUND);
    await expect(
      generateMetadata({ params: Promise.resolve({ locale, slug }) }),
    ).rejects.toThrow(NOT_FOUND);
  });
});

describe.each(LOCALES)("pages de section (%s)", (locale) => {
  const dict = getDictionary(locale);

  describe.each([
    ["about", getAboutCopy(locale)],
    ["press", getPressCopy(locale)],
  ] as const)("%s", (section, copy) => {
    const slug = SECTION_SLUGS[section][locale];

    it("a un seul H1, suivi de la phrase de définition", async () => {
      const markup = decode(await render(locale, slug));
      expect(markup.match(/<h1/g)).toHaveLength(1);
      expect(markup.match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1]).toBe(copy.hero.h1);
      const afterH1 = markup.slice(markup.indexOf("</h1>"));
      expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
        copy.hero.definition,
      );
    });

    it("ne laisse jamais passer le gabarit brut {app} des badges", async () => {
      expect(await render(locale, slug)).not.toContain("{app}");
    });

    it("annonce la date de mise à jour de la copie", async () => {
      const markup = await render(locale, slug);
      expect(markup).toContain(`<time dateTime="${copy.updatedAt}">`);
    });

    it("porte un fil d'Ariane visible et son JSON-LD, sans Organization ni aggregateRating", async () => {
      const markup = await render(locale, slug);
      const nodes = jsonLdNodes(markup);
      const crumbs = nodes.find((node) => node["@type"] === "BreadcrumbList")!;
      const names = (crumbs.itemListElement as Array<{ name: string }>).map(
        (entry) => entry.name,
      );
      expect(names).toEqual([dict.common.siteName, dict.common.nav[section]]);
      const nav = markup.match(/<nav[^>]*><ol[\s\S]*?<\/ol><\/nav>/)![0];
      for (const name of names) expect(nav).toContain(name);
      expect(nodes.map((node) => node["@type"])).not.toContain("Organization");
      expect(markup).not.toContain("aggregateRating");
    });

    it("canonical, hreflang et image Open Graph propre viennent de l'aide de routes", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
      });
      expect(metadata.alternates?.canonical).toBe(absoluteUrl(section, locale));
      expect(metadata.alternates?.languages).toMatchObject({
        "x-default": absoluteUrl(section, "en"),
      });
      expect(metadata.title).toEqual({ absolute: copy.meta.title });
      expect(metadata.description).toBe(copy.meta.description);
      // Une og:image par convention de fichier : jamais l'image du site en plus.
      expect(
        (metadata.openGraph as { images?: unknown } | undefined)?.images,
      ).toBeUndefined();
    });

    it("cite la date de sortie sur l'App Store, en toutes lettres et celle du JSON-LD", () => {
      const date = flat(
        formatUpdatedAt(getApp("cerebrum").datePublished, locale),
      );
      const text = JSON.stringify(
        section === "about"
          ? (copy as ReturnType<typeof getAboutCopy>).what
          : (copy as ReturnType<typeof getPressCopy>).factSheet,
      );
      expect(flat(text)).toContain(date);
    });
  });

  describe("À propos", () => {
    const slug = SECTION_SLUGS.about[locale];
    const copy = getAboutCopy(locale);

    it("émet une AboutPage qui référence l'organisation par son @id", async () => {
      const nodes = jsonLdNodes(await render(locale, slug));
      expect(nodes.map((node) => node["@type"])).toEqual([
        "AboutPage",
        "BreadcrumbList",
      ]);
      expect(nodes[0]).toMatchObject({
        url: absoluteUrl("about", locale),
        about: { "@id": "https://synapgeek.com/#organization" },
        dateModified: copy.updatedAt,
      });
    });

    it("affiche l'identité de l'éditeur issue de PUBLISHER, avec le pays et jamais l'adresse", async () => {
      const text = visibleText(await render(locale, slug));
      for (const place of [
        PUBLISHER.address.street,
        PUBLISHER.address.postalCode,
        PUBLISHER.address.locality,
        PUBLISHER.rcs.registry,
      ]) {
        expect(text, place).not.toContain(place);
      }
      for (const value of [
        PUBLISHER.legalName,
        PUBLISHER.address.country,
        PUBLISHER.siret,
        PUBLISHER.ape,
        PUBLISHER.vat,
        PUBLISHER.publicationDirector,
        PUBLISHER.host,
        PUBLISHER.contactEmail,
      ]) {
        expect(text, value).toContain(value);
      }
    });

    it("mène aux mentions légales, au formulaire de contact, à la presse et à l'app", async () => {
      const markup = await render(locale, slug);
      for (const href of [
        pagePath("legal", locale),
        pagePath("home", locale, "contact"),
        pagePath("press", locale),
        pagePath("cerebrum", locale),
      ]) {
        expect(markup, href).toContain(`href="${href}"`);
      }
      expect(markup).toContain(`href="mailto:${PUBLISHER.contactEmail}"`);
    });

    it("n'affirme pas que les grilles sont générées ou vérifiées par des outils", () => {
      const text = JSON.stringify(copy);
      expect(text).not.toMatch(
        /générée|généré|solveur|vérifiée par|generated|solver|checked by/i,
      );
    });
  });

  describe("Presse", () => {
    const slug = SECTION_SLUGS.press[locale];
    const copy = getPressCopy(locale);

    it("émet une WebPage et un fil d'Ariane", async () => {
      const nodes = jsonLdNodes(await render(locale, slug));
      expect(nodes.map((node) => node["@type"])).toEqual([
        "WebPage",
        "BreadcrumbList",
      ]);
    });

    it("nomme chaque jeu publié avec son genre (ou sa catégorie) et le lie à sa page", async () => {
      const markup = await render(locale, slug);
      const text = visibleText(markup);
      const { sections } = getAppCopy("cerebrum", locale);
      for (const game of getGames("cerebrum").filter((g) => g.published)) {
        const href = pagePath(pageIdForGame(game.id), locale);
        expect(markup, game.id).toContain(`href="${href}"`);
        const genre =
          game.genre[locale] ?? sections.games.categories[game.category];
        const shown =
          genre.charAt(0).toLocaleUpperCase(locale) + genre.slice(1);
        expect(text, game.id).toContain(`${game.name[locale]} ${shown}`);
      }
    });

    it("la fiche reprend les faits du registre (langues, systèmes minimaux)", () => {
      const app = getApp("cerebrum");
      const sheet = flat(JSON.stringify(copy.factSheet.rows));
      expect(sheet).toContain(`${app.languages.length} `);
      expect(sheet).toContain(`iOS ${app.platforms.ios.minOs}`);
      expect(sheet).toContain(`Android ${app.platforms.android.minOs}`);
    });

    it("donne l'adresse de contact en clair, avec un lien mailto", async () => {
      const markup = await render(locale, slug);
      expect(markup).toContain(`href="mailto:${PUBLISHER.contactEmail}"`);
      expect(visibleText(markup)).toContain(PUBLISHER.contactEmail);
    });

    it("affiche l'identité de l'éditeur issue de PUBLISHER, avec le pays et jamais l'adresse", async () => {
      const text = visibleText(await render(locale, slug));
      for (const place of [
        PUBLISHER.address.street,
        PUBLISHER.address.postalCode,
        PUBLISHER.address.locality,
        PUBLISHER.rcs.registry,
      ]) {
        expect(text, place).not.toContain(place);
      }
      for (const value of [
        PUBLISHER.legalName,
        PUBLISHER.address.country,
        PUBLISHER.siret,
      ]) {
        expect(text, value).toContain(value);
      }
    });

    it("liste quatre captures dans sa langue, le logo et l'icône, tous versionnés et présents", () => {
      const hrefs = copy.downloads.items.map((item) => item.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
      const screens = hrefs.filter((href) => href.includes("-screen-"));
      expect(screens).toHaveLength(4);
      for (const href of screens) expect(href).toContain(`-${locale}-`);
      expect(hrefs).toHaveLength(6);
      for (const href of hrefs) {
        // Un fichier remplacé change de nom : le cache de 7 jours ne le rattraperait pas.
        expect(href, href).toMatch(/^\/press\/[a-z0-9-]+-v3\.(png|webp)$/);
        expect(existsSync(path.join(process.cwd(), "public", href)), href).toBe(
          true,
        );
      }
    });

    it("propose chaque fichier au téléchargement", async () => {
      const markup = await render(locale, slug);
      for (const { href } of copy.downloads.items) {
        expect(markup).toMatch(new RegExp(`<a href="${href}" download=""`));
      }
    });
  });
});
