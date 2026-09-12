import {
  SG_CONSENT_FUTURE_TOLERANCE_MS,
  SG_CONSENT_MAX_AGE_MS,
  SG_CONSENT_STORAGE_KEY,
} from "./consent-state";

export type AnalyticsConsentChoice = "granted" | "denied";

interface StoredConsent {
  analytics: AnalyticsConsentChoice;
  ts: number;
}

function isStoredConsent(value: unknown): value is StoredConsent {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.analytics === "granted" || candidate.analytics === "denied") &&
    typeof candidate.ts === "number"
  );
}

/**
 * Lit le choix stocké côté navigateur (`ConsentBanner`), ou `null` si absent,
 * illisible, expiré (> `SG_CONSENT_MAX_AGE_MS`, 6 mois) OU horodaté dans le
 * futur au-delà de `SG_CONSENT_FUTURE_TOLERANCE_MS` (horloge cliente mal
 * réglée ou manipulée — sans cette borne, un `ts` futur ne serait jamais
 * rattrapé par la vérification d'âge et resterait valide indéfiniment).
 * Consulté par `ConsentBanner` au montage pour décider de s'afficher —
 * DUPLIQUE la logique de `buildConsentReplayScript` (`consent-state.ts`),
 * voir son docblock pour la raison de cette duplication.
 *
 * Jamais d'exception : tout accès `localStorage` (navigation privée, stockage
 * bloqué) ou tout contenu illisible est absorbé, jamais propagé.
 */
export function readStoredConsentChoice(): AnalyticsConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(SG_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredConsent(parsed)) return null;
    if (Date.now() - parsed.ts > SG_CONSENT_MAX_AGE_MS) return null;
    if (parsed.ts - Date.now() > SG_CONSENT_FUTURE_TOLERANCE_MS) return null;
    return parsed.analytics;
  } catch {
    return null;
  }
}

/**
 * Écrit le choix de consentement analytics. Retourne `false` si `localStorage`
 * est inaccessible (navigation privée, stockage bloqué) : dans ce cas, le
 * choix ne survit pas à la page, mais `ConsentBanner` applique quand même le
 * choix du clic pour la page en cours (décision produit : un échec de
 * stockage ne doit jamais faire réapparaître le bandeau immédiatement après
 * un clic).
 */
export function writeStoredConsentChoice(
  analytics: AnalyticsConsentChoice,
): boolean {
  try {
    const value: StoredConsent = { analytics, ts: Date.now() };
    window.localStorage.setItem(SG_CONSENT_STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Noms des cookies `_ga`/`_ga_*` actuellement posés — GA4 nomme le second `_ga_<identifiant de flux>`, propre à chaque measurement ID, d'où l'énumération plutôt qu'un nom fixe. Jamais la valeur, seulement le nom. */
function findGaCookieNames(): string[] {
  return document.cookie
    .split(";")
    .map((pair) => pair.split("=")[0]?.trim() ?? "")
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
}

/**
 * Domaine enregistrable précédé d'un point (ex. `.synapgeek.com`) déduit du
 * nom d'hôte courant — GA4 pose `_ga`/`_ga_*` sur ce domaine par défaut, pas
 * seulement sur l'hôte exact, donc l'effacement doit viser les deux. `null`
 * pour un hôte à un seul label (`localhost`) ou une adresse IP : ces hôtes ne
 * supportent pas l'attribut `domain`, seul le cookie « host-only » existe.
 */
function registrableDomain(hostname: string): string | null {
  if (hostname === "localhost" || /^[0-9.]+$/.test(hostname)) return null;
  const labels = hostname.split(".");
  if (labels.length < 2) return null;
  return `.${labels.slice(-2).join(".")}`;
}

/**
 * Efface les cookies `_ga`/`_ga_*` déjà posés — un `consent update denied`
 * empêche gtag.js d'en LIRE/ÉCRIRE de nouveaux mais n'efface jamais ceux déjà
 * présents (visiteur qui accepte puis refuse, ou visiteur mesuré par défaut
 * hors zone RGPD qui refuse). Appelée au clic « Refuser » (`ConsentBanner`) —
 * DUPLIQUE volontairement la logique de `buildConsentReplayScript`
 * (`consent-state.ts`), voir son docblock pour la raison de cette duplication.
 *
 * Expiration dans le passé, `path=/`, sur l'hôte courant ET sur le domaine
 * enregistrable préfixé d'un point (voir `registrableDomain`) : sans l'un des
 * deux, le navigateur peut ignorer silencieusement l'effacement selon
 * l'attribut `domain` avec lequel le cookie a été posé à l'origine.
 *
 * Jamais d'exception : `document.cookie` peut être inaccessible (permissions
 * restrictives) — absorbée, jamais propagée, comme le reste de ce fichier.
 */
export function clearGaCookies(): void {
  try {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const domain = registrableDomain(window.location.hostname);
    for (const name of findGaCookieNames()) {
      document.cookie = `${name}=; ${expires}; path=/`;
      if (domain) {
        document.cookie = `${name}=; ${expires}; path=/; domain=${domain}`;
      }
    }
  } catch {
    // Accès document.cookie impossible — jamais propagé, voir docblock.
  }
}
