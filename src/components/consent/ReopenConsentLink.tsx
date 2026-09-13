"use client";

import { SG_CONSENT_REOPEN_EVENT } from "@/lib/consent/reopen-event";

/**
 * ReopenConsentLink — bouton « Gérer mes cookies » du pied de page, TOUJOURS
 * rendu (le bandeau est maison, aucune CMP tierce à interroger avant de
 * l'afficher). Un clic redéclenche `ConsentBanner` via un événement `window`
 * personnalisé (`SG_CONSENT_REOPEN_EVENT`), qui l'affiche à nouveau quel que
 * soit le choix déjà stocké dans `sg-consent` — un visiteur qui a déjà
 * accepté peut donc revenir sur son choix et refuser (et inversement).
 */
export function ReopenConsentLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event(SG_CONSENT_REOPEN_EVENT));
      }}
      className="text-gray-400 transition-colors hover:text-white"
    >
      {label}
    </button>
  );
}
