import Image from "next/image";
import { getHubCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { SectionBand } from "@/components/ui/SectionBand";

/**
 * « Construit par des passionnés » : le studio et ses trois valeurs, repris de
 * l'ancien site. C'est l'unique bande violet profond de la page. Le Panda est une
 * illustration d'appoint, décorative.
 */
export function BuiltByEnthusiasts({ locale }: { locale: Locale }) {
  const { about } = getHubCopy(locale);

  return (
    <SectionBand tone="violet-deep" labelledBy="about-title">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,38rem)_auto] lg:justify-between">
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
        <div className="relative mx-auto w-40 sm:w-48 lg:w-56">
          <span
            aria-hidden="true"
            className="absolute inset-x-[-8%] top-[8%] bottom-0 rounded-full bg-canvas/10"
          />
          <Image
            src="/images/characters/panda-adult-v1.webp"
            alt=""
            width={480}
            height={635}
            sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 160px"
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
