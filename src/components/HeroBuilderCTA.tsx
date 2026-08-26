"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/motion/Reveal";
import { CheckIcon } from "@/lib/icons";

export default function HeroBuilderCTA() {
  const { t } = useTranslation();

  return (
    <section className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/40 mb-8">
              {t("cta.badge")}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-[-0.03em] leading-[1.05] text-balance">
              {t("cta.heading1")}{" "}
              <span className="text-accent">{t("cta.heading2")}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="text-lg text-white/60 leading-relaxed mt-7 max-w-xl text-pretty">
              {t("cta.subtitle")}{" "}
              <span className="text-white font-semibold">{t("cta.subtitle_bold")}</span>
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 mt-9 max-w-xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n} className="inline-flex items-center gap-2 text-sm text-white/70">
                  <CheckIcon className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                  {t(`cta.feature${n}`)}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-10">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-ink font-semibold rounded-xl text-base transition-all duration-300 hover:bg-accent-light hover:scale-[1.02] active:scale-[0.98]"
              >
                {t("cta.cta1")}
              </Link>
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-base transition-all duration-300 hover:border-white/50 active:scale-[0.98]"
              >
                {t("cta.cta2")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Trust strip */}
        <Reveal delay={0.34}>
          <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              {t("cta.trust")}
            </p>
            <div className="flex items-center gap-10 flex-wrap">
              {[1, 2, 3, 4].map((n) => (
                <div key={n}>
                  <div className="text-xl font-semibold tabular-nums tracking-tight">
                    {t(`cta.trust${n}_val`)}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">
                    {t(`cta.trust${n}_label`)}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/templates"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {t("cta.templates_link")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
