import Image from "next/image";
import { Button } from "@/components/ui/Button";

/** Textes de la 404 et destination du lien de retour, déjà résolus pour une langue. */
export interface NotFoundStrings {
  title: string;
  body: string;
  cta: string;
  /** Accueil de cette langue (`pagePath("home", locale)`), jamais un « / » nu. */
  href: string;
}

/**
 * Corps de la 404 : partagé par la 404 localisée et la 404 racine (anglaise).
 * Ne pose aucun `<title>` : chaque appelant sait s'il en a déjà un (voir leurs commentaires).
 */
export function NotFoundView({ title, body, cta, href }: NotFoundStrings) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-gutter py-section text-center">
      <Image
        src="/images/brand/logo-synapgeek.png"
        alt=""
        width={72}
        height={72}
      />
      <p
        aria-hidden="true"
        className="mt-6 font-display text-7xl font-bold text-brand-violet"
      >
        404
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-4 text-lg text-text-secondary">{body}</p>
      <Button href={href} className="mt-8">
        {cta}
      </Button>
    </section>
  );
}
