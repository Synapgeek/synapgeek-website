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

  const description = dict.privacy.metaDescription;

  return {
    title: dict.privacy.title,
    description,
    alternates: getAlternates("privacy", locale),
    openGraph: buildOpenGraph(
      locale,
      "privacy",
      dict.privacy.title,
      description,
    ),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const dict = getDictionary(locale);

  const webPage = webPageSchema({
    locale,
    pageId: "privacy",
    name: dict.privacy.title,
    dateModified: dict.privacy.updatedAt,
  });

  return (
    <>
      <JsonLd data={webPage} />
      <LegalPage
        title={dict.privacy.title}
        lastUpdated={dict.privacy.lastUpdated}
        sections={dict.privacy.sections}
      />
    </>
  );
}
