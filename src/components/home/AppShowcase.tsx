import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { AppEntry, GameEntry } from "@/content/apps";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import type { StoreLabels } from "@/content/types";
import { InternalLink } from "@/components/ui/InternalLink";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SceneBackground } from "@/components/ui/SceneBackground";
import { Sparkles } from "@/components/ui/Sparkles";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { storeLabelsFor } from "@/lib/store-badges";
import { gameColorVars } from "@/components/ui/game-colors";
import { wordmarkStyle } from "@/components/ui/wordmark";

/**
 * L'écran du téléphone, à la manière de l'écran d'accueil de l'app : les cartes
 * des jeux sur deux colonnes, chacune dans le dégradé de son jeu, semée de
 * paillettes. Comme dans l'app, la liste continue sous le bord de l'écran.
 * Décoratif (les vrais liens vers les jeux sont la ligne de texte sous la
 * description) : aucun lien, masqué aux lecteurs d'écran. La grille se cote en `cqw`
 * de l'écran, l'intérieur de chaque carte en `cqw` de la carte.
 */
function GamesScreen({
  games,
  locale,
}: {
  games: readonly GameEntry[];
  locale: Locale;
}) {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-canvas-soft">
      <ul className="grid grid-cols-2 gap-[4cqw] px-[4.5cqw] pt-[17cqw]">
        {games.map((game, index) => (
          <li
            key={game.id}
            style={gameColorVars(game.color)}
            className="game-gradient @container relative flex aspect-[11/12] flex-col items-center justify-center overflow-hidden rounded-[6cqw] text-(--deep) shadow-rest inset-ring-1 inset-ring-canvas/75"
          >
            <Sparkles variant={index} />
            <span className="relative block aspect-square w-[66%]">
              <Image
                src={game.icon}
                alt=""
                fill
                sizes="120px"
                className="object-contain"
              />
            </span>
            <span className="relative mt-[2cqw] block w-full truncate px-[5cqw] text-center font-display text-[11cqw] leading-tight">
              {game.name[locale]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * L'encart d'une app dans la section « Nos apps », à la manière d'une fiche de
 * catalogue : la scène de l'app (sa table de travail) avec le téléphone qui montre
 * les cartes des jeux, l'icône de l'app à cheval sur le bas de la scène, le nom
 * dans la couleur de son wordmark, le genre, la phrase de présentation suivie de
 * « Voir plus », la ligne de liens vers les pages de ses jeux publiés, puis les
 * badges des boutiques. Tout l'encart mène à la page de l'app (lien étiré posé
 * sur le nom, un seul arrêt de tabulation pour lui) ; seuls les liens des jeux et
 * les badges, posés au-dessus, mènent ailleurs. Une app de plus, c'est un encart de
 * plus : rien ici n'est propre à Cerebrum.
 */
export function AppShowcase({
  app,
  games,
  locale,
  genre,
  description,
  seeMore,
  gamesLabel,
  storeLabels,
}: {
  app: AppEntry;
  games: readonly GameEntry[];
  locale: Locale;
  genre: string;
  description: string;
  /** Invite visible après la description ; le lien lui-même est le nom de l'app. */
  seeMore: string;
  /** Nom de la ligne de liens vers les jeux, annoncé par les lecteurs d'écran. */
  gamesLabel: string;
  storeLabels: StoreLabels;
}) {
  // Un jeu sans page n'a pas de lien : il ne rendrait qu'un 404.
  const linked = games.filter((game) => game.published);

  return (
    <article className="group relative isolate rounded-card text-center text-ink has-[h3_a:focus-visible]:outline-3 has-[h3_a:focus-visible]:outline-offset-8 has-[h3_a:focus-visible]:outline-brand-violet">
      {/* Rapports de la scène et largeur du téléphone calculés ensemble : le bas du
          téléphone passe sous le bord de la scène, comme un écran qu'on ferait défiler,
          et l'icône de l'app s'y pose, de 320 px à 1440 px de large. Le passage au
          cadrage paysage (640 px) suit les classes `sm:` ; entre 640 et 1023 px, le
          téléphone (34 % de la scène, vérifié à 700 et 960 px) passe sous le bord
          comme sur mobile, la quatrième rangée de cartes coupée. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-canvas-soft shadow-rest sm:aspect-[3/2] lg:aspect-[2/1]">
        <SceneBackground
          scene={app.scene}
          breakpoint={640}
          sizes="(min-width: 1200px) 72rem, 100vw"
        />
        <div className="absolute top-[6%] left-1/2 w-[58%] -translate-x-1/2 transition-transform duration-250 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 sm:w-[34%] lg:w-[24%]">
          <PhoneFrame>
            <GamesScreen games={games} locale={locale} />
          </PhoneFrame>
        </div>
      </div>

      <Image
        src={app.icon}
        alt=""
        width={112}
        height={112}
        sizes="112px"
        className="relative mx-auto -mt-14 size-24 rounded-[22%] shadow-raised sm:-mt-16 sm:size-28"
      />
      <h3 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
        <InternalLink
          href={pagePath(app.slug, locale)}
          style={wordmarkStyle(app)}
          className="underline decoration-3 underline-offset-[0.22em] after:absolute after:inset-0 after:rounded-card focus-visible:outline-transparent"
        >
          {app.name}
          <span className="sr-only">, {seeMore}</span>
        </InternalLink>
      </h3>
      <p className="mt-2 text-base font-semibold text-text-secondary sm:text-lg">
        {genre}
      </p>
      <p className="mx-auto mt-6 max-w-[65ch] text-base leading-relaxed sm:text-lg">
        {description}{" "}
        <span
          aria-hidden="true"
          className="inline-flex items-center font-bold whitespace-nowrap text-brand-green-ink"
        >
          {seeMore}
          <ChevronRight className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </span>
      </p>
      {/* Sans séparateur : un « · » finirait une ligne quand la liste passe à la ligne.
          Les liens se lisent comme tels au repos (encre et soulignement discret). */}
      <ul
        aria-label={gamesLabel}
        className="relative z-10 mx-auto mt-5 flex max-w-5xl flex-wrap items-center justify-center gap-x-1 text-base sm:text-lg"
      >
        {linked.map((game) => (
          <li key={game.id}>
            <InternalLink
              href={pagePath(`game:${game.id}`, locale)}
              className="inline-flex min-h-11 items-center rounded-md px-2 font-semibold text-ink underline decoration-text-tertiary/50 decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-150 ease-out hover:decoration-current focus-visible:decoration-current focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-violet"
            >
              {game.name[locale]}
            </InternalLink>
          </li>
        ))}
      </ul>
      <StoreBadges
        locale={locale}
        labels={storeLabelsFor(storeLabels, app.name)}
        className="relative z-10 mt-8 justify-center"
      />
    </article>
  );
}
