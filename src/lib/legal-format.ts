/**
 * Mise en forme du texte des pages légales, en données pures (testable sans
 * rendu). `LegalPage` ne fait que transformer ces blocs et ces jetons en JSX.
 *
 * Ce que le format comprend, et rien d'autre :
 * - des paragraphes séparés par une ligne vide (découpés par l'appelant) ;
 * - dans un paragraphe, des lignes consécutives qui commencent par « - » suivi
 *   d'une espace : une vraie liste. Les autres lignes restent du texte, retours
 *   à la ligne conservés ;
 * - `**gras**`, l'auto-lien des URLs `http(s)` et celui des adresses e-mail.
 *
 * Pas de titres `###`, pas de listes numérotées, pas de liste imbriquée.
 */

export type LegalBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] };

export type LegalInlineToken =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "link"; value: string }
  | { kind: "email"; value: string };

const BULLET = /^- (.*)$/;

/** Découpe un paragraphe en blocs de texte et listes, sans toucher au contenu. */
export function splitLegalBlocks(paragraph: string): LegalBlock[] {
  if (paragraph === "") return [];

  const blocks: LegalBlock[] = [];
  let textLines: string[] = [];
  let items: string[] = [];

  const flushText = () => {
    if (textLines.length === 0) return;
    blocks.push({ kind: "text", text: textLines.join("\n") });
    textLines = [];
  };
  const flushList = () => {
    if (items.length === 0) return;
    blocks.push({ kind: "list", items });
    items = [];
  };

  for (const line of paragraph.split("\n")) {
    const bullet = BULLET.exec(line);
    if (bullet) {
      flushText();
      items.push(bullet[1]);
    } else {
      flushList();
      textLines.push(line);
    }
  }
  flushText();
  flushList();

  return blocks;
}

const BOLD = /(\*\*[^*]+\*\*)/g;

/**
 * Une URL s'arrête au premier blanc, à la parenthèse fermante ou à la virgule
 * (`[^\s),]+`) : une URL suivie d'une virgule ou citée entre parenthèses perd
 * donc ce qui suit, et rien dans le build ne le détecte. Écrire le contenu
 * légal en conséquence (voir CLAUDE.md, « Conventions de code »).
 */
const LINK =
  /(https?:\/\/[^\s),]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/** Gras d'abord ; liens et e-mails ensuite, dans les seuls passages hors gras. */
export function tokenizeLegalInline(text: string): LegalInlineToken[] {
  const tokens: LegalInlineToken[] = [];

  for (const part of text.split(BOLD)) {
    if (part.length >= 4 && part.startsWith("**") && part.endsWith("**")) {
      tokens.push({ kind: "bold", value: part.slice(2, -2) });
      continue;
    }

    let lastIndex = 0;
    for (const match of part.matchAll(LINK)) {
      if (match.index > lastIndex) {
        tokens.push({
          kind: "text",
          value: part.slice(lastIndex, match.index),
        });
      }
      const value = match[0];
      tokens.push({
        kind: value.startsWith("http") ? "link" : "email",
        value,
      });
      lastIndex = match.index + value.length;
    }
    if (lastIndex < part.length) {
      tokens.push({ kind: "text", value: part.slice(lastIndex) });
    }
  }

  return tokens;
}
