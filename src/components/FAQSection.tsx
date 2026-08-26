"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/lib/icons";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              index="08"
              eyebrow="FAQ"
              title={
                <>
                  {t("faq.heading")}{" "}
                  <span className="text-muted">{t("faq.heading_highlight")}</span>
                </>
              }
              description={t("faq.subtitle")}
            />
            <Reveal delay={0.15}>
              <div className="mt-10 p-6 rounded-2xl bg-white border border-line">
                <p className="text-sm text-muted mb-4">
                  Masih ada pertanyaan lain? Kami siap membantu.
                </p>
                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Tanya via WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <div>
            {[1, 2, 3, 4, 5, 6].map((num, index) => {
              const open = openIndex === index;
              return (
                <Reveal key={index} delay={index * 0.05} y={14}>
                  <div className="border-t border-line last:border-b">
                    <button
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left group"
                    >
                      <span
                        className={`text-base sm:text-lg font-medium tracking-tight transition-colors duration-200 ${
                          open ? "text-accent" : "text-ink group-hover:text-accent"
                        }`}
                      >
                        {t(`faq.q${num}`)}
                      </span>
                      <span
                        className={`relative flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          open
                            ? "border-accent bg-accent text-white rotate-45"
                            : "border-line text-muted group-hover:border-line-hover"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                        </svg>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pr-12 text-sm text-muted leading-relaxed max-w-2xl text-pretty">
                            {t(`faq.a${num}`)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
            <div className="border-t border-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
