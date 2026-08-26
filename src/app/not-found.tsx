import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-white min-h-dvh flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full py-24">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint mb-8">
            <span className="text-accent">404</span> · Halaman tidak ditemukan
          </p>
          <h1 className="font-bold tracking-[-0.035em] leading-[1.02] text-ink text-[clamp(3rem,8vw,5.5rem)] text-balance">
            Alamat ini tidak ada.
          </h1>
          <p className="body-lg mt-6 max-w-md text-pretty">
            Halaman yang Anda cari mungkin sudah dipindahkan atau tautannya salah.
            Mari kembali ke jalur yang benar.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <Link
              href="/"
              className="inline-flex items-center px-7 py-3.5 bg-ink text-white font-semibold rounded-xl hover:bg-black active:scale-[0.98] transition-all duration-300"
            >
              Ke beranda
            </Link>
            <Link
              href="/portofolio"
              className="inline-flex items-center px-7 py-3.5 font-semibold rounded-xl text-ink hover:bg-surface active:scale-[0.98] transition-all duration-300"
            >
              Lihat portofolio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
