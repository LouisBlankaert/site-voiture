import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/hover-effects.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import CookieConsentBanner from "@/components/cookie-consent";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AUTOGATE - Votre spécialiste en vente de véhicules d'occasion",
  description: "Découvrez notre sélection de voitures d'occasion de qualité à des prix compétitifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20`}
      >
        <Providers>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Container centré style Apple */}
            <Header />
            <main className="flex-1 py-4">{children}</main>
            <Footer />
          </div>
          <CookieConsentBanner />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
