"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { approach, tiltTarget, type Point, type Tilt } from "./tilt";

const REST: Tilt = { rotateX: 0, rotateY: 0 };
/** En dessous de ce reste (en degrés), on arrête la boucle d'animation. */
const SETTLE_EPSILON = 0.01;

/**
 * Îlot client minimal : incline ses enfants (rendus côté serveur, l'image du
 * héros reste donc le LCP) de ±`maxDeg` vers le pointeur, amorti. Décoratif :
 * actif seulement avec un pointeur précis, immobile sous prefers-reduced-motion.
 *
 * Aucun setState au `pointermove` : l'écouteur (passif) ne mémorise que la
 * position, et une boucle `requestAnimationFrame` lit le rectangle puis écrit le
 * `transform` (une lecture, une écriture par image), jusqu'à l'arrêt au repos.
 */
export function TiltOnPointer({
  children,
  maxDeg = 5,
  className,
}: {
  children: ReactNode;
  maxDeg?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pointer: Point | null = null;
    let current: Tilt = REST;
    let frame = 0;
    let last = 0;

    const enabled = () => finePointer.matches && !reduceMotion.matches;

    const write = (tilt: Tilt) => {
      el.style.transform =
        tilt === REST
          ? ""
          : `perspective(1000px) rotateX(${tilt.rotateX.toFixed(3)}deg) rotateY(${tilt.rotateY.toFixed(3)}deg)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const target = pointer
        ? tiltTarget(
            pointer,
            el.getBoundingClientRect(),
            { width: window.innerWidth, height: window.innerHeight },
            maxDeg,
          )
        : REST;
      current = {
        rotateX: approach(current.rotateX, target.rotateX, dt),
        rotateY: approach(current.rotateY, target.rotateY, dt),
      };
      const settled =
        Math.abs(current.rotateX - target.rotateX) < SETTLE_EPSILON &&
        Math.abs(current.rotateY - target.rotateY) < SETTLE_EPSILON;
      if (settled && !pointer) {
        current = REST;
        write(REST);
        el.style.willChange = "";
        frame = 0;
        return;
      }
      write(current);
      // Pointeur posé et rattrapé : on attend le prochain mouvement, la boucle repart alors.
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      el.style.willChange = "transform";
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!enabled() || event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    };

    const onLeave = () => {
      pointer = null;
      if (current !== REST) start();
    };

    const stopAndReset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      current = REST;
      write(REST);
      el.style.willChange = "";
    };

    const onPreferenceChange = () => {
      if (!enabled()) stopAndReset();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave, {
      passive: true,
    });
    window.addEventListener("blur", onLeave);
    finePointer.addEventListener("change", onPreferenceChange);
    reduceMotion.addEventListener("change", onPreferenceChange);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      finePointer.removeEventListener("change", onPreferenceChange);
      reduceMotion.removeEventListener("change", onPreferenceChange);
      stopAndReset();
    };
  }, [maxDeg]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
