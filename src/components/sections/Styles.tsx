"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useSiteState } from "@/components/providers";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { tattooStyles, type TattooStyle } from "@/config/styles";
import { categoryHasWorks } from "@/config/works";
import { cn } from "@/lib/cn";

function StyleCard({ style, index }: { style: TattooStyle; index: number }) {
  const { setGalleryFilter, setBookingStyle } = useSiteState();
  // Ako stil još nema radova u galeriji, kartica vodi pravo na zakazivanje sa tim stilom.
  const goesToGallery = style.galleryFilter !== null && categoryHasWorks(style.galleryFilter);
  const isWide = style.id === "custom";

  const handleClick = () => {
    if (goesToGallery && style.galleryFilter) setGalleryFilter(style.galleryFilter);
    else setBookingStyle(style.bookingStyle);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.12 }}
      className={cn("h-[26rem] sm:h-[30rem]", style.className, isWide && "sm:col-span-2")}
    >
      <a
        href={goesToGallery ? "#radovi" : "#zakazivanje"}
        onClick={handleClick}
        aria-label={
          goesToGallery
            ? `${style.name} — pogledaj radove u ovom stilu`
            : `${style.name} — zakaži termin sa unapred izabranim stilom`
        }
        className="group relative block h-full overflow-hidden bg-graphite"
      >
        <Image
          src={style.image}
          alt={style.imageAlt}
          fill
          sizes={isWide ? "100vw" : "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover grayscale transition-[transform,filter] duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07] group-hover:grayscale-0 group-focus-visible:grayscale-0 touch:grayscale-[0.4]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10 transition-opacity duration-700 group-hover:opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-blood/70"
        />

        <span className="absolute left-6 top-6 font-display text-sm tracking-[0.3em] text-bone/60">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          aria-hidden="true"
          className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-bone transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-blood group-hover:bg-blood"
        >
          <ArrowUpRight size={20} strokeWidth={1.5} className="-rotate-0 transition-transform duration-500 group-hover:-rotate-45" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <h3 className="font-display text-[clamp(2.2rem,4.2vw,4rem)] font-semibold uppercase leading-none tracking-tight transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
            {style.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70 transition-colors duration-500 group-hover:text-bone sm:text-base">
            {style.description}
          </p>
          <span className="mt-5 block h-px w-12 bg-blood transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:w-28" />
        </div>
      </a>
    </motion.li>
  );
}

export function Styles() {
  return (
    <section
      id="stilovi"
      aria-labelledby="stilovi-naslov"
      className="relative overflow-hidden border-t border-white/10 bg-coal py-28 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <SectionLabel index="03" label="Stilovi tetovaža" />
            <h2
              id="stilovi-naslov"
              className="mt-8 font-display text-[clamp(3rem,8.5vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-tight"
            >
              Svaki stil
              <br />
              ima svoj <span className="text-outline">jezik</span>
              <span className="text-blood">.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-base leading-relaxed text-bone/65">
              Nije važno da li znaš tačno šta želiš. Izaberi pravac koji ti je najbliži — ostalo rešavamo zajedno.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 grid items-start gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12 lg:gap-6">
          {tattooStyles.map((style, index) => (
            <StyleCard key={style.id} style={style} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
