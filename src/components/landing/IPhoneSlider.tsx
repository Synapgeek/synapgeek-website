"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";

// Identifiant stable de chaque écran (indépendant de la locale, sert de clé React)
type SlideId = "home" | "sudoku" | "daily" | "victory" | "profile";

interface SlideDefinition {
  id: SlideId;
  // Texte alternatif par locale — doit décrire ce qui est réellement visible à l'écran
  alt: Record<Locale, string>;
}

interface Slide {
  id: SlideId;
  src: string;
  alt: string;
}

const SLIDE_DEFINITIONS: SlideDefinition[] = [
  {
    id: "home",
    alt: {
      fr: "Écran d'accueil de Cerebrum présentant les jeux Sudoku, Mots Croisés, Mots Mêlés et Cross Math",
      en: "Cerebrum home screen showing the Sudoku, Crossword, Word Search, and Cross Math games",
    },
  },
  {
    id: "sudoku",
    alt: {
      fr: "Partie de Sudoku dans Cerebrum avec une grille partiellement remplie et le pavé numérique",
      en: "Cerebrum Sudoku gameplay with a partially filled grid and number pad",
    },
  },
  {
    id: "daily",
    alt: {
      fr: "Calendrier du défi quotidien de Cerebrum avec les jours complétés marqués d'étoiles",
      en: "Cerebrum Daily Challenge calendar with completed days marked by stars",
    },
  },
  {
    id: "victory",
    alt: {
      fr: "Écran de victoire de Cerebrum avec trois étoiles, un nouveau record et la progression de ligue",
      en: "Cerebrum victory screen with three stars, a new record and league progress",
    },
  },
  {
    id: "profile",
    alt: {
      fr: "Écran de profil de Cerebrum avec l'avatar du joueur, sa progression de ligue et ses trophées mensuels",
      en: "Cerebrum profile screen with the player's avatar, league progress and monthly trophies",
    },
  },
];

// Libellés ARIA du carrousel, localisés (le composant connaît désormais la locale
// affichée : autant éviter de mélanger de l'anglais dans une page servie en français)
const UI_TEXT: Record<
  Locale,
  {
    carouselLabel: string;
    slideLabel: (index: number, total: number) => string;
    tablistLabel: string;
    goToSlide: (index: number) => string;
  }
> = {
  fr: {
    carouselLabel: "Captures d'écran de l'application Cerebrum",
    slideLabel: (index, total) => `Diapositive ${index} sur ${total}`,
    tablistLabel: "Contrôles du diaporama",
    goToSlide: (index) => `Aller à la diapositive ${index}`,
  },
  en: {
    carouselLabel: "Cerebrum app screenshots",
    slideLabel: (index, total) => `Slide ${index} of ${total}`,
    tablistLabel: "Slide controls",
    goToSlide: (index) => `Go to slide ${index}`,
  },
};

const AUTOPLAY_INTERVAL = 4000;

interface IPhoneSliderProps {
  locale: Locale;
}

export function IPhoneSlider({ locale }: IPhoneSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  // Slides résolues pour la locale courante (source de l'image + alt traduit)
  const slides = useMemo<Slide[]>(
    () =>
      SLIDE_DEFINITIONS.map((slide) => ({
        id: slide.id,
        src: `/images/hero/screen-${slide.id}-${locale}.webp`,
        alt: slide.alt[locale],
      })),
    [locale],
  );

  const text = UI_TEXT[locale];

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  /**
   * Défilement automatique.
   *
   * Il est coupé net si l'utilisateur a demandé moins d'animation : neutraliser
   * le fondu en CSS ne suffisait pas, les captures se remplaçaient alors en
   * coupe franche toutes les 4 s (WCAG 2.2.2). `restartKey` est incrémenté à
   * chaque clic pour relancer un cycle complet plutôt que de reprendre au
   * milieu du précédent.
   */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || isPaused) return;

    const id = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused, goToNext, restartKey]);

  const handleDotClick = useCallback(
    (index: number) => {
      goToSlide(index);
      // Sans ceci, l'effet ci-dessus n'est pas réexécuté : au tap tactile (pas
      // de `mouseleave` pour rattraper), le carrousel ne repartait jamais.
      setRestartKey((k) => k + 1);
    },
    [goToSlide],
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
        aria-label={text.carouselLabel}
      >
        {/* Dynamic Island */}
        <div className="iphone-dynamic-island" aria-hidden="true" />

        {/* Screen */}
        <div className="iphone-screen">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="iphone-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={text.slideLabel(index + 1, slides.length)}
              aria-hidden={index !== activeIndex}
              data-active={index === activeIndex}
            >
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
                priority={index === 0}
              />
            </div>
          ))}
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
        aria-label={text.tablistLabel}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={text.goToSlide(index + 1)}
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
