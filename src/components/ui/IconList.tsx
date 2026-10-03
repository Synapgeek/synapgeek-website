import { Sparkle, type LucideIcon } from "lucide-react";
import { gameColorVars, type GameColor } from "./game-colors";

/** La tuile de l'icône : en dégradé pastel sur fond clair, translucide sur la bande violet profond. */
const TILE_CLASSES = {
  light:
    "game-gradient text-(--deep) shadow-rest inset-ring-1 inset-ring-canvas/70",
  dark: "bg-canvas/10 text-(--wash) inset-ring-1 inset-ring-canvas/20",
} as const;

/**
 * Liste à icônes : chaque point porte une icône dans une tuile arrondie, en dégradé
 * pastel comme les cartes de l'app (sur la bande violet profond, une tuile
 * translucide et l'icône en pastel). Le texte hérite la couleur de la bande ;
 * l'icône est décorative, la liste porte le sens. `icons` donne une icône par point,
 * dans l'ordre des `items` et leur nombre doit être le même (sinon le rendu, donc le
 * build, lève une erreur) ; sans `icons`, `icon` sert pour tous (une paillette par
 * défaut). `colors` : les couples de couleurs des tuiles, fournis par la page (ceux
 * des jeux de l'app, ou celui d'un seul jeu), qui tournent d'un point à l'autre.
 */
export function IconList({
  items,
  icons,
  icon = Sparkle,
  colors,
  surface = "light",
  className = "",
}: {
  items: readonly string[];
  icons?: readonly LucideIcon[];
  icon?: LucideIcon;
  /** Au moins un couple (noms de propriétés CSS d'un jeu, `GameEntry.color`). */
  colors: readonly GameColor[];
  /** `dark` sur la bande violet profond. */
  surface?: keyof typeof TILE_CLASSES;
  className?: string;
}) {
  if (icons && icons.length !== items.length) {
    throw new Error(
      `IconList : ${icons.length} icônes pour ${items.length} points. Une icône par point, dans l'ordre des items.`,
    );
  }
  if (colors.length === 0) {
    throw new Error("IconList : il faut au moins un couple de couleurs.");
  }
  return (
    <ul role="list" className={`grid gap-5 ${className}`}>
      {items.map((item, index) => {
        const Icon = icons?.[index] ?? icon;
        return (
          <li key={item} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              style={gameColorVars(colors[index % colors.length])}
              className={`flex size-11 shrink-0 items-center justify-center rounded-[0.875rem] ${TILE_CLASSES[surface]}`}
            >
              <Icon className="size-5" strokeWidth={2.25} />
            </span>
            <span className="max-w-[65ch] pt-[0.45rem] text-lg leading-relaxed">
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
