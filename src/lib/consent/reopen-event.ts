/**
 * Nom de l'événement DOM personnalisé qui rouvre le bandeau de consentement
 * (`ConsentBanner`) depuis le bouton « Gérer mes cookies » du pied de page
 * (`ReopenConsentLink`). Un simple événement `window`, pas de store dédié :
 * les deux composants sont montés une seule fois chacun par page (layout de
 * locale et pied de page), un `Event` suffit et n'ajoute aucune dépendance.
 */
export const SG_CONSENT_REOPEN_EVENT = "sg-consent:reopen";
