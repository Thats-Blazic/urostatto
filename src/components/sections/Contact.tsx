"use client";

import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { contact, workingHours } from "@/config/site";
import { cn } from "@/lib/cn";

function InfoCard({
  icon,
  label,
  value,
  children,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="group bg-ink p-6 transition-colors duration-500 hover:bg-graphite sm:p-8">
      <div className="flex items-center gap-3 text-blood">
        {icon}
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ash">{label}</span>
      </div>
      {children ?? (
        <p className={cn("mt-4 font-display text-2xl font-medium uppercase tracking-wide", !value && "text-ash/50")}>
          {value ?? "Uskoro"}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const missingAny = !contact.instagramUrl || !contact.telHref || !contact.address || !contact.hasHours;

  return (
    <section
      id="kontakt"
      aria-labelledby="kontakt-naslov"
      className="relative overflow-hidden border-t border-white/10 bg-coal pt-28 sm:pt-36 lg:pt-44"
    >
      <Image
        src="/images/studio-umetnost.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="-z-0 object-cover opacity-[0.07] grayscale"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionLabel index="06" label="Kontakt i lokacija" />
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            id="kontakt-naslov"
            className="mt-10 font-display text-[clamp(3.6rem,13.5vw,14rem)] font-semibold uppercase leading-[0.85] tracking-[-0.015em]"
          >
            Vidimo se
            <br />
            <span className="text-outline">u studiju</span>
            <span className="text-blood">.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-bone/70 sm:text-lg">
              Najbrži način da zakažeš termin je formular iznad. Ako imaš pitanje, javi se direktno — odgovaram na svaku poruku.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                href={contact.telHref}
                disabled={!contact.telHref}
                icon={Phone}
                title={contact.telHref ? undefined : "Broj telefona još nije unet"}
              >
                Pozovi
              </Button>
              <Button
                href={contact.instagramUrl}
                disabled={!contact.instagramUrl}
                external
                variant="outline"
                title={contact.instagramUrl ? undefined : "Instagram profil još nije unet"}
              >
                <InstagramIcon size={18} /> Instagram
              </Button>
              <Button
                href={contact.mapsUrl}
                disabled={!contact.mapsUrl}
                external
                variant="outline"
                icon={Navigation}
                title={contact.mapsUrl ? undefined : "Adresa još nije uneta"}
              >
                Navigacija
              </Button>
            </div>

            {missingAny && (
              <p className="mt-6 max-w-md text-sm text-ash">
                Kontakt podaci će uskoro biti objavljeni. Do tada, zahtev za termin možeš poslati putem formulara.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              <InfoCard
                icon={<InstagramIcon size={20} />}
                label="Instagram"
                value={contact.instagramHandle ? `@${contact.instagramHandle}` : null}
              />
              <InfoCard icon={<Phone size={20} strokeWidth={1.75} aria-hidden="true" />} label="Telefon" value={contact.phone} />
              <InfoCard icon={<MapPin size={20} strokeWidth={1.75} aria-hidden="true" />} label="Adresa" value={contact.address} />
              <InfoCard icon={<Clock size={20} strokeWidth={1.75} aria-hidden="true" />} label="Radno vreme">
                {contact.hasHours ? (
                  <dl className="mt-4 space-y-2 text-sm">
                    {workingHours
                      .filter((row) => row.hours.trim())
                      .map((row) => (
                        <div key={row.days} className="flex justify-between gap-4 border-b border-white/10 pb-2 last:border-0">
                          <dt className="text-ash">{row.days}</dt>
                          <dd className="font-medium text-bone">{row.hours}</dd>
                        </div>
                      ))}
                  </dl>
                ) : (
                  <p className="mt-4 font-display text-2xl font-medium uppercase tracking-wide text-ash/50">Uskoro</p>
                )}
              </InfoCard>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24 h-px bg-white/10" />
    </section>
  );
}
