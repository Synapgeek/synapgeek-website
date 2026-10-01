/**
 * Cerebrum app store metadata.
 * iOS depuis le 2026-06-03, Android depuis le lancement Play.
 * Le bundle iOS (com.synapgeek.cerebrumgame) et le package Android
 * (com.synapgeek.cerebrum) diffèrent : ce n'est pas une coquille.
 */

export const APP_STORE_ID = "6763915130";

// Geo-neutral App Store URL — Apple redirects to the visitor's local storefront.
export const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

// Fiche Google Play, en ligne.
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum";

/**
 * Cible App Store du QR imprimé (chevalet de comptoir, Lille).
 * `pt` (provider token) et `ct` (campaign token) sont les paramètres de campagne
 * Apple, lus dans App Analytics — ils n'identifient aucun visiteur.
 * Le QR encode https://synapgeek.com/cerebrum/play (`/play` et `/jouer` y
 * redirigent), jamais cette URL-ci : le carton vit des mois, la cible doit rester
 * modifiable sans réimpression.
 */
export const APP_STORE_QR_URL = `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=128805365&ct=plv-comptoir&mt=8`;
