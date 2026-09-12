"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * AnalyticsLoader — composé par `AnalyticsGate`, elle-même composée par
 * `ConsentBootstrap`. Réutilisation de MÉCANISME depuis Word Search Trove
 * (portefeuille Synapgeek).
 *
 * Le `<Script>` gtag.js monte dès que `gaId` existe, indépendamment de tout
 * signal de consentement : les défauts régionalisés posés par
 * `ConsentBootstrap` (`CONSENT_DEFAULT_COMMANDS`) expriment déjà un
 * consentement — accordé hors des 43 juridictions RGPD, refusé dedans — donc
 * charger gtag.js n'est plus un acte qui présuppose un accord. C'est Consent
 * Mode, À L'INTÉRIEUR de gtag.js une fois chargé, qui filtre ce qui part
 * réellement selon l'état courant du dataLayer.
 *
 * `strategy="lazyOnload"` (chargement après l'événement `load` de la
 * fenêtre) — reprend le choix déjà en production sur ce site (quelques
 * visites très courtes ne seront pas mesurées, contre du JS retiré de la
 * fenêtre de rendu initiale). Ce choix reste sûr avec des défauts
 * régionalisés : ceux-ci sont posés par un `<script>` inline SERVEUR
 * (`ConsentBootstrap`), exécuté bien avant que `lazyOnload` ne déclenche quoi
 * que ce soit — l'ordre « défauts avant tag » ne dépend donc pas de la
 * stratégie de chargement choisie ici.
 *
 * Le pont TCF→dataLayer ci-dessous tourne QUE `gaId` soit ou non accompagné
 * d'une CMP configurée : sans `NEXT_PUBLIC_FUNDING_CHOICES_ID`,
 * `window.__tcfapi` n'existe jamais, le poll s'arrête simplement après son
 * délai borné, sans effet ni erreur console. Le jour où une CMP est ajoutée,
 * ce fichier n'a rien à changer.
 */

interface AnalyticsLoaderProps {
  gaId: string;
}

/** IAB TCF v2.2 — forme minimale du `tcData` reçu par un callback `addEventListener`, limitée aux champs lus ici. */
interface TcfV2TcData {
  purpose?: {
    consents?: Record<string, boolean>;
  };
  // Fourni par une VRAIE CMP TCF v2.2 sur chaque rappel — capturé pour le
  // `removeEventListener` propre au démontage.
  listenerId?: number;
  // Seul champ TCF v2.2 qui distingue un rapport automatique de la CMP
  // ("tcloaded", "cmpuishown" — rien n'a encore été décidé par le visiteur)
  // d'une vraie action utilisateur ("useractioncomplete"). Type `string` :
  // cette forme vient d'un callback tiers, on ne prétend pas connaître
  // l'exhaustivité d'un vocabulaire que seule la CMP contrôle.
  eventStatus?: string;
}

type TcfEventCallback = (
  tcData: TcfV2TcData | null | undefined,
  success: boolean,
) => void;
type TcfApiFn = (
  command: string,
  version: number,
  callback: TcfEventCallback,
  parameter?: unknown,
) => void;

/** Purpose 1 (IAB TCF v2.2) accordé. Fonction pure, testable sans DOM ni mock de `__tcfapi`. */
export function tcfGrantsAnalytics(
  tcData: TcfV2TcData | null | undefined,
): boolean {
  return tcData?.purpose?.consents?.["1"] === true;
}

function readTcfApi(): TcfApiFn | null {
  const candidate = (window as unknown as { __tcfapi?: unknown }).__tcfapi;
  return typeof candidate === "function" ? (candidate as TcfApiFn) : null;
}

const TCF_POLL_INTERVAL_MS = 250;
// ≈ 20s (250ms × 80) — borne réelle du poll : une CMP qui ne charge jamais
// (bloqueur de publicités, réseau) ne doit pas laisser un timer tourner pour
// toute la session.
const TCF_POLL_MAX_ATTEMPTS = 80;

/**
 * Le pont TCF→dataLayer : quand la CMP (Funding Choices, TCF v2.2) donne ou
 * retire l'accord (Purpose 1), la mise à jour est relayée dans `dataLayer`
 * sous forme `gtag('consent','update',{analytics_storage:…})`. Sans ce pont,
 * une CMP montée deviendrait décorative en zone RGPD : `__tcfapi` seul ne
 * pousse rien dans `dataLayer` (API de callback, pas un flux gtag).
 *
 * `onChange` est appelée à chaque notification TCF valide, aussi bien pour le
 * premier octroi que pour tout changement ultérieur. Retourne une fonction
 * d'arrêt idempotente.
 */
