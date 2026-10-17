"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Tanka crvena linija na vrhu ekrana — pokazuje koliko je stranice pročitano. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-blood shadow-[0_0_12px_var(--color-blood)]"
    />
  );
}
