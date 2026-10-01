const TONES = {
  violet: "bg-wash-violet",
  green: "bg-wash-green",
} as const;

/** Colonnes à partir de `sm` (2) ou de `lg` (3) : jamais une carte orpheline sur sa ligne. */
const COLUMNS = {
  2: "sm:grid-cols-2",
  3: "lg:grid-cols-3",
} as const;

/**
 * Une liste de faits courts, chacun sur une carte pastel (texte encre sur
 * lavis : contraste AA). Vraie `<ul>` ; `role="list"` garde la sémantique de
 * liste dans Safari, qui la retire dès que `list-style` est `none`.
 */
export function CardList({
  items,
  tone,
  columns = 2,
  className = "",
}: {
  items: readonly string[];
  tone: keyof typeof TONES;
  /** Nombre de colonnes sur grand écran : celui qui divise le nombre de cartes. */
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return (
    <ul role="list" className={`grid gap-4 ${COLUMNS[columns]} ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-card p-6 text-lg leading-relaxed text-ink ${TONES[tone]}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
