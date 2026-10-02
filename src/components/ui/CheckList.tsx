import { Check } from "lucide-react";

/**
 * Liste à coches : le texte hérite la couleur de la bande (encre ou blanc), la
 * coche est encre sur vert, d'un contraste AA sur les deux fonds. La coche est
 * décorative, la liste porte le sens.
 */
export function CheckList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul role="list" className={`grid gap-5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-pill bg-brand-green text-ink"
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
          <span className="max-w-[65ch] text-lg leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
