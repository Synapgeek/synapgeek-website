/**
 * Une suite de faits courts écrits en prose : une vraie `<ul>`, sans puces ni
 * cartes, chaque fait est un paragraphe. Pour les faits qui se lisent à la
 * suite ; `role="list"` garde la sémantique de liste dans Safari, qui la retire
 * dès que `list-style` est `none`.
 */
export function ProseList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul role="list" className={`grid gap-5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="max-w-[65ch] text-lg leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}
