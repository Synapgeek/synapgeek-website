/** Délai entre deux slides en lecture automatique. */
export const AUTOPLAY_MS = 6000;

/**
 * État du slider, sans rien du DOM :
 * - `paused` : l'arrêt demandé par le visiteur (bouton pause) ;
 * - `held` : l'arrêt temporaire du survol et du focus clavier, qui ne touche jamais
 *   à `paused` (relâcher le survol ne relance pas ce que le visiteur a arrêté).
 */
export interface SliderState {
  index: number;
  count: number;
  paused: boolean;
  held: boolean;
}

export type SliderAction =
  | { type: "next" }
  | { type: "previous" }
  | { type: "goTo"; index: number }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "hold" }
  | { type: "release" };

export function initialSliderState(count: number): SliderState {
  return { index: 0, count, paused: false, held: false };
}

function moveTo(state: SliderState, index: number): SliderState {
  return index === state.index ? state : { ...state, index };
}

/** Un réducteur qui ne change rien rend le même objet, pour que React ne re-rende pas. */
export function sliderReducer(
  state: SliderState,
  action: SliderAction,
): SliderState {
  switch (action.type) {
    case "next":
      return moveTo(state, (state.index + 1) % state.count);
    case "previous":
      return moveTo(state, (state.index - 1 + state.count) % state.count);
    case "goTo":
      return Number.isInteger(action.index) &&
        action.index >= 0 &&
        action.index < state.count
        ? moveTo(state, action.index)
        : state;
    case "pause":
      return state.paused ? state : { ...state, paused: true };
    case "resume":
      return state.paused ? { ...state, paused: false } : state;
    case "hold":
      return state.held ? state : { ...state, held: true };
    case "release":
      return state.held ? { ...state, held: false } : state;
  }
}

/** La lecture automatique tourne seulement si rien ne l'arrête (WCAG 2.2.2) ; jamais en mouvement réduit. */
export function isAutoplaying(
  state: SliderState,
  reducedMotion: boolean,
): boolean {
  return state.count > 1 && !state.paused && !state.held && !reducedMotion;
}

/** « 2 sur 5 » : le gabarit localisé porte `{current}` et `{total}`. */
export function formatSlideLabel(
  template: string,
  current: number,
  total: number,
): string {
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}
