import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LOCALES, generateStaticParams as genParams } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getAboutCopy } from "@/content/copy";
import { getOgLocale, getOgAlternateLocales, getOgImages } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { pagePath } from "@/lib/routes";
import {
  buildLanguageSwitchTable,
  legalPagePaths,
} from "@/lib/language-switch-table";
import { SkipLink } from "@/components/site/SkipLink";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  LanguageSuggestion,
  type LanguageSuggestionCopy,
} from "@/components/site/LanguageSuggestion";
import { JsonLd } from "@/components/JsonLd";
import { ConsentBootstrap } from "@/components/consent/ConsentBootstrap";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { FONT_VARIABLES } from "../fonts";

export { genParams as generateStaticParams };

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  // Segment inconnu (ex. "wp-login.php", "llms.txt") : ne pas servir la home en 200.
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return {
    openGraph: {
      siteName: "Synapgeek",
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
      images: getOgImages(locale),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  // Segment inconnu : 404 au lieu de retomber silencieusement sur "fr".
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const languageTable = buildLanguageSwitchTable();
  // Chaque texte est rédigé dans la langue qu'il propose : on passe tous ceux de LOCALES.
  const languageSuggestionCopy = Object.fromEntries(
    LOCALES.map((l) => [l, getDictionary(l).common.languageSuggestion]),
  ) as Record<Locale, LanguageSuggestionCopy>;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${FONT_VARIABLES} antialiased`}>
        {/* Défauts Consent Mode v2 + GA4 : premier enfant de <body>, avant tout autre contenu (voir ConsentBootstrap). */}
        <ConsentBootstrap />
        <SkipLink label={dict.common.a11y.skipToContent} />
        {/* Non modal, position fixed (l'emplacement dans le DOM n'affecte pas son rendu) :
            monté tôt, juste après le lien d'évitement, pour qu'un utilisateur clavier
            l'atteigne sans devoir traverser toute la page. */}
        <ConsentBanner
          privacyHref={pagePath("privacy", locale, "website")}
          dict={dict.common.consent}
        />
        <div className="flex min-h-screen flex-col">
          <JsonLd data={organizationSchema(getAboutCopy(locale))} />
          <JsonLd data={websiteSchema()} />
          <SiteHeader
            locale={locale}
            dict={dict.common}
            languageTable={languageTable}
          />
          <LanguageSuggestion
            locale={locale}
            table={languageTable}
            excludedPaths={legalPagePaths()}
            copy={languageSuggestionCopy}
          />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter
            locale={locale}
            dict={dict.common}
            languageTable={languageTable}
          />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
