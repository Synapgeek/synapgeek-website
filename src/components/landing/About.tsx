import { SectionHeading } from "@/components/ui/SectionHeading";
import { Heart, Shield, MapPin } from "lucide-react";

const icons = [Heart, Shield, MapPin];
const iconColors = [
  "bg-accent-coral/10 text-accent-coral",
  "bg-primary/10 text-primary",
  "bg-accent-blue/10 text-accent-blue",
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
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Visual */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -inset-8">
                <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/10 animate-bounce-soft" />
                <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-accent-blue/10 animate-bounce-soft delay-200" />
                <div className="absolute right-8 top-8 h-16 w-16 rounded-full bg-accent-yellow/15 animate-bounce-soft delay-400" />
              </div>
              {/* Main card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-primary/5 via-white to-accent-blue/5 border border-border p-12 text-center shadow-xl">
                <p className="text-6xl font-black text-gradient">SG</p>
                <p className="mt-2 text-sm font-bold text-text-secondary">Est. 2026</p>
                <p className="mt-1 text-xs text-text-tertiary">Paris, France</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <SectionHeading title={dict.title} align="left" />
            <p className="text-text-secondary leading-relaxed">
              {dict.description}
            </p>
            <div className="mt-10 space-y-6">
              {dict.values.map((value, i) => {
                const Icon = icons[i] ?? Heart;
                return (
                  <div key={value.title} className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColors[i]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{value.title}</p>
                      <p className="text-sm text-text-secondary">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
