// Ce module est tiré par des composants client (LanguageSwitch, ConsentBanner) : il ne
// doit rien embarquer d'autre que `i18n.ts` (pas le registre de contenu de routes.ts).
import { LOCALES } from "./i18n";

/**
 * Segment racine qui existe comme dossier statique de l'App Router (`src/app/cerebrum/play`).
 * Le routeur client le reconnaît tel quel : `/cerebrum` n'est jamais pris pour une page `[locale]`.
 */
const STATIC_ROOT_SEGMENT = "cerebrum";

/**
 * Faut-il laisser `next/link` précharger ce lien ? Non pour un chemin interne d'un
 * seul segment (`/privacy`, `/terms`, `/legal`, `/about`, `/press`).
 *
 * Pourquoi : depuis une page `/fr/...` ou `/privacy`, le routeur client prédit qu'un tel
 * chemin est la page d'accueil d'une locale (`/$d$locale/__PAGE__`) et demande ce segment.
 * Le proxy a pourtant réécrit l'URL vers `/fr/privacy` ou `/en/about`, dont l'arbre est
 * `/$d$locale/privacy/__PAGE__` : le serveur répond 404, console en erreur et préchargement
 * perdu, sans que rien ne casse à la navigation. Réécrire côté proxy est le contrat
 * (spec §5.2), et la prédiction du routeur n'est pas configurable : on coupe le préchargement.
 * L'URL pleine (`/fr/a-propos`, `/en/privacy`) a deux segments et reste préchargée.
 */
export function isPrefetchable(href: string): boolean {
  if (!href.startsWith("/")) return true;
  const [path] = href.split(/[?#]/);
  const segments = path.split("/").filter(Boolean);
  if (segments.length !== 1) return true;
  // `/fr` est bien la page d'accueil d'une locale : la prédiction du routeur y est juste.
  return (
    segments[0] === STATIC_ROOT_SEGMENT ||
    (LOCALES as readonly string[]).includes(segments[0])
  );
}
