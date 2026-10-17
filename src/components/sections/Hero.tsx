"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const lines = [
  { text: "TVOJA IDEJA", dot: true, className: "text-bone" },
  { text: "MOJA UMETNOST", dot: true, className: "text-outline" },
  { text: "TRAJNA PRIČA", dot: true, className: "text-bone" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);

  return (
    <section
      ref={ref}
      id="pocetna"
      aria-labelledby="hero-naslov"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Fotografija: celom površinom na telefonu, desni panel na desktopu */}
      <motion.div
        style={{ y: imageY }}
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1.04 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute inset-0 -z-20 will-change-transform lg:left-[38%]"
      >
        <Image
          src="/images/hero.jpg"
          alt="Tattoo umetnik tetovira nogu klijenta — krupni kadar ruku u crnim rukavicama"
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover object-[50%_45%]"
        />
      </motion.div>

      {/* Tamni gradijenti za čitljivost teksta */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-ink)_8%,rgb(10_10_10/0.72)_45%,rgb(10_10_10/0.35)_100%)] lg:bg-[linear-gradient(to_right,var(--color-ink)_36%,rgb(10_10_10/0.78)_50%,rgb(10_10_10/0.1)_82%),linear-gradient(to_top,var(--color-ink)_0%,transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/80 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-28 pt-32 sm:px-8 lg:justify-center lg:px-12 lg:pb-32">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mb-6 flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-ash sm:text-xs"
        >
          <span aria-hidden="true" className="h-px w-10 bg-blood" />
          Tattoo studio · Portfolio
        </motion.p>

        <h1
          id="hero-naslov"
          className="font-display text-[clamp(3.1rem,12.6vw,11rem)] font-semibold uppercase leading-[0.88] tracking-[-0.01em]"
        >
          {lines.map((line, index) => (
            <span key={line.text} className="block overflow-hidden pb-[0.03em] pt-[0.16em] -mt-[0.16em]">
              <motion.span
                className={`block ${line.className}`}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.35 + index * 0.14 }}
              >
                {line.text}
                {line.dot && <span className="text-blood [-webkit-text-stroke:0]">.</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.0 }}
          className="mt-8 max-w-md text-base leading-relaxed text-bone/75 sm:text-lg"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button href="#radovi" icon={ImageIcon}>
            POGLEDAJ RADOVE
          </Button>
          <Button href="#zakazivanje" variant="outline" icon={CalendarDays}>
            ZAKAŽI TERMIN
          </Button>
        </motion.div>
      </div>

      {/* Indikator skrolovanja */}
      <motion.a
        href="#o-meni"
        aria-label="Skroluj na sledeću sekciju"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-6 left-5 flex items-center gap-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-ash transition-colors hover:text-bone sm:left-8 lg:left-12"
      >
        <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-white/20">
          <span className="animate-scroll-cue absolute inset-0 bg-blood" />
        </span>
        Skroluj
      </motion.a>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute bottom-7 right-5 hidden text-[0.65rem] font-medium uppercase tracking-[0.35em] text-ash sm:right-8 md:block lg:right-12"
      >
        Blackwork — Realizam — Fine Line
      </motion.p>
    </section>
  );
}
