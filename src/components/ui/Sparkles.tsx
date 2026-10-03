import type { CSSProperties } from "react";

/**
 * Une paillette : position en % de sa zone, taille en `cqw` de la carte qui la porte
 * (la carte doit être un conteneur, classe `@container`), forme (étoile à quatre
 * branches ou croix arrondie) et teinte (ton profond du jeu, ou reflet clair).
 */
interface Sparkle {
  x: number;
  y: number;
  size: number;
  shape: "star" | "plus";
  tone: "deep" | "light";
}

/** Trois semis, en alternance d'une carte à l'autre, comme sur l'écran d'accueil de l'app. */
const LAYOUTS: readonly (readonly Sparkle[])[] = [
  [
    { x: 10, y: 12, size: 9, shape: "star", tone: "deep" },
    { x: 86, y: 14, size: 7, shape: "plus", tone: "light" },
    { x: 90, y: 52, size: 10, shape: "star", tone: "light" },
    { x: 9, y: 58, size: 6, shape: "plus", tone: "deep" },
    { x: 84, y: 82, size: 7, shape: "star", tone: "deep" },
  ],
  [
    { x: 12, y: 10, size: 7, shape: "plus", tone: "deep" },
    { x: 88, y: 12, size: 10, shape: "star", tone: "light" },
    { x: 8, y: 46, size: 8, shape: "star", tone: "light" },
    { x: 91, y: 64, size: 6, shape: "plus", tone: "deep" },
    { x: 14, y: 84, size: 7, shape: "star", tone: "deep" },
  ],
  [
    { x: 86, y: 10, size: 8, shape: "star", tone: "deep" },
    { x: 10, y: 20, size: 6, shape: "plus", tone: "light" },
    { x: 92, y: 42, size: 6, shape: "plus", tone: "deep" },
    { x: 8, y: 70, size: 10, shape: "star", tone: "light" },
    { x: 88, y: 84, size: 7, shape: "star", tone: "deep" },
  ],
];

function SparkleShape({ sparkle }: { sparkle: Sparkle }) {
  const style = {
    left: `${sparkle.x}%`,
    top: `${sparkle.y}%`,
    width: `${sparkle.size}cqw`,
    height: `${sparkle.size}cqw`,
  } satisfies CSSProperties;

  return (
    <svg
      viewBox="0 0 24 24"
      style={style}
      className={`absolute -translate-1/2 ${
        sparkle.tone === "deep" ? "text-(--deep)/35" : "text-canvas/90"
      }`}
    >
      {sparkle.shape === "star" ? (
        <path
          fill="currentColor"
          d="M12 0C12.7 6.1 17.9 11.3 24 12 17.9 12.7 12.7 17.9 12 24 11.3 17.9 6.1 12.7 0 12 6.1 11.3 11.3 6.1 12 0Z"
        />
      ) : (
        <path
          d="M12 4v16M4 12h16"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * Le semis de paillettes kawaii d'une carte de jeu, décoratif. Posé dans une carte
 * qui porte `@container` et les variables de `gameColorVars` ; `variant` choisit le
 * semis (on le fait tourner d'une carte à l'autre), `className` la zone couverte
 * (toute la carte par défaut).
 */
export function Sparkles({
  variant = 0,
  className = "inset-0",
}: {
  variant?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    >
      {LAYOUTS[variant % LAYOUTS.length].map((sparkle) => (
        <SparkleShape key={`${sparkle.x}-${sparkle.y}`} sparkle={sparkle} />
      ))}
    </span>
  );
}
