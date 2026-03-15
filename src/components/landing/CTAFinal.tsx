import { Apple } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTAFinal({
  dict,
}: {
  dict: {
    title: string;
    subtitle: string;
    cta: string;
    note: string;
  };
}) {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      {/* Colorful background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent-blue/5 to-secondary/5" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {dict.title}
        </h2>
        <p className="mt-4 text-lg text-text-secondary">{dict.subtitle}</p>
        <div className="mt-8">
          <Button
            href="https://apps.apple.com/app/cerebrum"
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            <Apple className="h-5 w-5" />
            {dict.cta}
          </Button>
        </div>
        <p className="mt-4 text-sm text-text-tertiary">{dict.note}</p>
      </div>
    </section>
  );
}
