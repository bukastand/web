"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { WhatsAppIcon, MapPinIcon, ArrowUpRightIcon } from "@/lib/icons";

export default function LocationSection() {
  const { t } = useTranslation();

  return (
    <section id="lokasi" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="09"
          eyebrow="Lokasi"
          title={
            <>
              <span className="text-muted">{t("location.heading")}</span>{" "}
              {t("location.heading_highlight")}
            </>
          }
          description={t("location.subtitle")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          <Reveal>
            <div className="h-full flex flex-col justify-between p-8 sm:p-10 rounded-2xl border border-line">
              <div>
                <div className="w-11 h-11 rounded-xl bg-surface border border-line text-muted flex items-center justify-center mb-6">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-ink tracking-tight mb-2">
                  PAGODA STUDIO
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs text-pretty">
                  Jl. Ade Irma Suryani No.6A, Labuh Baru, Kec. Payakumbuh Utara,
                  Kota Payakumbuh, Sumatera Barat 26134
                </p>
              </div>

              <div className="mt-10 space-y-2">
                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 -mx-4 rounded-xl transition-colors duration-200 hover:bg-surface"
                >
                  <WhatsAppIcon className="w-5 h-5 text-accent" />
                  <span className="flex-1 text-sm font-medium text-ink">
                    WhatsApp — 0822 1009 9969
                  </span>
                  <ArrowUpRightIcon className="w-4 h-4 text-faint transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 -mx-4 rounded-xl transition-colors duration-200 hover:bg-surface"
                >
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="flex-1 text-sm font-medium text-ink">
                    {t("location.gmaps")}
                  </span>
                  <ArrowUpRightIcon className="w-4 h-4 text-faint transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl overflow-hidden border border-line min-h-[380px] h-full">
              <iframe
                src="https://www.google.com/maps?q=Jl.%20Ade%20Irma%20Suryani%20No.6A%20Payakumbuh&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PAGODA STUDIO Location"
                className="w-full h-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
