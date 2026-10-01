/**
 * Maths du téléphone qui suit le pointeur (`TiltOnPointer`). Fonctions pures :
 * le composant ne fait que lire le DOM et écrire un `transform`.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Tilt {
  rotateX: number;
  rotateY: number;
}

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

/**
 * Angle visé pour un pointeur donné : la surface tourne vers lui. L'écart au
 * centre de l'élément est rapporté à la demi-taille du viewport, donc l'angle
 * maximal n'est atteint qu'au bord de l'écran (amorti par la distance), et
 * jamais dépassé.
 * - pointeur à droite : `rotateY` positif, le bord droit recule ;
 * - pointeur en bas : `rotateX` négatif, le bord bas recule.
 */
export function tiltTarget(
  pointer: Point,
  box: Box,
  viewport: { width: number; height: number },
  maxDeg: number,
): Tilt {
  const dx = (pointer.x - (box.left + box.width / 2)) / (viewport.width / 2);
  const dy = (pointer.y - (box.top + box.height / 2)) / (viewport.height / 2);
  // `+ 0` normalise -0 en 0 (rotateX négatif d'un pointeur au centre).
  return {
    rotateX: -clamp(dy, 1) * maxDeg + 0,
    rotateY: clamp(dx, 1) * maxDeg + 0,
  };
}

/** Constante de temps de l'amorti, en ms : le téléphone rattrape le pointeur en ~0,4 s. */
export const TILT_TAU_MS = 120;

/**
 * Amorti exponentiel indépendant de la cadence : deux pas de 8 ms valent un
 * pas de 16 ms. Critique (aucun dépassement), comme un ressort à amortissement 1.
 */
export function approach(
  current: number,
  target: number,
  dtMs: number,
  tauMs: number = TILT_TAU_MS,
): number {
  return target + (current - target) * Math.exp(-dtMs / tauMs);
}
