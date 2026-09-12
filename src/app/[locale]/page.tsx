import type { Metadata } from "next";
import { generateStaticParams } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getAlternates, buildOpenGraph } from "@/lib/seo";
import {
  faqPageSchema,
  softwareApplicationSchema,
} from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";
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
  const { meta } = getDictionary(locale).landing;

  return {
    title: {
      absolute: meta.title,
    },
    description: meta.description,
    alternates: getAlternates(locale, "/"),
    openGraph: buildOpenGraph(locale, "/", meta.title, meta.description),
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

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema(locale, {
          description: dict.landing.hero.subtitle,
        })}
      />
      {/* Mêmes questions/réponses que la FAQ visible, en texte brut. */}
      <JsonLd data={faqPageSchema(dict.landing.faq.items)} />
      <Hero locale={locale} dict={dict.landing.hero} />
      <Stats items={dict.landing.stats.items} />
      <TrackSection name="features">
        <Features dict={dict.landing.features} />
      </TrackSection>
      <TrackSection name="faq">
        <FAQ locale={locale} dict={dict.landing.faq} />
      </TrackSection>
      <TrackSection name="about">
        <About dict={dict.landing.about} />
      </TrackSection>
      <TrackSection name="cta">
        <CTAFinal locale={locale} dict={dict.landing.cta} />
      </TrackSection>
      <TrackSection name="contact">
        <Contact dict={dict.landing.contact} />
      </TrackSection>
    </>
  );
}
