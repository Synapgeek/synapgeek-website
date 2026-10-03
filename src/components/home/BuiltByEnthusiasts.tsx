import Image from "next/image";
import { getHubCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { SectionBand } from "@/components/ui/SectionBand";

/**
 * Les taches de couleur du fond, reprises de la même section sur l'ancien site :
 * floues, aux couleurs du logo, elles dérivent lentement (figées en mouvement
 * réduit). Sous le contenu (`-z-10` dans la bande isolée), décoratives.
 */
function DriftingBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="blob-1 animate-blob-drift-1 absolute -top-16 -left-20 size-72 bg-accent-teal/30 blur-3xl sm:size-96" />
      <div className="blob-3 animate-blob-drift-3 absolute top-8 left-16 size-48 bg-accent-teal/15 blur-3xl sm:size-64" />
      <div className="blob-2 animate-blob-drift-2 absolute -top-10 -right-12 size-64 bg-brand-violet/45 blur-3xl sm:size-80" />
      <div className="blob-4 animate-blob-drift-1 absolute -right-16 -bottom-20 size-80 bg-accent-coral/30 blur-3xl sm:size-[28rem]" />
      <div className="blob-1 animate-blob-drift-3 absolute right-24 -bottom-8 size-48 bg-accent-orange/20 blur-3xl sm:size-64" />
      <div className="blob-2 animate-blob-drift-2 absolute -bottom-12 -left-8 size-64 bg-accent-teal/15 blur-3xl sm:size-80" />
    </div>
  );
}

/**
 * « Construit par des passionnés » : le studio et ses trois valeurs, repris de
 * l'ancien site. C'est l'unique bande violet profond de la page, animée par des
 * taches de couleur qui dérivent. Les trois Pandas (bébé, ado, adulte) qui
 * célèbrent viennent de l'écran de victoire de l'app : une illustration
 * d'appoint, décorative.
 */
export function BuiltByEnthusiasts({ locale }: { locale: Locale }) {
  const { about } = getHubCopy(locale);

  return (
    <SectionBand
      tone="violet-deep"
      labelledBy="about-title"
      backdrop={<DriftingBlobs />}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,30rem)] lg:justify-between">
        <div>
          <h2
            id="about-title"
            className="text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
          >
            {about.title}
          </h2>
          <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-canvas/90">
            {about.description}
          </p>
          <Button
            href={pagePath("about", locale)}
            variant="inverse"
            className="mt-8"
          >
            {about.cta}
          </Button>
        </div>
        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
          <span
            aria-hidden="true"
            className="absolute inset-[12%] rounded-full bg-accent-yellow/20 blur-3xl"
          />
          <Image
            src="/images/characters/panda-celebration-v1.webp"
            alt=""
            width={960}
            height={617}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 448px, 90vw"
            className="relative h-auto w-full"
          />
        </div>
      </div>

      <ul className="mt-12 grid gap-8 sm:mt-16 md:grid-cols-3 md:gap-10">
        {about.values.map((value) => (
          <li key={value.title} className="border-t-2 border-canvas/30 pt-5">
            <h3 className="font-display text-xl leading-snug sm:text-2xl">
              {value.title}
            </h3>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-canvas/90">
              {value.description}
            </p>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
