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
          <div className="cerebrum-lockup animate-fade-in-up relative mb-6">
            {/* Sparkle particles */}
            <div className="cerebrum-sparkles" aria-hidden="true">
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle cerebrum-sparkle--star" />
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle cerebrum-sparkle--star" />
              <span className="cerebrum-sparkle" />
              <span className="cerebrum-sparkle" />
            </div>

            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
              {/* Icon with glow + reflection */}
              <div className="cerebrum-icon-glow relative flex-shrink-0">
                <Image
                  src="/images/brand/cerebrum-icon.png"
                  alt="Cerebrum"
                  width={112}
                  height={112}
                  className="cerebrum-icon-img h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] lg:h-[120px] lg:w-[120px]"
                  priority
                />
                <div
                  className="cerebrum-icon-reflection"
                  aria-hidden="true"
                />
              </div>

              {/* Name */}
              <span className="cerebrum-name text-[2.75rem] font-extrabold leading-none tracking-tight sm:text-[3.25rem] lg:text-[4rem]">
                Cerebrum
              </span>
            </div>
          </div>

          <Badge color="green" className="animate-fade-in-up delay-100">
            <Sparkles className="h-3 w-3" />
            {dict.badge}
          </Badge>

          {/* Golden separator — animated shimmer */}
          <div className="animate-fade-in-up delay-100 my-5" aria-hidden="true">
            <div className="cerebrum-separator" />
          </div>

          <h1 className="animate-fade-in-up delay-200 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            {dict.title}
          </h1>

          <p className="animate-fade-in-up delay-300 mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
            {dict.subtitle}
          </p>

          <div className="animate-fade-in-up delay-400 mt-8">
            <StoreButtons
              locale={locale}
              comingSoon
              comingSoonLabel={dict.comingSoon}
              waitlist={dict.waitlist}
            />
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
