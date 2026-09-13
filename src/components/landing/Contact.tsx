import { ContactForm } from "@/components/ContactForm";
import type { Dictionary } from "@/content/types";

export function Contact({ dict }: { dict: Dictionary["landing"]["contact"] }) {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/3 via-accent-blue/3 to-secondary/3" />

      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.title}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{dict.subtitle}</p>
        </div>

        <ContactForm dict={dict.form} />
      </div>
    </section>
  );
}
