"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

const LANGUAGES: Record<Locale, { label: string; flag: string }> = {
  fr: { label: "FR", flag: "🇫🇷" },
  en: { label: "EN", flag: "🇬🇧" },
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getLocalizedPath(targetLocale: Locale) {
    let path = pathname;
    if (path.startsWith("/en")) {
      path = path.slice(3) || "/";
    } else if (path.startsWith("/fr")) {
      path = path.slice(3) || "/";
    }
    if (targetLocale === "fr") return path;
    return `/en${path}`;
  }

  const current = LANGUAGES[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-surface"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 min-w-[100px] overflow-hidden rounded-xl border border-border bg-white shadow-lg"
          role="listbox"
          aria-label="Languages"
        >
          {(Object.entries(LANGUAGES) as [Locale, { label: string; flag: string }][]).map(
            ([lang, { label, flag }]) => (
              <Link
                key={lang}
                href={getLocalizedPath(lang)}
                onClick={() => setOpen(false)}
                role="option"
                aria-selected={lang === locale}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-surface ${
                  lang === locale ? "bg-primary/5 text-primary" : ""
                }`}
              >
                <span aria-hidden="true">{flag}</span>
                <span>{label}</span>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
