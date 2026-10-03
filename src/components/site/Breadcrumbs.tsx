import { InternalLink } from "@/components/ui/InternalLink";

/**
 * Un maillon du fil d'Ariane. Le dernier (page courante) n'a pas de `href`.
 * Le même tableau alimente le JSON-LD `BreadcrumbList` : le visible et le
 * structuré ne peuvent donc pas diverger.
 */
export interface BreadcrumbItem {
  name: string;
  href?: string;
}

const linkClasses =
  "rounded-sm underline-offset-4 hover:text-ink hover:underline";

/**
 * Fil d'Ariane visible : `<nav>` nommé, liste ordonnée, page courante en texte
 * marquée `aria-current`. Les séparateurs sont du CSS (jamais du texte), donc
 * absents de l'arbre d'accessibilité et du texte copié.
 */
export function Breadcrumbs({
  items,
  label,
  className = "",
}: {
  items: readonly BreadcrumbItem[];
  /** Nom du repère de navigation, issu du dictionnaire. */
  label: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className || undefined}>
      <ol className="flex flex-wrap items-center text-sm text-text-secondary">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center before:mx-2 before:size-1.5 before:rotate-45 before:border-t before:border-r before:border-current before:opacity-60 before:content-[''] first:before:hidden"
          >
            {item.href ? (
              <InternalLink href={item.href} className={linkClasses}>
                {item.name}
              </InternalLink>
            ) : (
              <span aria-current="page" className="font-bold text-ink">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
