"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLocalePath } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({
  locale,
}: {
  locale: Locale;
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
          href={getLocalePath(locale, "/")}
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
          <Link
            href={getLocalePath(locale, "/#features")}
            className="text-text-secondary transition-colors hover:text-primary"
          >
            {locale === "fr" ? "Fonctionnalités" : "Features"}
          </Link>
          <Link
            href={getLocalePath(locale, "/#about")}
            className="text-text-secondary transition-colors hover:text-primary"
          >
            {locale === "fr" ? "À propos" : "About"}
          </Link>
          <Link
            href={getLocalePath(locale, "/#contact")}
            className="text-text-secondary transition-colors hover:text-primary"
          >
            Contact
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2 text-text-secondary hover:bg-surface md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-border bg-white md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link
              href={getLocalePath(locale, "/#features")}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-text-secondary hover:text-primary"
            >
              {locale === "fr" ? "Fonctionnalités" : "Features"}
            </Link>
            <Link
              href={getLocalePath(locale, "/#about")}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-text-secondary hover:text-primary"
            >
              {locale === "fr" ? "À propos" : "About"}
            </Link>
            <Link
              href={getLocalePath(locale, "/#contact")}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-medium text-text-secondary hover:text-primary"
            >
              Contact
            </Link>
            <div className="border-t border-border pt-4">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
