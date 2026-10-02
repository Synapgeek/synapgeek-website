import {
  platformsFor,
  type GameCategory,
  type GameEntry,
} from "@/content/apps";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import { GameCard } from "./GameCard";

/** Ordre d'affichage des familles de jeux. */
const CATEGORY_ORDER: readonly GameCategory[] = [
  "logic-numbers",
  "words",
  "paths",
];

/**
 * Les jeux d'une app groupés par famille : un titre H3 par famille qui a des
 * jeux (jamais un titre sans carte), une carte (H4) par jeu. Une carte ne mène vers la page du jeu que si elle est publiée,
 * jamais vers un 404. À placer sous un H2.
 */
export function GameGrid({
  games,
  categories,
  locale,
}: {
  games: readonly GameEntry[];
  /** Titres des familles, déjà localisés. */
  categories: Record<GameCategory, string>;
  locale: Locale;
}) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    members: games.filter((game) => game.category === category),
  })).filter(({ members }) => members.length > 0);

  return (
    <div className="space-y-12">
      {groups.map(({ category, members }) => (
        <div key={category}>
          <h3 className="mb-5 text-2xl sm:text-3xl">{categories[category]}</h3>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {members.map((game) => (
              <li key={game.id}>
                <GameCard
                  as="h4"
                  name={game.name[locale]}
                  genre={game.genre[locale]}
                  icon={game.icon}
                  color={game.color}
                  platforms={platformsFor(game)}
                  href={
                    game.published ? pagePath(`game:${game.id}`, locale) : null
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
