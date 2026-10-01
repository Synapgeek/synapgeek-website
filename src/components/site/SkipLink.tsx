/**
 * Lien d'évitement : premier élément focusable de la page, visible seulement au
 * focus. Cible `#main-content` (le `<main>` du layout de langue).
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-canvas focus:shadow-raised"
    >
      {label}
    </a>
  );
}
