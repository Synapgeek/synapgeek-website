import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/**
 * FAQ en `<details>`/`<summary>` : s'ouvre et se ferme sans JavaScript, et les
 * réponses sont dans le HTML même fermées (lisibles par les crawlers). La
 * réponse peut être un nœud (lien dans le texte) mais son texte doit rester
 * celui du JSON-LD FAQPage de la page.
 */
export function FaqList({
  items,
  className = "",
}: {
  items: ReadonlyArray<{ question: string; answer: ReactNode }>;
  className?: string;
}) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-card border border-border bg-canvas text-ink shadow-rest"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-6 py-4 font-display text-lg leading-snug font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180"
            />
          </summary>
          <div className="max-w-[65ch] px-6 pb-5 text-base leading-relaxed text-text-secondary">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
