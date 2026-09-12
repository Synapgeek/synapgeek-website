"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import type { StoreDownload } from "@/content/types";

const BADGES = {
  fr: {
    appStore: "/images/brand/badge-appstore-fr.svg",
    googlePlay: "/images/brand/badge-googleplay-fr.png",
    // Les badges fournis par Apple et Google n'ont pas le même ratio d'une
    // locale à l'autre : ces largeurs intrinsèques sont celles des fichiers.
    appStoreWidth: 127,
    googlePlayWidth: 646,
    googlePlayHeight: 192,
  },
  en: {
    appStore: "/images/brand/badge-appstore-en.svg",
    googlePlay: "/images/brand/badge-googleplay-en.png",
    appStoreWidth: 120,
    googlePlayWidth: 564,
    googlePlayHeight: 168,
  },
} as const;

type Locale = keyof typeof BADGES;

interface StoreButtonsProps {
  locale: Locale;
  dict: StoreDownload;
  className?: string;
}

export function StoreButtons({
  locale,
  dict,
  className = "",
}: StoreButtonsProps) {
  const badges = BADGES[locale];

  return (
    <div
      className={`flex flex-col items-center gap-3 lg:items-start ${className}`}
    >
      <div className="coming-soon-card w-full max-w-xs rounded-2xl px-5 py-4 sm:max-w-sm">
        <div className="flex flex-col items-center gap-4">
          <span className="store-pill store-pill--live">
            <Check className="h-3 w-3" aria-hidden="true" strokeWidth={3} />
            {dict.availableNow}
          </span>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.appStoreLabel}
              onClick={() =>
                trackEvent("app_store_click", { store: "app_store" })
              }
              className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Image
                src={badges.appStore}
                alt={dict.appStoreLabel}
                width={badges.appStoreWidth}
                height={40}
                className="h-[44px] w-auto"
              />
            </a>

            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.googlePlayLabel}
              onClick={() =>
                trackEvent("app_store_click", { store: "google_play" })
              }
              className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Image
                src={badges.googlePlay}
                alt={dict.googlePlayLabel}
                width={badges.googlePlayWidth}
                height={badges.googlePlayHeight}
                className="h-[44px] w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
