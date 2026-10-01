import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { pagePath } from "@/lib/routes";
import { getDictionary } from "@/content";
import { HeaderShell, type HeaderNavLink } from "./HeaderShell";

/**
 * Header du site (composant serveur) : résout les libellés de navigation dans
 * le dictionnaire et les URLs via `pagePath`, puis délègue l'interactivité à
 * `HeaderShell` (qui ne voit ainsi ni le dictionnaire ni le registre des routes).
 */
export function Header({
  locale,
  languageTable,
}: {
  locale: Locale;
  languageTable: LanguageSwitchTable;
}) {
  const { nav } = getDictionary(locale).common;
  const links: readonly HeaderNavLink[] = [
    { href: pagePath("home", locale, "features"), label: nav.features },
    { href: pagePath("home", locale, "faq"), label: nav.faq },
    { href: pagePath("home", locale, "about"), label: nav.about },
    { href: pagePath("home", locale, "contact"), label: nav.contact },
  ];

  return (
    <HeaderShell
      locale={locale}
      homeHref={pagePath("home", locale)}
      links={links}
      languageTable={languageTable}
    />
  );
}
