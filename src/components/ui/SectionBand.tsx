import { useId, type ReactNode } from "react";
import { gameColorVars, type GameColor } from "./game-colors";

/**
 * Tons d'une bande de page :
 * - canvas : fond blanc ; soft : fond gris-bleu très clair ;
 * - violet-deep : la section profonde unique d'une page (texte blanc) ;
 * - game-wash : lavis d'un jeu (`color`, noms de propriétés de `GameEntry`).
 */
type ToneProps =
  | { tone?: "canvas" | "soft" | "violet-deep"; color?: never }
  | { tone: "game-wash"; color: GameColor };

const TONE_CLASSES = {
  canvas: "bg-canvas text-ink",
  soft: "bg-canvas-soft text-ink",
  "violet-deep": "band-violet-deep bg-brand-violet-deep text-canvas",
  "game-wash": "bg-(--wash) text-ink",
} as const;

const INTRO_CLASSES = {
  canvas: "text-text-secondary",
  soft: "text-text-secondary",
  "violet-deep": "text-canvas/85",
  "game-wash": "text-ink/80",
} as const;

type SectionBandProps = ToneProps & {
  /** Ancre de la section : `scroll-margin-top` de 6 rem sous l'en-tête collant. */
  id?: string;
  /** Titre H2 de la section ; sans titre, la bande est un simple conteneur. */
  title?: string;
  intro?: string;
  /** `prose` : colonne de lecture étroite (pages de jeu). */
  width?: "wide" | "prose";
  /** Fondu d'entrée piloté par le défilement ; `false` pour la bande du premier écran. */
  enter?: boolean;
  children?: ReactNode;
  className?: string;
};

/** Bande de page pleine largeur : fond, rythme vertical, gouttières, titre H2. */
export function SectionBand({
  tone = "canvas",
  color,
  id,
  title,
  intro,
  width = "wide",
  enter = true,
  children,
  className = "",
}: SectionBandProps) {
  const titleId = useId();

  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      style={color ? gameColorVars(color) : undefined}
      className={`scroll-mt-24 py-section ${TONE_CLASSES[tone]} ${className}`}
    >
      <div
        className={`mx-auto px-gutter ${enter ? "band-enter" : ""} ${
          width === "prose" ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        {title && (
          <div className="mb-10 sm:mb-12">
            <h2
              id={titleId}
              className="text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
            {intro && (
              <p
                className={`mt-4 max-w-[65ch] text-lg leading-relaxed ${INTRO_CLASSES[tone]}`}
              >
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
