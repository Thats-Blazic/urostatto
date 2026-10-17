/**
 * ============================================================
 *  RADOVI (GALERIJA)
 *  Da zameniš fotografiju: ubaci svoju sliku u /public/images,
 *  zameni `src`, `width` i `height` (stvarne dimenzije fajla) i `alt`.
 *  Da dodaš rad: dodaj novi objekat u niz. Ništa drugo nije potrebno.
 *
 *  `placeholder: true` označava privremene stock fotografije
 *  (Unsplash licenca). Zameni ih svojim radovima pre objave.
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

export const filterOptions: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "Svi radovi" },
  { id: "blackwork", label: categoryLabels.blackwork },
  { id: "realizam", label: categoryLabels.realizam },
  { id: "fine-line", label: categoryLabels["fine-line"] },
  { id: "traditional", label: categoryLabels.traditional },
  { id: "ornamental", label: categoryLabels.ornamental },
];

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  src: string;
  width: number;
  height: number;
  alt: string;
  placeholder?: boolean;
}

export const works: Work[] = [
  {
    id: "kanji",
    title: "Tri znaka",
    category: "blackwork",
    src: "/images/rad-kanji.jpg",
    width: 768,
    height: 1024,
    alt: "Crna kanji tetovaža u tri reda na listu noge",
  },
  {
    id: "lav",
    title: "Lav",
    category: "realizam",
    src: "/images/rad-lav.jpg",
    width: 1400,
    height: 2100,
    alt: "Realistična crno-siva tetovaža lava na podlaktici",
    placeholder: true,
  },
  {
    id: "crna-geometrija",
    title: "Crna geometrija",
    category: "blackwork",
    src: "/images/rad-plemenski-ledja.jpg",
    width: 1400,
    height: 1960,
    alt: "Blackwork tetovaža sa gustim crnim geometrijskim šarama preko leđa",
    placeholder: true,
  },
  {
    id: "sveta-geometrija",
    title: "Sveta geometrija",
    category: "fine-line",
    src: "/images/rad-geometrija.jpg",
    width: 1400,
    height: 1867,
    alt: "Fine line tetovaža sa geometrijskim simbolima na podlaktici",
    placeholder: true,
  },
  {
    id: "stara-skola",
    title: "Stara škola",
    category: "traditional",
    src: "/images/rad-lobanja.jpg",
    width: 1400,
    height: 937,
    alt: "Traditional tetovaža lobanje i boce na ruci",
    placeholder: true,
  },
  {
    id: "mandala",
    title: "Mandala",
    category: "ornamental",
    src: "/images/rad-mandala.jpg",
    width: 1400,
    height: 1964,
    alt: "Ornamentalna tetovaža mandale na podlaktici",
    placeholder: true,
  },
  {
    id: "pali-andjeo",
    title: "Pali anđeo",
    category: "realizam",
    src: "/images/rad-andjeo.jpg",
    width: 1400,
    height: 2099,
    alt: "Realistična tetovaža anđela sa krilima preko leđa",
    placeholder: true,
  },
  {
    id: "cvet-i-tacke",
    title: "Cvet i tačkice",
    category: "blackwork",
    src: "/images/rad-cvece-vrat.jpg",
    width: 1400,
    height: 1750,
    alt: "Blackwork i dotwork tetovaža cveta na vratu",
    placeholder: true,
  },
  {
    id: "linija-cveta",
    title: "Linija cveta",
    category: "fine-line",
    src: "/images/rad-fine-cvece.jpg",
    width: 1400,
    height: 2099,
    alt: "Fine line cvetna tetovaža tankih linija na podlaktici",
    placeholder: true,
  },
  {
    id: "boje-stare-skole",
    title: "Boje stare škole",
    category: "traditional",
    src: "/images/rad-noga.jpg",
    width: 1400,
    height: 1400,
    alt: "Traditional tetovaže ruža i lasta u zasićenim bojama",
    placeholder: true,
  },
  {
    id: "pogled",
    title: "Pogled",
    category: "realizam",
    src: "/images/rad-oko.jpg",
    width: 1400,
    height: 1867,
    alt: "Realistična crno-bela tetovaža oka",
    placeholder: true,
  },
  {
    id: "vegvisir",
    title: "Vegvisir",
    category: "ornamental",
    src: "/images/rad-grudi.jpg",
    width: 1400,
    height: 2040,
    alt: "Ornamentalna tetovaža kompasa na grudima i ramenu u boji",
    placeholder: true,
  },
  {
    id: "oci",
    title: "Oči",
    category: "blackwork",
    src: "/images/rad-oci-ruka.jpg",
    width: 1400,
    height: 1867,
    alt: "Blackwork tetovaža sa motivom očiju na podlaktici",
    placeholder: true,
  },
  {
    id: "portret",
    title: "Portret u ornamentu",
    category: "realizam",
    src: "/images/rad-portret.jpg",
    width: 1400,
    height: 787,
    alt: "Realistična tetovaža ženskog portreta sa ornamentalnim detaljima na nadlaktici",
    placeholder: true,
  },
];
