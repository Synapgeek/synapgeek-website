import { getGames } from "@/content/apps";
import type { Locale } from "@/lib/i18n";

/**
 * « A, B et C » (fr) ou « A, B, and C » (en) : les jeux publiés de Cerebrum
 * sous leur nom dans la langue, tels que le registre les déclare. Sert le repli
 * de /cerebrum/play ; aucun nombre n'y figure, jamais.
 */
export function formatPublishedGameNames(locale: Locale): string {
  const names = getGames("cerebrum")
    .filter((game) => game.published)
    .map((game) => game.name[locale]);
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(names);
}
