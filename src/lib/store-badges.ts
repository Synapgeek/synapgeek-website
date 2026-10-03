import type { Locale } from "@/lib/i18n";
import type { StoreLabels } from "@/content/types";

/**
 * Badges officiels des deux boutiques. Les fichiers fournis par Apple et Google
 * n'ont pas le même ratio d'une langue à l'autre : ces dimensions intrinsèques
 * sont celles des fichiers, pas un choix de mise en page. Source unique de
 * `StoreBadges` (composant client) et du repli de /cerebrum/play (serveur).
 */
export const STORE_BADGES = {
  fr: {
    appStore: "/images/brand/badge-appstore-fr.svg",
    googlePlay: "/images/brand/badge-googleplay-fr.png",
    appStoreWidth: 127,
    googlePlayWidth: 646,
    googlePlayHeight: 192,
  },
  en: {
    appStore: "/images/brand/badge-appstore-en.svg",
    googlePlay: "/images/brand/badge-googleplay-en.png",
    appStoreWidth: 120,
    googlePlayWidth: 564,
    googlePlayHeight: 168,
  },
} as const satisfies Record<Locale, unknown>;

/**
 * Les libellés accessibles des badges pour une app : le Dictionnaire porte un gabarit
 * (`{app}` à la place du nom), résolu ici avec le nom de l'app que les badges vendent.
 * Une deuxième app aura donc ses badges à son nom, sans toucher au Dictionnaire.
 */
export function storeLabelsFor(
  labels: StoreLabels,
  appName: string,
): StoreLabels {
  return {
    appStoreLabel: labels.appStoreLabel.replace("{app}", appName),
    googlePlayLabel: labels.googlePlayLabel.replace("{app}", appName),
  };
}
