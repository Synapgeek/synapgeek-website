import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Locale } from "@/lib/i18n";
import {
  LanguageSuggestion,
  LanguageSuggestionCard,
  visibleSuggestionTarget,
} from "./LanguageSuggestion";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const base = {
  browserLanguage: "fr-FR",
  locale: "en" as Locale,
  bannerOpen: false,
  dismissed: false,
  pathname: "/",
  excludedPaths: ["/privacy"],
};

describe("visibleSuggestionTarget", () => {
  it("propose la langue du navigateur une fois le bandeau fermé ou absent", () => {
    expect(visibleSuggestionTarget(base)).toBe("fr");
  });

  it("ne propose rien tant que le bandeau de consentement est ouvert", () => {
    expect(visibleSuggestionTarget({ ...base, bannerOpen: true })).toBeNull();
  });

  it("ne propose rien si la langue du navigateur est celle de la page ou inconnue", () => {
    expect(
      visibleSuggestionTarget({ ...base, browserLanguage: "en-GB" }),
    ).toBeNull();
    expect(
      visibleSuggestionTarget({ ...base, browserLanguage: "de-DE" }),
    ).toBeNull();
    expect(
      visibleSuggestionTarget({ ...base, browserLanguage: null }),
    ).toBeNull();
  });

  it("ne propose rien après fermeture ni sur une page exclue", () => {
    expect(visibleSuggestionTarget({ ...base, dismissed: true })).toBeNull();
    expect(
      visibleSuggestionTarget({ ...base, pathname: "/privacy" }),
    ).toBeNull();
  });
});

describe("LanguageSuggestionCard", () => {
  const html = renderToStaticMarkup(
    createElement(LanguageSuggestionCard, {
      target: "fr",
      messageId: "msg",
      text: {
        message: "Ce site est aussi disponible en français.",
        cta: "Lire en français",
        dismiss: "Fermer",
      },
      href: "/",
      onNavigate: () => {},
      onDismiss: () => {},
    }),
  );
  const classes =
    /<aside[^>]*class="([^"]*)"/.exec(html)?.[1].split(/\s+/) ?? [];

  it("est ancrée en bas du viewport sous lg, sans aucune classe top-* sans préfixe", () => {
    expect(classes).toContain("fixed");
    expect(classes).toContain("inset-x-gutter");
    expect(classes).toContain("bottom-gutter");
    expect(classes.filter((c) => /^top-/.test(c))).toEqual([]);
  });

  it("repasse sous le header, en haut à droite, à partir de lg", () => {
    expect(classes).toContain("lg:top-20");
    expect(classes).toContain("lg:bottom-auto");
  });

  it("garde la langue proposée, le lien hreflang et le bouton de fermeture nommé", () => {
    expect(html).toContain('lang="fr"');
    expect(html).toContain('hrefLang="fr"');
    expect(html).toContain('aria-label="Fermer"');
  });
});

describe("LanguageSuggestion", () => {
  it("ne rend rien au serveur : le HTML statique est identique pour tous", () => {
    const html = renderToStaticMarkup(
      createElement(LanguageSuggestion, {
        locale: "en",
        table: { pages: {}, fallback: { en: "/", fr: "/fr" } },
        excludedPaths: [],
        copy: {
          en: { message: "m", cta: "c", dismiss: "d" },
          fr: { message: "m", cta: "c", dismiss: "d" },
        },
      }),
    );
    expect(html).toBe("");
  });
});
