import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "PAGODA STUDIO — Jasa Pembuatan Website Profesional",
  description:
    "Website modern, cepat, mobile friendly. Jasa pembuatan website profesional untuk bisnis, instansi, dan perusahaan di Payakumbuh dan seluruh Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#0f172a]">
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
