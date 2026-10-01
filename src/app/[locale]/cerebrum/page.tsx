import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { CardList } from "@/components/ui/CardList";
import { CheckList } from "@/components/ui/CheckList";
import { FaqList } from "@/components/ui/FaqList";
import { GameGrid } from "@/components/ui/GameGrid";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SectionBand } from "@/components/ui/SectionBand";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { TiltOnPointer } from "@/components/ui/TiltOnPointer";

export { generateStaticParams };

/** Inclinaison de repos du téléphone, en degrés (le suivi du pointeur s'ajoute). */
const PHONE_REST_ROTATE = 5;

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
        className="relative overflow-hidden pt-6 pb-0 sm:pt-10 sm:pb-section lg:pt-14"
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

          <div className="relative isolate mx-auto -mb-60 w-full max-w-[15rem] sm:mb-0 sm:max-w-[17rem] lg:max-w-[19rem]">
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
              src={app.icon}
              alt=""
              width={128}
              height={128}
              sizes="(min-width: 1024px) 128px, 96px"
              className="absolute -top-5 -left-8 size-24 rounded-[22%] shadow-raised sm:-left-12 lg:size-32"
            />
          </div>
        </div>
      </SectionBand>

      <TrackSection name="cerebrum_games">
        <SectionBand id="games" tone="soft" title={sections.games.title}>
          <GameGrid
            games={getGames("cerebrum")}
            categories={sections.games.categories}
            locale={locale}
          />
        </SectionBand>
      </TrackSection>

      <SectionBand id="daily" title={sections.daily.title}>
        <p className="mb-8 max-w-[65ch] text-lg leading-relaxed sm:text-xl">
          {sections.daily.body}
        </p>
        <CardList items={sections.daily.items} tone="violet" columns={3} />
      </SectionBand>

      <SectionBand id="progress" tone="soft" title={sections.progress.title}>
        <CardList items={sections.progress.items} tone="green" />
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
                      <Link
                        href={pagePath(link.page, locale, link.hash)}
                        className="rounded-sm font-bold text-ink underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
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
        <p className="mt-10 text-sm text-text-secondary">
          {dict.common.updatedOn}{" "}
          <time dateTime={copy.updatedAt}>
            {formatUpdatedAt(copy.updatedAt, locale)}
          </time>
        </p>
      </SectionBand>
    </>
  );
}
