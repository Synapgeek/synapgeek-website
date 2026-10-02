/**
 * Tableau des niveaux de difficulté : un vrai `<table>` avec `<caption>`, en
 * deux colonnes (pas de défilement horizontal sur mobile). Le libellé de chaque
 * niveau est déjà localisé par l'appelant.
 */
export function DifficultyTable({
  caption,
  columns,
  rows,
  className = "",
}: {
  caption: string;
  columns: { difficulty: string; detail: string };
  rows: ReadonlyArray<{ label: string; detail: string }>;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-card bg-canvas text-ink shadow-rest ${className}`}
    >
      <table className="w-full border-collapse text-left tabular-nums">
        <caption className="caption-top px-5 pt-5 pb-3 text-left font-display text-lg font-bold sm:px-6">
          {caption}
        </caption>
        <thead>
          <tr className="bg-canvas-soft text-sm">
            <th
              scope="col"
              className="w-28 px-5 py-3 font-bold sm:w-44 sm:px-6"
            >
              {columns.difficulty}
            </th>
            <th scope="col" className="px-5 py-3 font-bold sm:px-6">
              {columns.detail}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border align-top">
              <th
                scope="row"
                className="px-5 py-4 font-display text-base font-bold sm:px-6"
              >
                {row.label}
              </th>
              <td className="px-5 py-4 text-base leading-relaxed text-text-secondary sm:px-6">
                {row.detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
