import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { pagePath } from "@/lib/routes";
import type { Dictionary } from "@/content";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import { ReopenConsentLink } from "@/components/consent/ReopenConsentLink";
import { AlternateLanguageLink } from "@/components/AlternateLanguageLink";

export function Footer({
  locale,
  dict,
  languageTable,
}: {
  locale: Locale;
  dict: Dictionary["common"];
  languageTable: LanguageSwitchTable;
}) {
  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-lg font-extrabold">
              <Image
                src="/images/brand/logo-synapgeek.png"
                alt="Synapgeek logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              Synapgeek
            </div>
            <p className="mt-3 text-sm text-gray-400">{dict.tagline}</p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {dict.footer.productHeading}
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={pagePath("home", locale, "features")}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.features}
                </Link>
              </li>
              <li>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  App Store
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Google Play
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {dict.footer.legalHeading}
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={pagePath("privacy", locale)}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={pagePath("terms", locale)}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={pagePath("legal", locale)}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.legalNotice}
                </Link>
              </li>
              <li>
                <ReopenConsentLink label={dict.footer.manageCookies} />
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {dict.footer.contactHeading}
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={pagePath("home", locale, "contact")}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.writeToUs}
                </Link>
              </li>
              <li>
                <AlternateLanguageLink
                  table={languageTable}
                  targetLocale={dict.languageSwitchLocale}
                  label={dict.languageSwitch}
                  className="text-gray-400 transition-colors hover:text-white"
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-400 sm:flex-row">
          <p>{dict.footer.copyright}</p>
          <p className="flex items-center gap-1">
            {dict.footer.madeWith}
            <span className="text-accent-coral">❤</span>
            {dict.footer.inFrance}
          </p>
        </div>
      </div>
    </footer>
  );
}
