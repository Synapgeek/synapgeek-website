"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/gtag";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import type { Locale } from "@/lib/i18n";
import { STORE_BADGES } from "@/lib/store-badges";
import type { StoreLabels } from "@/content/types";

interface StoreBadgesProps {
  locale: Locale;
  /** Libellés accessibles, déjà localisés (`common.stores` du dictionnaire). */
  labels: StoreLabels;
  className?: string;
}

/** Rangée de badges : 44 px de haut (cible tactile), `app_store_click` au clic. */
export function StoreBadges({
  locale,
  labels,
  className = "",
}: StoreBadgesProps) {
  const badges = STORE_BADGES[locale];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.appStoreLabel}
        onClick={() => trackEvent("app_store_click", { store: "app_store" })}
        className="rounded-lg transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        <Image
          src={badges.appStore}
          alt=""
          width={badges.appStoreWidth}
          height={40}
          sizes="140px"
          className="h-11 w-auto"
        />
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.googlePlayLabel}
        onClick={() => trackEvent("app_store_click", { store: "google_play" })}
        className="rounded-lg transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        <Image
          src={badges.googlePlay}
          alt=""
          width={badges.googlePlayWidth}
          height={badges.googlePlayHeight}
          sizes="150px"
          className="h-11 w-auto"
        />
      </a>
    </div>
  );
}
