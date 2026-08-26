"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/lib/icons";

const steps = [
  {
    num: "01",
    title: "Konsultasi",
    desc: "Diskusi kebutuhan & tujuan project Anda secara detail.",
  },
  {
    num: "02",
    title: "Desain",
    desc: "Pembuatan mockup & konsep visual sesuai branding.",
  },
  {
    num: "03",
    title: "Development",
    desc: "Coding & integrasi fitur dengan teknologi modern.",
  },
  {
    num: "04",
    title: "Launch",
    desc: "Deploy, testing, dan go live.",
  },
];

export default function ProcessSection() {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="04"
          eyebrow="Proses"
          title={
            <>
              {t("process.heading")}{" "}
              <span className="text-muted">{t("process.heading_highlight")}</span>
            </>
          }
          description={t("process.subtitle")}
          action={
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-ink text-white font-semibold rounded-xl transition-all duration-300 hover:bg-black hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon />
              {t("process.cta")}
            </a>
          }
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="block font-bold tabular-nums leading-none tracking-tighter text-[4.5rem] text-transparent transition-all duration-500 group-hover:text-accent"
                  style={{ WebkitTextStroke: "1px var(--color-fainter)" }}
                >
                  {step.num}
                </span>
                <h3 className="text-lg font-semibold text-ink mt-5 mb-2.5">
                  {t(`process.step${i + 1}_title`)}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-[260px] text-pretty">
                  {t(`process.step${i + 1}_desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
