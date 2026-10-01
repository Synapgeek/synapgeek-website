import type { CSSProperties } from "react";

/** Noms de propriétés CSS d'un jeu, tels que `GameEntry.color` les porte. */
export interface GameColor {
  wash: string;
  deep: string;
}

/**
 * Variables locales d'un jeu : `--wash` (lavis, fond) et `--deep` (ton profond,
 * texte sur le lavis, AA vérifié par design-tokens.test.ts). Aucune valeur de
 * couleur ici : seulement des références aux propriétés de globals.css.
 * `--tint` est le lavis renforcé du survol et du focus.
 */
export function gameColorVars(color: GameColor): CSSProperties {
  return {
    "--wash": `var(${color.wash})`,
    "--deep": `var(${color.deep})`,
    "--tint": `color-mix(in srgb, var(${color.deep}) 14%, transparent)`,
  } as CSSProperties;
}
