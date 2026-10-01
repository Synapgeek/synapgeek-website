"use client";

import { usePathname } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n";
import {
  alternatesForPathname,
  type LanguageSwitchTable,
} from "@/lib/language-alternates";
import { trackEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/Button";

/** Textes de la suggestion, rédigés dans la langue qu'ils proposent. */
export interface LanguageSuggestionCopy {
  message: string;
  cta: string;
  dismiss: string;
}

const subscribeNever = () => () => {};
const readBrowserLanguage = () => navigator.language;
// Rendu serveur : jamais de suggestion (le HTML statique est identique pour tous).
const serverLanguage = () => null;

/** Langue du site correspondant au navigateur, si elle diffère de celle de la page. */
function suggestedLocale(
  browserLanguage: string | null,
  current: Locale,
): Locale | null {
  if (!browserLanguage) return null;
  const primary = browserLanguage.toLowerCase().split("-")[0];
  return (
    LOCALES.find(
      (candidate) => candidate === primary && candidate !== current,
    ) ?? null
  );
}

/**
 * Invitation à lire la page dans la langue du navigateur. Feuille cliente : le
 * serveur ne connaît pas `navigator.language`, donc elle ne rend rien au serveur
 * et n'apparaît qu'après l'hydratation, en `position: fixed` (aucun décalage de
 * mise en page). Ni redirection ni stockage : un lien, une fermeture en mémoire.
 * Jamais sur les pages légales (`excludedPaths`).
 */
export function LanguageSuggestion({
  locale,
  table,
  excludedPaths,
  copy,
}: {
  locale: Locale;
  table: LanguageSwitchTable;
  /** Chemins (publics et servis) où la suggestion ne s'affiche pas. */
  excludedPaths: readonly string[];
  copy: Readonly<Record<Locale, LanguageSuggestionCopy>>;
}) {
  const pathname = usePathname();
  const messageId = useId();
  const [dismissed, setDismissed] = useState(false);
  const browserLanguage = useSyncExternalStore(
    subscribeNever,
    readBrowserLanguage,
    serverLanguage,
  );

  const target = suggestedLocale(browserLanguage, locale);
  if (dismissed || !target || excludedPaths.includes(pathname)) return null;

  const text = copy[target];
  return (
    <aside
      lang={target}
      aria-labelledby={messageId}
      className="shell-pop fixed inset-x-gutter top-20 z-30 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-3 rounded-card border border-border bg-canvas p-4 pl-6 shadow-lift lg:right-[max(var(--spacing-gutter),calc((100vw-72rem)/2+var(--spacing-gutter)))] lg:left-auto lg:w-[26rem]"
    >
      <p id={messageId} className="self-center text-sm">
        {text.message}
      </p>
      <Button
        href={alternatesForPathname(table, pathname)[target]}
        hrefLang={target}
        onClick={() =>
          trackEvent("language_switched", { from: locale, to: target })
        }
        className="col-span-2 row-start-2"
      >
        {text.cta}
      </Button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={text.dismiss}
        className="col-start-2 row-start-1 inline-flex size-11 items-center justify-center rounded-pill text-text-secondary transition-colors duration-150 hover:bg-canvas-soft hover:text-ink"
      >
        <X className="size-5" />
      </button>
    </aside>
  );
}
