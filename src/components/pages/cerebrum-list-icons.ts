import {
  CirclePlay,
  Crown,
  Gem,
  Gift,
  Languages,
  LockOpen,
  Smartphone,
  Store,
  SunMoon,
  UserRound,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

/**
 * Une icône par point de « Bon à savoir » sur la page Cerebrum, dans l'ordre de la
 * copie (le même en français et en anglais) : hors ligne, invité et compte, langues,
 * appareils, affichage et sons. Le nombre est vérifié par test contre la copie ;
 * réordonner la copie impose de réordonner ces icônes.
 */
export const GOOD_TO_KNOW_ICONS: readonly LucideIcon[] = [
  WifiOff,
  UserRound,
  Languages,
  Smartphone,
  SunMoon,
];

/**
 * Une icône par point du modèle économique (« Gratuit, avec ou sans Premium »), dans
 * l'ordre de la copie : téléchargement gratuit, pubs récompensées, Premium, achat par
 * boutique, achats intégrés, aucun jeu réservé à un achat.
 */
export const MODEL_ICONS: readonly LucideIcon[] = [
  Gift,
  CirclePlay,
  Crown,
  Store,
  Gem,
  LockOpen,
];
