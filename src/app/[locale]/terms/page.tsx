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

  const description = dict.terms.metaDescription;

  return {
    title: dict.terms.title,
    description,
    alternates: getAlternates("terms", locale),
    openGraph: buildOpenGraph(locale, "terms", dict.terms.title, description),
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
    pageId: "terms",
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
