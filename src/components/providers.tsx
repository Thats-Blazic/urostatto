"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { WorkCategory } from "@/config/works";

export type GalleryFilter = "all" | WorkCategory;

interface SiteState {
  /** Aktivan filter u galeriji (menja se i klikom na karticu stila). */
  galleryFilter: GalleryFilter;
  setGalleryFilter: (filter: GalleryFilter) => void;
  /** Stil koji se unapred bira u formularu za zakazivanje. */
  bookingStyle: string;
  setBookingStyle: (style: string) => void;
}

const SiteStateContext = createContext<SiteState | null>(null);

export function useSiteState(): SiteState {
  const context = useContext(SiteStateContext);
  if (!context) throw new Error("useSiteState mora da se koristi unutar <Providers>.");
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>("all");
  const [bookingStyle, setBookingStyle] = useState("");

  const value = useMemo(
    () => ({ galleryFilter, setGalleryFilter, bookingStyle, setBookingStyle }),
    [galleryFilter, bookingStyle],
  );

  return (
    // reducedMotion="user": poštuje prefers-reduced-motion (isključuje pomeranja/transformacije).
    <MotionConfig reducedMotion="user">
      <SiteStateContext.Provider value={value}>{children}</SiteStateContext.Provider>
    </MotionConfig>
  );
}
