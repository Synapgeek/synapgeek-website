import { formatUpdatedAt } from "@/lib/format-date";
import type { Locale } from "@/lib/i18n";

/** Date de la page, en pied : « Mis à jour le … ». */
export function UpdatedOn({
  label,
  isoDate,
  locale,
}: {
  label: string;
  isoDate: string;
  locale: Locale;
}) {
  return (
    <div className="bg-canvas py-8 text-text-secondary">
      <p className="mx-auto max-w-3xl px-gutter text-sm">
        {label}{" "}
        <time dateTime={isoDate}>{formatUpdatedAt(isoDate, locale)}</time>
      </p>
    </div>
  );
}
