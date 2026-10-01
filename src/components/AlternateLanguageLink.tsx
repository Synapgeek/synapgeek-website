"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { useLanguageAlternates } from "@/hooks/useLanguageAlternates";

/**
 * Lien permanent vers la même page dans l'autre langue (pied de page). Rendu en
 * vrai <a hreflang lang> dans le HTML initial : c'est lui qui relie les deux
 * versions du site pour un crawler.
 */
export function AlternateLanguageLink({
  table,
  targetLocale,
  label,
  className,
}: {
  table: LanguageSwitchTable;
  targetLocale: Locale;
  label: string;
  className?: string;
}) {
  const alternates = useLanguageAlternates(table);

  return (
    <Link
      href={alternates[targetLocale]}
      hrefLang={targetLocale}
      lang={targetLocale}
      className={className}
    >
      {label}
    </Link>
  );
}
