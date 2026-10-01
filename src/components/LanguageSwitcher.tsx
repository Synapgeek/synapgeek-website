"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useId } from "react";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { useLanguageAlternates } from "@/hooks/useLanguageAlternates";
import { trackEvent } from "@/lib/gtag";

const LANGUAGES: Record<Locale, { label: string; flag: string }> = {
  fr: { label: "FR", flag: "🇫🇷" },
  en: { label: "EN", flag: "🇬🇧" },
};

/**
 * Les liens de langue sont toujours dans le HTML (attribut `hidden` tant que le
 * menu est fermé) : un crawler les voit, contrairement à un menu qui ne les
 * monterait qu'à l'ouverture.
 */
export function LanguageSwitcher({
  locale,
  table,
}: {
  locale: Locale;
  table: LanguageSwitchTable;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const alternates = useLanguageAlternates(table);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES[locale];

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-surface"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Select language"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
      </button>

      <ul
        id={menuId}
        hidden={!open}
        className="absolute right-0 z-50 mt-1 min-w-[100px] overflow-hidden rounded-xl border border-border bg-white shadow-lg"
      >
        {(
          Object.entries(LANGUAGES) as [
            Locale,
            { label: string; flag: string },
          ][]
        ).map(([lang, { label, flag }]) => (
          <li key={lang}>
            <Link
              href={alternates[lang]}
              hrefLang={lang}
              lang={lang}
              aria-current={lang === locale ? "true" : undefined}
              onClick={() => {
                setOpen(false);
                if (lang !== locale) {
                  trackEvent("language_switched", { from: locale, to: lang });
                }
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-surface ${
                lang === locale ? "bg-primary/5 text-primary" : ""
              }`}
            >
              <span aria-hidden="true">{flag}</span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
