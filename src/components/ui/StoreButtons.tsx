"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { trackEvent } from "@/lib/gtag";
import { APP_STORE_URL } from "@/lib/app";
import type { StoreDownload, Waitlist } from "@/content/types";

const BADGES = {
  fr: {
    appStore: "/images/brand/badge-appstore-fr.svg",
    googlePlay: "/images/brand/badge-googleplay-fr.png",
    appStoreAlt: "Télécharger dans l'App Store",
    googlePlayAlt: "Disponible sur Google Play",
  },
  en: {
    appStore: "/images/brand/badge-appstore-en.svg",
    googlePlay: "/images/brand/badge-googleplay-en.png",
    appStoreAlt: "Download on the App Store",
    googlePlayAlt: "Get it on Google Play",
  },
} as const;

type Locale = keyof typeof BADGES;

interface StoreButtonsProps {
  locale: Locale;
  dict: StoreDownload;
  waitlist: Waitlist;
  className?: string;
}

export function StoreButtons({
  locale,
  dict,
  waitlist,
  className = "",
}: StoreButtonsProps) {
  const badges = BADGES[locale];
  const appStoreWidth = locale === "fr" ? 127 : 120;
  const googlePlayWidth = locale === "fr" ? 646 : 564;
  const googlePlayHeight = locale === "fr" ? 192 : 168;

  return (
    <div
      className={`flex flex-col items-center gap-3 lg:items-start ${className}`}
    >
      <div className="coming-soon-card w-full max-w-xs rounded-2xl px-5 py-4 sm:max-w-sm">
        <div className="flex flex-col items-center gap-4">
          {/* iOS — available now */}
          <div className="flex flex-col items-center gap-2">
            <span className="store-pill store-pill--live">
              <Check className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
              {dict.availableNow}
            </span>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={badges.appStoreAlt}
              onClick={() =>
                trackEvent("app_store_click", { store: "app_store" })
              }
              className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Image
                src={badges.appStore}
                alt={badges.appStoreAlt}
                width={appStoreWidth}
                height={40}
                className="h-[44px] w-auto"
              />
            </a>
          </div>

          {/* Divider */}
          <div className="store-card-divider" aria-hidden="true" />

          {/* Android — coming soon */}
          <div className="flex w-full flex-col items-center gap-2">
            <span className="store-pill store-pill--soon">
              {dict.androidSoon}
            </span>
            <div
              className="grayscale-[60%] opacity-60"
              role="img"
              aria-label={badges.googlePlayAlt}
              onMouseEnter={() =>
                trackEvent("store_badge_hover", { store: "google_play" })
              }
            >
              <Image
                src={badges.googlePlay}
                alt={badges.googlePlayAlt}
                width={googlePlayWidth}
                height={googlePlayHeight}
                className="h-[40px] w-auto"
              />
            </div>
            <WaitlistForm dict={waitlist} />
          </div>
        </div>
      </div>
    </div>
  );
}
