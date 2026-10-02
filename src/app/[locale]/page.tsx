import type { Metadata } from "next";
import Image from "next/image";
import { generateStaticParams, type Locale } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getApp, getGames, platformsFor } from "@/content/apps";
import { getHubCopy } from "@/content/copy";
import { getAlternates, buildOpenGraph } from "@/lib/seo";
import { pagePath } from "@/lib/routes";
import { ContactForm } from "@/components/ContactForm";
import { TrackSection } from "@/components/TrackSection";
import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/Button";
import { GameGrid } from "@/components/ui/GameGrid";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { PhoneStage } from "@/components/ui/PhoneStage";
import { SectionBand } from "@/components/ui/SectionBand";
import { StoreBadges } from "@/components/ui/StoreBadges";

export { generateStaticParams };

/** Plateformes où au moins un jeu de l'app est annoncé, en liste localisée (« iPhone, iPad et Android »). */
function appPlatforms(locale: Locale): string {
  const platforms = new Set(
    getGames("cerebrum").flatMap((game) => platformsFor(game)),
  );
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(platforms);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const { meta } = getHubCopy(locale);

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: getAlternates("home", locale),
    openGraph: buildOpenGraph(locale, "home", meta.title, meta.description),
  };
}

export default async function HubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const dict = getDictionary(locale);
  const copy = getHubCopy(locale);
  const cerebrum = getApp("cerebrum");
  const games = getGames("cerebrum");

  return (
    <>
      <SectionBand
        enter={false}
        className="relative z-10 overflow-x-clip pt-8 pb-0 sm:pt-14 sm:pb-section lg:pt-20"
      >
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h1 className="text-6xl leading-none tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              {copy.hero.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-[34rem] text-base leading-snug sm:mt-6 sm:text-xl sm:leading-relaxed lg:mx-0">
              {copy.hero.definition}
            </p>
            <StoreBadges
              locale={locale}
              labels={dict.common.stores}
              className="mt-6 justify-center sm:mt-8 lg:justify-start"
            />
          </div>

          <PhoneStage
            screenSrc={`/images/screens/v3/homepage-${locale}.webp`}
            screenAlt={copy.hero.phoneAlt}
            icon={cerebrum.icon}
            className="-mb-24 sm:mb-0"
          />
        </div>
      </SectionBand>

      <TrackSection name="games">
        <SectionBand
          id="games"
          tone="soft"
          title={copy.games.title}
          className="pt-28 sm:pt-section"
        >
          <GameGrid
            games={games}
            categories={copy.games.categories}
            locale={locale}
          />
        </SectionBand>
      </TrackSection>

      <SectionBand title={copy.apps.title}>
        <AppCard
          name={cerebrum.name}
          description={copy.apps.items.cerebrum.description}
          note={copy.apps.items.cerebrum.note}
          platforms={appPlatforms(locale)}
          icon={cerebrum.icon}
          href={pagePath("cerebrum", locale)}
          ctaLabel={copy.apps.items.cerebrum.cta}
          aside={
            <div className="absolute top-8 left-1/2 w-52 -translate-x-1/2 lg:w-60">
              <PhoneFrame
                src={`/images/screens/v3/pandoku-${locale}.webp`}
                alt=""
                rotate={-4}
                sizes="(min-width: 1024px) 240px, 208px"
              />
            </div>
          }
        />
      </SectionBand>

      <TrackSection name="studio">
        <SectionBand tone="violet-deep" labelledBy="studio-title">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,38rem)_auto] lg:justify-between">
            <div>
              <h2
                id="studio-title"
                className="text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl"
              >
                {copy.studio.title}
              </h2>
              <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-canvas/90">
                {copy.studio.body}
              </p>
              <Button
                href={pagePath("about", locale)}
                variant="inverse"
                className="mt-8"
              >
                {copy.studio.cta}
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
        </SectionBand>
      </TrackSection>

      <TrackSection name="contact">
        <SectionBand id="contact" title={copy.contact.title} width="prose">
          <ContactForm dict={dict.common.contactForm} />
        </SectionBand>
      </TrackSection>
    </>
  );
}
