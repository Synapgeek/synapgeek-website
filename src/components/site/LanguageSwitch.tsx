"use client";

import { InternalLink } from "@/components/ui/InternalLink";
import type { Locale } from "@/lib/i18n";
import type { LanguageSwitchTable } from "@/lib/language-alternates";
import { useLanguageAlternates } from "@/hooks/useLanguageAlternates";
import { trackEvent } from "@/lib/gtag";

/**
 * Lien vers la page COURANTE dans l'autre langue : un vrai `<a href hreflang lang>`
 * présent dans le HTML initial (un crawler le suit), dont la destination vient du
 * tableau « chemin → alternates » construit côté serveur. Deux présentations :
 * `pill` (code de langue, barre du header) et `text` (nom de la langue, pied de page).
 */
export function LanguageSwitch({
  table,
  locale,
  target,
  label,
  variant,
  className = "",
}: {
  table: LanguageSwitchTable;
  /** Langue de la page affichée. */
  locale: Locale;
  /** Langue vers laquelle le lien mène. */
  target: Locale;
  /** Nom de la langue cible, dans le dictionnaire de la page (« English », « Français »). */
  label: string;
  variant: "pill" | "text";
  className?: string;
}) {
  const alternates = useLanguageAlternates(table);

  return (
    <InternalLink
      href={alternates[target]}
      hrefLang={target}
      lang={target}
      aria-label={variant === "pill" ? label : undefined}
      onClick={() =>
        trackEvent("language_switched", { from: locale, to: target })
      }
      className={className}
    >
      {variant === "pill" ? (
        <span aria-hidden="true">{target.toUpperCase()}</span>
      ) : (
        label
      )}
    </InternalLink>
  );
}
