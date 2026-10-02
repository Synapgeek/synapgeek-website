import type { AppSlug, Difficulty, GameCategory, GameId } from "@/content/apps";
import type { Locale } from "@/lib/i18n";
import type { PageId } from "@/lib/routes";

/**
 * Le H1 et la phrase de définition qui le suit. Les assistants citent cette
 * phrase : elle est courte, autonome, en texte brut (150 à 250 caractères,
 * vérifié par `content-guards.test.ts`).
 */
export interface DefinitionBlock {
  h1: string;
  definition: string;
}

/** Un lien interne : la page est un identifiant, le chemin vient de `pagePath`. */
export interface PageLink {
  label: string;
  page: PageId;
  hash?: string;
}

export interface FaqEntry {
  question: string;
  /** Texte complet : c'est lui que reprend le JSON-LD `FAQPage`, mot pour mot. */
  answer: string;
  /** Lien d'approfondissement sous la réponse (chemin par `pagePath`, jamais écrit à la main). */
  link?: PageLink;
}

interface PageMeta {
  title: string;
  /** 155 caractères au plus. */
  description: string;
}

/**
 * Chaque objet de copie porte sa propre date par langue : c'est elle que lisent
 * le `lastModified` du sitemap, la mention « Mis à jour le » et le
 * `dateModified` du JSON-LD.
 */
interface Dated {
  /** Date ISO (AAAA-MM-JJ). */
  updatedAt: string;
}

export interface GameCopy extends Dated {
  meta: PageMeta;
  /** `phoneAlt` décrit la capture du jeu dans le téléphone du héros. */
  hero: DefinitionBlock & { phoneAlt: string };
  /** 3 à 6 étapes. */
  howToPlay: { title: string; steps: readonly string[] };
  whatCerebrumAdds: {
    title: string;
    paragraphs: readonly string[];
    difficultyTable: {
      caption: string;
      rows: ReadonlyArray<{ difficulty: Difficulty; detail: string }>;
    };
  };
  /** 3 à 5 conseils. */
  tips: { title: string; items: readonly string[] };
  /** 3 à 6 questions. */
  faq: { title: string; items: readonly FaqEntry[] };
}

export interface AppCopy extends Dated {
  meta: PageMeta;
  /** `phoneAlt` décrit la capture de l'accueil de l'app dans le téléphone du héros. */
  hero: DefinitionBlock & { phoneAlt: string };
  sections: {
    games: { title: string; categories: Record<GameCategory, string> };
    daily: { title: string; body: string; items: readonly string[] };
    progress: {
      title: string;
      items: readonly string[];
      /** Légende, pour lecteur d'écran seulement, de la suite d'illustrations bébé, jeune, adulte. */
      growthCaption: string;
    };
    goodToKnow: { title: string; items: readonly string[] };
    model: { title: string; items: readonly string[] };
    /** Résumé de confidentialité : la politique reste la référence, `cta` y mène. */
    privacy: { title: string; body: string; cta: string };
  };
  faq: { title: string; items: readonly FaqEntry[] };
  /** Les mots communs aux pages jeux de l'app : ce qui ne change pas d'un jeu à l'autre. */
  gamePage: {
    /** Titre de la rangée des autres jeux de la même catégorie. */
    relatedTitle: string;
    /** En-têtes du tableau des difficultés. */
    difficultyColumns: { difficulty: string; detail: string };
    /** Nom de chaque difficulté, tel que l'app l'affiche. */
    difficulties: Record<Difficulty, string>;
  };
  /** Un jeu n'a de copie qu'au moment où sa page est publiée (`GameEntry.published`). */
  games: Partial<Record<GameId, GameCopy>>;
}

/** Les slides du slider d'accueil autres que la première (celle du H1, qui vient de `hero`). */
export type SliderSlideId = "relax" | "classics" | "offline" | "france";

/** Le texte d'une slide : un titre en paragraphe stylé (jamais un `<h2>`) et une phrase. */
interface SlideText {
  headline: string;
  body: string;
}

/** Slide dont le visuel est une capture de l'app : `phoneAlt` la décrit. */
type PhoneSlideText = SlideText & { phoneAlt: string };

/** Une valeur du studio : un titre court et une phrase. */
export interface StudioValue {
  title: string;
  description: string;
}

export interface HubCopy extends Dated {
  meta: PageMeta;
  /** `h1` et `definition` ouvrent la première slide ; `phoneAlt` décrit la capture de l'accueil de l'app. */
  hero: DefinitionBlock & { phoneAlt: string };
  slider: {
    /** Nom de la région carrousel. */
    label: string;
    /** Gabarit du nom d'une slide, avec `{current}` et `{total}`. */
    slideLabel: string;
    /** Gabarit du nom d'un point, avec `{current}`. */
    goTo: string;
    previous: string;
    next: string;
    pause: string;
    play: string;
    /** Libellé du bouton de la première slide, vers la page de l'app. */
    cta: string;
    slides: {
      relax: PhoneSlideText;
      classics: SlideText;
      offline: PhoneSlideText;
      france: SlideText;
    };
  };
  games: {
    title: string;
    /** Une entrée par app : la phrase de la carte, le nom de la rangée d'icônes, le libellé du bouton et la légende de la capture. */
    items: Record<
      AppSlug,
      { pitch: string; iconsLabel: string; cta: string; phoneAlt: string }
    >;
  };
  about: {
    title: string;
    description: string;
    values: readonly StudioValue[];
    cta: string;
  };
  contact: { title: string };
}

/** Un bloc de prose de la page À propos. */
export interface ProseBlock {
  title: string;
  body: string;
}

export interface AboutCopy extends Dated {
  meta: PageMeta;
  hero: DefinitionBlock;
  /** Qui est derrière le studio : de la prose en texte brut. */
  who: ProseBlock;
  /** Ce que le studio fait ; `link` mène à la page de son app. */
  what: ProseBlock & { link: PageLink };
  /** Fiche d'identité de l'éditeur : les valeurs viennent de `PUBLISHER`, jamais de la copie. */
  identity: { title: string; intro: string; legalNotice: PageLink };
  contact: { title: string; body: string; form: PageLink; press: PageLink };
}

/** Un fichier à télécharger : le chemin sous `public/press/` porte le suffixe de version. */
export interface PressDownload {
  label: string;
  href: string;
}

export interface PressCopy extends Dated {
  meta: PageMeta;
  hero: DefinitionBlock;
  /** Fiche d'identité de l'app : des faits, aucun chiffre non vérifié. */
  factSheet: {
    title: string;
    rows: ReadonlyArray<{ label: string; value: string }>;
  };
  /** Les jeux nommés, chacun avec son genre : la liste vient du registre. */
  games: { title: string; intro: string };
  /** L'éditeur : les valeurs viennent de `PUBLISHER`. */
  publisher: { title: string };
  downloads: { title: string; intro: string; items: readonly PressDownload[] };
  contact: { title: string; body: string };
}

/** Un module de copie enregistré, dans une langue. `app` n'existe que pour la copie d'une app. */
export type CopyEntry =
  | { kind: "hub"; locale: Locale; copy: HubCopy }
  | { kind: "about"; locale: Locale; copy: AboutCopy }
  | { kind: "press"; locale: Locale; copy: PressCopy }
  | {
      kind: "app";
      app: AppSlug;
      locale: Locale;
      copy: AppCopy;
    };
