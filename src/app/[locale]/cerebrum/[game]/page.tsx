import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/content";
import { getApp, getGames, type GameEntry } from "@/content/apps";
import { getAppCopy, type GameCopy } from "@/content/copy";
import { formatUpdatedAt } from "@/lib/format-date";
import type { Locale } from "@/lib/i18n";
import {
  findPublishedGame,
  pageIdForGame,
  pagePath,
  publishedGameParams,
} from "@/lib/routes";
import { buildOpenGraph, getAlternates } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  videoGameSchema,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/site/Breadcrumbs";
import { CheckList } from "@/components/ui/CheckList";
import { DifficultyTable } from "@/components/ui/DifficultyTable";
import { FaqList } from "@/components/ui/FaqList";
import { GameGrid } from "@/components/ui/GameGrid";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SectionBand } from "@/components/ui/SectionBand";
import { StepList } from "@/components/ui/StepList";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { TiltOnPointer } from "@/components/ui/TiltOnPointer";

export { publishedGameParams as generateStaticParams };

/** Inclinaison de repos du téléphone, en degrés (le suivi du pointeur s'ajoute). */
const PHONE_REST_ROTATE = 5;

type Params = Promise<{ locale: string; game: string }>;

/** Jeu publié et copie de la page, ou `notFound()` : slug inconnu, non publié, ou d'une autre langue. */
async function resolve(params: Params): Promise<{
  locale: Locale;
  game: GameEntry;
  copy: GameCopy;
}> {
  const { locale: rawLocale, game: slug } = await params;
  const locale = getLocale(rawLocale);
  const game = findPublishedGame(locale, slug);
  if (!game) notFound();
  const copy = getAppCopy("cerebrum", locale).games[game.id];
  // Un jeu publié sans copie est une erreur de contenu : le build doit échouer, pas servir une page vide.
  if (!copy) throw new Error(`Jeu publié sans copie (${locale}) : ${game.id}`);
  return { locale, game, copy };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, game, copy } = await resolve(params);
  const { meta } = copy;
  const pageId = pageIdForGame(game.id);

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: getAlternates(pageId, locale),
    openGraph: buildOpenGraph(locale, pageId, meta.title, meta.description, {
      ownImage: true,
    }),
  };
}

export default async function GamePage({ params }: { params: Params }) {
  const { locale, game, copy } = await resolve(params);
  const dict = getDictionary(locale);
  const app = getApp("cerebrum");
  const appCopy = getAppCopy(app.slug, locale);
  const { gamePage } = appCopy;
  const name = game.name[locale];

  // Le même tableau nourrit le fil visible et le JSON-LD BreadcrumbList.
  const breadcrumbs: readonly BreadcrumbItem[] = [
    { name: dict.common.siteName, href: pagePath("home", locale) },
    { name: app.name, href: pagePath("cerebrum", locale) },
    { name },
  ];

  const siblings = getGames(app.slug).filter(
    (other) => other.category === game.category && other.id !== game.id,
  );

  return (
    <>
      <JsonLd data={videoGameSchema(app, game, locale, copy)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqPageSchema(copy.faq.items)} />

      <div className="mx-auto max-w-6xl px-gutter pt-6">
        <Breadcrumbs items={breadcrumbs} label={dict.common.breadcrumb.label} />
      </div>

      <SectionBand
        tone="game-wash"
        color={game.color}
        enter={false}
        className="relative mt-4 overflow-hidden pt-10 pb-0 sm:pb-section lg:pt-14"
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

          <div className="relative isolate mx-auto -mb-60 w-full max-w-[15rem] sm:mb-0 sm:max-w-[17rem] lg:max-w-[19rem]">
            <TiltOnPointer>
              <PhoneFrame
                src={game.screenshot[locale]}
                alt={copy.hero.phoneAlt}
                priority
                sizes="(min-width: 1024px) 304px, (min-width: 640px) 272px, 240px"
                rotate={PHONE_REST_ROTATE}
              />
            </TiltOnPointer>
            <Image
              src={game.icon}
              alt=""
              width={128}
              height={128}
              sizes="(min-width: 1024px) 128px, 96px"
              className="absolute -top-5 -left-8 size-24 drop-shadow-lg sm:-left-12 lg:size-32"
            />
          </div>
        </div>
      </SectionBand>

      <SectionBand id="how-to-play" title={copy.howToPlay.title} width="prose">
        <StepList steps={copy.howToPlay.steps} />
      </SectionBand>

      <SectionBand
        id="what-cerebrum-adds"
        tone="soft"
        title={copy.whatCerebrumAdds.title}
        width="prose"
      >
        <div className="space-y-5 text-lg leading-relaxed">
          {copy.whatCerebrumAdds.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-[65ch]">
              {paragraph}
            </p>
          ))}
        </div>
        <DifficultyTable
          className="mt-10"
          caption={copy.whatCerebrumAdds.difficultyTable.caption}
          columns={gamePage.difficultyColumns}
          rows={copy.whatCerebrumAdds.difficultyTable.rows.map(
            ({ difficulty, detail }) => ({
              label: gamePage.difficulties[difficulty],
              detail,
            }),
          )}
        />
      </SectionBand>

      <SectionBand id="tips" title={copy.tips.title} width="prose">
        <CheckList items={copy.tips.items} />
      </SectionBand>

      <SectionBand id="faq" tone="soft" title={copy.faq.title} width="prose">
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

      {siblings.length > 0 && (
        <SectionBand id="more-games" title={gamePage.relatedTitle}>
          <GameGrid
            games={siblings}
            categories={appCopy.sections.games.categories}
            locale={locale}
          />
        </SectionBand>
      )}

      <SectionBand
        id="get-it"
        tone="violet-deep"
        title={copy.whereToPlay.title}
        width="prose"
      >
        <p className="max-w-[65ch] text-lg leading-relaxed">
          {copy.whereToPlay.body}
        </p>
        <StoreBadges
          locale={locale}
          labels={dict.common.stores}
          className="mt-8"
        />
        <p className="mt-10 text-sm text-canvas/85">
          {dict.common.updatedOn}{" "}
          <time dateTime={copy.updatedAt}>
            {formatUpdatedAt(copy.updatedAt, locale)}
          </time>
        </p>
      </SectionBand>
    </>
  );
}
