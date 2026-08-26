"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

const testimonials = [
  {
    chars: "JC",
    name: "James Clarke",
    role: "Owner, Shop The Paws",
    metric: "300%",
    quoteKey: "quote1",
    resultKey: "result1",
  },
  {
    chars: "SW",
    name: "Sarah Wijaya",
    role: "CEO, TechBiz Solutions",
    metric: "20%",
    quoteKey: "quote2",
    resultKey: "result2",
  },
  {
    chars: "BS",
    name: "Budi Santoso",
    role: "Direktur, GreenHill Residence",
    metric: "150+",
    quoteKey: "quote3",
    resultKey: "result3",
  },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              index="05"
              eyebrow="Testimoni"
              title={
                <>
                  {t("testimonials.heading")}{" "}
                  <span className="text-muted">{t("testimonials.heading_highlight")}</span>
                </>
              }
              description={t("testimonials.subtitle")}
            />

            {/* Client switcher */}
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-1 mt-10">
                {testimonials.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={`text-left text-sm px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                      i === active
                        ? "bg-surface text-ink"
                        : "text-faint hover:text-muted"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Active quote */}
          <Reveal delay={0.1}>
            <div className="relative border-l-2 border-accent pl-8 sm:pl-12 py-2 min-h-[320px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-xl sm:text-2xl md:text-[1.75rem] text-ink leading-relaxed font-medium tracking-tight text-pretty">
                    &ldquo;{t(`testimonials.${current.quoteKey}`)}&rdquo;
                  </p>

                  <footer className="mt-10 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-accent-light text-accent-hover flex items-center justify-center text-xs font-bold">
                      {current.chars}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-ink">{current.name}</div>
                      <div className="text-xs text-faint">{current.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-accent tabular-nums tracking-tight">
                        {current.metric}
                      </div>
                      <div className="text-[11px] text-faint uppercase tracking-wider">
                        {t(`testimonials.${current.resultKey}`)}
                      </div>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Pager */}
            <div className="flex items-center gap-2 mt-8 pl-8 sm:pl-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimoni ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-accent" : "w-3 bg-line hover:bg-line-hover"
                  }`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
