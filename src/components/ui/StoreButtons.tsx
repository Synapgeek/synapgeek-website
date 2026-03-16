import Image from "next/image";
import { WaitlistForm } from "@/components/WaitlistForm";

const BADGES = {
  fr: {
    appStore: "/images/brand/badge-appstore-fr.svg",
    googlePlay: "/images/brand/badge-googleplay-fr.png",
  },
  en: {
    appStore: "/images/brand/badge-appstore-en.svg",
    googlePlay: "/images/brand/badge-googleplay-en.png",
  },
} as const;

type Locale = keyof typeof BADGES;

function StoreBadge({
  src,
  alt,
  href,
  comingSoon,
  width,
  height,
}: {
  src: string;
  alt: string;
  href: string;
  comingSoon: boolean;
  width: number;
  height: number;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="h-[40px] w-auto"
    />
  );

  if (comingSoon) {
    return (
      <div
        className="opacity-80 grayscale-[20%] transition-all duration-300 hover:opacity-90 hover:grayscale-0"
        role="img"
        aria-label={alt}
      >
        {image}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {image}
    </a>
  );
}

interface StoreButtonsProps {
  locale: Locale;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  waitlist?: {
    placeholder: string;
    button: string;
    success: string;
    error: string;
    platformIos: string;
    platformAndroid: string;
    platformBoth: string;
  };
  className?: string;
}

export function StoreButtons({
  locale,
  comingSoon = true,
  comingSoonLabel,
  waitlist,
  className = "",
}: StoreButtonsProps) {
  const badges = BADGES[locale];

  if (comingSoon) {
    return (
      <div
        className={`flex flex-col items-center gap-3 lg:items-start ${className}`}
      >
        <div className="coming-soon-card rounded-2xl px-5 py-4">
          <div className="flex flex-col items-center gap-3">
            {/* Coming Soon pill */}
            {comingSoonLabel && (
              <span className="coming-soon-shimmer text-xs font-bold uppercase tracking-widest">
                {comingSoonLabel}
              </span>
            )}

            {/* Store badges */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <StoreBadge
                src={badges.appStore}
                alt={
                  locale === "fr"
                    ? "Télécharger dans l'App Store"
                    : "Download on the App Store"
                }
                href="https://apps.apple.com/app/cerebrum"
                comingSoon
                width={locale === "fr" ? 127 : 120}
                height={40}
              />
              <StoreBadge
                src={badges.googlePlay}
                alt={
                  locale === "fr"
                    ? "Disponible sur Google Play"
                    : "Get it on Google Play"
                }
                href="https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum"
                comingSoon
                width={locale === "fr" ? 646 : 564}
                height={locale === "fr" ? 192 : 168}
              />
            </div>

            {/* Waitlist form */}
            {waitlist && <WaitlistForm dict={waitlist} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center gap-3 lg:items-start ${className}`}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <StoreBadge
          src={badges.appStore}
          alt={
            locale === "fr"
              ? "Télécharger dans l'App Store"
              : "Download on the App Store"
          }
          href="https://apps.apple.com/app/cerebrum"
          comingSoon={false}
          width={locale === "fr" ? 127 : 120}
          height={40}
        />
        <StoreBadge
          src={badges.googlePlay}
          alt={
            locale === "fr"
              ? "Disponible sur Google Play"
              : "Get it on Google Play"
          }
          href="https://play.google.com/store/apps/details?id=com.synapgeek.cerebrum"
          comingSoon={false}
          width={locale === "fr" ? 646 : 564}
          height={locale === "fr" ? 192 : 168}
        />
      </div>
    </div>
  );
}
