import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { DM_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LOCALES, generateStaticParams as genParams } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getOgLocale, getOgAlternateLocales } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { APP_STORE_ID } from "@/lib/app";
import { pagePath } from "@/lib/routes";
import { buildLanguageSwitchTable } from "@/lib/language-switch-table";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsentBootstrap } from "@/components/consent/ConsentBootstrap";
import { ConsentBanner } from "@/components/consent/ConsentBanner";

export { genParams as generateStaticParams };

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

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
    // Safari smart App Banner — now that Cerebrum is live on the App Store.
    itunes: { appId: APP_STORE_ID },
    openGraph: {
      siteName: "Synapgeek",
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
      images: [
        { url: "/images/brand/og-image.jpeg", width: 1200, height: 630 },
      ],
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        {/* Défauts Consent Mode v2 + GA4 : premier enfant de <body>, avant tout autre contenu (voir ConsentBootstrap). */}
        <ConsentBootstrap />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          {locale === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        {/* Non modal, position fixed (l'emplacement dans le DOM n'affecte pas son rendu) :
            monté tôt, juste après le lien d'évitement, pour qu'un utilisateur clavier
            l'atteigne sans devoir traverser toute la page. */}
        <ConsentBanner
          privacyHref={pagePath("privacy", locale, "website")}
          dict={dict.common.consent}
        />
        <div className="flex min-h-screen flex-col">
          <JsonLd data={organizationSchema()} />
          <JsonLd data={websiteSchema(locale)} />
          <Header locale={locale} languageTable={languageTable} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer
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
