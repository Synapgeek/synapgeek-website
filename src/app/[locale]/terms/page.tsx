import type { Metadata } from "next";
import { generateStaticParams } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/content";
import { getAlternates } from "@/lib/seo";
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
      ? "Conditions générales d'utilisation des apps SynapGeek — licence, achats in-app, biens virtuels, propriété intellectuelle."
      : "Terms of use for SynapGeek apps — license, in-app purchases, virtual goods, intellectual property.";

  return {
    title: dict.terms.title,
    description,
    alternates: getAlternates(locale, "/terms"),
    openGraph: {
      title: dict.terms.title,
      description,
      type: "website",
    },
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

  return (
    <LegalPage
      title={dict.terms.title}
      lastUpdated={dict.terms.lastUpdated}
      sections={dict.terms.sections}
    />
  );
}
