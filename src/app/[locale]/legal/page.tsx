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
      ? "Mentions légales de Synapgeek — éditeur, hébergeur, immatriculation RCS et informations sur la société."
      : "Synapgeek legal notice — publisher, hosting provider, company registration details and corporate information.";

  return {
    title: dict.legal.title,
    description,
    alternates: getAlternates(locale, "/legal"),
    openGraph: {
      title: dict.legal.title,
      description,
      type: "website",
    },
  };
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = getLocale(raw);
  const dict = getDictionary(locale);

  return (
    <LegalPage
      title={dict.legal.title}
      lastUpdated={dict.legal.lastUpdated}
      sections={dict.legal.sections}
    />
  );
}
