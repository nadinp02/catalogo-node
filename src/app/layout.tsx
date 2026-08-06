import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScanlineOverlay } from "@/components/scanline-overlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RETROID — Consolas retro y coleccionismo",
    template: "%s | RETROID",
  },
  description:
    "Consolas portátiles Nintendo DS/3DS reacondicionadas, accesorios y cartuchos. Consultas y pedidos por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dark-first sin selector claro/oscuro: la clase "dark" queda fija acá,
    // no depende de prefers-color-scheme ni de ningún toggle.
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ScanlineOverlay />
      </body>
    </html>
  );
}
