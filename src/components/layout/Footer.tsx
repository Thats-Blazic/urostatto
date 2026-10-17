"use client";

import { ArrowUp } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { bookingCta, contact, designCredit, navLinks, siteConfig } from "@/config/site";
import { useClientValue } from "@/lib/hooks";

export function Footer() {
  // Godina se računa u browseru, pa se sama ažurira (bez ručnih izmena).
  const year = useClientValue(() => new Date().getFullYear(), 2026);

  return (
    <footer className="relative bg-coal">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <Logo />

        <nav aria-label="Navigacija u podnožju">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-[0.75rem] font-medium uppercase tracking-[0.22em] text-ash transition-colors hover:text-bone"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`#${bookingCta.id}`}
                className="text-[0.75rem] font-medium uppercase tracking-[0.22em] text-blood transition-colors hover:text-bone"
              >
                Zakaži termin
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {contact.instagramUrl && (
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profil (otvara se u novom prozoru)"
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-bone transition-colors duration-300 hover:border-blood hover:bg-blood"
            >
              <InstagramIcon size={18} />
            </a>
          )}
          <a
            href="#pocetna"
            aria-label="Nazad na vrh stranice"
            className="flex h-11 w-11 items-center justify-center border border-white/15 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone hover:text-ink"
          >
            <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-6 text-xs tracking-wide text-ash sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            © {year} {siteConfig.name}. Sva prava zadržana.
          </p>
          <p>
            Designed by{" "}
            <a
              href={designCredit.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${designCredit.name} — Instagram (otvara se u novom prozoru)`}
              className="font-semibold uppercase tracking-[0.18em] text-bone underline decoration-blood decoration-2 underline-offset-4 transition-colors duration-300 hover:text-blood"
            >
              {designCredit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
