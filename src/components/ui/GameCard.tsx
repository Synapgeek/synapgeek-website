import Image from "next/image";
import { InternalLink } from "@/components/ui/InternalLink";
import { Sparkles } from "./Sparkles";
import { gameColorVars, type GameColor } from "./game-colors";

type HeadingLevel = "h2" | "h3" | "h4";

/**
 * Carte de jeu au format affiche (5:7), à la manière des cartes de l'app : lavis
 * du jeu en dégradé sous un liseré clair, paillettes kawaii autour de l'icône,
 * puis nom et genre. Avec `href`, toute la carte est cliquable (lien étiré posé
 * sur le nom, donc un seul arrêt de tabulation) ; elle se soulève et s'éclaircit
 * au survol et au focus. Sans `href` (jeu non publié), c'est la même carte, sans
 * lien et sans effet : rien ne promet une page qui n'existe pas. `platforms`
 * (noms d'appareils, ex. `platformsFor`) s'affiche sur une ligne sous le genre.
 * `sparkles` choisit le semis de paillettes (on le fait tourner dans une grille).
 */
export function GameCard({
  name,
  genre,
  icon,
  color,
  platforms = [],
  href,
  as: Heading = "h3",
  sparkles = 0,
  className = "",
}: {
  name: string;
  /** Genre à citer à côté d'un nom maison ; `null` pour les classiques. */
  genre: string | null;
  icon: string;
  color: GameColor;
  /** Appareils où le jeu est annoncé ; vide ou absent : aucune ligne. */
  platforms?: readonly string[];
  /** Page du jeu, ou `null` quand elle n'est pas publiée. */
  href: string | null;
  as?: HeadingLevel;
  sparkles?: number;
  className?: string;
}) {
  const interactive = href !== null;

  return (
    <article
      style={gameColorVars(color)}
      className={`game-gradient @container relative isolate flex aspect-[5/7] flex-col overflow-hidden rounded-card text-(--deep) shadow-rest inset-ring-2 inset-ring-canvas/70 ${
        interactive
          ? "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lift focus-within:-translate-y-1.5 focus-within:shadow-lift active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-brand-violet [&:hover>[data-tint]]:opacity-100 [&:focus-within>[data-tint]]:opacity-100"
          : ""
      } ${className}`}
    >
      <span
        aria-hidden="true"
        data-tint
        className="absolute inset-0 -z-10 bg-(--tint) opacity-0 transition-opacity duration-200 ease-out"
      />
      <Sparkles variant={sparkles} className="inset-x-0 top-0 h-[66%]" />
      <div className="flex flex-1 items-center justify-center p-4 pb-1">
        <div className="relative aspect-square w-[78%]">
          <Image
            src={icon}
            alt=""
            fill
            sizes="(min-width: 1024px) 170px, (min-width: 640px) 25vw, 34vw"
            className="object-contain"
          />
        </div>
      </div>
      {/* Bloc nom, genre, plateformes collé au bas de la carte : les lignes de plateformes
          s'alignent d'une carte à l'autre, avec ou sans genre. */}
      <div className="mt-auto flex min-h-[6.25rem] flex-col justify-end px-3 pt-1 pb-5 text-center">
        <Heading className="font-display text-lg leading-tight sm:text-xl">
          {interactive ? (
            <InternalLink
              href={href}
              className="after:absolute after:inset-0 focus-visible:outline-transparent"
            >
              {name}
            </InternalLink>
          ) : (
            name
          )}
        </Heading>
        {genre !== null && (
          <p className="mt-1 text-[0.8125rem] leading-snug font-semibold">
            {genre}
          </p>
        )}
        {platforms.length > 0 && (
          <p className="mt-1.5 text-xs leading-snug font-bold">
            {platforms.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
