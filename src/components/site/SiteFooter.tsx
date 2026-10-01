import Image from "next/image";
import Link from "next/link";
import { Languages } from "lucide-react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { pagePath } from "@/lib/routes";
import { ReopenConsentLink } from "@/components/consent/ReopenConsentLink";
import { LanguageSwitch } from "./LanguageSwitch";

const linkClasses =
  "inline-block rounded-sm py-1.5 text-sm text-text-secondary underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline";
const headingClasses = "mb-2 text-sm font-bold text-ink";

/**
 * Pied de page (composant serveur). Contient le lien permanent vers la même page
 * dans l'autre langue (texte, crawlable), les pages légales, « Gérer mes cookies »
 * et la ligne d'identité de l'éditeur. Aucun mailto : le contact passe par le
 * formulaire du hub.
 */
export function SiteFooter({
  locale,
  dict,
  languageTable,
}: {
  locale: Locale;
  dict: Dictionary["common"];
  languageTable: LanguageSwitchTable;
}) {
  const { footer, nav } = dict;

  return (
    <footer className="border-t border-border bg-canvas-soft">
      <div className="mx-auto max-w-6xl px-gutter py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Link
              href={pagePath("home", locale)}
              className="inline-flex items-center gap-2.5 rounded-pill"
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
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              {dict.tagline}
            </p>
            <p className="mt-4 flex items-center gap-2">
              <Languages
                className="size-4 text-text-secondary"
                aria-hidden="true"
              />
              <LanguageSwitch
                table={languageTable}
                locale={locale}
                target={dict.languageSwitchLocale}
                label={dict.languageSwitch}
                variant="text"
                className={linkClasses}
              />
            </p>
          </div>

          <nav
            aria-label={dict.a11y.footerNavigation}
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            <div>
              <p className={headingClasses}>{footer.productHeading}</p>
              <ul>
                <li>
                  <Link
                    href={pagePath("home", locale, "games")}
                    className={linkClasses}
                  >
                    {nav.games}
                  </Link>
                </li>
                <li>
                  <Link
                    href={pagePath("cerebrum", locale)}
                    className={linkClasses}
                  >
                    {nav.cerebrum}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className={headingClasses}>{footer.studioHeading}</p>
              <ul>
                <li>
                  <Link
                    href={pagePath("about", locale)}
                    className={linkClasses}
                  >
                    {nav.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={pagePath("press", locale)}
                    className={linkClasses}
                  >
                    {nav.press}
                  </Link>
                </li>
                <li>
                  <Link
                    href={pagePath("home", locale, "contact")}
                    className={linkClasses}
                  >
                    {footer.contact}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className={headingClasses}>{footer.legalHeading}</p>
              <ul>
                <li>
                  <Link
                    href={pagePath("privacy", locale)}
                    className={linkClasses}
                  >
                    {footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={pagePath("terms", locale)}
                    className={linkClasses}
                  >
                    {footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={pagePath("legal", locale)}
                    className={linkClasses}
                  >
                    {footer.legalNotice}
                  </Link>
                </li>
                <li>
                  <ReopenConsentLink
                    label={footer.manageCookies}
                    className={`${linkClasses} text-left`}
                  />
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:justify-between">
          <p>{footer.identity}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
