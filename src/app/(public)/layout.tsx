import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:text-sm focus:font-semibold focus:rounded-lg"
      >
        Lewati ke konten utama
      </a>
      <Navbar />
      <div id="main-content" className="min-h-screen bg-white">
        {children}
      </div>
      <Footer />
    </>
  );
}
