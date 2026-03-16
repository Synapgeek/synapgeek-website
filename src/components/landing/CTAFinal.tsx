import { StoreButtons } from "@/components/ui/StoreButtons";

export function CTAFinal({
  locale,
  dict,
}: {
  locale: "fr" | "en";
  dict: {
    title: string;
    subtitle: string;
    note: string;
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
    <section className="relative overflow-hidden px-6 py-24">
      {/* Colorful background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-accent-blue/5 to-secondary/5" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {dict.title}
        </h2>
        <p className="mt-4 text-lg text-text-secondary">{dict.subtitle}</p>
        <div className="mt-8 flex justify-center">
          <StoreButtons
            locale={locale}
            comingSoon
            comingSoonLabel={dict.comingSoon}
            waitlist={dict.waitlist}
            className="lg:items-center"
          />
        </div>
        <p className="mt-4 text-sm text-text-tertiary">{dict.note}</p>
      </div>
    </section>
  );
}
