/**
 * Lecture des deux variables d'environnement du consentement analytics.
 *
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` est déjà en production sur ce site (GA4
 * chargé sans consentement à ce jour) ; `NEXT_PUBLIC_FUNDING_CHOICES_ID`
 * (l'ID publisher AdSense de la CMP Google Funding Choices) n'existe pas
 * encore — son absence est le cas nominal, pas une erreur.
 *
 * IMPORTANT : `NEXT_PUBLIC_*` est inliné par Next AU BUILD, par substitution
 * de texte sur l'expression littérale `process.env.NEXT_PUBLIC_XXX` — jamais
 * lu au runtime. Les deux accès ci-dessous doivent donc rester écrits en
 * toutes lettres dans ce fichier, jamais factorisés derrière un helper
 * générique paramétré par le nom de la variable (un accès par crochets sur un
 * nom calculé ne serait jamais remplacé par l'inlining et enverrait
 * `undefined` en production).
 *
 * Une chaîne vide est traitée comme absente, pas comme une erreur — même
 * convention que `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` ailleurs dans ce repo
 * (`ContactForm.tsx`).
 */
export interface ConsentEnv {
  gaId: string | null;
  fundingChoicesId: string | null;
}

export function readConsentEnv(): ConsentEnv {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const fundingChoicesId = process.env.NEXT_PUBLIC_FUNDING_CHOICES_ID;
  return {
    gaId: gaId ? gaId : null,
    fundingChoicesId: fundingChoicesId ? fundingChoicesId : null,
  };
}

/**
 * Réponse oui/non à « existe-t-il un écran de consentement à rouvrir ? » —
 * pour des consommateurs (`Footer.tsx`, pages légales) qui n'ont besoin que
 * de cette réponse, jamais de l'ID lui-même.
 */
export function hasConfiguredConsentScreen(): boolean {
  return readConsentEnv().fundingChoicesId !== null;
}
