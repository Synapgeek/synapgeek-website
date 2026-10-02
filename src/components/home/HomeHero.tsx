import ReactDOM from "react-dom";
import { getImageProps } from "next/image";
import { getHubCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { Button } from "@/components/ui/Button";

// Breakpoint Tailwind `lg` : au-delà, le fond desktop s'affiche ; en-deçà, le fond
// mobile. Doit rester synchronisé avec les classes `lg:` du héros ci-dessous.
const DESKTOP_BREAKPOINT = "(min-width: 1024px)";
const MOBILE_BREAKPOINT = "(max-width: 1023px)";
const BACKGROUND = {
  desktop: "/images/hero/hero-bg-desktop.webp",
  mobile: "/images/hero/hero-bg-mobile.webp",
} as const;

/**
 * La photo de la table (croissant, jus d'orange, grille de mots croisés, crayon),
 * en « art direction » : un seul <picture> à deux <source media>, donc une seule
 * image téléchargée selon la largeur, jamais les deux. Le préchargement est posé à
 * la main, gardé par `media` : celui de next/image ne gère pas l'art direction.
 * C'est l'image LCP de la page.
 */
function TableBackground() {
  const common = { alt: "", fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: BACKGROUND.desktop });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: BACKGROUND.mobile });

  ReactDOM.preload(BACKGROUND.desktop, {
    as: "image",
    imageSrcSet: desktopSrcSet,
    imageSizes: "100vw",
    media: DESKTOP_BREAKPOINT,
    fetchPriority: "high",
  });
  ReactDOM.preload(BACKGROUND.mobile, {
    as: "image",
    imageSrcSet: mobileSrcSet,
    imageSizes: "100vw",
    media: MOBILE_BREAKPOINT,
    fetchPriority: "high",
  });

  return (
    // `<picture>` n'accepte pas aria-hidden : l'attribut est porté par l'<img> effective.
    <picture>
      <source media={DESKTOP_BREAKPOINT} srcSet={desktopSrcSet} />
      <source media={MOBILE_BREAKPOINT} srcSet={mobileSrcSet} />
      {/* Source effective si aucun média ne matche : le fond mobile. */}
      <img
        {...imgProps}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
      />
    </picture>
  );
}

/**
 * Le héros de l'accueil : la photo de la table sous un voile de la couleur de la
 * page, le nom du studio, son accroche (dans le même H1), la phrase de définition
 * que citent les assistants, puis le bouton vers la page de l'app. Sur desktop le
 * texte se pose à droite, sur le bois libre : le croissant, le jus et la grille
 * restent à gauche, sans voile épais. Sur mobile le texte est en haut, sous un voile
 * qui s'éclaircit vers le bas pour laisser voir le croissant.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const { hero } = getHubCopy(locale);

  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[min(calc(100svh-4rem),52rem)] items-start overflow-hidden text-ink lg:items-center"
    >
      <TableBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-canvas/95 from-20% via-canvas/70 via-55% to-transparent lg:bg-linear-to-l lg:from-canvas/92 lg:from-30% lg:via-canvas/72 lg:via-60% lg:to-transparent"
      />
      <div className="relative mx-auto w-full max-w-6xl px-gutter py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-xl text-center lg:mr-0 lg:ml-auto lg:max-w-[34rem] lg:text-left">
          <h1 id="home-title">
            <span className="block text-6xl leading-none tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              {hero.h1}
            </span>
            <span className="sr-only">. </span>
            <span className="mt-4 block text-2xl leading-tight font-bold tracking-[-0.01em] text-balance sm:text-3xl lg:text-4xl">
              {hero.tagline}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed sm:text-xl">
            {hero.definition}
          </p>
          <Button
            href={pagePath("cerebrum", locale)}
            size="lg"
            className="mt-8"
          >
            {hero.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
