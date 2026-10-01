"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

/**
 * Menu mobile : un `<details>` natif (le bouton « Menu » est un `<summary>`,
 * clavier et lecteurs d'écran gérés par le navigateur) que cet îlot complète :
 * il se ferme au choix d'un lien (y compris une ancre de la même page, qui ne
 * change pas le chemin), au changement de page, au clic extérieur et à Échap,
 * et dans ce dernier cas rend le focus au bouton (WCAG 2.4.3).
 * Les liens arrivent en `children`, rendus par le serveur : l'îlot ne connaît ni
 * le dictionnaire ni le registre des routes.
 */
export function MobileMenu({
  label,
  children,
}: {
  /** Nom du bouton (l'icône seule n'en a pas). */
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const close = useCallback((restoreFocus: boolean) => {
    const details = ref.current;
    if (!details?.open) return;
    details.open = false;
    if (restoreFocus) details.querySelector("summary")?.focus();
  }, []);

  useEffect(() => close(false), [pathname, close]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [close]);

  return (
    <details
      ref={ref}
      className="group md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          event.preventDefault();
          close(true);
        }
      }}
    >
      <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-pill text-ink transition-colors duration-150 hover:bg-canvas-soft active:scale-[0.97] [&::-webkit-details-marker]:hidden">
        <span className="sr-only">{label}</span>
        <Menu className="size-6 group-open:hidden" />
        <X className="hidden size-6 group-open:block" />
      </summary>
      <div
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) close(false);
        }}
        className="shell-pop absolute inset-x-0 top-full border-t border-border bg-canvas shadow-raised"
      >
        {children}
      </div>
    </details>
  );
}
