import type { Metadata } from "next";
import Image from "next/image";
import { InternalLink } from "@/components/ui/InternalLink";
import { generateStaticParams } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getApp, getGames } from "@/content/apps";
import { getAppCopy } from "@/content/copy";
import { formatUpdatedAt } from "@/lib/format-date";
import { pagePath } from "@/lib/routes";
import { buildOpenGraph, getAlternates } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  mobileApplicationSchema,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { TrackSection } from "@/components/TrackSection";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CheckList } from "@/components/ui/CheckList";
import { FaqList } from "@/components/ui/FaqList";
import { GameGrid } from "@/components/ui/GameGrid";
import { PhoneStage } from "@/components/ui/PhoneStage";
import { ProseList } from "@/components/ui/ProseList";
import { SectionBand } from "@/components/ui/SectionBand";
import { StoreBadges } from "@/components/ui/StoreBadges";

export { generateStaticParams };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const { meta } = getAppCopy("cerebrum", locale);

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: getAlternates("cerebrum", locale),
    openGraph: buildOpenGraph(locale, "cerebrum", meta.title, meta.description),
  };
}

export default async function CerebrumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const dict = getDictionary(locale);
  const copy = getAppCopy("cerebrum", locale);
  const app = getApp("cerebrum");
  const { sections } = copy;

  // Le même tableau nourrit le fil visible et le JSON-LD BreadcrumbList.
  const breadcrumbs: readonly BreadcrumbItem[] = [
    { name: dict.common.siteName, href: pagePath("home", locale) },
    { name: app.name },
  ];

  return (
    <>
      <JsonLd data={mobileApplicationSchema(app, locale, copy)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqPageSchema(copy.faq.items)} />

      <SectionBand
        enter={false}
        className="relative z-10 overflow-x-clip pt-6 pb-0 sm:pt-10 sm:pb-section lg:pt-14"
      >
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <Breadcrumbs
              items={breadcrumbs}
              label={dict.common.breadcrumb.label}
              className="mb-5 flex justify-center sm:mb-8 lg:justify-start"
            />
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
            icon={app.icon}
            className="-mb-24 sm:mb-0"
          />
        </div>
      </SectionBand>

      <TrackSection name="cerebrum_games">
        <SectionBand
          id="games"
          tone="soft"
          title={sections.games.title}
          className="pt-40 sm:pt-section"
        >
          <GameGrid
            games={getGames("cerebrum")}
            categories={sections.games.categories}
            locale={locale}
          />
        </SectionBand>
      </TrackSection>

      <SectionBand id="daily" title={sections.daily.title}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <p className="max-w-[65ch] text-xl leading-relaxed sm:text-2xl">
            {sections.daily.body}
          </p>
          <ProseList items={sections.daily.items} />
        </div>
      </SectionBand>

      <SectionBand id="progress" tone="soft" title={sections.progress.title}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <ProseList items={sections.progress.items} />
          <figure className="flex items-end justify-center gap-3 rounded-card bg-wash-green px-4 pt-10 pb-8 sm:gap-6 sm:px-6 lg:gap-4">
            <Image
              src="/images/characters/panda-baby-v1.webp"
              alt=""
              width={320}
              height={359}
              sizes="120px"
              className="h-20 w-auto sm:h-32 lg:h-24"
            />
            <Image
              src="/images/characters/panda-teen-v1.webp"
              alt=""
              width={320}
              height={406}
              sizes="140px"
              className="h-24 w-auto sm:h-44 lg:h-32"
            />
            <Image
              src="/images/characters/panda-adult-v1.webp"
              alt=""
              width={480}
              height={635}
              sizes="180px"
              className="h-32 w-auto sm:h-56 lg:h-44"
            />
            <figcaption className="sr-only">
              {sections.progress.growthCaption}
            </figcaption>
          </figure>
        </div>
      </SectionBand>

      <SectionBand id="good-to-know" title={sections.goodToKnow.title}>
        <CheckList items={sections.goodToKnow.items} />
      </SectionBand>

      <TrackSection name="cerebrum_model">
        <SectionBand
          id="free"
          tone="violet-deep"
          title={sections.model.title}
          width="prose"
        >
          <CheckList items={sections.model.items} />
        </SectionBand>
      </TrackSection>

      <TrackSection name="cerebrum_faq">
        <SectionBand id="faq" title={copy.faq.title} width="prose">
          <FaqList
            items={copy.faq.items.map(({ question, answer, link }) => ({
              question,
              answer: (
                <>
                  <p>{answer}</p>
                  {link && (
                    <p className="mt-3">
                      <InternalLink
                        href={pagePath(link.page, locale, link.hash)}
                        className="rounded-sm font-bold text-ink underline underline-offset-4"
                      >
                        {link.label}
                      </InternalLink>
                    </p>
                  )}
                </>
              ),
            }))}
          />
        </SectionBand>
      </TrackSection>

      <SectionBand
        id="privacy"
        tone="soft"
        title={sections.privacy.title}
        width="prose"
      >
        <p className="max-w-[65ch] text-lg leading-relaxed">
          {sections.privacy.body}
        </p>
        <Button
          href={pagePath("privacy", locale)}
          variant="outline"
          className="mt-8"
        >
          {sections.privacy.cta}
        </Button>
      </SectionBand>

      {/* Date de la page, pas de la politique : hors de la bande confidentialité. */}
      <div className="bg-canvas py-8 text-text-secondary">
        <p className="mx-auto max-w-3xl px-gutter text-sm">
          {dict.common.updatedOn}{" "}
          <time dateTime={copy.updatedAt}>
            {formatUpdatedAt(copy.updatedAt, locale)}
          </time>
        </p>
      </div>
    </>
  );
}
