"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const VIDEO_SRC = "/video/prezentacija.mp4";
const VIDEO_POSTER = "/video/prezentacija-poster.jpg";

const steps = [
  { title: "Crtež", text: "Ideja postaje skica, prilagođena tvom telu." },
  { title: "Šablon", text: "Dizajn se prenosi na kožu i pozicionira do detalja." },
  { title: "Tetoviranje", text: "Sterilno, precizno, linija po linija." },
  { title: "Rezultat", text: "Tetovaža koja ostaje — čista i tačna." },
] as const;

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }, []);

  // Pauzira video kad izađe iz vidnog polja (štedi podatke i ne svira u pozadini).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem]">
      {/* Dekorativni crveni pomak iza videa */}
      <div
        aria-hidden="true"
        className="absolute -bottom-4 -right-4 hidden h-full w-full border border-blood/60 sm:block"
      />

      <MaskReveal className="relative aspect-[9/16] w-full overflow-hidden bg-graphite shadow-2xl shadow-black/60">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          preload="none"
          playsInline
          muted={muted}
          loop={false}
          aria-label="Video: kako nastaje tetovaža, od crteža do rezultata"
          onPlay={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setStarted(false);
          }}
          onClick={toggle}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        />

        {/* Tamni gradijent da dugme i tekst budu čitljivi */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30 transition-opacity duration-500",
            playing ? "opacity-0" : "opacity-100",
          )}
        />

        <AnimatePresence>
          {!playing && (
            <motion.button
              key="play"
              type="button"
              onClick={toggle}
              aria-label={started ? "Nastavi video" : "Pusti video"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-5 text-bone"
            >
              <span className="relative flex h-24 w-24 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-blood/40 [animation-duration:2.4s]"
                />
                <span className="relative flex h-full w-full items-center justify-center rounded-full bg-blood text-white shadow-[0_0_40px_rgb(212_32_44/0.55)] transition-transform duration-500 group-hover:scale-110">
                  <Play size={34} strokeWidth={0} fill="currentColor" className="ml-1" aria-hidden="true" />
                </span>
              </span>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-bone/90">
                {started ? "Nastavi" : "Pogledaj video"}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Kontrole dok video svira */}
        {playing && (
          <div className="absolute inset-x-0 top-0 flex justify-end gap-2 p-3">
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-label={muted ? "Uključi zvuk" : "Isključi zvuk"}
              className="flex h-10 w-10 items-center justify-center bg-ink/70 text-bone backdrop-blur transition-colors hover:bg-blood"
            >
              {muted ? (
                <VolumeX size={18} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Volume2 size={18} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label="Pauziraj video"
              className="flex h-10 w-10 items-center justify-center bg-ink/70 text-bone backdrop-blur transition-colors hover:bg-blood"
            >
              <Pause size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        )}
      </MaskReveal>
    </div>
  );
}

export function Showreel() {
  return (
    <section
      id="proces"
      aria-labelledby="proces-naslov"
      className="relative overflow-hidden border-t border-white/10 bg-coal py-28 sm:py-36 lg:py-44"
    >
      {/* Mutan crveni sjaj u pozadini */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-blood/10 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionLabel index="03" label="Proces" />
            <h2
              id="proces-naslov"
              className="mt-8 font-display text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-tight"
            >
              Od skice
              <br />
              do <span className="text-outline">tetovaže</span>
              <span className="text-blood">.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 max-w-lg">
            <p className="text-base leading-relaxed text-bone/70 sm:text-lg">
              Pogledaj kako nastaje jedna tetovaža — od prvog crteža, preko prenosa šablona, do poslednje
              linije. Bez prečica, svaki korak radi se pažljivo.
            </p>
          </Reveal>

          <ol className="mt-12 grid max-w-2xl gap-x-10 gap-y-8 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Reveal key={step.title} as="li" delay={0.1 + index * 0.08} y={24}>
                <span className="font-display text-sm tracking-[0.3em] text-blood">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-2xl font-medium uppercase tracking-wide text-bone">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-bone/60">{step.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3} className="mt-12">
            <Button href="#zakazivanje" icon={CalendarDays}>
              ZAKAŽI TERMIN
            </Button>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <VideoPlayer />
        </div>
      </div>
    </section>
  );
}
