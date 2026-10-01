import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary, FaqItem } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { pagePath } from "@/lib/routes";

/**
 * Réponse rendue en texte brut, avec le lien optionnel posé sur l'extrait
 * `link.text`. Le texte affiché reste strictement celui du dictionnaire, donc
 * celui du JSON-LD FAQPage. Si l'extrait est introuvable, pas de lien plutôt
 * qu'une réponse tronquée.
 */
function Answer({ item, locale }: { item: FaqItem; locale: Locale }) {
  const { answer, link } = item;
  const index = link ? answer.indexOf(link.text) : -1;

  if (!link || index === -1) return <>{answer}</>;

  return (
    <>
      {answer.slice(0, index)}
      <Link
        href={pagePath(link.path.page, locale, link.path.hash)}
        className="font-medium text-secondary underline underline-offset-2 hover:no-underline"
      >
        {link.text}
      </Link>
      {answer.slice(index + link.text.length)}
    </>
  );
}

/**
 * FAQ de la home : composant serveur, zéro JavaScript. Les <details>/<summary>
 * natifs s'ouvrent au clavier et restent lisibles par les crawlers (le contenu
 * replié est présent dans le HTML).
 */
export function FAQ({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["landing"]["faq"];
}) {
  return (
    <section id="faq" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={dict.title} subtitle={dict.subtitle} />
        <div className="flex flex-col gap-4">
          {dict.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-3xl border border-border bg-white shadow-sm transition-shadow duration-300 open:shadow-md hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:px-8 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-bold sm:text-lg">
                  {item.question}
                </h3>
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-text-secondary transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-text-secondary sm:px-8 sm:text-base">
                <Answer item={item} locale={locale} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
