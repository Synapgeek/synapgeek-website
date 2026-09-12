import { GDPR_REGIONS } from "./regions";

/**
 * Consent Mode v2 — défauts RÉGIONALISÉS, réutilisation de MÉCANISME depuis
 * Word Search Trove (portefeuille Synapgeek, skill `synapgeek-portfolio-
 * rules` règle 8, corrigée le 2026-08-25 : « accordé par défaut hors des
 * régions RGPD listées, refusé dedans », pas le mode "basic" tout refusé).
 *
 * `CONSENT_SIGNALS` — les 4 signaux exigés par la règle portefeuille 8.
 */
export const CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
] as const;

/**
 * Union discriminée : le modèle doit pouvoir exprimer aussi bien une commande
 * `gtag('consent','default', payload)` qu'une commande `gtag('set', key,
 * value)` (nécessaire pour `ads_data_redaction` ci-dessous). Chaque variante
 * décrit une commande sous forme de DONNÉES, jamais une chaîne pré-assemblée :
 * `ConsentBootstrap` reste un simple `switch` exhaustif sur `kind` pour la
 * sérialiser.
 */
export type GtagBootstrapCommand =
  | {
      readonly kind: "consent-default";
      readonly payload: Record<string, unknown>;
    }
  | { readonly kind: "set"; readonly key: string; readonly value: unknown };

/**
 * La séquence ORDONNÉE que `ConsentBootstrap` sérialise dans un `<script>`
 * inline, identique pour tout visiteur (aucune variante conditionnée à la
 * géolocalisation côté serveur — la région est résolue par Google, jamais par
 * nous ; comment elle l'est n'est pas documenté publiquement).
 *
 * Ce n'est PAS l'ordre des deux commandes `consent default` qui fait tenir la
 * politique régionale, c'est leur SPÉCIFICITÉ : Google documente que « the one
 * with a more specific region will take effect ». La commande globale
 * ("granted", sans `region`) ne couvre donc que les visiteurs qu'aucune
 * commande régionale ne couvre déjà ; la commande régionale ("denied",
 * `region: GDPR_REGIONS`) prévaut pour ces 43 juridictions quel que soit
 * l'ordre d'appel. L'ordre régional-en-dernier ci-dessous est retenu pour la
 * lisibilité humaine (le cas général d'abord, l'exception ensuite), jamais
 * parce que gtag.js le lirait dans cet ordre pour trancher.
 *
 * `wait_for_update: 500` (ms) sur la commande régionale seulement : laisse à
 * une CMP déjà connue du visiteur (consentement stocké localement) le temps
 * de pousser son verdict avant qu'un tag ne parte sous le défaut "denied".
 * Sans effet observable tant qu'aucune CMP n'est montée (rien ne pousse
 * jamais de `consent update`) — posé quand même pour ne rien avoir à changer
 * le jour où `NEXT_PUBLIC_FUNDING_CHOICES_ID` est renseignée.
 *
 * `ads_data_redaction: true` est posé INCONDITIONNELLEMENT : Google précise
 * qu'il est sans effet quand `ad_storage` vaut "granted" (le cas global
 * ci-dessus) — il ne redresse donc que le cas "denied" (zone RGPD, avant tout
 * accord), sans jamais avoir à distinguer les deux cas dans ce script.
 */
export const CONSENT_DEFAULT_COMMANDS: readonly GtagBootstrapCommand[] = [
  {
    kind: "consent-default",
    payload: Object.fromEntries(
      CONSENT_SIGNALS.map((signal) => [signal, "granted"]),
    ),
  },
  {
    kind: "consent-default",
    payload: {
      ...Object.fromEntries(
        CONSENT_SIGNALS.map((signal) => [signal, "denied"]),
      ),
      wait_for_update: 500,
      region: GDPR_REGIONS,
    },
  },
  { kind: "set", key: "ads_data_redaction", value: true },
];

function isArrayLikeOfUnknown(value: unknown): value is ArrayLike<unknown> {
  if (typeof value !== "object" || value === null) return false;
  const length = (value as { length?: unknown }).length;
  return typeof length === "number";
}

/** Normalise une entrée du dataLayer (IArguments ou tableau littéral) en tableau exploitable, ou `null` si la forme est inexploitable. */
function toArgsArray(entry: unknown): unknown[] | null {
  if (Array.isArray(entry)) return entry;
  if (isArrayLikeOfUnknown(entry)) return Array.from(entry);
  return null;
}

function isConsentUpdatePayload(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Régime tri-état du dernier `consent update` explicite mentionnant
 * `analytics_storage` dans un dataLayer gtag.js — jamais une variable globale
 * maison. Consommé par la garde étroite de `trackEvent` (`src/lib/gtag.ts`)
 * et par le pont TCF (`AnalyticsLoader.tsx`).
 *
 * `"unset"` : aucun `consent update` explicite n'a jamais été poussé — le cas
 * nominal sans CMP montée, ou avant qu'une CMP connue n'ait eu le temps de
 * rappeler. **Ne jamais lire "unset" comme "refusé"** : sous des défauts
 * régionalisés, aucune fonction pure côté client ne peut connaître l'état de
 * consentement EFFECTIF d'un visiteur (la région qui détermine quel défaut
 * s'applique vit chez Google, jamais dans notre dataLayer, qui ne contient
 * que les commandes envoyées). `"granted"`/`"denied"` : le dernier `update`
 * qui mentionne `analytics_storage` gagne — un `update` qui ne mentionne pas
 * ce signal ne change rien à l'état analytics, fidèle au comportement réel de
 * gtag.js (un `update` ne modifie que les clés qu'il fournit).
 *
 * Accepte aussi bien un `IArguments` réel (ce que gtag.js pousse en
 * production) qu'un tableau littéral, via un test structurel sur `.length`
 * plutôt que `Array.isArray` seul.
 */
export function lastExplicitAnalyticsRegime(
  dataLayer: unknown[],
): "granted" | "denied" | "unset" {
  let regime: "granted" | "denied" | "unset" = "unset";
  for (const entry of dataLayer) {
    const args = toArgsArray(entry);
    if (!args) continue;
    if (args[0] !== "consent" || args[1] !== "update") continue;
    const payload = args[2];
    if (!isConsentUpdatePayload(payload)) continue;
    if (payload.analytics_storage === "granted") {
      regime = "granted";
    } else if (payload.analytics_storage === "denied") {
      regime = "denied";
    }
  }
  return regime;
}
