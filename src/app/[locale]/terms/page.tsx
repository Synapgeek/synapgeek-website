import type { Metadata } from "next";
import { generateStaticParams } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getAlternates, buildOpenGraph } from "@/lib/seo";
import { webPageSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";

export { generateStaticParams };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const dict = getDictionary(locale);

  const description =
    locale === "fr"
      ? "Conditions générales d'utilisation des apps Synapgeek — licence, achats in-app, biens virtuels, propriété intellectuelle."
      : "Terms of use for Synapgeek apps — license agreement, in-app purchases and subscriptions, virtual goods, intellectual property, and user conduct.";

  return {
    title: dict.terms.title,
    description,
    alternates: getAlternates(locale, "/terms"),
    openGraph: buildOpenGraph(locale, "/terms", dict.terms.title, description),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const dict = getDictionary(locale);

  const webPage = webPageSchema({
    locale,
    path: "/terms",
    name: dict.terms.title,
    dateModified: dict.terms.updatedAt,
  });

  return (
    <>
      <JsonLd data={webPage} />
      <LegalPage
        title={dict.terms.title}
        lastUpdated={dict.terms.lastUpdated}
        sections={dict.terms.sections}
      />
    </>
  );
}
