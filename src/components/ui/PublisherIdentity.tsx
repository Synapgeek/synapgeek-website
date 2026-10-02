import type { Dictionary } from "@/content";
import { PUBLISHER, formatAddress } from "@/content/publisher";
import type { Locale } from "@/lib/i18n";
import { FactTable, type FactRow } from "./FactTable";

type Labels = Dictionary["common"]["publisher"];
export type PublisherField = Exclude<keyof Labels, "legalFormValue">;

/**
 * Fiche d'identité de l'éditeur. Chaque valeur vient de `PUBLISHER` (source
 * unique, relue contre les mentions légales par `publisher.test.ts`), chaque
 * libellé du dictionnaire. `fields` choisit les lignes et leur ordre.
 */
export function PublisherIdentity({
  locale,
  labels,
  fields,
  className,
}: {
  locale: Locale;
  labels: Labels;
  fields: readonly PublisherField[];
  className?: string;
}) {
  const values: Record<PublisherField, FactRow["value"]> = {
    legalName: PUBLISHER.legalName,
    legalForm: labels.legalFormValue,
    capital: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(PUBLISHER.capitalEur),
    address: formatAddress(),
    rcs: `${PUBLISHER.rcs.registry} ${PUBLISHER.rcs.number}`,
    siret: PUBLISHER.siret,
    ape: PUBLISHER.ape,
    vat: PUBLISHER.vat,
    publicationDirector: PUBLISHER.publicationDirector,
    host: PUBLISHER.host,
    email: (
      <a
        href={`mailto:${PUBLISHER.contactEmail}`}
        className="rounded-sm font-bold text-ink underline underline-offset-4"
      >
        {PUBLISHER.contactEmail}
      </a>
    ),
  };

  return (
    <FactTable
      className={className}
      rows={fields.map((field) => ({
        key: field,
        label: labels[field],
        value: values[field],
      }))}
    />
  );
}
