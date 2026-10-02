"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  useEffect,
  useReducer,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  AUTOPLAY_MS,
  formatSlideLabel,
  initialSliderState,
  isAutoplaying,
  sliderReducer,
} from "./slider-state";

/** Noms accessibles des commandes, déjà localisés (module de copie du hub). */
export interface SliderLabels {
  /** Gabarit du nom d'une slide, avec `{current}` et `{total}`. */
  slide: string;
  /** Gabarit du nom d'un point, avec `{current}`. */
  goTo: string;
  previous: string;
  next: string;
  pause: string;
  play: string;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
// Rendu serveur et hydratation : on suppose le mouvement permis, le client corrige ensuite.
const getServerReducedMotion = () => false;

function subscribePageLoad(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}

const getPageLoaded = () => document.readyState === "complete";
const getServerPageLoaded = () => false;

const CONTROL =
  "inline-flex size-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-rest transition-[box-shadow,transform] duration-150 ease-out hover:shadow-raised active:scale-[0.97]";

/**
 * Le carrousel de l'accueil (motif WAI-ARIA APG), îlot client minimal : les
 * slides arrivent déjà rendues par le serveur, tout leur texte est donc dans le
 * HTML servi, la première visible au premier affichage. Les slides sont
 * empilées dans une même cellule de grille : la hauteur est celle de la plus
 * haute et ne bouge jamais d'une slide à l'autre. Une slide inactive est
 * `aria-hidden`, `inert` et masquée (`visibility`), jamais seulement transparente.
 *
 * Défilement toutes les 6 s, arrêté par le bouton pause, au survol de la souris
 * et au focus clavier, et jamais lancé sous prefers-reduced-motion (WCAG 2.2.2).
 */
export function HeroSlider({
  label,
  labels,
  slides,
}: {
  /** Nom de la région carrousel. */
  label: string;
  labels: SliderLabels;
  slides: readonly ReactNode[];
}) {
  const total = slides.length;
  const [state, dispatch] = useReducer(
    sliderReducer,
    total,
    initialSliderState,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const autoplaying = isAutoplaying(state, reducedMotion);

  // Les visuels des slides cachées ne se chargent qu'une fois la page chargée (voir globals.css).
  const warm = useSyncExternalStore(
    subscribePageLoad,
    getPageLoaded,
    getServerPageLoaded,
  );

  // Chaque changement de slide, manuel ou automatique, relance le délai.
  useEffect(() => {
    if (!autoplaying) return;
    const timer = window.setTimeout(
      () => dispatch({ type: "next" }),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [autoplaying, state.index]);

  const onPointerEnter = (event: PointerEvent) => {
    // Le survol n'existe qu'à la souris : un toucher ne doit pas figer le défilement.
    if (event.pointerType === "mouse") dispatch({ type: "hold" });
  };
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    // Le focus clavier arrête le défilement, le focus laissé par un clic non.
    if (event.target.matches(":focus-visible")) dispatch({ type: "hold" });
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch({ type: "release" });
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      data-warm={warm ? "" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => dispatch({ type: "release" })}
      onFocus={onFocus}
      onBlur={onBlur}
      className="relative overflow-hidden"
    >
      <div
        aria-live={autoplaying ? "off" : "polite"}
        className="grid [&>*]:col-start-1 [&>*]:row-start-1"
      >
        {slides.map((slide, index) => {
          const active = index === state.index;
          return (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={formatSlideLabel(labels.slide, index + 1, total)}
              aria-hidden={active ? undefined : true}
              inert={!active}
              className={`flex flex-col transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none *:flex-1 ${
                active ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              {slide}
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 sm:bottom-6">
        <div className="mx-auto flex max-w-6xl justify-center px-gutter lg:justify-start">
          <div className="pointer-events-auto flex items-center gap-1 rounded-pill bg-canvas p-1 shadow-rest">
            {!reducedMotion && (
              <button
                type="button"
                aria-label={state.paused ? labels.play : labels.pause}
                onClick={() =>
                  dispatch({ type: state.paused ? "resume" : "pause" })
                }
                className={CONTROL}
              >
                {state.paused ? (
                  <Play aria-hidden="true" className="size-5" />
                ) : (
                  <Pause aria-hidden="true" className="size-5" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => dispatch({ type: "previous" })}
              className={CONTROL}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            {/* Sous sm, cinq points de 44 px et trois boutons de 44 px ne tiennent
                pas dans 350 px : la position passe en texte, précédent et suivant
                restent les deux voies de navigation. */}
            <span
              aria-hidden="true"
              className="min-w-14 px-1 text-center text-sm font-semibold text-ink sm:hidden"
            >
              {formatSlideLabel(labels.slide, state.index + 1, total)}
            </span>
            <ul className="hidden items-center sm:flex">
              {slides.map((_, index) => {
                const active = index === state.index;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      aria-label={formatSlideLabel(
                        labels.goTo,
                        index + 1,
                        total,
                      )}
                      aria-current={active ? "true" : undefined}
                      onClick={() => dispatch({ type: "goTo", index })}
                      className="group inline-flex size-11 items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className={`block h-3 rounded-pill border-2 border-ink transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none ${
                          active ? "w-6 bg-ink" : "w-3 bg-transparent"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => dispatch({ type: "next" })}
              className={CONTROL}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
