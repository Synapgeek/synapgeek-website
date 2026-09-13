import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { HeaderShell, type HeaderNavLink } from "./HeaderShell";

/**
 * Header du site (composant serveur) : résout les libellés de navigation dans
 * le dictionnaire, puis délègue l'interactivité à `HeaderShell`.
 */
export function Header({ locale }: { locale: Locale }) {
  const { nav } = getDictionary(locale).common;
  const links: readonly HeaderNavLink[] = [
    { path: "/#features", label: nav.features },
    { path: "/#faq", label: nav.faq },
    { path: "/#about", label: nav.about },
    { path: "/#contact", label: nav.contact },
  ];

  return <HeaderShell locale={locale} links={links} />;
}
