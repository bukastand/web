import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Artikel",
  description:
    "Tips, trik, dan wawasan terbaru seputar website, digital marketing, dan teknologi untuk mengembangkan bisnis Anda.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
