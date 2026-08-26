"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { WhatsAppIcon, ArrowRightIcon } from "@/lib/icons";

interface HeroData {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

const defaultHero: HeroData = {
  badge_text: "PAGODA STUDIO — Since 2024",
  title_line1: "Professional",
  title_line2: "Website Development",
  subtitle:
    "Modern, fast, mobile-friendly websites ready to help your business look more professional and attract more customers.",
  cta_text: "Free Consultation",
  cta_link: "https://wa.me/6282210099969",
  secondary_cta_text: "View Packages",
  secondary_cta_link: "/layanan",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function LineReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        animate={reduce ? undefined : { y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    supabase
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setHero({
            badge_text: data.badge_text,
            title_line1: data.title_line1,
            title_line2: data.title_line2,
            subtitle: data.subtitle,
            cta_text: data.cta_text,
            cta_link: data.cta_link,
            secondary_cta_text: data.secondary_cta_text,
            secondary_cta_link: data.secondary_cta_link,
          });
        }
      });
  }, []);

  const fadeIn = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-white"
    >
      {/* Dot grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Soft accent wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-accent/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Overline */}
          <motion.p
            {...fadeIn(0)}
            className="font-mono text-xs uppercase tracking-[0.22em] text-faint mb-8"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-3 align-middle" />
            {t("hero.badge")}
          </motion.p>

          {/* Headline */}
          <h1 className="font-bold tracking-[-0.04em] text-ink leading-[0.98] text-[clamp(2.75rem,8vw,6.75rem)]">
            <LineReveal delay={0.1}>{t("hero.title1")}</LineReveal>
            <LineReveal delay={0.22}>
              <span className="text-accent">{t("hero.title2")}</span>
            </LineReveal>
          </h1>

          {/* Subtitle */}
          <motion.p
            {...fadeIn(0.45)}
            className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mt-8 leading-relaxed text-pretty"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeIn(0.58)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <a
              href={hero.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-ink text-white font-semibold rounded-xl text-base transition-all duration-300 hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(17,17,17,0.12)]"
            >
              <WhatsAppIcon />
              {t("hero.cta")}
            </a>
            <a
              href={hero.secondary_cta_link}
              className="group inline-flex items-center gap-2 px-8 py-4 text-ink font-semibold rounded-xl text-base transition-all duration-300 hover:bg-surface active:scale-[0.98]"
            >
              {t("hero.secondary_cta")}
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        {...fadeIn(0.75)}
        className="relative z-10 w-full"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-line py-8 grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {[
              { value: "47+", label: t("hero.stat1") },
              { value: "32", label: t("hero.stat2") },
              { value: "12", label: t("hero.stat3") },
              { value: "24/7", label: t("hero.stat4") },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center ${i > 0 ? "md:border-l md:border-line" : ""}`}
              >
                <div className="text-3xl md:text-4xl font-semibold text-ink tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-faint mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
