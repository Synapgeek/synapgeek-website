"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Script from "next/script";

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

export function ContactForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  const renderRecaptcha = useCallback(() => {
    if (recaptchaRef.current && window.grecaptcha && widgetIdRef.current === null) {
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
    if (window.grecaptcha) renderRecaptcha();
  }, [renderRecaptcha]);

  const isFr = locale === "fr";

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
          message: formData.get("message"),
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        formRef.current?.reset();
        setRecaptchaToken(null);
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
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="lazyOnload"
      />

      {status === "success" ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          {/* Checkmark circle */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-7 w-7 text-primary"
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
          <p className="text-xl font-bold text-primary">
            {isFr ? "Message envoyé !" : "Message sent!"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {isFr
              ? "Nous vous répondrons dans les plus brefs délais."
              : "We'll get back to you as soon as possible."}
          </p>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
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
                {isFr ? "Nom" : "Name"}
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
                Email
              </label>
            </div>
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
              Message
            </label>
          </div>

          {/* reCAPTCHA — visually toned down */}
          <div ref={recaptchaRef} className="flex justify-center [&>div]:!mx-auto" />

          {status === "error" && (
            <div className="rounded-xl border border-accent-coral/20 bg-accent-coral/5 px-4 py-3">
              <p className="text-center text-sm text-accent-coral">
                {isFr
                  ? "Une erreur est survenue. Réessayez ou contactez-nous directement."
                  : "An error occurred. Please try again or contact us directly."}
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={
                !recaptchaToken || status === "sending" || !recaptchaReady
              }
              className="w-full rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
            >
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
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
                  {isFr ? "Envoi en cours..." : "Sending..."}
                </span>
              ) : isFr ? (
                "Envoyer le message"
              ) : (
                "Send message"
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
