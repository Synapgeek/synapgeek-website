import type { Metadata } from "next";
import { generateStaticParams, type Locale } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getApps, getGames, type AppSlug } from "@/content/apps";
import { getHubCopy } from "@/content/copy";
import { getAlternates, buildOpenGraph } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { TrackSection } from "@/components/TrackSection";
import { AppShowcase } from "@/components/home/AppShowcase";
import { BuiltByEnthusiasts } from "@/components/home/BuiltByEnthusiasts";
import { HomeHero } from "@/components/home/HomeHero";
import { SectionBand } from "@/components/ui/SectionBand";

export { generateStaticParams };

/** La capture de l'app dans son encart : une par app, dans la langue de la page. */
const SHOWCASE_SCREEN: Record<AppSlug, (locale: Locale) => string> = {
  cerebrum: (locale) => `/images/screens/v3/pandoku-${locale}.webp`,
};

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

  return (
    <>
      <HomeHero locale={locale} />

      <TrackSection name="games">
        <SectionBand id="games" tone="soft" title={copy.games.title}>
          <div className="space-y-8">
            {getApps().map((app) => {
              const item = copy.games.items[app.slug];
              return (
                <AppShowcase
                  key={app.slug}
                  app={app}
                  games={getGames(app.slug)}
                  locale={locale}
                  pitch={item.pitch}
                  iconsLabel={item.iconsLabel}
                  ctaLabel={item.cta}
                  phoneSrc={SHOWCASE_SCREEN[app.slug](locale)}
                  phoneAlt={item.phoneAlt}
                  storeLabels={dict.common.stores}
                />
              );
            })}
          </div>
        </SectionBand>
      </TrackSection>

      <TrackSection name="studio">
        <BuiltByEnthusiasts locale={locale} />
      </TrackSection>

      <TrackSection name="contact">
        <SectionBand id="contact" title={copy.contact.title} width="prose">
          <ContactForm dict={dict.common.contactForm} />
        </SectionBand>
      </TrackSection>
    </>
  );
}
