"use client";

/**
 * ReopenConsentLink — bouton « Gérer mes cookies » du pied de page. Monté
 * uniquement quand `hasConfiguredConsentScreen()` (`src/lib/consent/env.ts`)
 * est vrai : un bouton qui appellerait `googlefc.showRevocationMessage` sans
 * qu'aucune CMP ne soit jamais chargée sur la page serait un mensonge à
 * saveur de conformité — rien ne répondrait jamais au clic. Réutilisation de
 * MÉCANISME depuis Word Search Trove (portefeuille Synapgeek).
 *
 * Mécanisme officiel Google (support.google.com/adsense/answer/10959060,
 * « Add a consent revocation link to your site ») :
 * `googlefc.callbackQueue.push(googlefc.showRevocationMessage)`, jamais un
 * appel direct — `callbackQueue` est le mécanisme de FILE documenté par
 * Google précisément pour le cas où `window.googlefc` n'existe pas encore au
 * moment du clic (la CMP charge en `strategy="afterInteractive"`, après
 * hydratation). On y pousse une fermeture qui résout `showRevocationMessage`
 * au moment où la file la DRAINE (potentiellement après le clic), pas au
 * moment où elle est mise en file : la fenêtre où `googlefc` existe mais où
 * Funding Choices n'a pas encore exposé cette méthode ne fait donc jamais
 * perdre le clic en silence.
 *
 * Aucun retry si `googlefc` n'existe pas du tout — un tiers indisponible ne
 * casse jamais le site : un second clic, une fois la CMP chargée, fonctionne
 * normalement.
 */
export function ReopenConsentLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const w = window as unknown as {
          googlefc?: {
            callbackQueue?: Array<() => void>;
            showRevocationMessage?: () => void;
          };
        };
        if (!w.googlefc) return;
        w.googlefc.callbackQueue = w.googlefc.callbackQueue ?? [];
        w.googlefc.callbackQueue.push(() =>
          w.googlefc?.showRevocationMessage?.(),
        );
      }}
      className="text-gray-400 transition-colors hover:text-white"
    >
      {label}
    </button>
  );
}
