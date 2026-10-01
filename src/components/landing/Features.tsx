import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Visuel par jeu, indexé par `id` et non par position : l'ordre du tableau du
 * dictionnaire peut changer sans désynchroniser les images.
 */
const FEATURE_IMAGES: Record<string, string> = {
  sudoku: "/images/games/feature-sudoku.webp",
  pandoku: "/images/games/feature-pandoku.webp",
  minesweeper: "/images/games/feature-minesweeper.webp",
  pixelart: "/images/games/feature-pixelart.webp",
  crossmath: "/images/games/feature-crossmath.webp",
  crossword: "/images/games/feature-crosswords.webp",
  wordsearch: "/images/games/feature-wordsearch.webp",
  trace: "/images/games/feature-trace.webp",
  maze: "/images/games/feature-maze.webp",
  arrowmaze: "/images/games/feature-arrowmaze.webp",
};

export function Features({
  dict,
}: {
  dict: {
    title: string;
    subtitle: string;
    items: readonly { id: string; title: string; description: string }[];
  };
}) {
  return (
    <section id="features" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={dict.title} subtitle={dict.subtitle} />
        {/* Dernière carte seule sur sa rangée à 3 colonnes : centrée plutôt qu'orpheline à gauche. */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:last-child:nth-child(3n+1)]:col-start-2">
          {dict.items.map((feature) => (
            <Card key={feature.title}>
              <div className="mb-6">
                <Image
                  src={FEATURE_IMAGES[feature.id]}
                  alt={feature.title}
                  width={80}
                  height={80}
                  sizes="80px"
                  className="rounded-2xl"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
