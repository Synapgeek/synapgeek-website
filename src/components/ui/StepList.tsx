/**
 * Étapes numérotées : une vraie `<ol>`. Le numéro est décoratif (`aria-hidden`),
 * l'ordre est porté par la liste ; `role="list"` garde la sémantique de liste
 * dans Safari, qui la retire dès que `list-style` est `none`.
 */
export function StepList({
  steps,
  className = "",
}: {
  steps: readonly string[];
  className?: string;
}) {
  return (
    <ol role="list" className={`grid gap-5 ${className}`}>
      {steps.map((step, index) => (
        <li key={step} className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-canvas font-display text-lg font-bold text-ink shadow-rest"
          >
            {index + 1}
          </span>
          <p className="max-w-[65ch] pt-1.5 text-lg leading-relaxed">{step}</p>
        </li>
      ))}
    </ol>
  );
}
