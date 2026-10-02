import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./PhoneFrame.module.css";

/** Les captures du site sont des webp de 800 px de large (rapport de l'iPhone 16 Pro Max). */
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 1738;

/**
 * Téléphone dessiné en CSS autour d'une capture réelle de l'app. Composant
 * serveur : l'image reste rendue côté serveur (et peut donc être le LCP).
 * `priority` ne se pose que si l'appelant dit que cette capture est le LCP,
 * c'est-à-dire sur le héros : `preload` (la propriété `priority` de next/image est
 * dépréciée depuis Next 16) ET `fetchpriority="high"` (`preload` ne pose que le
 * premier) ; partout ailleurs elle charge paresseusement.
 * `rotate` est l'inclinaison de repos en degrés (le suivi du pointeur,
 * `TiltOnPointer`, s'ajoute par-dessus).
 */
export function PhoneFrame({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 360px, 70vw",
  rotate = 0,
  className = "",
}: {
  src: string;
  /** Description de la capture, localisée : le téléphone n'est pas décoratif. */
  alt: string;
  priority?: boolean;
  sizes?: string;
  rotate?: number;
  className?: string;
}) {
  const style = { "--phone-rotate": `${rotate}deg` } as CSSProperties;

  return (
    <div className={`${styles.frame} ${className}`} style={style}>
      <div className={styles.bezel}>
        <div className={styles.screen}>
          <Image
            src={src}
            alt={alt}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            sizes={sizes}
            preload={priority}
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
