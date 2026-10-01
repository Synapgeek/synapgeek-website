/**
 * Action principale en pilule : encre sur vert (contraste AA), cible tactile de
 * 44 px. Remplacée par `PillButton` quand les primitives arrivent (Task 11) :
 * en attendant, le shell (suggestion de langue, 404) partage cette seule chaîne
 * plutôt que d'en recopier une variante par composant.
 */
export const PILL_ACTION_CLASSES =
  "inline-flex min-h-11 items-center justify-center rounded-pill bg-brand-green px-6 text-sm font-bold text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-brand-green/90 active:scale-[0.97]";
