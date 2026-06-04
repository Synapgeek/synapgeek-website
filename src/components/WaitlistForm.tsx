"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/gtag";
import type { Waitlist } from "@/content/types";

// iOS is live; the waitlist now only collects Android launch sign-ups.
const PLATFORM = "android";

export function WaitlistForm({ dict }: { dict: Waitlist }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), platform: PLATFORM, website }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        trackEvent("waitlist_signup", { platform: PLATFORM });
      } else {
        setStatus("error");
        setErrorMessage(dict.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage(dict.error);
    }
  }

  if (status === "success") {
    return (
      <p className="mt-1 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
        {dict.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Honeypot — hidden from humans, visible to bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* Email + submit */}
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.placeholder}
          aria-label={dict.placeholder}
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
        >
          {status === "loading" ? "..." : dict.button}
        </button>
      </div>
      {status === "error" && errorMessage && (
        <p className="mt-2 text-center text-xs text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
