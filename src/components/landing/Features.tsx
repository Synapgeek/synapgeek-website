import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const featureImages = [
  "/images/games/feature-sudoku.webp",
  "/images/games/feature-crosswords.webp",
  "/images/games/feature-wordsearch.webp",
  "/images/games/feature-crossmath.webp",
];

export function Features({
  dict,
}: {
  dict: {
    title: string;
    subtitle: string;
    items: readonly { title: string; description: string }[];
  };
}) {
  return (
    <section id="features" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={dict.title} subtitle={dict.subtitle} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {dict.items.map((feature, i) => (
            <Card key={feature.title}>
              <div className="mb-6">
                <Image
                  src={featureImages[i]}
                  alt={feature.title}
                  width={80}
                  height={80}
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
