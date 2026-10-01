import type { AppEntry } from "../types";

const APP_STORE_ID = "6763915130";

/**
 * Faits non localisés de Cerebrum. Le bundle iOS (com.synapgeek.cerebrumgame) et
 * le package Android (com.synapgeek.cerebrum) diffèrent : ce n'est pas une coquille.
 * `appStoreUrl` est neutre côté pays : Apple redirige vers la boutique locale.
 */
export const cerebrum: AppEntry = {
  slug: "cerebrum",
  name: "Cerebrum",
  publisher: "Synapgeek",
  appStoreId: APP_STORE_ID,
  appStoreUrl: `https://apps.apple.com/app/id${APP_STORE_ID}`,
  googlePlayUrl:
    "https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum",
  platforms: {
    ios: { minOs: "17.0" },
    android: { minOs: null },
  },
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
