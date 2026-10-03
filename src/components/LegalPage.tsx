import type { LegalSection } from "@/content/types";
import {
  splitLegalBlocks,
  tokenizeLegalInline,
  type LegalBlock,
} from "@/lib/legal-format";

// Composant serveur uniquement, comme tout ce qu'il importe : les pages légales
// doivent se lire sans JavaScript (garde transitive dans route-invariants.test.ts).

const LINK_CLASSES =
  "rounded-sm font-semibold text-brand-violet-deep underline decoration-brand-violet/50 underline-offset-4 transition-colors hover:decoration-brand-violet";

/** Gras, URL et e-mails d'un passage de texte (le découpage vit dans `legal-format`). */
function Inline({ text }: { text: string }) {
  return tokenizeLegalInline(text).map((token, i) => {
    switch (token.kind) {
      case "bold":
        return (
          <strong key={i} className="font-bold text-ink">
            {token.value}
          </strong>
        );
      case "email":
        return (
          <a key={i} href={`mailto:${token.value}`} className={LINK_CLASSES}>
            {token.value}
          </a>
        );
      case "link":
        return (
          <a
            key={i}
            href={token.value}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASSES}
          >
            {token.value}
          </a>
        );
      case "text":
        return token.value;
    }
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === "list") {
    return (
      <ul className="list-disc space-y-1.5 pl-6 marker:text-brand-violet">
        {block.items.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="whitespace-pre-line">
      <Inline text={block.text} />
    </p>
  );
}

export function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
}) {
  return (
    <article>
      <header className="border-b border-border bg-canvas-soft">
        <div className="mx-auto max-w-3xl px-gutter py-10 md:py-14">
          <h1 className="text-4xl leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 inline-flex rounded-pill bg-wash-violet px-3 py-1 text-sm font-bold text-ink">
            {lastUpdated}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-10 px-gutter py-12 md:py-16">
        {sections.map((section) => (
          // scroll-mt-24 (6 rem) compense l'en-tête collant de 4 rem (h-16) : sans lui, une ancre place le titre sous le header.
          // tabIndex=-1 : sans lui, un saut d'ancre déplace le viewport mais pas le focus
          // clavier — un lecteur d'écran resterait en haut de page.
          <section
            key={section.title}
            id={section.id}
            tabIndex={section.id ? -1 : undefined}
            className="scroll-mt-24 border-t border-border pt-8 first:border-t-0 first:pt-0 focus-visible:rounded-2xl focus-visible:outline-offset-8"
          >
            <h2 className="mb-4 text-2xl">{section.title}</h2>
            <div className="max-w-[70ch] space-y-4 break-words text-base leading-relaxed text-ink/80">
              {section.content.split("\n\n").map((paragraph, i) => (
                <div key={i} className="space-y-2">
                  {splitLegalBlocks(paragraph).map((block, j) => (
                    <Block key={j} block={block} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
