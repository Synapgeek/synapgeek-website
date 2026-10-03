import { InternalLink } from "@/components/ui/InternalLink";
import { Button } from "@/components/ui/Button";
import { SectionBand } from "@/components/ui/SectionBand";
import { PUBLISHER } from "@/content/publisher";

/**
 * Bande profonde unique des pages de section : l'adresse de contact en clair
 * (bouton mailto) et, dessous, des liens internes en texte souligné. Les liens
 * arrivent déjà résolus (`pagePath`) par la page appelante.
 */
export function ContactBand({
  title,
  body,
  links,
}: {
  title: string;
  body: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <SectionBand tone="violet-deep" title={title} width="prose">
      <p className="max-w-[65ch] text-lg leading-relaxed text-canvas/90">
        {body}
      </p>
      <Button
        href={`mailto:${PUBLISHER.contactEmail}`}
        variant="inverse"
        className="mt-8"
      >
        {PUBLISHER.contactEmail}
      </Button>
      {links.length > 0 && (
        <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          {links.map(({ label, href }) => (
            <li key={href}>
              <InternalLink
                href={href}
                className="inline-block rounded-sm py-1.5 font-bold text-canvas underline underline-offset-4"
              >
                {label}
              </InternalLink>
            </li>
          ))}
        </ul>
      )}
    </SectionBand>
  );
}
