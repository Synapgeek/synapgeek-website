"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

const slides: Slide[] = [
  {
    src: "/hero-screen-main.png",
    alt: "Cerebrum main screen showing Sudoku, Crossword, Word Search, and Cross Math games",
  },
  {
    src: "/hero-screen-daily.png",
    alt: "Cerebrum Daily Challenge calendar with 28 out of 28 days completed",
  },
  {
    src: "/hero-screen-avatars.png",
    alt: "Cerebrum victory screen with 3 stars and Roman avatar characters",
  },
];

const AUTOPLAY_INTERVAL = 4000;

export function IPhoneSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(goToNext, AUTOPLAY_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, goToNext]);

  // Reset interval when user manually changes slide
  const handleDotClick = useCallback(
    (index: number) => {
      goToSlide(index);
      // Reset autoplay timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
        aria-label="Cerebrum app screenshots"
      >
        {/* Dynamic Island */}
        <div className="iphone-dynamic-island" aria-hidden="true" />

        {/* Screen */}
        <div className="iphone-screen">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className="iphone-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              aria-hidden={index !== activeIndex}
              data-active={index === activeIndex}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 260px, 300px"
                className="object-cover object-top"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2.5" role="tablist" aria-label="Slide controls">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "h-2.5 w-2.5 bg-primary shadow-sm shadow-primary/40"
                : "h-2 w-2 bg-text-tertiary/40 hover:bg-text-tertiary/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
