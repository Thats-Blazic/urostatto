/**
 * ============================================================
 *  RADOVI (GALERIJA)
 *  Da dodaš rad: ubaci fotografiju u /public/images i dodaj novi
 *  objekat u niz `works` (src, stvarne dimenzije fajla `width`/`height`,
 *  `alt`, stil `category`). Ništa drugo nije potrebno.
 *
 *  Filter stila se prikazuje samo ako ima bar jedan rad u tom stilu.
 * ============================================================
 */

export type WorkCategory = "blackwork" | "realizam" | "fine-line" | "traditional" | "ornamental";

export const categoryLabels: Record<WorkCategory, string> = {
  blackwork: "Blackwork",
  realizam: "Realizam",
  "fine-line": "Fine Line",
  traditional: "Traditional",
  ornamental: "Ornamental",
};

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const works: Work[] = [
  {
    id: "palma",
    title: "Palm",
    category: "blackwork",
    src: "/images/rad-palma.jpg",
    width: 1024,
    height: 1024,
    alt: "Mala crna tetovaža palme na zadnjoj strani potkolenice",
  },
  {
    id: "plejer",
    title: "Music Player Tatto",
    category: "blackwork",
    src: "/images/rad-plejer.jpg",
    width: 768,
    height: 1024,
    alt: "Crni simboli muzičkog plejera (ponavljanje, nazad, pauza, napred, mešanje) na podlaktici",
  },
  {
    id: "vanzemaljac",
    title: "Alien 👽",
    category: "fine-line",
    src: "/images/rad-vanzemaljac.jpg",
    width: 1024,
    height: 1024,
    alt: "Linijska tetovaža osmeha koji se topi, sa vanzemaljcem u šeširu, na članku noge",
  },
  {
    id: "zmija",
    title: "Snake (Design)",
    category: "realizam",
    src: "/images/rad-zmija.jpg",
    width: 1024,
    height: 1024,
    alt: "Realističan crno-sivi dizajn zmijske glave sa račvastim jezikom, nacrtan za tetovažu",
  },
  {
    id: "kanji",
    title: "Japanese Tattoo",
    category: "blackwork",
    src: "/images/rad-kanji.jpg",
    width: 768,
    height: 1024,
    alt: "Crna kanji tetovaža u tri reda na listu noge",
  },
];

/** Filteri: „Svi radovi" + samo stilovi koji imaju bar jedan rad. */
export const filterOptions: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "Svi radovi" },
  ...(Object.keys(categoryLabels) as WorkCategory[])
    .filter((id) => works.some((work) => work.category === id))
    .map((id) => ({ id, label: categoryLabels[id] })),
];

/** Da li stil ima radove u galeriji (za kartice stilova). */
export const categoryHasWorks = (category: WorkCategory) => works.some((work) => work.category === category);
