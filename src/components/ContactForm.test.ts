import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import fr from "@/content/fr";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "./ContactForm";

/**
 * Le bouton d'envoi du formulaire de contact est le `Button` du site, pas une
 * copie : CLAUDE.md, « jamais un sixième bouton ». Rendu serveur pur, comme
 * ui/primitives-markup.test.ts.
 */
const dict = fr.common.contactForm;
const html = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

function renderForm(siteKey: string): string {
  vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", siteKey);
  return html(createElement(ContactForm, { dict }));
}

function submitButton(markup: string): string {
  const match = /<button[^>]*type="submit"[^>]*>/.exec(markup);
  if (!match) throw new Error("no submit button in the form markup");
  return match[0];
}

function classOf(tag: string): string {
  const match = /class="([^"]*)"/.exec(tag);
  if (!match) throw new Error(`no class attribute in ${tag}`);
  return match[1];
}

afterEach(() => vi.unstubAllEnvs());

describe("ContactForm submit button", () => {
  it("is the shared Button: primary, large, full width, same classes", () => {
    const expected = html(
      createElement(
        Button,
        { type: "submit", variant: "primary", size: "lg", className: "w-full" },
        "x",
      ),
    );
    const tag = submitButton(renderForm("test-key"));
    expect(classOf(tag)).toBe(classOf(expected));
  });

  it("puts ink on green and none of the old hand-rolled classes", () => {
    const classes = classOf(submitButton(renderForm("test-key")));
    expect(classes).toContain("bg-brand-green");
    expect(classes).toContain("text-ink");
    expect(classes).toContain("w-full");
    expect(classes).not.toMatch(/text-white|transition-all|hover:scale/);
  });

  it("starts disabled, until the reCAPTCHA has produced a token", () => {
    const withoutClasses = submitButton(renderForm("test-key")).replace(
      /class="[^"]*"/,
      "",
    );
    expect(withoutClasses).toMatch(/\sdisabled(?:=""|\s|>)/);
  });

  it("carries the localised label", () => {
    expect(renderForm("test-key")).toContain(dict.submit);
  });

  it("is replaced by the unavailable notice when no site key is built in", () => {
    const markup = renderForm("");
    expect(markup).not.toContain('type="submit"');
    expect(markup).toContain(dict.unavailable);
  });
});
