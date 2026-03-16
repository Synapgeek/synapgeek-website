import type { Metadata } from "next";
import { generateStaticParams } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { About } from "@/components/landing/About";
import { CTAFinal } from "@/components/landing/CTAFinal";
import { Contact } from "@/components/landing/Contact";
import { TrackSection } from "@/components/TrackSection";

export { generateStaticParams };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const dict = getDictionary(locale);

  return {
    title: {
      absolute: `${dict.common.siteName} — ${dict.common.tagline}`,
    },
    description: dict.landing.hero.subtitle,
    alternates: getAlternates(locale, "/"),
    openGraph: {
      title: `${dict.common.siteName} — ${dict.common.tagline}`,
      description: dict.landing.hero.subtitle,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const dict = getDictionary(locale);

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cerebrum",
    description: dict.landing.hero.subtitle,
    image: "https://synapgeek.com/images/brand/og-image.jpeg",
    applicationCategory: "GameApplication",
    operatingSystem: "iOS",
    inLanguage: ["fr", "en"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/PreOrder",
    },
    author: {
      "@id": "https://synapgeek.com/#organization",
    },
  };

  return (
    <>
      <JsonLd data={softwareAppSchema} />
      <Hero locale={locale} dict={dict.landing.hero} />
      <Stats items={dict.landing.stats.items} />
      <TrackSection name="features">
        <Features dict={dict.landing.features} />
      </TrackSection>
      <TrackSection name="about">
        <About dict={dict.landing.about} />
      </TrackSection>
      <TrackSection name="cta">
        <CTAFinal locale={locale} dict={dict.landing.cta} />
      </TrackSection>
      <TrackSection name="contact">
        <Contact locale={locale} dict={dict.landing.contact} />
      </TrackSection>
    </>
  );
}
