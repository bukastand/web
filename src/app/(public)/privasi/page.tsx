import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
};

export default function PrivasiPage() {
  return (
    <main className="bg-white">
      <article className="max-w-2xl mx-auto px-6 pt-36 pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-5">Legal</p>
        <h1 className="heading-lg mb-10">Kebijakan Privasi</h1>

        <div className="space-y-6 text-muted leading-relaxed text-[15px]">
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Data yang kami kumpulkan</h2>
            <p>
              Kami mengumpulkan nama, nomor WhatsApp, dan alamat email yang Anda kirimkan melalui
              formulir kontak atau WhatsApp.               Data ini digunakan hanya untuk keperluan komunikasi
              project dan penawaran layanan.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Penggunaan data</h2>
            <p>
              Data Anda tidak dijual atau dibagikan kepada pihak ketiga di luar keperluan operasional
              project (misalnya pendaftaran domain atas nama Anda). Kami hanya menggunakannya untuk
              merespons pertanyaan dan mengerjakan layanan yang Anda pesan.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Keamanan</h2>
            <p>
              Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data Anda,
              termasuk enkripsi saat transit dan pembatasan akses internal.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">Hak Anda</h2>
            <p>
              Anda dapat meminta salinan, koreksi, atau penghapusan data pribadi Anda kapan saja
              dengan menghubungi kami di{" "}
              <a href="mailto:info@pagodastudio.com" className="text-accent hover:underline">
                info@pagodastudio.com
              </a>
              .
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
