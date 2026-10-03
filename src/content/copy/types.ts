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
  /**
   * Phrase d'homonymie : « pas le Cerebrum d'à côté ». C'est le `disambiguatingDescription` du
   * JSON-LD de l'app et la phrase d'homonymie de `llms.txt` ; une page doit aussi l'afficher,
   * le structuré ne disant jamais plus que le visible.
   */
  disambiguation: string;
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

/** Une valeur du studio : un titre court et une phrase. */
export interface StudioValue {
  title: string;
  description: string;
}

export interface HubCopy extends Dated {
  meta: PageMeta;
  /**
   * Le héros de l'accueil, sur la photo de la table : `h1` est le nom du studio, `tagline` l'accroche
   * qui le suit dans le même titre, `definition` la phrase citée par les assistants (courte, autonome,
   * sans lieu ni date), `cta` le libellé du bouton vers la page de l'app.
   */
  hero: DefinitionBlock & { tagline: string; cta: string };
  apps: {
    title: string;
    /**
     * Une entrée par app, pour son encart : `genre` la ligne sous le nom, `description` la
     * phrase de présentation, `seeMore` l'invite qui la suit vers la page de l'app,
     * `gamesLabel` le nom de la ligne de liens vers les pages de ses jeux.
     */
    items: Record<
      AppSlug,
      {
        genre: string;
        description: string;
        seeMore: string;
        gamesLabel: string;
      }
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
