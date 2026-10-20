"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSiteState } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

const SPLIT_EASE = [0.76, 0, 0.24, 1] as const;
const SPLIT_DURATION = 1.15;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Jedna polovina ekrana sa svojom polovinom logoa. Dve polovine zajedno daju ceo logo. */
function Half({
  side,
  open,
  fill,
  reduce,
}: {
  side: "left" | "right";
  open: boolean;
  fill: MotionValue<string>;
  reduce: boolean;
}) {
  const left = side === "left";
  return (
    <motion.div
      aria-hidden="true"
      className={cn("fixed inset-y-0 z-[90] w-1/2 overflow-hidden bg-ink", left ? "left-0" : "right-0")}
      animate={{ x: open ? (left ? "-101%" : "101%") : "0%" }}
      transition={{ duration: reduce ? 0 : SPLIT_DURATION, ease: SPLIT_EASE }}
    >
      {/* Scena je široka kao ceo ekran, pa se obe polovine poklapaju u sredini */}
      <div className={cn("absolute inset-y-0 w-[200%]", left ? "left-0" : "right-0")}>
        {/* Pozadinski sjaj (jedan, centriran na celoj sceni) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(212_32_44/0.2),transparent_32%)]" />
        <div className="absolute left-1/2 top-1/2 aspect-[591/671] h-[min(40svh,300px)] -translate-x-1/2 -translate-y-1/2">
          {/* Prazan (tamni) logo */}
          <Image
            src="/logo.png"
            alt=""
            fill
            priority
            sizes="300px"
            className="object-contain opacity-[0.16] grayscale"
          />
          {/* Logo u boji — „puni se" odozdo nagore prema procentu učitavanja */}
          <motion.div className="absolute inset-0" style={{ clipPath: fill }}>
            <Image
              src="/logo.png"
              alt=""
              fill
              priority
              sizes="300px"
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Crvena ivica reza — upali se kad se logo prepolovi */}
      <motion.div
        className={cn(
          "absolute inset-y-0 w-[2px] bg-blood shadow-[0_0_24px_4px_var(--color-blood)]",
          left ? "right-0" : "left-0",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

/**
 * Loader pri ulasku na sajt: logo se puni bojom uz brojač, a zatim se
 * prepolovi i obe polovine odlete levo i desno otkrivajući stranicu.
 */
export function Preloader() {
  const { setIntroReady } = useSiteState();
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"loading" | "split" | "done">("loading");

  const progress = useMotionValue(0);
  const fill = useTransform(progress, (v) => `inset(${100 - v}% 0 0 0)`);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => v / 100);

  useEffect(() => {
    let cancelled = false;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    progress.set(0);

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
      setTimeout(resolve, 5000); // sigurnosni limit — loader nikad ne ostaje zauvek
    });

    const run = async () => {
      // Brojač ide do ~90% sam, a ostatak tek kad je stranica stvarno učitana.
      await animate(progress, 90, { duration: reduce ? 0.3 : 1.6, ease: [0.65, 0, 0.35, 1] });
      await pageReady;
      if (cancelled) return;
      await animate(progress, 100, { duration: reduce ? 0.1 : 0.45, ease: "easeOut" });
      if (cancelled) return;
      await wait(reduce ? 100 : 350);
      if (cancelled) return;

      setPhase("split");
      setIntroReady(true);
      await wait(reduce ? 100 : SPLIT_DURATION * 1000 + 100);
      if (cancelled) return;

      html.style.overflow = previousOverflow;
      setPhase("done");
    };
    void run();

    return () => {
      cancelled = true;
      html.style.overflow = previousOverflow;
    };
  }, [progress, reduce, setIntroReady]);

  if (phase === "done") return null;

  const open = phase === "split";

  return (
    <div id="preloader" role="status" aria-live="polite" aria-label="Učitavanje sajta">
      <Half side="left" open={open} fill={fill} reduce={reduce} />
      <Half side="right" open={open} fill={fill} reduce={reduce} />

      {/* Sjaj u pukotini koji se pojavi kad se logo otvori */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[89] bg-[radial-gradient(ellipse_30%_70%_at_center,rgb(212_32_44/0.7),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? [0, 1, 0] : 0 }}
        transition={{ duration: reduce ? 0 : SPLIT_DURATION + 0.2, times: [0, 0.25, 1] }}
      />

      {/* Brojač i naziv — nestaju čim krene deljenje */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[91] flex items-end justify-between px-5 pb-8 sm:px-10 sm:pb-10"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.span className="font-display text-5xl font-semibold leading-none tracking-wider text-bone sm:text-7xl">
          {count}
        </motion.span>
        <span className="pb-1 text-right font-display text-[0.7rem] uppercase tracking-[0.35em] text-ash sm:text-xs">
          {siteConfig.name}
        </span>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[91] h-[3px] origin-left bg-blood shadow-[0_0_12px_var(--color-blood)]"
        style={{ scaleX: bar }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />
    </div>
  );
}
