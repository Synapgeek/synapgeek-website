import { GDPR_REGIONS } from "./regions";

/**
 * Signaux publicitaires de Consent Mode v2. Ce site n'affiche AUCUNE
 * publicité : ces trois signaux restent "denied" INCONDITIONNELLEMENT — en
 * défaut global comme en défaut régional — et ne sont jamais accordés par
 * `ConsentBanner`. Seul `analytics_storage` (mesure d'audience) est gouverné
 * par le bandeau ; il n'apparaît pas dans cette liste, voir
 * `CONSENT_DEFAULT_COMMANDS` ci-dessous pour son traitement séparé.
 */
const AD_CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
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
 * Deux commandes `consent default` :
 *
 * 1. **Globale** (sans `region`) : `analytics_storage: "granted"`, les trois
 *    signaux publicitaires "denied". Ne couvre que les visiteurs qu'aucune
 *    commande régionale ne couvre déjà.
 * 2. **Régionale** (`region: GDPR_REGIONS`) : `analytics_storage: "denied"`,
 *    les trois signaux publicitaires "denied" (déjà refusés globalement,
 *    répétés ici pour que le payload régional reste autonome et lisible).
 *    Google documente que « the one with a more specific region will take
 *    effect » : cette commande prévaut pour ces 43 juridictions quel que soit
 *    l'ordre d'appel — l'ordre régional-en-dernier ci-dessous est retenu pour
 *    la lisibilité humaine (le cas général d'abord, l'exception ensuite),
 *    jamais parce que gtag.js le lirait dans cet ordre pour trancher.
 *
 * `wait_for_update: 500` (ms) sur la commande régionale seulement : laisse au
 * rejeu du choix stocké (voir `buildConsentReplayScript` ci-dessous) le temps
 * de pousser son verdict avant qu'un tag ne parte sous le défaut "denied".
 * Sans effet sur les signaux publicitaires, qui ne changent jamais.
 *
 * `ads_data_redaction: true` est posé INCONDITIONNELLEMENT : Google précise
 * qu'il est sans effet quand `ad_storage` vaut "granted" — un cas qui ne se
 * produit jamais sur ce site (`ad_storage` reste "denied" partout) — donc
 * cette commande redresse systématiquement le cas "denied", sans qu'il y ait
 * de distinction à faire ici.
 */
export const CONSENT_DEFAULT_COMMANDS: readonly GtagBootstrapCommand[] = [
  {
    kind: "consent-default",
    payload: {
      ...Object.fromEntries(
        AD_CONSENT_SIGNALS.map((signal) => [signal, "denied"]),
      ),
      analytics_storage: "granted",
    },
  },
  {
    kind: "consent-default",
    payload: {
      ...Object.fromEntries(
        AD_CONSENT_SIGNALS.map((signal) => [signal, "denied"]),
      ),
      analytics_storage: "denied",
      wait_for_update: 500,
      region: GDPR_REGIONS,
    },
  },
  { kind: "set", key: "ads_data_redaction", value: true },
];

/**
 * Sérialise une valeur en JSON prêt à être inliné dans un `<script>` HTML —
 * même idiome que `JsonLd.tsx` : `JSON.stringify` seul ne protège pas contre
 * une valeur qui contiendrait `</script>`, qui fermerait la balise avant que
 * le JS ne s'exécute. Partagée par `ConsentBootstrap` (commandes de défaut,
 * `js`/`config` GA4) et par `buildConsentReplayScript` ci-dessous.
 */
export function jsonForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Sérialise une `GtagBootstrapCommand` en l'appel `gtag(...)` littéral exécuté par le script inline. `switch` exhaustif : TypeScript refuse la compilation si une future variante de l'union n'est pas couverte. */
export function serializeGtagBootstrapCommand(
  command: GtagBootstrapCommand,
): string {
  switch (command.kind) {
    case "consent-default":
      return `gtag('consent','default',${jsonForInlineScript(command.payload)});`;
    case "set":
      return `gtag('set',${jsonForInlineScript(command.key)},${jsonForInlineScript(command.value)});`;
  }
}

/** Clé localStorage du choix de consentement analytics — lue et écrite à l'identique par `ConsentBanner`/`src/lib/consent/storage.ts` (React, après hydratation) et par `buildConsentReplayScript` (script inline, avant hydratation). */
export const SG_CONSENT_STORAGE_KEY = "sg-consent";

/** Durée de validité du choix stocké — 6 mois (180 jours), recommandation CNIL. Au-delà, le choix est traité comme absent : le bandeau réapparaît. */
export const SG_CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

