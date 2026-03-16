"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { IPhoneSlider } from "@/components/landing/IPhoneSlider";

export function Hero({
  locale,
  dict,
}: {
  locale: "fr" | "en";
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    comingSoon: string;
    waitlist: {
      placeholder: string;
      button: string;
      success: string;
      error: string;
      platformIos: string;
      platformAndroid: string;
      platformBoth: string;
    };
  };
}) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Background scene */}
      <Image
        src="/images/hero/hero-bg-desktop.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 100vw, 0px"
        className="hidden object-cover lg:block"
        priority
        aria-hidden="true"
      />
      <Image
        src="/images/hero/hero-bg-mobile.webp"
        alt=""
        fill
        sizes="(max-width: 1023px) 100vw, 0px"
        className="object-cover lg:hidden"
        priority
        aria-hidden="true"
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent lg:from-white/85 lg:via-white/50 lg:to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-32">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Cerebrum identity lockup */}
          <div className="animate-fade-in-up mb-4 flex flex-col items-center gap-3 lg:items-start">
            <div className="cerebrum-icon-glow relative">
              <Image
                src="/images/brand/cerebrum-icon.png"
                alt="Cerebrum"
                width={80}
                height={80}
                className="cerebrum-icon-img"
                priority
              />
            </div>
            <span className="cerebrum-name text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Cerebrum
            </span>
          </div>

          <Badge color="green" className="animate-fade-in-up delay-100">
            <Sparkles className="h-3 w-3" />
            {dict.badge}
          </Badge>

          {/* Golden separator */}
          <div className="animate-fade-in-up delay-100 my-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <h1 className="animate-fade-in-up delay-200 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {dict.title}
          </h1>

          <p className="animate-fade-in-up delay-300 mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
            {dict.subtitle}
          </p>

          <div className="animate-fade-in-up delay-400 mt-8 flex flex-col gap-4">
            <StoreButtons
              locale={locale}
              comingSoon
              comingSoonLabel={dict.comingSoon}
              waitlist={dict.waitlist}
            />
            <Button
              href="#features"
              variant="ghost"
              size="lg"
              onClick={() =>
                trackEvent("cta_clicked", {
                  button_text: dict.ctaSecondary,
                  location: "hero",
                })
              }
            >
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
