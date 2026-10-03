import { getHubCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { SceneBackground } from "@/components/ui/SceneBackground";

// La photo de la table (croissant, jus d'orange, grille de mots croisés, crayon), en
// deux cadrages. Le point de bascule est le `lg` de Tailwind : il doit rester
// synchronisé avec les classes `lg:` du héros ci-dessous.
const TABLE_SCENE = {
  wide: "/images/hero/hero-bg-desktop.webp",
  narrow: "/images/hero/hero-bg-mobile.webp",
} as const;

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
      {/* C'est l'image LCP de la page. */}
      <SceneBackground
        scene={TABLE_SCENE}
        breakpoint={1024}
        sizes="100vw"
        priority
        className="object-[50%_60%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-canvas/95 from-20% via-canvas/70 via-55% to-transparent lg:bg-linear-to-l lg:from-canvas/92 lg:from-30% lg:via-canvas/72 lg:via-60% lg:to-transparent"
      />
      <div className="relative mx-auto w-full max-w-6xl px-gutter py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-xl text-center lg:mr-0 lg:ml-auto lg:max-w-[34rem] lg:text-left">
          <h1 id="home-title">
            {/* Le nom du studio dans le violet profond de la marque, sobre. */}
            <span className="block text-6xl leading-none tracking-[-0.03em] text-brand-violet-deep sm:text-7xl lg:text-8xl">
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
