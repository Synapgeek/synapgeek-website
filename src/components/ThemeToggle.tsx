"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(onStoreChange: () => void) {
  // Listen for storage events from other tabs
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot(): boolean {
  return localStorage.getItem("theme") !== "light";
}

function getServerSnapshot(): boolean {
  return true; // Default to dark on SSR
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync DOM classes with the current theme (external system update, no setState)
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [dark]);

  const toggle = useCallback(() => {
    const next = !dark;
    if (next) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    // Trigger a re-render by dispatching a storage event manually
    window.dispatchEvent(new StorageEvent("storage"));
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-surface-elevated hover:text-text-primary"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
