import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getLocalePath } from "@/lib/i18n";
import type { Dictionary } from "@/content";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["common"];
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
            <p className="mt-3 text-sm text-gray-400">
              {dict.tagline}
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Product
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={getLocalePath(locale, "/#features")}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {locale === "fr" ? "Fonctionnalités" : "Features"}
                </Link>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/cerebrum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  App Store
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              {locale === "fr" ? "Légal" : "Legal"}
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={getLocalePath(locale, "/privacy")}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={getLocalePath(locale, "/terms")}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {locale === "fr" ? "Nous écrire" : "Write to us"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>{dict.footer.copyright}</p>
          <p className="flex items-center gap-1">
            {locale === "fr" ? "Fait avec" : "Made with"}
            <span className="text-accent-coral">❤</span>
            {locale === "fr" ? "en France" : "in France"}
          </p>
        </div>
      </div>
    </footer>
  );
}
