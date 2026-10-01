import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { pagePath } from "@/lib/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";

const desktopLinkClasses =
  "rounded-pill px-4 py-2 text-sm font-bold text-text-secondary transition-colors duration-150 hover:bg-canvas-soft hover:text-ink";
const mobileLinkClasses =
  "block rounded-2xl px-4 py-3 font-display text-xl font-bold text-ink transition-colors duration-150 hover:bg-canvas-soft";

/**
 * Barre du site (composant serveur). Logo et wordmark mènent au hub ; les liens
 * viennent de `pagePath` et du dictionnaire ; le lien de langue (client) mène à
 * la page courante dans l'autre langue. Sticky, 4 rem de haut : les ancres des
 * pages gardent un `scroll-margin-top` d'au moins 6 rem.
 */
export function SiteHeader({
  locale,
  dict,
  languageTable,
}: {
  locale: Locale;
  dict: Dictionary["common"];
  languageTable: LanguageSwitchTable;
}) {
  const links = [
    { href: pagePath("home", locale, "games"), label: dict.nav.games },
    { href: pagePath("cerebrum", locale), label: dict.nav.cerebrum },
    { href: pagePath("about", locale), label: dict.nav.about },
    { href: pagePath("press", locale), label: dict.nav.press },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-gutter">
        <Link
          href={pagePath("home", locale)}
          className="flex items-center gap-2.5 rounded-pill"
        >
          <Image
            src="/images/brand/logo-synapgeek.png"
            alt=""
            width={40}
            height={40}
          />
          <span className="font-display text-2xl font-bold tracking-tight">
            {dict.siteName}
          </span>
        </Link>

        <nav
          aria-label={dict.a11y.mainNavigation}
          className="ml-auto hidden md:block"
        >
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={desktopLinkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:ml-0">
          <LanguageSwitch
            table={languageTable}
            locale={locale}
            target={dict.languageSwitchLocale}
            label={dict.languageSwitch}
            variant="pill"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill bg-canvas-soft px-4 text-sm font-bold text-ink transition-colors duration-150 hover:bg-wash-violet active:scale-[0.97]"
          />
          <MobileMenu label={dict.a11y.menu}>
            <nav
              aria-label={dict.a11y.mainNavigation}
              className="mx-auto max-w-6xl px-gutter py-4"
            >
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={mobileLinkClasses}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
