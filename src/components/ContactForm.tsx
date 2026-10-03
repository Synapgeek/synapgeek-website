"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/gtag";
import type { Dictionary } from "@/content/types";

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
        },
      ) => number;
      reset: (widgetId: number) => void;
    };
    onRecaptchaLoad: () => void;
  }
}

type FormStatus = "idle" | "sending" | "success" | "error";

type ContactFormDict = Dictionary["common"]["contactForm"];

export function ContactForm({ dict }: { dict: ContactFormDict }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  // Le script reCAPTCHA (~465 Ko) n'est demandé qu'à la première interaction
  // avec le formulaire (focus ou pointerdown), pas au chargement de la page.
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const loadRecaptcha = useCallback(() => {
    setShouldLoadRecaptcha(true);
  }, []);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  // Sans clé au build, le widget ne se rendra jamais : inutile de charger le
  // script, et le bouton d'envoi laisse place à un message d'indisponibilité.
  const hasRecaptchaKey = siteKey !== "";

  const renderRecaptcha = useCallback(() => {
    if (
      recaptchaRef.current &&
      window.grecaptcha &&
      widgetIdRef.current === null
    ) {
      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setRecaptchaToken(token),
        "expired-callback": () => setRecaptchaToken(null),
      });
      setRecaptchaReady(true);
    }
  }, [siteKey]);

  useEffect(() => {
    window.onRecaptchaLoad = renderRecaptcha;
    if (window.grecaptcha) {
      // Defer to avoid synchronous setState during render
      const id = requestAnimationFrame(() => renderRecaptcha());
      return () => cancelAnimationFrame(id);
    }
  }, [renderRecaptcha]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recaptchaToken) return;

    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          topic: formData.get("topic"),
          message: formData.get("message"),
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        formRef.current?.reset();
        setRecaptchaToken(null);
        trackEvent("contact_form_submit", {
          topic: String(formData.get("topic") ?? "unknown"),
        });
        if (widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {shouldLoadRecaptcha && hasRecaptchaKey && (
        <Script
          src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
          strategy="lazyOnload"
        />
      )}

      {status === "success" ? (
        <div
          role="status"
          className="rounded-2xl border border-brand-green-ink/20 bg-wash-green/40 p-8 text-center"
        >
          {/* Checkmark circle */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-wash-green">
            <svg
              className="h-7 w-7 text-brand-green-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-xl font-bold text-brand-green-ink">
            {dict.successTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {dict.successBody}
          </p>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          onFocus={loadRecaptcha}
          onPointerDown={loadRecaptcha}
          className="space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="input-group relative">
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                aria-required="true"
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="contact-name" className="input-label">
                {dict.name}
              </label>
            </div>

            {/* Email */}
            <div className="input-group relative">
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                aria-required="true"
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="contact-email" className="input-label">
                {dict.email}
              </label>
            </div>
          </div>

          {/* Sujet — un select natif : accessible au clavier et aux lecteurs
              d'écran sans une ligne de JS, et lisible sur mobile. */}
          <div>
            <label
              htmlFor="contact-topic"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              {dict.topicLabel}
            </label>
            <select
              id="contact-topic"
              name="topic"
              required
              aria-required="true"
              defaultValue=""
              className="input-field w-full"
            >
              <option value="" disabled>
                {dict.topicPlaceholder}
              </option>
              {dict.topics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="input-group relative">
            <textarea
              id="contact-message"
              name="message"
              required
              aria-required="true"
              rows={5}
              className="input-field peer resize-none"
              placeholder=" "
            />
            <label htmlFor="contact-message" className="input-label">
              {dict.message}
            </label>
          </div>

          {/* reCAPTCHA — visually toned down */}
          {hasRecaptchaKey && (
            <div
              ref={recaptchaRef}
              className="flex justify-center [&>div]:!mx-auto"
            />
          )}

          {status === "error" && (
            <div
              role="alert"
              className="rounded-xl border border-error/30 bg-error/5 px-4 py-3"
            >
              <p className="text-center text-sm text-error">{dict.error}</p>
            </div>
          )}

          <div className="pt-2">
            {hasRecaptchaKey ? (
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  !recaptchaToken || status === "sending" || !recaptchaReady
                }
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {dict.sending}
                  </>
                ) : (
                  dict.submit
                )}
              </Button>
            ) : (
              <p
                role="status"
                className="rounded-xl border border-text-secondary/20 bg-text-secondary/5 px-4 py-3 text-center text-sm text-text-secondary"
              >
                {dict.unavailable}
              </p>
            )}
          </div>
        </form>
      )}
    </>
  );
}
