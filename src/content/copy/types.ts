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

export interface FaqEntry {
  question: string;
  /** Texte complet : c'est lui que reprend le JSON-LD `FAQPage`, mot pour mot. */
  answer: string;
  /** Lien d'approfondissement sous la réponse (chemin par `pagePath`, jamais écrit à la main). */
  link?: { label: string; page: PageId; hash?: string };
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
    progress: { title: string; items: readonly string[] };
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

export interface HubCopy extends Dated {
  meta: PageMeta;
  /** `phoneAlt` décrit la capture de l'accueil de l'app dans le téléphone du héros. */
  hero: DefinitionBlock & { phoneAlt: string };
  apps: {
    title: string;
    /** Une entrée par app : la phrase de la carte et le libellé de son lien. */
    items: Record<AppSlug, { description: string; cta: string }>;
  };
  games: { title: string; categories: Record<GameCategory, string> };
  facts: ReadonlyArray<{ value: string; label: string }>;
  studio: { title: string; body: string; cta: string };
  contact: { title: string };
}

export interface AboutCopy extends Dated {
  meta: PageMeta;
  hero: DefinitionBlock;
  sections: ReadonlyArray<{ title: string; body: string }>;
}

export interface PressCopy extends Dated {
  meta: PageMeta;
  hero: DefinitionBlock;
  factSheet: ReadonlyArray<{ label: string; value: string }>;
  downloads: ReadonlyArray<{ label: string; href: string }>;
  contact: string;
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
