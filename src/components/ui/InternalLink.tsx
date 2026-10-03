import Link from "next/link";
import type { ComponentProps } from "react";
import { isPrefetchable } from "@/lib/link-prefetch";

type InternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Le seul point d'entrée de `next/link` du site (un test le garantit) : il coupe le
 * préchargement des chemins que le routeur client prédit mal, voir `isPrefetchable`.
 * Un `prefetch` explicite de l'appelant l'emporte.
 */
export function InternalLink({ href, prefetch, ...props }: InternalLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch ?? (isPrefetchable(href) ? undefined : false)}
      {...props}
    />
  );
}
