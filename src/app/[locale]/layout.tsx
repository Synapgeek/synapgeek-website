import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { LOCALES, generateStaticParams as genParams } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getOgLocale, getOgAlternateLocales } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

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
  const locale: Locale = isLocale(raw) ? raw : "fr";

  return {
    openGraph: {
      siteName: "Synapgeek",
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
      images: [{ url: "/images/brand/og-image.png", width: 1200, height: 630 }],
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
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  const dict = getDictionary(locale);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Synapgeek",
    url: "https://synapgeek.com",
    logo: "https://synapgeek.com/og-image.png",
    email: "contact@synapgeek.com",
    description: dict.common.tagline,
  };

  return (
    <div lang={locale} className="flex min-h-screen flex-col">
      <JsonLd data={organizationSchema} />
      <Header locale={locale} dict={dict.common} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict.common} />
    </div>
  );
}
