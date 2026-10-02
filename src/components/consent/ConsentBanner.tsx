"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import type { Dictionary } from "@/content";
import {
  clearGaCookies,
  readStoredConsentChoice,
  writeStoredConsentChoice,
  type AnalyticsConsentChoice,
} from "@/lib/consent/storage";
import { SG_CONSENT_REOPEN_EVENT } from "@/lib/consent/reopen-event";
import { publishBannerOpen } from "./banner-signal";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * État exposé via `useSyncExternalStore` plutôt que `useState` + `useEffect` :
 * `localStorage` est un système EXTERNE à React, et le lire pendant le rendu
 * casserait l'hydratation SSR (le serveur ne peut pas y accéder), tandis
 * qu'un `setState` synchrone dans le corps d'un effet déclenche des rendus en
 * cascade — les deux approches usuelles sont donc écartées au profit de celle
 * que React documente pour ce cas exact. `getServerSnapshot` renvoie toujours
 * l'état initial (masqué) : le bandeau reste masqué au rendu serveur dans
 * tous les cas, conformément à la spécification.
 *
 * `focusToken` (incrémenté à chaque réouverture via `reopen()`, jamais à
 * l'affichage automatique initial) permet à `ConsentBanner` de distinguer
 * « le bandeau vient d'apparaître tout seul au chargement » (ne pas voler le
 * focus) de « le bandeau vient d'être rouvert via "Gérer mes cookies" »
 * (déplacer le focus sur son titre) — y compris quand il était déjà visible,
 * cas où `visible` seul ne changerait pas et ne déclencherait pas l'effet.
 *
 * État de module (pas de Context ni de prop) : `ConsentBanner` n'est monté
 * qu'une fois par page (layout de locale), un singleton suffit et survit
 * intentionnellement à une navigation client-side (un choix déjà fait sur une
 * page ne doit pas rouvrir le bandeau sur la suivante).
 */
interface BannerState {
  visible: boolean;
  focusToken: number;
}

const INITIAL_STATE: BannerState = { visible: false, focusToken: 0 };

let state: BannerState = INITIAL_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  state = { ...state, visible: readStoredConsentChoice() === null };
}

function reopen() {
  state = { visible: true, focusToken: state.focusToken + 1 };
  notify();
}

function subscribe(listener: () => void): () => void {
  ensureInitialized();
  listeners.add(listener);
  window.addEventListener(SG_CONSENT_REOPEN_EVENT, reopen);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(SG_CONSENT_REOPEN_EVENT, reopen);
  };
}

function getSnapshot(): BannerState {
  ensureInitialized();
  return state;
}

function getServerSnapshot(): BannerState {
  return INITIAL_STATE;
}

/**
 * ConsentBanner — bandeau de consentement maison (Google Funding Choices
 * abandonné : exige un compte AdSense/Ad Manager que ce site n'a pas). Monté
 * une fois dans `[locale]/layout.tsx`, indépendamment de `ConsentBootstrap` /
 * de la présence de `NEXT_PUBLIC_GA_MEASUREMENT_ID` — la région étant résolue
 * par Google et jamais par nous, on ne peut cibler l'affichage : le bandeau
 * s'affiche à tout visiteur sans choix stocké valide, qu'il serve à
 * s'opposer (hors zone RGPD) ou à consentir (dedans).
 *
 * Non modal : `role="region"` (pas `role="dialog"`), pas de fond assombri,
 * pas de piège de focus, la page reste utilisable et ne subit aucun
 * décalage de mise en page (`position: fixed`). L'animation d'apparition
 * (`.animate-fade-in-up`, `globals.css`) est déjà neutralisée sous
 * `prefers-reduced-motion: reduce`.
 *
 * Position : carte pleine largeur (avec marges) ancrée en bas, centrée, en
 * dessous du breakpoint `lg` ; à partir de `lg`, ancrée en bas à DROITE et
 * plafonnée à 26rem — sur desktop, le hero place les badges App
 * Store/Google Play (le CTA principal) dans sa colonne de GAUCHE et son
 * mockup iPhone (purement décoratif) dans sa colonne de DROITE : ancrer le
 * bandeau à droite le fait chevaucher au pire ce mockup, jamais les badges.
 *
 * Focus clavier : monté tôt dans le DOM (juste après le lien d'évitement,
 * voir `[locale]/layout.tsx`) pour qu'un utilisateur clavier l'atteigne sans
 * traverser toute la page. Le focus n'est déplacé sur son titre QUE lors
 * d'une réouverture via « Gérer mes cookies » (`focusToken` incrémenté par
 * `reopen()`) — jamais lors de l'affichage automatique au premier chargement,
 * qui ne doit pas voler le focus courant.
 */
export function ConsentBanner({
  privacyHref,
  dict,
}: {
  /** URL déjà résolue de la politique de confidentialité (ancre #website) : ce composant client ne connaît pas le registre des routes. */
  privacyHref: string;
  dict: Dictionary["common"]["consent"];
}) {
  const { visible: isVisible, focusToken } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const titleRef = useRef<HTMLParagraphElement>(null);

  const choose = useCallback((choice: AnalyticsConsentChoice) => {
    // Le choix du clic s'applique toujours pour la page en cours, même si
    // l'écriture localStorage échoue (navigation privée, stockage bloqué) —
    // décision produit : un bandeau qui réapparaîtrait aussitôt après un
    // clic serait pire qu'un choix non mémorisé d'une page à l'autre.
    writeStoredConsentChoice(choice);
    window.gtag?.("consent", "update", { analytics_storage: choice });
    if (choice === "denied") {
      // "consent update denied" empêche gtag.js de LIRE/ÉCRIRE _ga/_ga_*
      // dès maintenant, mais n'efface jamais les cookies déjà posés lors
      // d'une session précédente (accepté puis refusé, ou mesuré par défaut
      // hors zone RGPD puis refusant) — voir `clearGaCookies`.
      clearGaCookies();
    }
    state = { visible: false, focusToken: 0 };
    notify();
  }, []);

  // Publie l'état ouvert/fermé pour `LanguageSuggestion`, qui attend la fermeture
  // du bandeau (deux surfaces fixées en bas ne se superposent jamais). Layout
  // effect : l'abonné se met à jour avant la peinture, sans image intermédiaire
  // où les deux seraient visibles.
  useLayoutEffect(() => {
    publishBannerOpen(isVisible);
    return () => publishBannerOpen(false);
  }, [isVisible]);

  // Ne déplace le focus que sur une réouverture explicite (`focusToken` > 0
  // signifie qu'un `reopen()` a eu lieu au moins une fois) — jamais sur
  // l'affichage automatique initial, où `focusToken` reste à 0.
  useEffect(() => {
    if (isVisible && focusToken > 0) {
      titleRef.current?.focus();
    }
  }, [isVisible, focusToken]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6 lg:justify-end lg:px-8 lg:pb-8">
      <div
        role="region"
        aria-label={dict.title}
        className="animate-fade-in-up pointer-events-auto w-full max-w-lg rounded-3xl border border-border bg-white p-5 shadow-lg sm:p-6 lg:max-w-[26rem]"
      >
        <p
          ref={titleRef}
          tabIndex={-1}
          className="rounded text-base font-extrabold text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          {dict.title}
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          {dict.body}{" "}
          <Link
            href={privacyHref}
            className="font-semibold text-text-primary underline underline-offset-2"
          >
            {dict.learnMore}
          </Link>
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm font-bold text-text-primary transition-colors hover:bg-border/60"
          >
            {dict.refuse}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm font-bold text-text-primary transition-colors hover:bg-border/60"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
