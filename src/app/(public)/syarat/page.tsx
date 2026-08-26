import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
};

export default function SyaratPage() {
  return (
    <main className="bg-white">
      <article className="max-w-2xl mx-auto px-6 pt-36 pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-5">Legal</p>
        <h1 className="heading-lg mb-10">Syarat &amp; Ketentuan</h1>

        <div className="space-y-6 text-muted leading-relaxed text-[15px]">
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Layanan</h2>
            <p>
              PAGODA STUDIO menyediakan jasa pembuatan dan pengembangan website serta aplikasi web.
              Ruang lingkup, harga, dan jadwal pengerjaan disepakati terlebih dahulu melalui
              konsultasi sebelum project dimulai.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Pembayaran</h2>
            <p>
              Pembayaran dilakukan sesuai skema yang tercantum pada penawaran (umumnya uang muka di
              awal dan pelunasan sebelum serah terima). Project dimulai setelah uang muka diterima.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Revisi</h2>
            <p>
              Setiap paket mencakup jumlah revisi yang tercantum di halaman layanan. Revisi di luar
              lingkup kesepakatan dapat dikenakan biaya tambahan atas persetujuan kedua pihak.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Hak kekayaan intelektual</h2>
            <p>
              Setelah pelunasan penuh, seluruh hasil karya untuk project Anda menjadi milik Anda,
              kecuali komponen pihak ketiga yang tunduk pada lisensinya masing-masing.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Konten pihak pertama</h2>
            <p>
              Anda menjamin bahwa materi yang Anda serahkan (teks, gambar, logo) tidak melanggar hak
              pihak lain, dan bertanggung jawab atas legalitas konten tersebut.
            </p>
          </section>
          <p className="text-sm text-faint pt-4 border-t border-line">
            Terakhir diperbarui: 1 Agustus 2026
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mt-12 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
          Kembali ke beranda
        </Link>
      </article>
    </main>
  );
}
