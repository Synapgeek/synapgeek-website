"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { HeroSlideId, HeroSlider } from "@/content/types";

// Identifiant stable de chaque écran (indépendant de la locale, sert de clé React) :
// dérivé de `alts`, dont les clés sont figées dans src/content/types.ts.
const SLIDE_IDS: HeroSlideId[] = [
  "home",
  "pandoku",
  "pixelart",
  "daily",
  "progression",
];

// Dossier versionné : /images/* est mis en cache 7 jours (vercel.json), un
// remplacement sous le même nom ne suffirait pas. Nouveau lot de captures =
// nouveau dossier (v4, …).
const SCREENSHOT_DIR = "/images/hero/v3";

interface Slide {
  id: HeroSlideId;
  src: string;
  alt: string;
}

const AUTOPLAY_INTERVAL = 4000;

// Lu à chaque (re)démarrage du minuteur (effet ou clic sur un point) plutôt que
// mémorisé une seule fois : le réglage système peut changer pendant la visite.
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface IPhoneSliderProps {
  locale: Locale;
  // Textes localisés du carrousel, fournis par src/content/{fr,en}.ts — aucun texte
  // en dur ici, ces libellés sont lus par les lecteurs d'écran et indexés par Google Images.
  dict: HeroSlider;
}

export function IPhoneSlider({ locale, dict }: IPhoneSliderProps) {
  // `previous` reste monté, pleinement opaque, sous `active` pendant le
  // fondu : sans lui, les deux captures fondent l'une SUR l'autre au même
  // rythme et leurs textes se lisent en transparence l'un à travers l'autre.
  const [slideIndex, setSlideIndex] = useState<{
    active: number;
    previous: number | null;
  }>({ active: 0, previous: null });
  const { active: activeIndex, previous: previousIndex } = slideIndex;
  const [isPaused, setIsPaused] = useState(false);
  // Id du `setInterval` en cours : conservé dans un ref (et non un état) pour
  // pouvoir le stopper/relancer de façon synchrone depuis `handleDotClick`,
  // sans modéliser ce clic comme un état supplémentaire consommé par l'effet.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Les diapositives 2 à 5 ne sont montées qu'une fois la première chargée :
  // au premier rendu, les 5 captures se téléchargeaient alors que 4 étaient
  // invisibles.
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false);

  // Slides résolues pour la locale courante (source de l'image + alt traduit)
  const slides = useMemo<Slide[]>(
    () =>
      SLIDE_IDS.map((id) => ({
        id,
        src: `${SCREENSHOT_DIR}/screen-${id}-${locale}.webp`,
        alt: dict.alts[id],
      })),
    [locale, dict],
  );

  const goToSlide = useCallback((index: number) => {
    setSlideIndex((prev) => ({ active: index, previous: prev.active }));
  }, []);

  const goToNext = useCallback(() => {
    setSlideIndex((prev) => ({
      active: (prev.active + 1) % slides.length,
      previous: prev.active,
    }));
  }, [slides.length]);

  /**
   * Défilement automatique.
   *
   * Il est coupé net si l'utilisateur a demandé moins d'animation : neutraliser
   * le fondu en CSS ne suffisait pas, les captures se remplaçaient alors en
   * coupe franche toutes les 4 s (WCAG 2.2.2).
   */
  useEffect(() => {
    if (prefersReducedMotion() || isPaused) return;

    intervalRef.current = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, goToNext]);

  const handleDotClick = useCallback(
    (index: number) => {
      goToSlide(index);
      // Redémarre le minuteur d'autoplay directement dans le gestionnaire :
      // sans ce clear/set synchrone (plutôt qu'un état consommé par l'effet
      // ci-dessus), le tap tactile (pas de `mouseleave` pour rattraper) ne
      // relançait jamais le carrousel.
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!prefersReducedMotion() && !isPaused) {
        intervalRef.current = setInterval(goToNext, AUTOPLAY_INTERVAL);
      }
    },
    [goToSlide, goToNext, isPaused],
  );

  return (
    <div
      className="flex flex-col items-center gap-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* iPhone Frame */}
      <div
        className="iphone-frame"
        role="region"
        aria-roledescription="carousel"
        aria-label={dict.carouselLabel}
      >
        {/* Biseau + tranche titane : boîte dédiée à fond opaque (pas de
            `border`) — cf. commentaire sur .iphone-frame dans globals.css,
            Chrome arrondit les `border-width` fractionnaires au pixel entier
            et fait sauter le rail d'un palier à l'autre. */}
        <div className="iphone-bezel">
          {/* Dynamic Island */}
          <div className="iphone-dynamic-island" aria-hidden="true" />

          {/* Screen */}
          <div className="iphone-screen">
            {slides.map((slide, index) => {
              // Diapositive active : par-dessus, en cours de fondu entrant.
              // Diapositive précédente : reste dessous, pleinement opaque,
              // le temps du fondu (cf. .iphone-slide dans globals.css).
              // Toutes les autres : masquées, sans transition.
              const state =
                index === activeIndex
                  ? "active"
                  : index === previousIndex
                    ? "previous"
                    : "idle";
              const isFirstSlide = index === 0;
              const shouldRenderImage = isFirstSlide || firstSlideLoaded;

              return (
                <div
                  key={slide.id}
                  className="iphone-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={dict.slideLabel
                    .replace("{index}", String(index + 1))
                    .replace("{total}", String(slides.length))}
                  aria-hidden={index !== activeIndex}
                  data-state={state}
                >
                  {shouldRenderImage && (
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      /* Largeurs réellement posées par le CSS : l'écran vaut 94 % de
                         --iphone-width (biseau de 3 % de chaque côté), qui change à
                         chacun des paliers de globals.css. L'ancien « 400px » au-delà
                         de 1024px faisait choisir un candidat 640w là où 384w suffit. */
                      sizes="(min-width: 1536px) 378px, (min-width: 1280px) 359px, (min-width: 1024px) 330px, (min-width: 640px) 313px, 284px"
                      className="object-cover object-top"
                      priority={isFirstSlide}
                      onLoad={
                        isFirstSlide
                          ? () => setFirstSlideLoaded(true)
                          : undefined
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Points de navigation. Volontairement de simples boutons : le motif
        `tablist`/`tab` exige des `tabpanel` reliés par `aria-controls`, que ce
        carrousel n'a pas — un lecteur d'écran annonçait « onglet 1 sur 5 » sans
        jamais pouvoir atteindre le panneau correspondant.

        Le fond translucide n'est pas décoratif : les points reposent sur la
        photo du hero, dont la clarté varie. Posés directement dessus, ils
        mesuraient 1,2:1 de contraste là où WCAG 1.4.11 en exige 3:1.
      */}
      <div
        className="flex items-center gap-0.5 rounded-full bg-white/75 px-1.5 backdrop-blur-sm"
        role="group"
        aria-label={dict.controlsLabel}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={dict.goToSlide.replace("{index}", String(index + 1))}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => handleDotClick(index)}
            className="flex items-center justify-center rounded-full p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-white"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "h-2.5 w-2.5 bg-primary-dark"
                  : "h-2 w-2 bg-text-primary/55 hover:bg-text-primary/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
