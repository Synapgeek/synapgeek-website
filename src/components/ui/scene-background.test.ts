import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SceneBackground } from "./SceneBackground";

/**
 * La scène en art direction : deux cadrages, une seule image téléchargée, décorative.
 * Avec `priority` l'<img> est la candidate LCP : eager + fetchpriority high, et aucun
 * préchargement manuel (voir le docstring du composant).
 */
const scene = { wide: "/images/a-wide.webp", narrow: "/images/a-narrow.webp" };

const render = (priority?: boolean) =>
  renderToStaticMarkup(
    createElement(SceneBackground, {
      scene,
      breakpoint: 1024,
      sizes: "100vw",
      priority,
      className: "object-[50%_60%]",
    }),
  );

const imgOf = (out: string) => /<img[^>]*>/.exec(out)?.[0] ?? "";

describe("SceneBackground", () => {
  it("has two sources split at the breakpoint: wide from it, narrow below it", () => {
    const out = render();
    expect(out.match(/<source /g)).toHaveLength(2);
    const wide = /<source[^>]*min-width: 1024px[^>]*>/.exec(out)?.[0] ?? "";
    const narrow = /<source[^>]*max-width: 1023px[^>]*>/.exec(out)?.[0] ?? "";
    expect(wide).toContain("a-wide.webp");
    expect(narrow).toContain("a-narrow.webp");
    // Le repli (aucun média ne matche) est le cadrage portrait.
    expect(imgOf(out)).toContain("a-narrow.webp");
  });

  it("is decorative: empty alt and aria-hidden on the effective image", () => {
    const img = imgOf(render());
    expect(img).toContain('alt=""');
    expect(img).toContain('aria-hidden="true"');
  });

  it("loads eagerly with high fetch priority when it is the LCP", () => {
    const img = imgOf(render(true));
    expect(img).toContain('loading="eager"');
    expect(img).toContain('fetchPriority="high"');
  });

  it("loads lazily, without fetch priority, otherwise", () => {
    const img = imgOf(render());
    expect(img).toContain('loading="lazy"');
    expect(img).not.toContain("fetchPriority");
  });

  it("passes its class to the image, after the cover classes", () => {
    expect(imgOf(render())).toMatch(
      /class="[^"]*object-cover[^"]*object-\[50%_60%\]/,
    );
  });

  it("emits no manual preload: it would leak into the RSC payload of every page", () => {
    // Le docstring explique le piège et cite `ReactDOM.preload` : seul le code compte.
    const source = readFileSync(
      "src/components/ui/SceneBackground.tsx",
      "utf8",
    ).replace(/\/\*[\s\S]*?\*\//g, "");
    expect(source).not.toMatch(/ReactDOM|react-dom|\.preload\(/);
  });
});
