"use client";

import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { testimonials } from "@/config/testimonials";
import { cn } from "@/lib/cn";

const offsets = ["lg:mt-0", "lg:mt-16", "lg:mt-32"];

export function Testimonials() {
  const hasPlaceholders = testimonials.some((item) => item.placeholder);

  return (
    <section id="utisci" aria-labelledby="utisci-naslov" className="relative py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionLabel index="05" label="Utisci klijenata" />
            <h2
              id="utisci-naslov"
              className="mt-8 font-display text-[clamp(3rem,9vw,8rem)] font-semibold uppercase leading-[0.88] tracking-tight"
            >
              Reč <span className="text-outline">klijenata</span>
              <span className="text-blood">.</span>
            </h2>
          </Reveal>
          {hasPlaceholders && (
            <Reveal delay={0.1} className="max-w-sm">
              <p className="border-l-2 border-blood pl-4 text-sm leading-relaxed text-ash">
                Tekstovi ispod su <strong className="font-semibold text-bone">placeholder</strong> — nisu prave
                recenzije. Zamenjuju se autentičnim utiscima klijenata.
              </p>
            </Reveal>
          )}
        </div>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
          {testimonials.map((item, index) => (
            <Reveal
              as="li"
              key={item.id}
              delay={index * 0.12}
              className={cn(
                "group relative flex h-full flex-col border border-white/10 bg-coal p-8 transition-colors duration-500 hover:border-white/25 sm:p-10",
                offsets[index % offsets.length],
              )}
            >
              <Quote aria-hidden="true" size={36} strokeWidth={1.25} className="text-blood" />

              <div
                role="img"
                aria-label={`Ocena ${item.rating} od 5`}
                className="mt-6 flex gap-1 text-blood"
              >
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={starIndex < item.rating ? "fill-current" : "text-white/20"}
                  />
                ))}
              </div>

              <blockquote className="mt-6 flex-1 font-serif text-2xl italic leading-snug text-bone/90 sm:text-[1.7rem]">
                &bdquo;{item.text}&ldquo;
              </blockquote>

              <footer className="mt-8 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-lg font-medium uppercase tracking-[0.12em]">{item.author}</p>
                  <p className="text-sm text-ash">{item.detail}</p>
                </div>
                {item.placeholder && (
                  <span className="shrink-0 border border-blood/60 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-blood">
                    Primer
                  </span>
                )}
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