/**
 * Tolérance sur un horodatage `ts` dans le FUTUR — une horloge client mal
 * réglée (ou manipulée) ne doit pas rendre le choix stocké valide
 * indéfiniment : seule la borne haute (`SG_CONSENT_MAX_AGE_MS`) était
 * vérifiée jusqu'ici, un `ts` futur passait donc `Date.now() - ts < 0 <=
 * SG_CONSENT_MAX_AGE_MS` sans jamais expirer. 24 h de marge absorbe les
 * petits décalages d'horloge légitimes (fuseau mal configuré, dérive NTP)
 * sans réintroduire la faille pour un `ts` très éloigné dans le futur.
 */
export const SG_CONSENT_FUTURE_TOLERANCE_MS = 24 * 60 * 60 * 1000;

/**
 * Sérialise le rejeu du choix stocké — DUPLIQUE volontairement la logique de
 * lecture de `readStoredConsentChoice` ET d'effacement de `clearGaCookies`
 * (`src/lib/consent/storage.ts`) sous forme de texte JS littéral : ce script
 * doit s'exécuter de façon SYNCHRONE dans le flux HTML, avant tout
 * chargement de module React (avant hydratation) — importer les fonctions
 * TypeScript ici ne servirait à rien, elles ne peuvent être exécutées
 * qu'après hydratation, alors que gtag.js peut déjà avoir traité la file
 * `dataLayer`. Toute évolution du format de stockage (`{ analytics, ts }`)
 * ou de la logique d'effacement des cookies doit être répercutée dans LES
 * DEUX endroits.
 *
 * Si le choix rejoué est "denied", les cookies `_ga`/`_ga_*` déjà posés sont
 * aussi effacés ICI (pas seulement au clic "Refuser" de `ConsentBanner`) :
 * un visiteur qui a accepté puis refusé, ou mesuré par défaut hors zone RGPD
 * puis refusant, peut recharger la page avec un choix "denied" déjà stocké —
 * sans ce rejeu, les cookies posés lors d'une session précédente
 * survivraient indéfiniment.
 *
 * `try/catch` (un englobant + un imbriqué pour l'effacement des cookies) :
 * un accès `localStorage` ou `document.cookie` peut lever (navigation
 * privée, stockage bloqué) — dans ce cas, aucun rejeu ni effacement, les
 * défauts régionaux s'appliquent tels quels, jamais d'erreur visible.
 */
export function buildConsentReplayScript(): string {
  return (
    "try{" +
    `var r=window.localStorage.getItem(${jsonForInlineScript(SG_CONSENT_STORAGE_KEY)});` +
    "if(r){" +
    "var p=JSON.parse(r);" +
    "if(p&&(p.analytics==='granted'||p.analytics==='denied')&&typeof p.ts==='number'" +
    `&&(Date.now()-p.ts)<=${SG_CONSENT_MAX_AGE_MS}` +
    `&&(p.ts-Date.now())<=${SG_CONSENT_FUTURE_TOLERANCE_MS}){` +
    "gtag('consent','update',{analytics_storage:p.analytics});" +
    "if(p.analytics==='denied'){" +
    "try{" +
    "var h=window.location.hostname;" +
    "var lb=h.split('.');" +
    "var dm=(h==='localhost'||/^[0-9.]+$/.test(h)||lb.length<2)?null:('.'+lb.slice(-2).join('.'));" +
    "var ex='expires=Thu, 01 Jan 1970 00:00:00 GMT';" +
    "var cs=document.cookie.split(';');" +
    "for(var i=0;i<cs.length;i++){" +
    "var nm=cs[i].split('=')[0].replace(/^\\s+|\\s+$/g,'');" +
    "if(nm==='_ga'||nm.indexOf('_ga_')===0){" +
    "document.cookie=nm+'=; '+ex+'; path=/';" +
    "if(dm)document.cookie=nm+'=; '+ex+'; path=/; domain='+dm;" +
    "}}" +
    "}catch(e){}" +
    "}" +
    "}}}catch(e){}"
  );
}

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
 * maison. Consommé par la garde étroite de `trackEvent` (`src/lib/gtag.ts`).
 *
 * `"unset"` : aucun `consent update` explicite n'a jamais été poussé — le cas
 * nominal avant que le visiteur n'ait cliqué sur `ConsentBanner` (ou pendant
 * le court instant avant que le rejeu du choix stocké, `buildConsentReplayScript`
 * ci-dessus, ne s'exécute). **Ne jamais lire "unset" comme "refusé"** : sous
 * des défauts régionalisés, aucune fonction pure côté client ne peut connaître
 * l'état de consentement EFFECTIF d'un visiteur (la région qui détermine quel
 * défaut s'applique vit chez Google, jamais dans notre dataLayer, qui ne
 * contient que les commandes envoyées). `"granted"`/`"denied"` : le dernier
 * `update` qui mentionne `analytics_storage` gagne — un `update` qui ne
 * mentionne pas ce signal ne change rien à l'état analytics, fidèle au
 * comportement réel de gtag.js (un `update` ne modifie que les clés qu'il
 * fournit).
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
