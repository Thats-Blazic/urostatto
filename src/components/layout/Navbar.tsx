"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { CalendarDays, Phone } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { bookingCta, contact, navLinks } from "@/config/site";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";

const OBSERVED_IDS = [...navLinks.map((link) => link.id), bookingCta.id];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("pocetna");
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 40);
  });

  // Označava sekciju koja je trenutno na ekranu.
  useEffect(() => {
    const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Mobilni meni: zaključaj skrol, Escape zatvara, fokus ide na prvi link.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Ako se prozor poveća do desktop prikaza, zatvori mobilni meni.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const handleMobileLink = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    // Skrol posle zatvaranja menija (kada se vrati skrol na stranici).
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView();
      window.history.replaceState(null, "", `#${id}`);
    }, 60);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !menuOpen
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Glavna navigacija"
          className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <Logo onClick={closeMenu} />

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeId === link.id ? "true" : undefined}
                  className={cn(
                    "group relative py-2 text-[0.78rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300",
                    activeId === link.id ? "text-bone" : "text-ash hover:text-bone",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-blood transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      activeId === link.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button href={`#${bookingCta.id}`} icon={CalendarDays} className="px-6 py-3 max-lg:hidden">
              {bookingCta.label}
            </Button>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobilni-meni"
              aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
              className="relative flex h-11 w-11 items-center justify-center text-bone lg:hidden"
            >
              <span className="relative block h-3.5 w-6">
                <motion.span
                  className="absolute left-0 top-0 block h-px w-full bg-current"
                  animate={menuOpen ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="absolute left-0 top-[7px] block h-px bg-current"
                  animate={menuOpen ? { opacity: 0, width: "0%" } : { opacity: 1, width: "70%" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 block h-px w-full bg-current"
                  animate={menuOpen ? { y: -6.5, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobilni-meni"
            role="dialog"
            aria-modal="true"
            aria-label="Meni"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-5 pb-8 pt-28 sm:px-8 lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.75rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.25rem)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.07 }}
                >
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={`#${link.id}`}
                    onClick={(event) => handleMobileLink(event, link.id)}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-3 font-display text-[clamp(2.6rem,12vw,4.5rem)] font-medium uppercase leading-none tracking-tight text-bone"
                  >
                    <span className="w-7 text-xs font-sans tracking-[0.2em] text-blood">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-3 group-active:translate-x-3">
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 flex flex-col gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                href={`#${bookingCta.id}`}
                icon={CalendarDays}
                className="w-full"
                onClick={(event) => handleMobileLink(event as MouseEvent<HTMLAnchorElement>, bookingCta.id)}
              >
                {bookingCta.label}
              </Button>
              {(contact.instagramUrl || contact.telHref) && (
                <div className="flex items-center gap-6 text-ash">
                  {contact.instagramUrl && (
                    <a
                      href={contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm transition-colors hover:text-bone"
                    >
                      <InstagramIcon size={18} /> Instagram
                    </a>
                  )}
                  {contact.telHref && (
                    <a href={contact.telHref} className="flex items-center gap-2 text-sm transition-colors hover:text-bone">
                      <Phone size={18} strokeWidth={1.75} aria-hidden="true" /> Pozovi
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
