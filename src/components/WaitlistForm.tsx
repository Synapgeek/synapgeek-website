"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/gtag";

type Platform = "ios" | "android" | "both";

interface WaitlistFormProps {
  dict: {
    placeholder: string;
    button: string;
    success: string;
    error: string;
    platformIos: string;
    platformAndroid: string;
    platformBoth: string;
  };
}

export function WaitlistForm({ dict }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [platform, setPlatform] = useState<Platform>("both");
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
        body: JSON.stringify({ email: email.trim(), platform, website }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        trackEvent("waitlist_signup", { platform });
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
      <p className="mt-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
        {dict.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 w-full">
      {/* Platform selector */}
      <div className="mb-2 flex items-center justify-center gap-1">
        {(["ios", "android", "both"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              platform === p
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary hover:bg-surface/80"
            }`}
          >
            {p === "ios"
              ? dict.platformIos
              : p === "android"
                ? dict.platformAndroid
                : dict.platformBoth}
          </button>
        ))}
      </div>

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
