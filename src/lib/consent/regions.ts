/**
 * Codes ISO 3166-1 alpha-2 des juridictions où Consent Mode v2 doit REFUSER
 * par défaut plutôt qu'accorder — valeur du paramètre `region` d'une commande
 * `gtag('consent','default',{...})` (voir `consent-state.ts`).
 *
 * Réutilisation de MÉCANISME depuis Word Search Trove (portefeuille Synapgeek,
 * skill `synapgeek-portfolio-rules` règle 8) : même liste, même découpage en
 * quatre blocs, chacun avec sa propre base légale.
 *
 * 1. **UE (27)** — les 27 États membres, RGPD.
 * 2. **EEE hors UE (3)** — Islande (IS), Liechtenstein (LI), Norvège (NO) : le
 *    RGPD s'y applique via l'accord EEE, pas par appartenance à l'UE.
 * 3. **Royaume-Uni (1)** — GB : UK GDPR post-Brexit, régime quasi identique
 *    mais juridiquement distinct, jamais fusionné avec le bloc UE.
 * 4. **Suisse (1)** — CH : la nLPD n'exige PAS de consentement préalable pour
 *    la seule mesure d'audience (contrairement au RGPD). CH est inclus par
 *    choix prudent du portefeuille, pas par obligation légale — ne pas le
 *    retirer sans décision explicite qui renverse ce choix.
 * 5. **Régions ultrapériphériques / territoires UE à code ISO propre (7)** —
 *    GF (Guyane), GP (Guadeloupe), MQ (Martinique), RE (La Réunion), YT
 *    (Mayotte) et MF (Saint-Martin, partie française) sont des régions
 *    ultrapériphériques françaises au sens de l'article 349 TFUE : territoire
 *    de l'UE, RGPD pleinement applicable, mais Google (et la géolocalisation
 *    IP en général) leur attribue leur propre code ISO 3166-1 plutôt que FR —
 *    GA4 affiche d'ailleurs ces territoires sous leur propre nom de pays, pas
 *    sous « France ». AX (Åland) est un territoire finlandais membre de l'UE
 *    à code ISO distinct, même raisonnement pour FI. Sans ce bloc, un
 *    visiteur de ces territoires tombe sur la commande globale "granted" :
 *    RGPD violé en pratique malgré une liste UE nominalement complète.
 * 6. **Dépendances de la Couronne britannique (4)** — GI (Gibraltar), IM
 *    (Île de Man), JE (Jersey), GG (Guernesey) : hors UE/EEE, RGPD non
 *    applicable directement, mais chacune dispose d'un régime de protection
 *    des données propre reconnu adéquat par la Commission européenne, de
 *    juridiction distincte du Royaume-Uni (bloc 3). Inclus par le même choix
 *    prudent que CH (bloc 4), pas par obligation légale — ne pas retirer sans
 *    décision explicite qui renverse ce choix.
 */
export const GDPR_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
  "GF",
  "GP",
  "MQ",
  "RE",
  "YT",
  "MF",
  "AX",
  "GI",
  "IM",
  "JE",
  "GG",
] as const;
