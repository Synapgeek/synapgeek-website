import { InternalLink } from "@/components/ui/InternalLink";
import { getDictionary } from "@/content";
import { getApp } from "@/content/apps";
import { getAboutCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { aboutPageSchema, breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import type { BreadcrumbItem } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { PublisherIdentity } from "@/components/ui/PublisherIdentity";
import { SectionBand } from "@/components/ui/SectionBand";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { storeLabelsFor } from "@/lib/store-badges";
import { ContactBand } from "./ContactBand";
import { SectionHero } from "./SectionHero";
import { UpdatedOn } from "./UpdatedOn";

const TEXT_LINK = "rounded-sm font-bold text-ink underline underline-offset-4";

/** Page À propos : le studio, ce qu'il fait, sa fiche d'éditeur, comment le joindre. */
export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = getAboutCopy(locale);

  // Le même tableau nourrit le fil visible et le JSON-LD BreadcrumbList.
  const breadcrumbs: readonly BreadcrumbItem[] = [
    { name: dict.common.siteName, href: pagePath("home", locale) },
    { name: dict.common.nav.about },
  ];

  return (
    <>
      <JsonLd
        data={aboutPageSchema({
          locale,
          name: copy.meta.title,
          dateModified: copy.updatedAt,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <SectionHero
        breadcrumbs={breadcrumbs}
        breadcrumbLabel={dict.common.breadcrumb.label}
        h1={copy.hero.h1}
        definition={copy.hero.definition}
        mark={{ src: "/images/brand/logo-synapgeek.png" }}
      />

      <SectionBand tone="soft" title={copy.who.title} width="prose">
        <p className="max-w-[65ch] text-lg leading-relaxed">{copy.who.body}</p>
      </SectionBand>

      <SectionBand title={copy.what.title} width="prose">
        <p className="max-w-[65ch] text-lg leading-relaxed">{copy.what.body}</p>
        <p className="mt-6">
          <InternalLink
            href={pagePath(copy.what.link.page, locale, copy.what.link.hash)}
            className={TEXT_LINK}
          >
            {copy.what.link.label}
          </InternalLink>
        </p>
        <StoreBadges
          locale={locale}
          labels={storeLabelsFor(dict.common.stores, getApp("cerebrum").name)}
          className="mt-8"
        />
      </SectionBand>

      <SectionBand
        id="publisher"
        tone="soft"
        title={copy.identity.title}
        intro={copy.identity.intro}
        width="prose"
      >
        <PublisherIdentity
          locale={locale}
          labels={dict.common.publisher}
          fields={[
            "legalName",
            "legalForm",
            "capital",
            "country",
            "siret",
            "ape",
            "vat",
            "publicationDirector",
            "host",
          ]}
        />
        <Button
          href={pagePath(
            copy.identity.legalNotice.page,
            locale,
            copy.identity.legalNotice.hash,
          )}
          variant="outline"
          className="mt-8"
        >
          {copy.identity.legalNotice.label}
        </Button>
      </SectionBand>

      <ContactBand
        title={copy.contact.title}
        body={copy.contact.body}
        links={[copy.contact.form, copy.contact.press].map((link) => ({
          label: link.label,
          href: pagePath(link.page, locale, link.hash),
        }))}
      />

      <UpdatedOn
        label={dict.common.updatedOn}
        isoDate={copy.updatedAt}
        locale={locale}
      />
    </>
  );
}
