/**
 * Lecture de la variable d'environnement du consentement analytics.
 *
 * IMPORTANT : `NEXT_PUBLIC_*` est inliné par Next AU BUILD, par substitution
 * de texte sur l'expression littérale `process.env.NEXT_PUBLIC_XXX` — jamais
 * lu au runtime. L'accès ci-dessous doit donc rester écrit en toutes lettres
 * dans ce fichier, jamais factorisé derrière un helper générique paramétré
 * par le nom de la variable (un accès par crochets sur un nom calculé ne
 * serait jamais remplacé par l'inlining et enverrait `undefined` en
 * production).
 *
 * Une chaîne vide est traitée comme absente, pas comme une erreur — même
 * convention que `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ailleurs dans ce repo
 * (`ContactForm.tsx`).
 */
export interface ConsentEnv {
  gaId: string | null;
}

export function readConsentEnv(): ConsentEnv {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return {
    gaId: gaId ? gaId : null,
  };
}
