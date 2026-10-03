import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import styles from "./PhoneFrame.module.css";

/** Les captures du site sont des webp de 800 px de large (rapport de l'iPhone 16 Pro Max). */
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 1738;

/**
 * L'écran montre soit une capture réelle de l'app (`src` + `alt`), soit un contenu
 * HTML (`children`) posé dans une boîte aux proportions de la capture, qui sert de
 * conteneur : ses enfants se dimensionnent en `cqw` et suivent la taille du téléphone.
 * `priority` et `sizes` ne concernent que l'image : le mode `children` les interdit.
 */
type ScreenProps =
  | {
      src: string;
      /** Description de la capture, localisée : le téléphone n'est pas décoratif. */
      alt: string;
      /** Cette capture est le LCP de la page (héros) : préchargée, `fetchpriority="high"`. */
      priority?: boolean;
      sizes?: string;
      children?: never;
    }
  | {
      children: ReactNode;
      src?: never;
      alt?: never;
      priority?: never;
      sizes?: never;
    };

/**
 * Téléphone dessiné en CSS autour d'une capture réelle ou d'un écran HTML. Composant
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
  children,
  priority = false,
  sizes = "(min-width: 1024px) 360px, 70vw",
  rotate = 0,
  className = "",
}: ScreenProps & {
  rotate?: number;
  className?: string;
}) {
  const style = { "--phone-rotate": `${rotate}deg` } as CSSProperties;

  return (
    <div className={`${styles.frame} ${className}`} style={style}>
      <div className={styles.bezel}>
        <div className={styles.screen}>
          {src === undefined ? (
            <div className={styles.content}>{children}</div>
          ) : (
            <Image
              src={src}
              alt={alt}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              sizes={sizes}
              preload={priority}
              fetchPriority={priority ? "high" : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
