import Image from "next/image";
import { Button } from "./Button";

type HeadingLevel = "h2" | "h3" | "h4";

/**
 * Carte d'une app du studio : icône, nom, une phrase, plateformes, un lien.
 * Le seul lien est le bouton (un arrêt de tabulation, un nom accessible
 * explicite) : la carte elle-même n'est pas cliquable.
 */
export function AppCard({
  name,
  description,
  platforms,
  icon,
  href,
  ctaLabel,
  as: Heading = "h3",
  className = "",
}: {
  name: string;
  description: string;
  /** Plateformes, déjà localisées (« iPhone, iPad et Android »). */
  platforms: string;
  icon: string;
  href: string;
  ctaLabel: string;
  as?: HeadingLevel;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col gap-6 rounded-card bg-wash-green p-6 text-ink shadow-rest sm:flex-row sm:items-center sm:gap-8 sm:p-8 ${className}`}
    >
      <Image
        src={icon}
        alt=""
        width={112}
        height={112}
        sizes="112px"
        className="size-24 shrink-0 rounded-[22%] shadow-raised sm:size-28"
      />
      <div className="min-w-0">
        <Heading className="font-display text-2xl leading-tight sm:text-3xl">
          {name}
        </Heading>
        <p className="mt-2 max-w-[65ch] text-base leading-relaxed">
          {description}
        </p>
        <p className="mt-2 text-sm font-bold">{platforms}</p>
        <Button href={href} variant="outline" className="mt-5">
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