function watchTcfForConsent(onChange: (granted: boolean) => void): () => void {
  let stopped = false;
  let pollId: ReturnType<typeof setInterval> | null = null;
  let registeredTcfapi: TcfApiFn | null = null;
  let listenerId: number | undefined;

  function register(tcfapi: TcfApiFn) {
    registeredTcfapi = tcfapi;
    tcfapi("addEventListener", 2, (tcData, success) => {
      if (stopped || !success) return;
      if (typeof tcData?.listenerId === "number")
        listenerId = tcData.listenerId;
      const granted = tcfGrantsAnalytics(tcData);
      // Un refus ne compte que s'il vient d'une action utilisateur réelle.
      // Sans cette garde, un rapport TCF purement automatique appellerait
      // quand même `onChange(false)` et écraserait à tort le défaut régional
      // "granted" légitime d'un visiteur hors zone RGPD. L'octroi, lui, reste
      // ungated : dégrader accidentellement vers plus de mesure n'est pas le
      // risque à borner ici.
      if (!granted && tcData?.eventStatus !== "useractioncomplete") return;
      onChange(granted);
    });
  }

  const existing = readTcfApi();
  if (existing) {
    register(existing);
  } else {
    let attempts = 0;
    pollId = setInterval(() => {
      attempts += 1;
      const tcfapi = readTcfApi();
      if (tcfapi) {
        if (pollId !== null) clearInterval(pollId);
        pollId = null;
        register(tcfapi);
        return;
      }
      if (attempts >= TCF_POLL_MAX_ATTEMPTS) {
        // La CMP n'a jamais chargé — dégradation assumée, jamais un throw.
        if (pollId !== null) clearInterval(pollId);
        pollId = null;
      }
    }, TCF_POLL_INTERVAL_MS);
  }

  return () => {
    stopped = true;
    if (pollId !== null) clearInterval(pollId);
    if (registeredTcfapi && listenerId !== undefined) {
      registeredTcfapi("removeEventListener", 2, () => {}, listenerId);
    }
  };
}

/** Le script de défauts de `ConsentBootstrap` initialise déjà `window.dataLayer`, mais ce composant reste utilisable seul. */
function ensureDataLayer(): unknown[] {
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  return w.dataLayer;
}

/**
 * Pousse la mise à jour de consentement dans `dataLayer`. L'API Consent Mode
 * de Google est spécifiée à travers `gtag()`, qui pousse l'`arguments` RÉEL
 * de son appel — le modèle `dataLayer` de GTM distingue les entrées
 * `arguments` (des COMMANDES, que gtag.js reconnaît et exécute) des
 * tableaux/objets littéraux (des DONNÉES, qu'il ignore). Un tableau littéral
 * ici laisserait GA4 se charger et rester bloqué en `analytics_storage:
 * denied` quel que soit le vrai choix du visiteur.
 *
 * D'où une fonction LOCALE DÉCLARÉE (jamais fléchée — une fléchée n'a pas
 * d'`arguments` propre) qui pousse ses propres `arguments` dans le
 * `dataLayer` capturé par closure — même idiome que le stub `gtag` posé par
 * `ConsentBootstrap`.
 */
function pushAnalyticsConsentUpdate(
  dataLayer: unknown[],
  state: "granted" | "denied",
): void {
  function gtag(): void {
    // eslint-disable-next-line prefer-rest-params -- il faut un vrai IArguments, pas le tableau d'un rest param
    dataLayer.push(arguments);
  }
  (gtag as (...args: unknown[]) => void)("consent", "update", {
    analytics_storage: state,
  });
}

export function AnalyticsLoader({ gaId }: AnalyticsLoaderProps) {
  useEffect(() => {
    const dataLayer = ensureDataLayer();
    let lastPushedState: "granted" | "denied" = "denied";
    let hasPushed = false;

    const syncConsent = (granted: boolean) => {
      const state: "granted" | "denied" = granted ? "granted" : "denied";
      // Idempotence : jamais de push redondant sur deux notifications TCF
      // consécutives identiques.
      if (hasPushed && state === lastPushedState) return;
      hasPushed = true;
      lastPushedState = state;
      pushAnalyticsConsentUpdate(dataLayer, state);
    };

    // Canal TCF — reste vivant pour toute la durée du montage : lui seul
    // capte un changement ultérieur de consentement, octroi et retrait.
    const stopTcfWatch = watchTcfForConsent(syncConsent);

    return () => {
      stopTcfWatch();
    };
  }, []);

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      strategy="lazyOnload"
      onLoad={() => {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void };
        // Bootstrap standard GA4 — pousse dans le même dataLayer déjà
        // initialisé par ConsentBootstrap (le stub `gtag` existe déjà).
        w.gtag?.("js", new Date());
        w.gtag?.("config", gaId);
      }}
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
