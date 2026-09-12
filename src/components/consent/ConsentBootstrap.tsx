import Script from "next/script";

import { AnalyticsGate } from "@/components/consent/AnalyticsGate";
import {
  CONSENT_DEFAULT_COMMANDS,
  type GtagBootstrapCommand,
} from "@/lib/consent/consent-state";
import { readConsentEnv } from "@/lib/consent/env";

/**
 * ConsentBootstrap — monté une seule fois dans `[locale]/layout.tsx`, en tout
 * premier enfant de `<body>` (avant même le lien d'évitement et le JSON-LD).
 * Réutilisation de MÉCANISME depuis Word Search Trove (portefeuille
 * Synapgeek, skill `synapgeek-portfolio-rules` règle 8).
 *
 * Trois sorties indépendantes l'une de l'autre, dont l'ordre dans le DOM
 * reste fixe pour les pièces effectivement rendues :
 *
 * 1. Les défauts Consent Mode v2 régionalisés (`CONSENT_DEFAULT_COMMANDS`,
 *    voir `src/lib/consent/consent-state.ts`) — un `<script>` inline SERVEUR
 *    (`dangerouslySetInnerHTML`, même idiome que `JsonLd.tsx`), jamais
 *    `next/script` en stratégie `beforeInteractive` : en App Router, cette
 *    stratégie ne place pas le script dans le HTML au parse-time, elle le
 *    pousse dans une file drainée par le runtime Next après le premier parse
 *    — un script écrit à la main garantit, lui, une exécution synchrone à
 *    l'endroit où il apparaît dans le flux HTML. Rendu dès qu'AU MOINS UNE
 *    des deux variables d'environnement existe : le poser ne déclenche
 *    aucune requête réseau, il ne fait que fixer l'état initial du
 *    consentement pour tout tag qui se chargera ensuite.
 * 2. Le chargeur de la CMP (Google Funding Choices), `strategy=
 *    "afterInteractive"` — jamais bloquant, jamais avant les défauts
 *    ci-dessus. Rendu SEULEMENT si `fundingChoicesId` est présent,
 *    indépendamment de `gaId`. `<Script>` ne rend rien côté SSR pour cette
 *    stratégie : l'injection réelle se fait par un `useEffect` client interne
 *    à `next/script`, donc ce composant reste un Server Component ordinaire.
 * 3. GA4 (`AnalyticsGate` → `AnalyticsLoader`), composé dès que `gaId` est
 *    présent, INDÉPENDAMMENT de `fundingChoicesId` : les défauts régionalisés
 *    (pièce 1) expriment déjà un consentement pour tout visiteur hors des 43
 *    juridictions RGPD, sans qu'aucune CMP n'ait besoin d'exister. Exiger une
 *    CMP pour mesurer ces visiteurs-là ferait dépendre toute mesure d'un
 *    compte AdSense — c'est justement ce qu'évite le mode régionalisé. C'est
 *    Consent Mode, à l'intérieur de gtag.js une fois chargé, qui filtre ce
 *    qui part réellement selon l'état courant du dataLayer.
 *
 * Aucune UI maison : la CMP possède l'écran (règle portefeuille 8) — ce
 * composant ne rend jamais de bandeau, de bouton, ou le moindre texte
 * visible.
 *
 * Table de vérité :
 *
 * | `gaId`   | `fundingChoicesId` | défauts | CMP | GA4 |
 * |----------|--------------------|---------|-----|-----|
 * | absent   | absent             | non     | non | non |
 * | absent   | présent            | oui     | oui | non |
 * | présent  | absent             | oui     | non | oui |
 * | présent  | présent            | oui     | oui | oui |
 *
 * Aujourd'hui, `NEXT_PUBLIC_GA_MEASUREMENT_ID` est configurée (GA4 déjà en
 * production) et `NEXT_PUBLIC_FUNDING_CHOICES_ID` ne l'est pas encore : on
 * est sur la ligne 3 du tableau — mesuré partout, aucun écran de
 * consentement à afficher, refus régional posé en zone RGPD.
 */
export function ConsentBootstrap() {
  const { fundingChoicesId, gaId } = readConsentEnv();
  if (!fundingChoicesId && !gaId) return null;

  const consentDefaultsScript =
    "window.dataLayer=window.dataLayer||[];" +
    "function gtag(){dataLayer.push(arguments);}" +
    CONSENT_DEFAULT_COMMANDS.map(serializeGtagBootstrapCommand).join("");

  return (
    <>
      {/* Défauts Consent Mode v2 — script serveur, jamais next/script beforeInteractive (voir docblock). */}
      <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
      {/* CMP — seulement si fundingChoicesId est configuré, indépendamment de gaId. */}
      {fundingChoicesId && (
        // Le snippet Funding Choices réel expose son script sous `pub-<chiffres>`,
        // sans le préfixe `ca-` que porte l'ID publisher stocké (format
        // `ca-pub-<chiffres>`) — à reconfirmer contre le vrai snippet livré par
        // l'UI AdSense le jour où cette variable est renseignée pour de vrai.
        <Script
          src={`https://fundingchoicesmessages.google.com/i/${fundingChoicesId.replace(/^ca-/, "")}?ers=1`}
          strategy="afterInteractive"
        />
      )}
      {/* GA4 — composé dès que gaId est présent, indépendamment de la CMP (voir docblock). */}
      <AnalyticsGate gaId={gaId} />
    </>
  );
}

/**
 * Sérialise une valeur en JSON prêt à être inliné dans un `<script>` HTML —
 * même idiome que `JsonLd.tsx` : `JSON.stringify` seul ne protège pas contre
 * une valeur qui contiendrait `</script>`, qui fermerait la balise avant que
 * le JS ne s'exécute.
 */
function jsonForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Sérialise une `GtagBootstrapCommand` en l'appel `gtag(...)` littéral exécuté par le script inline. `switch` exhaustif : TypeScript refuse la compilation si une future variante de l'union n'est pas couverte. */
function serializeGtagBootstrapCommand(command: GtagBootstrapCommand): string {
  switch (command.kind) {
    case "consent-default":
      return `gtag('consent','default',${jsonForInlineScript(command.payload)});`;
    case "set":
      return `gtag('set',${jsonForInlineScript(command.key)},${jsonForInlineScript(command.value)});`;
  }
}
