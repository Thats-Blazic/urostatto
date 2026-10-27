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
    id: "mac-i-kanji",
    title: "Katana & Kanji",
    category: "blackwork",
    src: "/images/rad-mac-kanji.jpg",
    width: 768,
    height: 1024,
    alt: "Crno-siva tetovaža mača omotanog dimom i tri kanji znaka na listu noge",
  },
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
  {
    id: "1111",
    title: "11:11",
    category: "fine-line",
    src: "/images/rad-1111.jpg",
    width: 819,
    height: 1024,
    alt: "Sitna fine line tetovaža broja 11:11 u pisaćem fontu na podlaktici",
  },
  {
    id: "kanji-2",
    title: "Kanji Script",
    category: "blackwork",
    src: "/images/rad-kanji-2.jpg",
    width: 819,
    height: 1024,
    alt: "Krupna crna tetovaža tri kineska znaka jedan ispod drugog na listu noge",
  },
  {
    id: "strelice",
    title: "Matching Arrows",
    category: "fine-line",
    src: "/images/rad-strelice.jpg",
    width: 819,
    height: 1024,
    alt: "Parne sitne tetovaže trouglova i strelica na zadnjoj strani potkolenica dve osobe",
  },
  {
    id: "joker",
    title: "Joker & Harley",
    category: "fine-line",
    src: "/images/rad-joker.jpg",
    width: 819,
    height: 1024,
    alt: "Fine line tetovaža dve igraće karte sa Džokerom i Harli Kvin na butini",
  },
  {
    id: "222",
    title: "222",
    category: "fine-line",
    src: "/images/rad-222.jpg",
    width: 819,
    height: 1024,
    alt: "Fine line tetovaža broja 222 u tri reda, jedan ispod drugog, na rebrima",
  },
  {
    id: "slovo-m",
    title: "Letter M",
    category: "blackwork",
    src: "/images/rad-m.jpg",
    width: 819,
    height: 1024,
    alt: "Malo crno serifno slovo M na unutrašnjoj strani zgloba",
  },
  {
    id: "patika",
    title: "Sneaker Bag",
    category: "blackwork",
    src: "/images/rad-tn.jpg",
    width: 819,
    height: 1024,
    alt: "Linijska tetovaža patike u providnoj kesi sa zip-lock zatvaračem na potkolenici",
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
