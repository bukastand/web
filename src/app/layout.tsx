import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pagodastudio.com"),
  title: {
    default: "PAGODA STUDIO — Jasa Pembuatan Website Profesional",
    template: "%s | PAGODA STUDIO",
  },
  description:
    "Modern, fast, mobile-friendly websites. Professional website development services for businesses, institutions, and companies.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PAGODA STUDIO",
    title: "PAGODA STUDIO — Jasa Pembuatan Website Profesional",
    description:
      "Website modern, cepat, dan mobile-friendly untuk bisnis, instansi, dan perusahaan Anda.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PAGODA STUDIO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PAGODA STUDIO — Jasa Pembuatan Website Profesional",
    description:
      "Website modern, cepat, dan mobile-friendly untuk bisnis, instansi, dan perusahaan Anda.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
