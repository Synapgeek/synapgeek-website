"use client";

import Script from "next/script";

/**
 * AnalyticsLoader — composé par `AnalyticsGate`, elle-même composée par
 * `ConsentBootstrap`. Ne fait plus que demander le fichier `gtag.js` :
 * les commandes `gtag('js', …)` et `gtag('config', …)` sont posées par le
 * script inline SERVEUR de `ConsentBootstrap`, exécuté bien avant
 * l'hydratation (voir son docblock pour la raison — garantir que `config`
 * précède tout `trackEvent`). La file `dataLayer` est donc déjà prête quand
 * ce fichier charge et la traite ; ce composant n'a plus qu'à le requêter.
 *
 * `strategy="lazyOnload"` (chargement après l'événement `load` de la
 * fenêtre) — reprend le choix déjà en production sur ce site (quelques
 * visites très courtes ne seront pas mesurées, contre du JS retiré de la
 * fenêtre de rendu initiale). Ce choix reste sûr : les défauts et le rejeu du
 * choix stocké sont déjà dans `dataLayer` avant que `lazyOnload` ne
 * déclenche quoi que ce soit — l'ordre « consentement avant tag » ne dépend
 * donc pas de la stratégie de chargement choisie ici.
 */
interface AnalyticsLoaderProps {
  gaId: string;
}

export function AnalyticsLoader({ gaId }: AnalyticsLoaderProps) {
  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      strategy="lazyOnload"
      onError={() => {
        // Un tiers indisponible (bloqueur de publicités, réseau) ne casse
        // jamais le site : jamais de retry, jamais de throw.
        console.error(
          "AnalyticsLoader: échec du chargement de gtag.js — analytics restera inerte pour cette session.",
        );
      }}
    />
  );
}
