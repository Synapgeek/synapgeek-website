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
      ? "Politique de confidentialité des apps et services SynapGeek — données collectées, droits RGPD, publicités et cookies."
      : "Privacy policy for SynapGeek apps and services — data collected, GDPR rights, advertising and cookies.";

  return {
    title: dict.privacy.title,
    description,
    alternates: getAlternates(locale, "/privacy"),
    openGraph: {
      title: dict.privacy.title,
      description,
      type: "website",
    },
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

  return (
    <LegalPage
      title={dict.privacy.title}
      lastUpdated={dict.privacy.lastUpdated}
      sections={dict.privacy.sections}
    />
  );
}
