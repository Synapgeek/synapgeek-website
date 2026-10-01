import type { CSSProperties } from "react";

/** Noms de propriétés CSS d'un jeu, tels que `GameEntry.color` les porte. */
export interface GameColor {
  wash: string;
  deep: string;
}

/** Part de blanc du voile de survol/focus (voir `gameColorVars`). */
export const TINT_CANVAS_PERCENT = 35;

/**
 * Variables locales d'un jeu : `--wash` (lavis, fond) et `--deep` (ton profond,
 * texte sur le lavis, AA vérifié par design-tokens.test.ts). Aucune valeur de
 * couleur ici : seulement des références aux propriétés de globals.css.
 * `--tint` est le voile du survol et du focus : du blanc (`--color-canvas`) sur
 * le lavis, jamais le ton deep. Assombrir le fond fait perdre au texte `--deep`
 * son 4.5:1 (marge de départ 0.1 à 0.23 seulement) ; éclaircir ne peut que
 * l'augmenter. design-tokens/game-colors.test.ts le vérifie pour chaque jeu.
 */
export function gameColorVars(color: GameColor): CSSProperties {
  return {
    "--wash": `var(${color.wash})`,
    "--deep": `var(${color.deep})`,
    "--tint": `color-mix(in srgb, var(--color-canvas) ${TINT_CANVAS_PERCENT}%, transparent)`,
  } as CSSProperties;
}
