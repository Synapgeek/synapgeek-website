import { SectionHeading } from "@/components/ui/SectionHeading";
import { Heart, Shield, MapPin } from "lucide-react";
import Image from "next/image";

const icons = [Heart, Shield, MapPin];

const iconGradients = [
  "from-accent-coral to-accent-orange",
  "from-secondary to-secondary-light",
  "from-accent-blue to-accent-teal",
];

const iconBgColors = [
  "bg-accent-coral/15",
  "bg-secondary/15",
  "bg-accent-blue/15",
];

export function About({
  dict,
}: {
  dict: {
    title: string;
    description: string;
    values: readonly { title: string; description: string }[];
  };
}) {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-about-cream py-28 sm:py-36"
    >
      {/* ---- Decorative blobs (matches OG image) ---- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top-left — teal/mint cluster */}
        <div
          className="blob-1 animate-blob-drift-1 absolute -left-20 -top-16 h-72 w-72 bg-accent-teal/25 blur-3xl sm:h-96 sm:w-96"
        />
        <div
          className="blob-3 animate-blob-drift-3 absolute left-16 top-8 h-48 w-48 bg-accent-teal/15 blur-3xl sm:h-64 sm:w-64"
        />

        {/* Top-right — lavender/purple */}
        <div
          className="blob-2 animate-blob-drift-2 absolute -right-12 -top-10 h-64 w-64 bg-secondary/20 blur-3xl sm:h-80 sm:w-80"
        />

        {/* Bottom-right — coral/orange */}
        <div
          className="blob-4 animate-blob-drift-1 absolute -bottom-20 -right-16 h-80 w-80 bg-accent-coral/20 blur-3xl sm:h-[28rem] sm:w-[28rem] delay-500"
        />
        <div
          className="blob-1 animate-blob-drift-3 absolute -bottom-8 right-24 h-48 w-48 bg-accent-orange/15 blur-3xl sm:h-64 sm:w-64 delay-300"
        />

        {/* Bottom-left — mint/teal (softer) */}
        <div
          className="blob-5 animate-blob-drift-2 absolute -bottom-12 -left-8 h-64 w-64 bg-accent-teal/15 blur-3xl sm:h-80 sm:w-80 delay-200"
        />

        {/* Center-right — subtle coral glow */}
        <div
          className="blob-2 animate-blob-drift-3 absolute right-0 top-1/2 h-48 w-48 -translate-y-1/2 bg-accent-orange/10 blur-3xl sm:h-64 sm:w-64 delay-400"
        />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Logo left + Title/Description right */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Logo — left third */}
          <div className="flex shrink-0 justify-center lg:w-1/3">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent-teal/20 via-secondary/15 to-accent-coral/20 blur-2xl" />
              <Image
                src="/images/brand/logo-synapgeek.png"
                alt="Synapgeek logo"
                width={180}
                height={180}
                className="relative drop-shadow-sm"
              />
            </div>
          </div>

          {/* Vertical divider */}
          <div
            className="hidden h-32 w-px bg-gradient-to-b from-transparent via-text-primary/15 to-transparent lg:block"
            aria-hidden="true"
          />

          {/* Title + Description — right two thirds */}
          <div className="text-center lg:w-2/3 lg:text-left">
            <SectionHeading title={dict.title} align="left" className="lg:text-left text-center" />
            <p className="text-lg leading-relaxed text-text-secondary">
              {dict.description}
            </p>
          </div>
        </div>

        {/* Value cards — 3-column grid with glassmorphism */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.values.map((value, i) => {
            const Icon = icons[i] ?? Heart;
            return (
              <div
                key={value.title}
                className="group relative rounded-2xl border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white/70 hover:shadow-md"
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColors[i]} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    className={`h-6 w-6 bg-gradient-to-br ${iconGradients[i]} bg-clip-text`}
                    strokeWidth={2.5}
                    style={{
                      color:
                        i === 0
                          ? "#FF6B6B"
                          : i === 1
                            ? "#8549BA"
                            : "#1CB0F6",
                    }}
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold tracking-tight">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
