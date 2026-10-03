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
import {
  readBannerOpen,
  readBannerOpenOnServer,
  subscribeBannerOpen,
} from "@/components/consent/banner-signal";

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

interface SuggestionInput {
  browserLanguage: string | null;
  locale: Locale;
  /** Le bandeau de consentement, fixé lui aussi en bas, est ouvert. */
  bannerOpen: boolean;
  dismissed: boolean;
  pathname: string;
  excludedPaths: readonly string[];
}

/** Langue à proposer maintenant, ou `null` si la suggestion doit rester cachée. */
export function visibleSuggestionTarget({
  browserLanguage,
  locale,
  bannerOpen,
  dismissed,
  pathname,
  excludedPaths,
}: SuggestionInput): Locale | null {
  if (bannerOpen || dismissed || excludedPaths.includes(pathname)) return null;
  return suggestedLocale(browserLanguage, locale);
}

/**
 * Sous `lg` : feuille compacte (message, pilule, fermeture sur une ligne) ancrée
 * en bas, comme le bandeau de consentement, pour ne jamais couvrir le titre ni la
 * définition du hero. À partir de `lg` : carte en haut à droite, sous le header.
 */
const CARD_CLASSES = [
  "shell-pop fixed inset-x-gutter bottom-gutter z-30 flex items-center gap-2 rounded-card border border-border bg-canvas py-2 pr-2 pl-4 shadow-lift",
  "lg:inset-x-auto lg:top-20 lg:right-[max(var(--spacing-gutter),calc((100vw-72rem)/2+var(--spacing-gutter)))] lg:bottom-auto lg:grid lg:w-[26rem] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch lg:gap-x-2 lg:gap-y-3 lg:p-4 lg:pl-6",
].join(" ");

export function LanguageSuggestionCard({
  target,
  messageId,
  text,
  href,
  onNavigate,
  onDismiss,
}: {
  target: Locale;
  messageId: string;
  text: LanguageSuggestionCopy;
  href: string;
  onNavigate: () => void;
  onDismiss: () => void;
}) {
  return (
    <aside lang={target} aria-labelledby={messageId} className={CARD_CLASSES}>
      <p id={messageId} className="min-w-0 flex-1 text-sm lg:self-center">
        {text.message}
      </p>
      <Button
        href={href}
        hrefLang={target}
        onClick={onNavigate}
        className="px-4! lg:col-span-2 lg:row-start-2 lg:px-6!"
      >
        {text.cta}
      </Button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={text.dismiss}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-text-secondary transition-colors duration-150 hover:bg-canvas-soft hover:text-ink lg:col-start-2 lg:row-start-1"
      >
        <X className="size-5" />
      </button>
    </aside>
  );
}

/**
 * Invitation à lire la page dans la langue du navigateur. Feuille cliente : le
 * serveur ne connaît pas `navigator.language`, donc elle ne rend rien au serveur
 * et n'apparaît qu'après l'hydratation, en `position: fixed` (aucun décalage de
 * mise en page). Ni redirection ni stockage : un lien, une fermeture en mémoire.
 * Jamais sur les pages légales (`excludedPaths`), et jamais tant que le bandeau
 * de consentement est ouvert (signal `banner-signal`).
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
  const bannerOpen = useSyncExternalStore(
    subscribeBannerOpen,
    readBannerOpen,
    readBannerOpenOnServer,
  );

  const target = visibleSuggestionTarget({
    browserLanguage,
    locale,
    bannerOpen,
    dismissed,
    pathname,
    excludedPaths,
  });
  if (!target) return null;

  return (
    <LanguageSuggestionCard
      target={target}
      messageId={messageId}
      text={copy[target]}
      href={alternatesForPathname(table, pathname)[target]}
      onNavigate={() =>
        trackEvent("language_switched", { from: locale, to: target })
      }
      onDismiss={() => setDismissed(true)}
    />
  );
}
