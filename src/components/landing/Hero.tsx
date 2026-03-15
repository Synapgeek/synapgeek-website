import Image from "next/image";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero({
  dict,
}: {
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
}) {
  return (
    <section className="relative min-h-screen overflow-hidden gradient-hero pt-20">
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-accent-blue/10 blur-3xl" />
      <div className="absolute right-1/3 bottom-10 h-48 w-48 rounded-full bg-accent-yellow/10 blur-3xl" />

      {/* Floating decorative elements */}
      <div className="absolute left-[10%] top-[20%] animate-bounce-soft delay-200">
        <div className="h-4 w-4 rounded-lg bg-accent-yellow rotate-12" />
      </div>
      <div className="absolute right-[15%] top-[30%] animate-bounce-soft delay-400">
        <div className="h-3 w-3 rounded-full bg-accent-coral" />
      </div>
      <div className="absolute left-[20%] bottom-[25%] animate-bounce-soft delay-600">
        <div className="h-5 w-5 rounded-full bg-accent-blue/60" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-32">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <Badge color="green" className="animate-fade-in-up">
            <Apple className="h-3 w-3" />
            {dict.badge}
          </Badge>

          <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {dict.title}
          </h1>

          <p className="animate-fade-in-up delay-200 mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
            {dict.subtitle}
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              href="https://apps.apple.com/app/cerebrum"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <Apple className="h-5 w-5" />
              {dict.cta}
            </Button>
            <Button href="#features" variant="outline" size="lg">
              {dict.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="animate-fade-in-up delay-400 flex flex-1 justify-center lg:justify-end">
          <div className="animate-float relative">
            <Image
              src="/hero-v2.png"
              alt="Cerebrum App"
              width={450}
              height={450}
              className="relative drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
