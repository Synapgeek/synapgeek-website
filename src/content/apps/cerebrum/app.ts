import { APP_STORE_ID, APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import type { AppEntry } from "../types";

/**
 * Faits non localisés de Cerebrum. Le bundle iOS (com.synapgeek.cerebrumgame) et
 * le package Android (com.synapgeek.cerebrum) diffèrent : ce n'est pas une coquille.
 * Identifiants et URLs de boutique : src/lib/app.ts (source unique, importable côté client
 * sans tirer ce registre).
 */
export const cerebrum: AppEntry = {
  slug: "cerebrum",
  name: "Cerebrum",
  publisher: "Synapgeek",
  appStoreId: APP_STORE_ID,
  appStoreUrl: APP_STORE_URL,
  googlePlayUrl: GOOGLE_PLAY_URL,
  platforms: {
    ios: { minOs: "17.0" },
    android: { minOs: "8.0" },
  },
  // Fiches App Store et Play (FR puis EN) ; les deux boutiques portent les mêmes titres.
  storeTitles: [
    "Cerebrum : Jeux zen sans wifi",
    "Cerebrum: Offline Puzzle Games",
  ],
  // Première publication de la fiche iOS.
  datePublished: "2026-06-03",
  languages: [
    "en",
    "fr",
    "es",
    "pt-BR",
    "de",
    "it",
    "nl",
    "tr",
    "id",
    "vi",
    "ja",
    "ko",
    "zh-Hans",
    "zh-Hant",
    "hi",
    "th",
  ],
  contentRating: { appStore: "4+" },
  icon: "/images/brand/cerebrum-icon.png",
  // Le magenta du wordmark « C·E·R·E·B·R·U·M » (constantes de marque du design system).
  wordmarkColor: "--color-cerebrum",
  // Table de travail zen générée (provenance : docs/contrat/provenance-visuels-r8.md).
  scene: {
    wide: "/images/apps/cerebrum-scene-wide-v1.webp",
    narrow: "/images/apps/cerebrum-scene-narrow-v1.webp",
  },
  games: [
    "sudoku",
    "pandoku",
    "minesweeper",
    "pixel-art",
    "cross-math",
    "crossword",
    "word-search",
    "trace",
    "maze",
    "arrow-maze",
  ],
};
