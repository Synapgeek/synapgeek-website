import { getImageProps } from "next/image";

/** Une scène photographique en deux cadrages : paysage (`wide`) et portrait (`narrow`). */
export interface Scene {
  wide: string;
  narrow: string;
}

/**
 * La scène en « art direction » : un seul <picture> à deux <source media>, donc une
 * seule image téléchargée selon la largeur, jamais les deux. Décorative, elle couvre
 * son parent positionné (`absolute inset-0`). Avec `priority` (image LCP d'un héros),
 * l'<img> sort en `loading="eager"` + `fetchpriority="high"` : le navigateur la découvre
 * dans le HTML servi et la charge en premier. Aucun préchargement n'est posé à la main :
 * un `ReactDOM.preload` appelé depuis un composant serveur part dans le flux RSC
 * (indice `:HL`) et fait précharger l'image à chaque navigation client vers une autre
 * page, jusque sur les pages qui ne la montrent pas. Sans `priority`, elle charge
 * paresseusement.
 */
export function SceneBackground({
  scene,
  breakpoint,
  sizes,
  priority = false,
  className = "",
}: {
  scene: Scene;
  /** Largeur en px à partir de laquelle le cadrage paysage remplace le portrait. */
  breakpoint: number;
  sizes: string;
  priority?: boolean;
  /** Classes de l'<img> (cadrage `object-*` par exemple). */
  className?: string;
}) {
  const wideMedia = `(min-width: ${breakpoint}px)`;
  const narrowMedia = `(max-width: ${breakpoint - 1}px)`;
  const common = {
    alt: "",
    fill: true,
    sizes,
    loading: priority ? "eager" : "lazy",
  } as const;
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ ...common, src: scene.wide });
  const {
    props: { srcSet: narrowSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: scene.narrow });

  return (
    // `<picture>` n'accepte pas aria-hidden : l'attribut est porté par l'<img> effective.
    <picture>
      <source media={wideMedia} srcSet={wideSrcSet} sizes={sizes} />
      <source media={narrowMedia} srcSet={narrowSrcSet} sizes={sizes} />
      <img
        {...imgProps}
        alt=""
        aria-hidden="true"
        fetchPriority={priority ? "high" : undefined}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
