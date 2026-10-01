import type { Metadata, Viewport } from "next";
import { BASE_URL } from "@/lib/routes";
import { THEME_COLOR } from "@/design/theme-color";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Synapgeek — Studio indie de jeux mobiles",
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
