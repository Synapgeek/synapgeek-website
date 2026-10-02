import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "./Button";

type HeadingLevel = "h2" | "h3" | "h4";

/**
 * Carte d'une app du studio : icône, nom, une phrase, le modèle en une phrase
 * (`note`), plateformes, un lien. Le seul lien est le bouton, l'action
 * principale (un arrêt de tabulation, un nom accessible explicite) : la carte
 * elle-même n'est pas cliquable. `aside` est une illustration décorative
 * (masquée aux technologies d'assistance, absente sous `md`) qui prend la place
 * de droite et déborde jusqu'aux bords de la carte : ce que la carte coupe,
 * c'est le bord de la carte, jamais une ligne arbitraire.
 */
export function AppCard({
  name,
  description,
  note,
  platforms,
  icon,
  href,
  ctaLabel,
  aside,
  as: Heading = "h3",
  className = "",
}: {
  name: string;
  description: string;
  /** Le modèle en une phrase : gratuité, publicité, Premium, langues. */
  note: string;
  /** Plateformes, déjà localisées (« iPhone, iPad et Android »). */
  platforms: string;
  icon: string;
  href: string;
  ctaLabel: string;
  aside?: ReactNode;
  as?: HeadingLevel;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col gap-6 overflow-hidden rounded-card bg-wash-green p-6 text-ink shadow-rest sm:flex-row sm:items-center sm:gap-8 sm:p-8 ${className}`}
    >
      <Image
        src={icon}
        alt=""
        width={112}
        height={112}
        sizes="112px"
        className="size-24 shrink-0 rounded-[22%] shadow-raised sm:size-28"
      />
      <div className="min-w-0 flex-1">
        <Heading className="font-display text-2xl leading-tight sm:text-3xl">
          {name}
        </Heading>
        <p className="mt-2 max-w-[65ch] text-base leading-relaxed">
          {description}
        </p>
        <p className="mt-2 max-w-[65ch] text-base leading-relaxed">{note}</p>
        <p className="mt-2 text-sm font-bold">{platforms}</p>
        <Button href={href} className="mt-5">
          {ctaLabel}
        </Button>
      </div>
      {aside && (
        <div
          aria-hidden="true"
          className="relative hidden w-56 shrink-0 self-stretch md:-my-8 md:-mr-8 md:block lg:w-72"
        >
          {aside}
        </div>
      )}
    </article>
  );
}
