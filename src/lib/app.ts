/**
 * Cerebrum app store metadata.
 * iOS depuis le 2026-06-03, Android depuis le lancement Play.
 * Le bundle iOS (com.synapgeek.cerebrumgame) et le package Android
 * (com.synapgeek.cerebrum) diffèrent : ce n'est pas une coquille.
 */

import { getApp } from "@/content/apps";

const cerebrum = getApp("cerebrum");

export const APP_STORE_ID = cerebrum.appStoreId;

// URL App Store neutre côté pays : Apple redirige vers la boutique locale.
export const APP_STORE_URL = cerebrum.appStoreUrl;

// Fiche Google Play, en ligne.
export const GOOGLE_PLAY_URL = cerebrum.googlePlayUrl;

/**
 * Cible App Store du QR imprimé (chevalet de comptoir, Lille).
 * `pt` (provider token) et `ct` (campaign token) sont les paramètres de campagne
 * Apple, lus dans App Analytics — ils n'identifient aucun visiteur.
 * Le QR encode https://synapgeek.com/cerebrum/play (`/play` et `/jouer` y
 * redirigent), jamais cette URL-ci : le carton vit des mois, la cible doit rester
 * modifiable sans réimpression.
 */
export const APP_STORE_QR_URL = `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=128805365&ct=plv-comptoir&mt=8`;
