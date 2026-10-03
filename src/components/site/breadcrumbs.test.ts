import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";

const render = (items: Parameters<typeof Breadcrumbs>[0]["items"]) =>
  renderToStaticMarkup(
    createElement(Breadcrumbs, { label: "Breadcrumb", items }),
  );

describe("Breadcrumbs", () => {
  const html = render([
    { name: "Home", href: "/" },
    { name: "Cerebrum", href: "/cerebrum" },
    { name: "Sudoku" },
  ]);

  it("rend un repère de navigation nommé qui contient une liste ordonnée", () => {
    expect(html).toMatch(/^<nav aria-label="Breadcrumb"><ol/);
    expect(html.match(/<li/g)).toHaveLength(3);
  });

  it("lie les maillons parents et laisse le dernier en texte, marqué page courante", () => {
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Home<\/a>/);
    expect(html).toMatch(/<a [^>]*href="\/cerebrum"[^>]*>Cerebrum<\/a>/);
    expect(html).toMatch(/<span [^>]*aria-current="page"[^>]*>Sudoku<\/span>/);
    expect(html).not.toMatch(/<a [^>]*>Sudoku<\/a>/);
    expect(html).not.toContain('href="/cerebrum/sudoku"');
  });

  it("ne rend rien pour un tableau vide", () => {
    expect(render([])).toBe("");
  });

  it("n'insère aucun séparateur dans le texte (CSS seulement)", () => {
    const text = html.replace(/<[^>]+>/g, "|");
    expect(text).not.toMatch(/[>/›»]/);
  });
});
