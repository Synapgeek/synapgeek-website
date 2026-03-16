import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://synapgeek.com"),
  title: {
    default: "Synapgeek — Studio indie de jeux de réflexion",
    template: "%s | Synapgeek",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
