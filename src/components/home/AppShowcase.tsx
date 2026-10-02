import Image from "next/image";
import type { AppEntry, GameEntry } from "@/content/apps";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";
import type { StoreLabels } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { InternalLink } from "@/components/ui/InternalLink";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { gameColorVars } from "@/components/ui/game-colors";

/**
 * L'encart pleine largeur d'une app dans la section « Nos jeux » : icône, nom,
 * phrase de présentation, rangée des icônes de ses jeux (chacune mène à la page
 * du jeu, son nom n'est que son `aria-label`), badges des boutiques et bouton
 * vers la page de l'app. Une app de plus, c'est un encart de plus : rien ici
 * n'est propre à Cerebrum. Le téléphone déborde le bas de la carte, qui le coupe.
 */
export function AppShowcase({
  app,
  games,
  locale,
  pitch,
  iconsLabel,
  ctaLabel,
  phoneSrc,
  phoneAlt,
  storeLabels,
}: {
  app: AppEntry;
  games: readonly GameEntry[];
  locale: Locale;
  pitch: string;
  /** Nom de la rangée d'icônes, localisé. */
  iconsLabel: string;
  ctaLabel: string;
  phoneSrc: string;
  phoneAlt: string;
  storeLabels: StoreLabels;
}) {
  return (
    <article className="grid overflow-hidden rounded-card bg-wash-green text-ink shadow-rest lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-4">
          <Image
            src={app.icon}
            alt=""
            width={96}
            height={96}
            sizes="96px"
            className="size-20 shrink-0 rounded-[22%] shadow-raised sm:size-24"
          />
          <h3 className="font-display text-3xl leading-tight sm:text-4xl">
            {app.name}
          </h3>
        </div>
        <p className="mt-5 max-w-[65ch] text-base leading-relaxed sm:text-lg">
          {pitch}
        </p>

        <ul
          aria-label={iconsLabel}
          className="mt-6 grid max-w-md grid-cols-5 gap-2.5 sm:gap-3"
        >
          {games.map((game) => {
            const name = game.name[locale];
            const tile =
              "relative block aspect-square rounded-2xl bg-(--wash) shadow-rest";
            const icon = (
              <Image
                src={game.icon}
                alt=""
                fill
                sizes="(min-width: 640px) 88px, 64px"
                className="object-contain p-1.5"
              />
            );
            return (
              <li key={game.id} style={gameColorVars(game.color)}>
                {game.published ? (
                  <InternalLink
                    href={pagePath(`game:${game.id}`, locale)}
                    aria-label={name}
                    className={`${tile} transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-raised motion-reduce:hover:translate-y-0`}
                  >
                    {icon}
                  </InternalLink>
                ) : (
                  <span role="img" aria-label={name} className={tile}>
                    {icon}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <StoreBadges
          locale={locale}
          labels={storeLabels}
          className="mt-6 sm:mt-8"
        />
        <Button
          href={pagePath(app.slug, locale)}
          size="lg"
          className="mt-5 w-full sm:w-auto"
        >
          {ctaLabel}
        </Button>
      </div>

      <div className="relative h-72 sm:h-80 lg:h-auto">
        <div className="absolute top-8 left-1/2 w-48 -translate-x-1/2 lg:top-10 lg:w-56">
          <PhoneFrame
            src={phoneSrc}
            alt={phoneAlt}
            rotate={-4}
            sizes="(min-width: 1024px) 224px, 192px"
          />
        </div>
      </div>
    </article>
  );
}
