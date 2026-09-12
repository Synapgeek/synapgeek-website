import { lastExplicitAnalyticsRegime } from "@/lib/consent/consent-state";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Garde étroite de consentement (réutilisation de MÉCANISME depuis Word
 * Search Trove, portefeuille Synapgeek) : si le DERNIER `consent update`
 * explicite du dataLayer dit "denied", `trackEvent` n'émet rien. « N'a pas
 * encore répondu » et « a dit non » ne sont pas la même position
 * juridiquement — les défauts régionalisés posés par `ConsentBootstrap`
 * arbitrent déjà la première (mesure par défaut hors zone RGPD) ; un visiteur
 * qui refuse ACTIVEMENT via la CMP ne doit pas continuer d'être mesuré, même
 * sans cookie.
 *
 * Cette garde n'entrave jamais le cas nominal : sans CMP configurée, aucun
 * `update` n'existe jamais dans le dataLayer (`ConsentBootstrap` ne pousse
 * que des `default`), donc `trackEvent` émet — c'est Consent Mode, à
 * l'intérieur de gtag.js une fois chargé, qui filtre ce qui part réellement
 * selon l'état courant du dataLayer, pas cette fonction.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  if (lastExplicitAnalyticsRegime(dataLayer) === "denied") return;
  window.gtag?.("event", eventName, params);
}
