import type { Metadata } from "next";
import Image from "next/image";
import { generateStaticParams, type Locale } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getApp, getGames, platformsFor } from "@/content/apps";
import type { GameCategory } from "@/content/apps";
import { getHubCopy } from "@/content/copy";
import { getAlternates, buildOpenGraph } from "@/lib/seo";
import { pagePath } from "@/lib/routes";
import { ContactForm } from "@/components/ContactForm";
import { TrackSection } from "@/components/TrackSection";
import { AppCard } from "@/components/ui/AppCard";
import { Button } from "@/components/ui/Button";
import { FactStrip } from "@/components/ui/FactStrip";
import { GameCard } from "@/components/ui/GameCard";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SectionBand } from "@/components/ui/SectionBand";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { TiltOnPointer } from "@/components/ui/TiltOnPointer";

export { generateStaticParams };

/** Ordre d'affichage des familles de jeux sur le hub. */
const CATEGORY_ORDER: readonly GameCategory[] = [
  "logic-numbers",
  "words",
  "paths",
];

/** Inclinaison de repos du téléphone, en degrés (le suivi du pointeur s'ajoute). */
const PHONE_REST_ROTATE = 5;

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
        className="relative overflow-hidden pt-8 sm:pt-14 lg:pt-20"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h1 className="text-6xl leading-none tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              {copy.hero.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-base leading-relaxed sm:mt-6 sm:text-xl lg:mx-0">
              {copy.hero.definition}
            </p>
            <StoreBadges
              locale={locale}
              labels={dict.common.stores}
              className="mt-6 justify-center sm:mt-8 lg:justify-start"
            />
          </div>

          <div className="relative isolate mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:max-w-[19rem]">
            {/* Lavis pastel : décoratifs, derrière le téléphone */}
            <span
              aria-hidden="true"
              className="absolute top-[6%] -left-[34%] -z-10 size-[105%] rounded-[42%_58%_55%_45%/55%_40%_60%_45%] bg-wash-green"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[32%] bottom-[12%] -z-10 size-[78%] rounded-[55%_45%_35%_65%/40%_60%_40%_60%] bg-wash-violet"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[4%] -left-[26%] -z-10 size-[22%] rounded-[35%_65%_50%_50%/60%_40%_55%_45%] bg-wash-violet"
            />
            <TiltOnPointer>
              <PhoneFrame
                src={`/images/screens/v3/homepage-${locale}.webp`}
                alt={copy.hero.phoneAlt}
                priority
                sizes="(min-width: 1024px) 304px, (min-width: 640px) 272px, 240px"
                rotate={PHONE_REST_ROTATE}
              />
            </TiltOnPointer>
            <Image
              src={cerebrum.icon}
              alt=""
              width={128}
              height={128}
              sizes="(min-width: 1024px) 128px, 96px"
              className="absolute -top-5 -left-8 size-24 rounded-[22%] shadow-raised sm:-left-12 lg:size-32"
            />
          </div>
        </div>
      </SectionBand>

      <SectionBand tone="soft" title={copy.apps.title}>
        <AppCard
          name={cerebrum.name}
          description={copy.apps.items.cerebrum.description}
          platforms={appPlatforms(locale)}
          icon={cerebrum.icon}
          href={pagePath("cerebrum", locale)}
          ctaLabel={copy.apps.items.cerebrum.cta}
        />
      </SectionBand>

      <TrackSection name="games">
        <SectionBand id="games" title={copy.games.title}>
          <div className="space-y-12">
            {CATEGORY_ORDER.map((category) => (
              <div key={category}>
                <h3 className="mb-5 text-2xl sm:text-3xl">
                  {copy.games.categories[category]}
                </h3>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
                  {games
                    .filter((game) => game.category === category)
                    .map((game) => (
                      <li key={game.id}>
                        <GameCard
                          as="h4"
                          name={game.name[locale]}
                          genre={game.genre[locale]}
                          icon={game.icon}
                          color={game.color}
                          href={
                            game.published
                              ? pagePath(`game:${game.id}`, locale)
                              : null
                          }
                        />
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionBand>
      </TrackSection>

      <SectionBand tone="soft">
        <FactStrip facts={copy.facts} />
      </SectionBand>

      <TrackSection name="studio">
        <SectionBand tone="violet-deep" title={copy.studio.title} width="prose">
          <p className="max-w-[65ch] text-lg leading-relaxed text-canvas/90">
            {copy.studio.body}
          </p>
          <Button
            href={pagePath("about", locale)}
            variant="inverse"
            className="mt-8"
          >
            {copy.studio.cta}
          </Button>
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
