import Image from "next/image";
import { Download } from "lucide-react";
import type { PressDownload } from "@/content/copy";

/** Extension du fichier en capitales, affichée à côté du libellé (« PNG », « WEBP »). */
function fileType(href: string): string {
  return (href.split(".").pop() ?? "").toUpperCase();
}

/**
 * Fichiers à télécharger : un aperçu et un lien par fichier. Le lien porte
 * l'attribut `download` ; l'aperçu est décoratif (le libellé du lien nomme le
 * fichier). Les chemins sont ceux de `public/press/`, versionnés dans leur nom.
 */
export function DownloadGrid({
  items,
  className = "",
}: {
  items: readonly PressDownload[];
  className?: string;
}) {
  return (
    <ul
      role="list"
      className={`grid grid-cols-2 gap-4 lg:grid-cols-3 ${className}`}
    >
      {items.map(({ label, href }) => (
        <li key={href}>
          <a
            href={href}
            download
            className="group flex h-full flex-col gap-3 rounded-card bg-canvas-soft p-4 text-ink transition-shadow duration-150 hover:shadow-raised"
          >
            <span className="relative block h-44 overflow-hidden rounded-xl bg-canvas">
              <Image
                src={href}
                alt=""
                fill
                sizes="(min-width: 1024px) 18rem, 45vw"
                className="object-contain p-2"
              />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-base leading-snug font-bold">
                {label}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                <Download className="size-4" aria-hidden="true" />
                {fileType(href)}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
