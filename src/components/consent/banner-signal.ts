/**
 * Signal « le bandeau de consentement est ouvert », partagé entre `ConsentBanner`
 * (qui le publie) et `LanguageSuggestion` (qui l'attend). Deux surfaces fixées au
 * bas de l'écran ne doivent jamais se superposer : la suggestion de langue patiente
 * jusqu'à la fermeture du bandeau.
 *
 * Le signal vit sur `<html data-consent-banner="open">` (lisible aussi en CSS ou
 * depuis la console) et un événement `window` prévient les abonnés. Aucune
 * logique, aucune donnée ni aucun signal Consent Mode ne passe par ici.
 */
export const SG_CONSENT_BANNER_EVENT = "sg-consent:banner";

const OPEN = "open";

/** Publie l'état du bandeau : l'attribut n'existe que tant qu'il est ouvert. */
export function publishBannerOpen(open: boolean): void {
  const { dataset } = document.documentElement;
  if (open) {
    dataset.consentBanner = OPEN;
  } else {
    delete dataset.consentBanner;
  }
  window.dispatchEvent(new Event(SG_CONSENT_BANNER_EVENT));
}

export function readBannerOpen(): boolean {
  return document.documentElement.dataset.consentBanner === OPEN;
}

export function subscribeBannerOpen(onChange: () => void): () => void {
  window.addEventListener(SG_CONSENT_BANNER_EVENT, onChange);
  return () => window.removeEventListener(SG_CONSENT_BANNER_EVENT, onChange);
}

/** Rendu serveur : « fermé » (le HTML statique est identique pour tous). */
export function readBannerOpenOnServer(): boolean {
  return false;
}
