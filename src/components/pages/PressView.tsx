import { InternalLink } from "@/components/ui/InternalLink";
import { getDictionary } from "@/content";
import { getGames } from "@/content/apps";
import { getAppCopy, getPressCopy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { pageIdForGame, pagePath } from "@/lib/routes";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";
import type { BreadcrumbItem } from "@/components/site/Breadcrumbs";
import { DownloadGrid } from "@/components/ui/DownloadGrid";
import { FactTable } from "@/components/ui/FactTable";
import { PublisherIdentity } from "@/components/ui/PublisherIdentity";
import { SectionBand } from "@/components/ui/SectionBand";
import { ContactBand } from "./ContactBand";
import { SectionHero } from "./SectionHero";
import { UpdatedOn } from "./UpdatedOn";

/** « nonograms » devient « Nonograms » : la colonne des genres commence toujours par une majuscule. */
function capitalize(text: string, locale: Locale): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

/** Page Presse : fiche d'identité de l'app, jeux nommés avec leur genre, éditeur, fichiers, contact. */
export function PressView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const copy = getPressCopy(locale);
  const { sections } = getAppCopy("cerebrum", locale);

  // Le même tableau nourrit le fil visible et le JSON-LD BreadcrumbList.
  const breadcrumbs: readonly BreadcrumbItem[] = [
    { name: dict.common.siteName, href: pagePath("home", locale) },
    { name: dict.common.nav.press },
  ];

  // Un classique n'a pas de genre maison : on nomme sa catégorie.
  const gameRows = getGames("cerebrum")
    .filter((game) => game.published)
    .map((game) => ({
      key: game.id,
      label: (
        <InternalLink
          href={pagePath(pageIdForGame(game.id), locale)}
          className="rounded-sm underline underline-offset-4"
        >
          {game.name[locale]}
        </InternalLink>
      ),
      value: capitalize(
        game.genre[locale] ?? sections.games.categories[game.category],
        locale,
      ),
    }));

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          pageId: "press",
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
        mark={{ src: "/images/brand/cerebrum-icon.png", rounded: true }}
      />

      <SectionBand
        id="fact-sheet"
        tone="soft"
        title={copy.factSheet.title}
        width="prose"
      >
        <FactTable
          rows={copy.factSheet.rows.map(({ label, value }) => ({
            key: label,
            label,
            value,
          }))}
        />
      </SectionBand>

      <SectionBand
        id="games"
        title={copy.games.title}
        intro={copy.games.intro}
        width="prose"
      >
        <FactTable rows={gameRows} />
      </SectionBand>

      <SectionBand
        id="publisher"
        tone="soft"
        title={copy.publisher.title}
        width="prose"
      >
        <PublisherIdentity
          locale={locale}
          labels={dict.common.publisher}
          fields={["legalName", "country", "siret"]}
        />
      </SectionBand>

      <SectionBand
        id="downloads"
        title={copy.downloads.title}
        intro={copy.downloads.intro}
        width="prose"
      >
        <DownloadGrid items={copy.downloads.items} />
      </SectionBand>

      <ContactBand
        title={copy.contact.title}
        body={copy.contact.body}
        links={[]}
      />

      <UpdatedOn
        label={dict.common.updatedOn}
        isoDate={copy.updatedAt}
        locale={locale}
      />
    </>
  );
}
