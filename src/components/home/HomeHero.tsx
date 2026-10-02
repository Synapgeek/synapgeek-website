import Image from "next/image";
import type { ReactNode } from "react";
import { getApp, getGames } from "@/content/apps";
import { getHubCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { TiltOnPointer } from "@/components/ui/TiltOnPointer";
import { gameColorVars } from "@/components/ui/game-colors";
import { HeroSlider } from "./HeroSlider";

/** Fond pleine largeur d'une slide : un lavis de la palette, jamais le violet profond (réservé à une seule bande). */
const TONES = {
  canvas: "bg-canvas",
  green: "bg-wash-green",
  violet: "bg-wash-violet",
  soft: "bg-canvas-soft",
} as const;

type Tone = keyof typeof TONES;

/**
 * Une slide : texte à gauche et visuel à droite dès `lg`, texte puis visuel
 * dessous sur mobile, où le téléphone, plus haut que sa boîte, s'efface en bas par un
 * masque dans la boîte du visuel (jamais une arête nette). Le padding bas réserve la
 * place des commandes du slider, qui se posent par-dessus.
 */
function Slide({
  tone,
  fade = false,
  children,
  visual,
}: {
  tone: Tone;
  /** Visuel plus haut que sa boîte sur mobile (un téléphone) : il s'efface en bas. */
  fade?: boolean;
  children: ReactNode;
  visual: ReactNode;
}) {
  return (
    <div className={`${TONES[tone]} text-ink`}>
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-gutter pt-8 pb-20 sm:pt-12 lg:grid-cols-2 lg:gap-8 lg:pt-14 lg:pb-24">
        <div className="text-center lg:text-left">{children}</div>
        <div
          className={`slide-visual relative h-64 sm:h-80 lg:h-[30rem] ${
            fade
              ? "overflow-hidden mask-[linear-gradient(to_bottom,black_65%,transparent)] lg:overflow-visible lg:mask-none"
              : ""
          }`}
        >
          {visual}
        </div>
      </div>
    </div>
  );
}

/** Titre d'une slide autre que la première : un paragraphe stylé, jamais un titre (le plan reste H1 puis les H2 des sections). */
function Headline({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-3xl leading-[1.1] font-bold tracking-[-0.02em] text-balance sm:text-4xl lg:text-5xl">
      {children}
    </p>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-4 max-w-[34rem] text-base leading-snug sm:mt-6 sm:text-xl sm:leading-relaxed lg:mx-0">
      {children}
    </p>
  );
}

/** Position d'un téléphone dans le visuel : posé en haut et coupé en bas sur mobile, centré en entier dès `lg`. */
const PHONE_SPOT =
  "absolute top-8 left-1/2 w-44 -translate-x-1/2 sm:w-52 lg:top-1/2 lg:w-[13rem] lg:-translate-y-1/2";

const PHONE_SIZES =
  "(min-width: 1024px) 208px, (min-width: 640px) 208px, 176px";

/**
 * Le héros de l'accueil : un slider de messages vrais sur le studio. La première
 * slide porte l'unique H1, la phrase de définition et l'appel vers la page de
 * l'app ; son téléphone est l'image LCP de la page. Chaque slide a un visuel du
 * monde de Cerebrum déjà dans le dépôt (captures 3.0.0, icônes des jeux, ciel
 * Breeze, Panda).
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const copy = getHubCopy(locale);
  const { slider } = copy;
  const cerebrum = getApp("cerebrum");
  const games = getGames("cerebrum");

  const slides = [
    <Slide
      key="identity"
      fade
      tone="canvas"
      visual={
        <>
          <span
            aria-hidden="true"
            className="slide-sky pointer-events-none absolute top-1/2 left-1/2 aspect-[960/1239] h-[135%] -translate-x-1/2 -translate-y-1/2"
          />
          <div className={PHONE_SPOT}>
            <TiltOnPointer>
              <PhoneFrame
                src={`/images/screens/v3/homepage-${locale}.webp`}
                alt={copy.hero.phoneAlt}
                priority
                sizes={PHONE_SIZES}
                rotate={5}
              />
            </TiltOnPointer>
            <Image
              src={cerebrum.icon}
              alt=""
              width={128}
              height={128}
              sizes="(min-width: 1024px) 112px, 80px"
              className="absolute -top-5 -left-8 size-20 rounded-[22%] shadow-raised sm:-left-10 lg:size-28"
            />
          </div>
        </>
      }
    >
      <h1 className="text-6xl leading-none tracking-[-0.03em] sm:text-7xl lg:text-8xl">
        {copy.hero.h1}
      </h1>
      <Body>{copy.hero.definition}</Body>
      <Button
        href={pagePath("cerebrum", locale)}
        size="lg"
        className="mt-6 sm:mt-8"
      >
        {slider.cta}
      </Button>
    </Slide>,

    <Slide
      key="relax"
      fade
      tone="green"
      visual={
        <div className={PHONE_SPOT}>
          <PhoneFrame
            src={`/images/screens/v3/sudoku-${locale}.webp`}
            alt={slider.slides.relax.phoneAlt}
            sizes={PHONE_SIZES}
            rotate={-5}
          />
        </div>
      }
    >
      <Headline>{slider.slides.relax.headline}</Headline>
      <Body>{slider.slides.relax.body}</Body>
    </Slide>,

    <Slide
      key="classics"
      tone="violet"
      visual={
        <ul
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 grid w-[min(100%,28rem)] -translate-x-1/2 -translate-y-[60%] -rotate-3 grid-cols-5 gap-2 sm:gap-3 lg:-translate-y-1/2 [&>li:nth-child(even)]:translate-y-3"
        >
          {games.map((game) => (
            <li
              key={game.id}
              style={gameColorVars(game.color)}
              className="relative aspect-square rounded-2xl bg-(--wash) shadow-rest"
            >
              <Image
                src={game.icon}
                alt=""
                fill
                sizes="(min-width: 640px) 88px, 64px"
                className="object-contain p-1.5"
              />
            </li>
          ))}
        </ul>
      }
    >
      <Headline>{slider.slides.classics.headline}</Headline>
      <Body>{slider.slides.classics.body}</Body>
    </Slide>,

    <Slide
      key="offline"
      fade
      tone="soft"
      visual={
        <div className={PHONE_SPOT}>
          <PhoneFrame
            src={`/images/screens/v3/pixel-art-${locale}.webp`}
            alt={slider.slides.offline.phoneAlt}
            sizes={PHONE_SIZES}
            rotate={4}
          />
        </div>
      }
    >
      <Headline>{slider.slides.offline.headline}</Headline>
      <Body>{slider.slides.offline.body}</Body>
    </Slide>,

    <Slide
      key="france"
      tone="green"
      visual={
        <div className="absolute bottom-16 left-1/2 w-36 -translate-x-1/2 sm:w-40 lg:bottom-auto lg:top-1/2 lg:w-60 lg:-translate-y-1/2">
          <span
            aria-hidden="true"
            className="absolute inset-x-[-12%] top-[8%] bottom-0 rounded-full bg-canvas/60"
          />
          <Image
            src="/images/characters/panda-adult-v1.webp"
            alt=""
            width={480}
            height={635}
            sizes="(min-width: 1024px) 240px, 160px"
            className="relative h-auto w-full"
          />
        </div>
      }
    >
      <Headline>{slider.slides.france.headline}</Headline>
      <Body>{slider.slides.france.body}</Body>
    </Slide>,
  ];

  return (
    <HeroSlider
      label={slider.label}
      labels={{
        slide: slider.slideLabel,
        goTo: slider.goTo,
        previous: slider.previous,
        next: slider.next,
        pause: slider.pause,
        play: slider.play,
      }}
      slides={slides}
    />
  );
}
