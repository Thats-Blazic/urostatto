"use client";

import Image from "next/image";
import { aboutContent, aboutPillars } from "@/config/about";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section id="o-meni" aria-labelledby="o-meni-naslov" className="relative py-28 sm:py-36 lg:py-44">
      {/* Veliki dekorativni broj u pozadini */}
      <span
        aria-hidden="true"
        className="text-outline-thin pointer-events-none absolute -right-6 top-16 select-none font-display text-[22rem] font-semibold leading-none [--outline-color:rgb(255_255_255/0.08)] max-lg:hidden"
      >
        01
      </span>

      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Fotografije */}
        <div className="relative lg:col-span-5">
          <MaskReveal className="relative aspect-[4/5] w-full overflow-hidden bg-graphite">
            <Image
              src="/images/umetnik.jpg"
              alt={aboutContent.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          </MaskReveal>

          <Reveal delay={0.25} className="absolute -bottom-10 right-4 w-[46%] sm:-right-6 lg:-right-12 lg:w-[48%]">
            <div className="relative aspect-[3/4] w-full overflow-hidden border-[6px] border-ink bg-graphite shadow-2xl shadow-black/60">
              <Image
                src="/images/studio-tinte.jpg"
                alt={aboutContent.detailImageAlt}
                fill
                sizes="(min-width: 1024px) 20vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <p
            aria-hidden="true"
            className="absolute -left-2 bottom-24 hidden origin-bottom-left -rotate-90 text-[0.65rem] font-medium uppercase tracking-[0.4em] text-ash xl:block"
          >
            U studiju · Tattoo umetnik
          </p>
        </div>

        {/* Tekst */}
        <div className="lg:col-span-7 lg:pl-20 lg:pt-14">
          <Reveal>
            <SectionLabel index="01" label="O meni" />
            <p className="mt-8 font-serif text-3xl italic text-blood sm:text-4xl">{aboutContent.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              id="o-meni-naslov"
              className="mt-4 font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-tight"
            >
              Više od
              <br />
              <span className="text-outline">tetovaže</span>
              <span className="text-blood">.</span>
            </h2>
          </Reveal>

          <div className="mt-10 max-w-xl space-y-6 text-base leading-relaxed text-bone/70 sm:text-lg">
            {aboutContent.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.15 + index * 0.1}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <blockquote className="mt-10 max-w-xl border-l-2 border-blood pl-6 font-serif text-2xl italic leading-snug text-bone sm:text-3xl">
              &bdquo;{aboutContent.quote}&ldquo;
            </blockquote>
          </Reveal>

          <ul className="mt-14 grid gap-px bg-white/10 sm:grid-cols-3">
            {aboutPillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.title} delay={0.1 * index} className="group bg-ink p-6 transition-colors duration-500 hover:bg-graphite">
                <pillar.icon
                  aria-hidden="true"
                  size={28}
                  strokeWidth={1.4}
                  className="text-blood transition-transform duration-500 group-hover:-translate-y-1"
                />
                <h3 className="mt-5 font-display text-lg font-medium uppercase tracking-[0.12em]">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{pillar.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
