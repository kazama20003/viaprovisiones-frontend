import type { Metadata } from "next";
import { Suspense } from "react";
import LenisScroll from "./lenis-scroll";
import PersistentPanelMenu from "./persistent-panel-menu";
import "./globals.css";
import "./design-frame.css";

export const metadata: Metadata = {
  title: "VIA Provisiones | Tienda y panel de control",
  description: "Tienda, administración y vistas móviles de VIA Provisiones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Montserrat:wght@500&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://unpkg.com/lenis@1.3.27/dist/lenis.css" rel="stylesheet" />
      </head>
      <body><LenisScroll /><Suspense fallback={null}><PersistentPanelMenu /></Suspense>{children}</body>
    </html>
  );
}

