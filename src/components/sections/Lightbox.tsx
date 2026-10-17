"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { categoryLabels, type Work } from "@/config/works";

interface LightboxProps {
  items: Work[];
  /** Indeks otvorenog rada ili `null` kada je lightbox zatvoren. */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

const slide = {
  enter: (direction: number) => ({ x: direction * 90, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction * -90, opacity: 0, scale: 0.98 }),
};

export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const open = index !== null;
  const item = index !== null ? items[index] : undefined;
  const [direction, setDirection] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (step: 1 | -1) => {
      if (index === null || items.length < 2) return;
      setDirection(step);
      onChange((index + step + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  // Fokus: zapamti element koji je otvorio lightbox, vrati ga na zatvaranju; zaključaj skrol.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);

  // Tastatura: Escape, strelice, zadržavanje fokusa unutar dijaloga.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -600) go(1);
    else if (info.offset.x > 80 || info.velocity.x > 600) go(-1);
  };

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Galerija radova — ${item.title}`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="font-display text-sm tracking-[0.25em] text-ash" aria-live="polite">
              <span className="text-bone">{String((index ?? 0) + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-blood">/</span>
              {String(items.length).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Zatvori galeriju"
              className="group flex h-11 w-11 items-center justify-center border border-white/20 text-bone transition-colors hover:border-blood hover:bg-blood"
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden px-4 sm:px-20">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="absolute inset-x-4 inset-y-0 cursor-grab active:cursor-grabbing sm:inset-x-20"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="select-none object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-end justify-between gap-6 px-5 py-5 sm:px-8">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-blood">
                {categoryLabels[item.category]}
              </p>
              <h3 className="mt-1 font-display text-2xl font-medium uppercase tracking-wide sm:text-3xl">
                {item.title}
              </h3>
            </div>
            {items.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Prethodni rad"
                  className="flex h-12 w-12 items-center justify-center border border-white/20 text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                >
                  <ChevronLeft size={22} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Sledeći rad"
                  className="flex h-12 w-12 items-center justify-center border border-white/20 text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                >
                  <ChevronRight size={22} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
