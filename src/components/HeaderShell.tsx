"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Entrée de navigation : URL déjà résolue (ex. "/#faq", "/fr#faq") et libellé localisé. */
export interface HeaderNavLink {
  href: string;
  label: string;
}

/**
 * Partie interactive du header (fond au scroll, menu mobile). Les libellés
 * arrivent déjà traduits depuis `Header` (composant serveur) : le dictionnaire
 * complet n'est ainsi jamais embarqué dans le bundle client.
 */
export function HeaderShell({
  locale,
  homeHref,
  links,
  languageTable,
}: {
  locale: Locale;
  homeHref: string;
  links: readonly HeaderNavLink[];
  languageTable: LanguageSwitchTable;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-white/90 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={homeHref}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <Image
            src="/images/brand/logo-synapgeek.png"
            alt="Synapgeek logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          Synapgeek
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher locale={locale} table={languageTable} />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2 text-text-secondary hover:bg-surface md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-white md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-text-secondary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4">
              <LanguageSwitcher locale={locale} table={languageTable} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
