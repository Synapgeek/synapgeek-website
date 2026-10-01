import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/routes";

// Crawlers de recherche et d'assistants IA, nommés pour que l'autorisation soit
// explicite et survive à un futur durcissement du groupe `*`. Aucun `disallow` :
// le site entier est public.
const NAMED_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ["*", ...NAMED_CRAWLERS].map((userAgent) => ({
      userAgent,
      allow: "/",
    })),
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
