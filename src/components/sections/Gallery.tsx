"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { categoryLabels, filterOptions, works } from "@/config/works";
import { useSiteState } from "@/components/providers";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const { galleryFilter, setGalleryFilter } = useSiteState();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visibleWorks = useMemo(
    () => (galleryFilter === "all" ? works : works.filter((work) => work.category === galleryFilter)),
    [galleryFilter],
  );

  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  return (
    <section id="radovi" aria-labelledby="radovi-naslov" className="relative border-t border-white/10 py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <Reveal>
            <SectionLabel index="02" label="Portfolio" />
            <h2
              id="radovi-naslov"
              className="mt-8 font-display text-[clamp(3.5rem,11vw,10rem)] font-semibold uppercase leading-[0.86] tracking-tight"
            >
              Radovi<span className="text-blood">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-sm">
            <p className="text-base leading-relaxed text-bone/65">
              Izbor mojih radova. Klikni na fotografiju za veći prikaz, ili filtriraj prema stilu.
            </p>
          </Reveal>
        </div>

        {/* Filteri */}
        <Reveal delay={0.1} className="mt-14">
          <div role="group" aria-label="Filtriraj radove po stilu" className="flex flex-wrap gap-x-2 gap-y-3">
            {filterOptions.map((option) => {
              const active = galleryFilter === option.id;
              const count = option.id === "all" ? works.length : works.filter((w) => w.category === option.id).length;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGalleryFilter(option.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                    active ? "text-ink" : "text-ash hover:text-bone",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      aria-hidden="true"
                      className="absolute inset-0 bg-bone"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  {!active && <span aria-hidden="true" className="absolute inset-0 border border-white/15" />}
                  <span className="relative">
                    {option.label}
                    <sup className={cn("ml-1.5 text-[0.6rem] tracking-normal", active ? "text-blood" : "text-ash/60")}>
                      {count}
                    </sup>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Masonry */}
        <AnimatePresence mode="wait">
          <motion.ul
            key={galleryFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-12 columns-2 gap-3 sm:gap-4 lg:columns-3 lg:gap-6"
          >
            {visibleWorks.map((work, index) => (
              <motion.li
                key={work.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.1 }}
                className="mb-3 break-inside-avoid sm:mb-4 lg:mb-6"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Otvori rad: ${work.title} (${categoryLabels[work.category]})`}
                  className="group relative block w-full cursor-zoom-in overflow-hidden bg-graphite text-left"
                >
                  <Image
                    src={work.src}
                    alt={work.alt}
                    width={work.width}
                    height={work.height}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="h-auto w-full transition-[transform,filter] duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 touch:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/30 group-focus-visible:border-white/30"
                  />

                  <span className="absolute right-3 top-3 flex h-9 w-9 -translate-y-2 items-center justify-center bg-blood text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 touch:hidden">
                    <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>

                  <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 touch:translate-y-0 touch:opacity-100 sm:p-6">
                    <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-blood sm:text-[0.7rem]">
                      {categoryLabels[work.category]}
                    </span>
                    <span className="mt-1 block font-display text-lg font-medium uppercase leading-tight tracking-wide text-bone sm:text-2xl">
                      {work.title}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Lightbox items={visibleWorks} index={openIndex} onClose={closeLightbox} onChange={setOpenIndex} />
    </section>
  );
}
