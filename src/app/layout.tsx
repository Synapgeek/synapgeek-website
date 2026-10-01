import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/content";
import { BASE_URL } from "@/lib/routes";
import { THEME_COLOR } from "@/design/theme-color";
import "./globals.css";

const { siteName, tagline } = getDictionary("en").common;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${siteName}: ${tagline}`,
    template: "%s | Synapgeek",
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
