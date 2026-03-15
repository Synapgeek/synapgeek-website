import type { MetadataRoute } from "next";
import { LOCALES, DEFAULT_LOCALE, getLocalePath } from "@/lib/i18n";

const BASE_URL = "https://synapgeek.com";

const routes = ["/", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}${getLocalePath(locale, route)}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.5,
      alternates: {
        languages: {
          fr: `${BASE_URL}${getLocalePath("fr", route)}`,
          en: `${BASE_URL}${getLocalePath("en", route)}`,
          "x-default": `${BASE_URL}${getLocalePath(DEFAULT_LOCALE, route)}`,
        },
      },
    })),
  );
}
