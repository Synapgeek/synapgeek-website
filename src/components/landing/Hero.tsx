import Image from "next/image";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IPhoneSlider } from "@/components/landing/IPhoneSlider";

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
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background scene */}
      <Image
        src="/images/hero/hero-bg-desktop.png"
        alt=""
        fill
        className="hidden object-cover lg:block"
        priority
        aria-hidden="true"
      />
      <Image
        src="/images/hero/hero-bg-mobile.png"
        alt=""
        fill
        className="object-cover lg:hidden"
        priority
        aria-hidden="true"
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent lg:from-white/85 lg:via-white/50 lg:to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-32">
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

        {/* iPhone mockup slider */}
        <div className="animate-fade-in-up delay-400 flex flex-1 justify-center lg:justify-end">
          <div className="iphone-tilt">
            <IPhoneSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
