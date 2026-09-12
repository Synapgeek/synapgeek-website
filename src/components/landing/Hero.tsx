import ReactDOM from "react-dom";
import Image, { getImageProps } from "next/image";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { IPhoneSlider } from "@/components/landing/IPhoneSlider";
import type { StoreDownload, HeroSlider } from "@/content/types";
import type { Locale } from "@/lib/i18n";

// Breakpoint Tailwind `lg` : au-delà, le fond desktop s'affiche ; en-deçà, le
// fond mobile. Doit rester synchronisé avec les classes `lg:` du reste du hero.
const DESKTOP_BREAKPOINT = "(min-width: 1024px)";
const MOBILE_BREAKPOINT = "(max-width: 1023px)";

/**
 * Fond du hero, en « art direction » (motif documenté par next/image) : un
 * seul <picture> avec deux <source media>, plutôt que deux <Image priority>
 * gardés/masqués en CSS. Avec deux <Image>, les DEUX étaient téléchargées et
 * préchargées quel que soit le breakpoint (le `hidden` Tailwind ne coupe pas
 * le fetch) ; ici le navigateur ne télécharge et ne précharge que la source
 * dont le `media` correspond.
 */
function HeroBackground() {
  const common = {
    alt: "",
    fill: true,
    sizes: "100vw",
    priority: true,
  } as const;

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/images/hero/hero-bg-desktop.webp",
  });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({
    ...common,
    src: "/images/hero/hero-bg-mobile.webp",
  });

  /**
   * Préchargement manuel, gardé par `media`.
   *
   * La doc next/image le documente explicitement : le préchargement
   * automatique de `<Image priority>` ne gère pas l'art direction (il
   * préchargeait les DEUX fonds, quel que soit le breakpoint — c'était le
   * bug initial). `ReactDOM.preload` avec `media` produit deux <link> dans
   * le HTML, mais chacun ne s'active que si son media matche : un seul est
   * donc réellement téléchargé par le navigateur, jamais les deux.
   */
  ReactDOM.preload("/images/hero/hero-bg-desktop.webp", {
    as: "image",
    imageSrcSet: desktopSrcSet,
    imageSizes: "100vw",
    media: DESKTOP_BREAKPOINT,
    fetchPriority: "high",
  });
  ReactDOM.preload("/images/hero/hero-bg-mobile.webp", {
    as: "image",
    imageSrcSet: mobileSrcSet,
    imageSizes: "100vw",
    media: MOBILE_BREAKPOINT,
    fetchPriority: "high",
  });

  return (
    // `<picture>` ne supporte pas aria-hidden (jsx-a11y/aria-unsupported-elements) :
    // l'attribut est porté par le <img> effectif, qui suffit à masquer l'image aux AT.
    <picture>
      <source media={DESKTOP_BREAKPOINT} srcSet={desktopSrcSet} />
      <source media={MOBILE_BREAKPOINT} srcSet={mobileSrcSet} />
      {/* Fallback (et source effective si aucun média ne matche) : le fond mobile */}
      <img
        {...imgProps}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    store: StoreDownload;
    slider: HeroSlider;
  };
}) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background scene */}
      <HeroBackground />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent lg:from-white/85 lg:via-white/50 lg:to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:items-start lg:gap-16 lg:py-12 xl:py-16 2xl:py-20 [@media(min-width:1280px)_and_(max-height:800px)]:py-10">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Cerebrum identity lockup */}
          <div className="cerebrum-lockup animate-fade-in-up relative mb-6 lg:mb-4">
            {/* Sparkle particles */}
            <div className="cerebrum-sparkles" aria-hidden="true">
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle cerebrum-sparkle--star" />
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle cerebrum-sparkle--star" />
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle" />
            </div>

            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
              {/* Icon with glow + reflection */}
              <div className="cerebrum-icon-glow relative flex-shrink-0">
                <Image
                  src="/images/brand/cerebrum-icon.png"
                  alt="Cerebrum"
                  width={112}
                  height={112}
                  className="cerebrum-icon-img h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] lg:h-[120px] lg:w-[120px]"
                  priority
                />
                <div className="cerebrum-icon-reflection" aria-hidden="true" />
              </div>

              {/* Nom de l'app = unique h1 de la page. `font-body` reproduit la
                  police héritée de l'ancien <span> (les h1 passent en DM Sans). */}
              <h1 className="cerebrum-name font-body text-[2.75rem] font-extrabold leading-none tracking-tight sm:text-[3.25rem] lg:text-[4rem]">
                Cerebrum
              </h1>
            </div>
          </div>

          <Badge color="green" className="animate-fade-in-up delay-100">
            <Sparkles className="h-3 w-3" />
            {dict.badge}
          </Badge>

          {/* Golden separator — animated shimmer */}
          <div
            className="animate-fade-in-up delay-100 my-5 lg:my-4"
            aria-hidden="true"
          >
            <div className="cerebrum-separator" />
          </div>

          {/* Slogan : ancien h1, rendu identique. `font-sans` garde la police
              des titres (DM Sans) qu'il tenait de la règle globale h1. */}
          <p className="animate-fade-in-up delay-200 font-sans text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {dict.title}
          </p>

          <p className="animate-fade-in-up delay-300 mt-6 lg:mt-5 max-w-lg text-lg leading-relaxed text-text-secondary">
            {dict.subtitle}
          </p>

          <div className="animate-fade-in-up delay-400 mt-8 lg:mt-6">
            <StoreButtons locale={locale} dict={dict.store} />
          </div>
        </div>

        {/* iPhone mockup slider */}
        <div className="animate-fade-in-up delay-400 flex flex-1 justify-center lg:justify-end">
          <div className="iphone-tilt">
            <IPhoneSlider locale={locale} dict={dict.slider} />
          </div>
        </div>
      </div>
    </section>
  );
}
