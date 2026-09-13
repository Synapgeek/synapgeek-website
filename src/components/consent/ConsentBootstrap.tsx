import { AnalyticsGate } from "@/components/consent/AnalyticsGate";
import {
  CONSENT_DEFAULT_COMMANDS,
  buildConsentReplayScript,
  jsonForInlineScript,
  serializeGtagBootstrapCommand,
} from "@/lib/consent/consent-state";
import { readConsentEnv } from "@/lib/consent/env";

/** 13 mois en secondes (recommandation CNIL) — durée de vie du cookie `_ga` posé par la commande `config` ci-dessous. */
const GA_COOKIE_EXPIRES_SECONDS = 34128000;

/**
 * `cookie_update: false` — gtag.js vaut `true` par défaut, ce qui réécrit le
 * cookie `_ga`/`_ga_*` et repousse son expiration de 13 mois à CHAQUE page vue
 * d'un visiteur déjà consentant (rétention glissante et sans plafond). En le
 * désactivant, l'expiration posée au premier dépôt du cookie n'est plus
 * prolongée : 13 mois reste une durée fixe, conforme à la privacy policy
 * (fr.ts / en.ts, section « Google Analytics 4 ») et à la recommandation CNIL.
 */
const GA_COOKIE_UPDATE = false;

/**
 * ConsentBootstrap — monté une seule fois dans `[locale]/layout.tsx`, en tout
 * premier enfant de `<body>` (avant même le lien d'évitement et le JSON-LD).
 * Ne rend rien si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est absente : c'est la seule
 * condition qui déclenche cette pièce (plus de CMP tierce à considérer — le
 * consentement est géré par le bandeau maison `ConsentBanner`, monté
 * indépendamment dans le layout, quel que soit l'état de GA4).
 *
 * Un unique `<script>` inline SERVEUR (`dangerouslySetInnerHTML`, même idiome
 * que `JsonLd.tsx`), jamais `next/script` en stratégie `beforeInteractive` :
 * en App Router, cette stratégie ne place pas le script dans le HTML au
 * parse-time, elle le pousse dans une file drainée par le runtime Next après
 * le premier parse — un script écrit à la main garantit, lui, une exécution
 * SYNCHRONE à l'endroit où il apparaît dans le flux HTML, avant tout module
 * React (donc avant hydratation, avant tout `trackEvent`). Ce script pousse,
 * DANS CET ORDRE :
 *
 * 1. Les défauts Consent Mode v2 régionalisés (`CONSENT_DEFAULT_COMMANDS`,
 *    voir `src/lib/consent/consent-state.ts`) — identiques pour tout
 *    visiteur, la région étant résolue par Google, jamais par nous.
 * 2. Le rejeu du choix stocké (`buildConsentReplayScript`) : si un choix
 *    valide existe dans `localStorage` (clé `sg-consent`, ≤ 6 mois), il est
 *    repoussé ICI, juste après les défauts — un visiteur qui a déjà accepté
 *    est donc mesuré avec cookies dès cette page, sans attendre
 *    l'hydratation de `ConsentBanner`.
 * 3. `gtag('js', …)` puis `gtag('config', gaId, { cookie_expires, cookie_update: false })` : posés
 *    ICI plutôt que dans `AnalyticsLoader` (au chargement de gtag.js, en
 *    `lazyOnload`) pour garantir que `config` précède TOUT `trackEvent` —
 *    `section_viewed` notamment, déclenché par un `IntersectionObserver` dès
 *    le premier rendu et qui pourrait sinon atterrir dans le dataLayer avant
 *    que gtag.js n'ait vu la commande `config`. `gtag()` n'étant qu'un stub
 *    qui empile dans `dataLayer` (posé juste avant), l'ordre d'écriture dans
 *    CE script suffit à garantir l'ordre de traitement, indépendamment du
 *    moment où le fichier `gtag.js` charge réellement.
 *
 * `AnalyticsGate` (composée juste après) ne fait plus que demander le
 * fichier `gtag.js` lui-même, en différé — voir son docblock.
 */
export function ConsentBootstrap() {
  const { gaId } = readConsentEnv();
  if (!gaId) return null;

  const bootstrapScript =
    "window.dataLayer=window.dataLayer||[];" +
    "function gtag(){dataLayer.push(arguments);}" +
    CONSENT_DEFAULT_COMMANDS.map(serializeGtagBootstrapCommand).join("") +
    buildConsentReplayScript() +
    "gtag('js',new Date());" +
    `gtag('config',${jsonForInlineScript(gaId)},${jsonForInlineScript({ cookie_expires: GA_COOKIE_EXPIRES_SECONDS, cookie_update: GA_COOKIE_UPDATE })});`;

  return (
    <>
      {/* Défauts + rejeu + bootstrap GA4 — script serveur, jamais next/script beforeInteractive (voir docblock). */}
      <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      <AnalyticsGate gaId={gaId} />
    </>
  );
}
