import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getAppCopy } from "@/content/copy";
import { LOCALES } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import CerebrumPage, { generateMetadata } from "./page";

async function render(locale: (typeof LOCALES)[number]) {
  const element = await CerebrumPage({ params: Promise.resolve({ locale }) });
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

describe.each(LOCALES)("page Cerebrum (%s)", (locale) => {
  const copy = getAppCopy("cerebrum", locale);

  it("a un seul H1, suivi de la phrase de définition", async () => {
    const markup = decode(await render(locale));
    expect(markup.match(/<h1/g)).toHaveLength(1);
    const afterH1 = markup.slice(markup.indexOf("</h1>"));
    expect(afterH1.match(/<p[^>]*>([^<]*)<\/p>/)?.[1]).toBe(
      copy.hero.definition,
    );
  });

  it("émet l'application, le fil d'Ariane et la FAQ, sans aggregateRating", async () => {
    const markup = await render(locale);
    const types = jsonLdNodes(markup).map((node) =>
      JSON.stringify(node["@type"]),
    );
    expect(types).toEqual([
      '["MobileApplication","VideoGame"]',
      '"BreadcrumbList"',
      '"FAQPage"',
    ]);
    expect(markup).not.toContain("aggregateRating");
  });

  it("la FAQ du JSON-LD est mot pour mot la FAQ visible", async () => {
    const markup = await render(locale);
    const visible = decode(markup);
    const faq = jsonLdNodes(markup).find(
      (node) => node["@type"] === "FAQPage",
    )!;
    const entities = faq.mainEntity as Array<{
      name: string;
      acceptedAnswer: { text: string };
    }>;
    expect(entities).toHaveLength(copy.faq.items.length);
    for (const entity of entities) {
      expect(visible).toContain(entity.name);
      expect(visible).toContain(entity.acceptedAnswer.text);
    }
  });

  it("le fil d'Ariane du JSON-LD porte les mêmes noms que le fil visible", async () => {
    const markup = await render(locale);
    const crumbs = jsonLdNodes(markup).find(
      (node) => node["@type"] === "BreadcrumbList",
    )!;
    const names = (crumbs.itemListElement as Array<{ name: string }>).map(
      (entry) => entry.name,
    );
    const nav = markup.match(/<nav[^>]*><ol[\s\S]*?<\/ol><\/nav>/)![0];
    for (const name of names) expect(nav).toContain(name);
    expect(names).toHaveLength(2);
  });

  it("la question de suppression de compte renvoie à l'ancre de la politique", async () => {
    const markup = await render(locale);
    expect(markup).toContain(
      `href="${pagePath("privacy", locale, "account-deletion")}"`,
    );
  });

  it("annonce la date de mise à jour de la copie", async () => {
    const markup = await render(locale);
    expect(markup).toContain(`<time dateTime="${copy.updatedAt}">`);
  });

  it("la date de mise à jour clôt la page et ne se lit pas comme celle de la politique", async () => {
    const markup = await render(locale);
    const time = markup.indexOf(`<time dateTime="${copy.updatedAt}">`);
    const privacyStart = markup.indexOf('id="privacy"');
    const privacyEnd = markup.indexOf("</section>", privacyStart);
    expect(privacyStart).toBeGreaterThan(-1);
    expect(time).toBeGreaterThan(privacyEnd);
    expect(markup.slice(time)).not.toContain("<section");
  });

  it("canonical et hreflang viennent de l'aide de routes", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale }),
    });
    expect(metadata.alternates?.canonical).toBe(
      locale === "en"
        ? "https://synapgeek.com/cerebrum"
        : "https://synapgeek.com/fr/cerebrum",
    );
    expect(metadata.alternates?.languages).toMatchObject({
      "x-default": "https://synapgeek.com/cerebrum",
    });
  });
});
