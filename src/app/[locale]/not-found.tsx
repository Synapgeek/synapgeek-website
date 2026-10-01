import { LOCALES, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { pagePath } from "@/lib/routes";
import { LocalizedNotFound } from "@/components/site/LocalizedNotFound";
import type { NotFoundStrings } from "@/components/site/NotFoundView";

/**
 * 404 rendue DANS le layout de langue (header, pied de page, `<html lang>`),
 * pour un `notFound()` levé par une page du segment. Les textes des deux langues
 * sont passés à la feuille cliente, qui choisit selon `useParams()`.
 */
export default function LocaleNotFound() {
  const strings = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      {
        ...getDictionary(locale).common.notFound,
        href: pagePath("home", locale),
      },
    ]),
  ) as Record<Locale, NotFoundStrings>;

  return <LocalizedNotFound strings={strings} />;
}
