import { ContactForm } from "@/components/ContactForm";
import { Mail } from "lucide-react";

export function Contact({
  locale,
  dict,
}: {
  locale: string;
  dict: {
    title: string;
    subtitle: string;
  };
}) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-about-cream py-28 sm:py-36"
    >
      {/* ---- Decorative blobs (subtler than About) ---- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top-right -- soft teal */}
        <div className="blob-2 animate-blob-drift-2 absolute -right-16 -top-12 h-56 w-56 bg-accent-teal/15 blur-3xl sm:h-72 sm:w-72" />
        {/* Bottom-left -- warm coral */}
        <div className="blob-4 animate-blob-drift-1 absolute -bottom-16 -left-12 h-64 w-64 bg-accent-coral/12 blur-3xl sm:h-80 sm:w-80 delay-300" />
        {/* Center-left -- faint lavender */}
        <div className="blob-1 animate-blob-drift-3 absolute left-1/4 top-1/3 h-40 w-40 bg-secondary/10 blur-3xl sm:h-56 sm:w-56 delay-200" />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto max-w-2xl px-6">
        {/* Glassmorphism card wrapping heading + form */}
        <div className="rounded-3xl border border-white/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl sm:p-12">
          {/* Section heading — inline to stay inside the card */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {dict.title}
            </h2>
            {dict.subtitle && (
              <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
                {dict.subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
