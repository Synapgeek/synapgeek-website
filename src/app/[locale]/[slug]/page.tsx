import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "@/content";
import { getAboutCopy, getPressCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { resolveSection, sectionParams, type SectionId } from "@/lib/routes";
import { buildOpenGraph, getAlternates } from "@/lib/seo";
import { AboutView } from "@/components/pages/AboutView";
import { PressView } from "@/components/pages/PressView";

export { sectionParams as generateStaticParams };

type Params = Promise<{ locale: string; slug: string }>;

/** Section et langue de la page, ou `notFound()` : slug inconnu, réservé, ou d'une autre langue. */
async function resolve(
  params: Params,
): Promise<{ locale: Locale; section: SectionId }> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const section = resolveSection(locale, slug);
  if (!section) notFound();
  return { locale, section };
}

const META: Record<
  SectionId,
  (locale: Locale) => { title: string; description: string }
> = {
  about: (locale) => getAboutCopy(locale).meta,
  press: (locale) => getPressCopy(locale).meta,
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, section } = await resolve(params);
  const { title, description } = META[section](locale);

  return {
    title: { absolute: title },
    description,
    alternates: getAlternates(section, locale),
    openGraph: buildOpenGraph(locale, section, title, description, {
      ownImage: true,
    }),
  };
}

export default async function SectionPage({ params }: { params: Params }) {
  const { locale, section } = await resolve(params);
  return section === "about" ? (
    <AboutView locale={locale} />
  ) : (
    <PressView locale={locale} />
  );
}
