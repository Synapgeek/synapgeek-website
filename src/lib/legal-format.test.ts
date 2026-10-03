import { describe, expect, it } from "vitest";
import { getDictionary } from "@/content";
import { LOCALES } from "@/lib/i18n";
import {
  splitLegalBlocks,
  tokenizeLegalInline,
  type LegalBlock,
  type LegalInlineToken,
} from "./legal-format";

describe("splitLegalBlocks", () => {
  it("transforme un paragraphe à tirets en texte puis liste", () => {
    expect(splitLegalBlocks("Intro :\n- A\n- B")).toEqual([
      { kind: "text", text: "Intro :" },
      { kind: "list", items: ["A", "B"] },
    ]);
  });

  it("laisse intact un texte sans tirets, retours à la ligne compris", () => {
    const text =
      "**Synapgeek**\nEmail : contact@synapgeek.com\nSite : https://synapgeek.com";
    expect(splitLegalBlocks(text)).toEqual([{ kind: "text", text }]);
  });

  it("ne prend pas un tiret sans espace, ni un tiret en milieu de ligne, pour une puce", () => {
    const text = "-sans espace\nrien - ici\n—tiret long";
    expect(splitLegalBlocks(text)).toEqual([{ kind: "text", text }]);
  });

  it("garde le texte qui suit une liste", () => {
    expect(splitLegalBlocks("- A\n- B\nFin")).toEqual([
      { kind: "list", items: ["A", "B"] },
      { kind: "text", text: "Fin" },
    ]);
  });

  it("sépare deux listes que du texte interrompt", () => {
    expect(splitLegalBlocks("- A\nmilieu\n- B")).toEqual([
      { kind: "list", items: ["A"] },
      { kind: "text", text: "milieu" },
      { kind: "list", items: ["B"] },
    ]);
  });

  it("ne produit aucun bloc pour un paragraphe vide", () => {
    expect(splitLegalBlocks("")).toEqual([]);
  });
});

describe("tokenizeLegalInline", () => {
  it("lit le gras, les URL et les e-mails", () => {
    expect(
      tokenizeLegalInline("**Gras** puis https://example.com et a@b.fr"),
    ).toEqual([
      { kind: "bold", value: "Gras" },
      { kind: "text", value: " puis " },
      { kind: "link", value: "https://example.com" },
      { kind: "text", value: " et " },
      { kind: "email", value: "a@b.fr" },
    ]);
  });

  // Règle documentée : `[^\s),]+` s'arrête à la virgule et à la parenthèse
  // fermante. Une URL suivie d'une virgule ne l'emporte pas dans le lien.
  it("tronque l'URL à la virgule et à la parenthèse fermante", () => {
    expect(tokenizeLegalInline("(https://example.com/a), puis b")).toEqual([
      { kind: "text", value: "(" },
      { kind: "link", value: "https://example.com/a" },
      { kind: "text", value: "), puis b" },
    ]);
    expect(tokenizeLegalInline("https://example.com/a, b")[0]).toEqual({
      kind: "link",
      value: "https://example.com/a",
    });
  });

  it("ne lie pas le contenu d'un passage en gras", () => {
    expect(tokenizeLegalInline("**https://example.com**")).toEqual([
      { kind: "bold", value: "https://example.com" },
    ]);
  });
});

function blockText(block: LegalBlock): string {
  return block.kind === "text"
    ? block.text
    : block.items.map((item) => `- ${item}`).join("\n");
}

function inlineText(token: LegalInlineToken): string {
  return token.kind === "bold" ? `**${token.value}**` : token.value;
}

describe("contenu légal réel : aucun caractère perdu ni ajouté", () => {
  const cases = LOCALES.flatMap((locale) => {
    const dict = getDictionary(locale);
    return [dict.privacy, dict.terms, dict.legal].flatMap((doc) =>
      doc.sections.flatMap((section) =>
        section.content
          .split("\n\n")
          .map((paragraph) => ({ locale, title: section.title, paragraph })),
      ),
    );
  });

  it("couvre des paragraphes dans les deux langues", () => {
    expect(cases.length).toBeGreaterThan(50);
  });

  it("recompose chaque paragraphe à l'identique (blocs, puis jetons)", () => {
    for (const { locale, title, paragraph } of cases) {
      const blocks = splitLegalBlocks(paragraph);
      expect(blocks.map(blockText).join("\n"), `${locale} ${title}`).toBe(
        paragraph,
      );
      for (const block of blocks.filter((b) => b.kind === "text")) {
        expect(
          tokenizeLegalInline(block.text).map(inlineText).join(""),
          `${locale} ${title}`,
        ).toBe(block.text);
      }
    }
  });

  it("rend au moins une vraie liste dans chaque langue", () => {
    for (const locale of LOCALES) {
      const lists = cases
        .filter((c) => c.locale === locale)
        .flatMap((c) => splitLegalBlocks(c.paragraph))
        .filter((b) => b.kind === "list");
      expect(lists.length, locale).toBeGreaterThan(0);
    }
  });
});
