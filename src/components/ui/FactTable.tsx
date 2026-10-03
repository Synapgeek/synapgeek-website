import type { ReactNode } from "react";

export interface FactRow {
  /** Clé React stable (le libellé peut être un lien). */
  key: string;
  label: ReactNode;
  value: ReactNode;
}

/**
 * Fiche de faits : une liste de définitions (`<dl>`), libellé à gauche et
 * valeur à droite dès `sm`, empilés en dessous. Le libellé précède sa valeur
 * dans le DOM ; rien n'est réordonné en CSS.
 */
export function FactTable({
  rows,
  className = "",
}: {
  rows: readonly FactRow[];
  className?: string;
}) {
  return (
    <dl className={`border-b border-border ${className}`}>
      {rows.map(({ key, label, value }) => (
        <div
          key={key}
          className="grid gap-1 border-t border-border py-4 sm:grid-cols-[minmax(9rem,1fr)_2fr] sm:gap-8 sm:py-5"
        >
          <dt className="font-display text-base font-bold">{label}</dt>
          <dd className="max-w-[65ch] text-base tabular-nums leading-relaxed text-text-secondary">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
