import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ibn Sina — Gestion Médicale · إدارة طبية",
  description: "Système de gestion pour cabinets et cliniques en Algérie · نظام إدارة العيادات والمصحّات في الجزائر",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0071e3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initial direction/lang are set to fr on the server; the AppShell
  // updates <html> attributes on the client based on the store's locale.
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
