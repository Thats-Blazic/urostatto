import type { WorkCategory } from "./works";

/**
 * ============================================================
 *  STILOVI TETOVAŽA
 *  `galleryFilter`: klik na karticu otvara galeriju filtriranu na taj stil.
 *  Ako je `null` (Custom Design), klik vodi na formular za zakazivanje
 *  sa unapred izabranim stilom.
 *  `className`: raspored kartice (širina/visina) na velikim ekranima.
 * ============================================================
 */

export interface TattooStyle {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  galleryFilter: WorkCategory | null;
  className: string;
}

export const tattooStyles: TattooStyle[] = [
  {
    id: "blackwork",
    name: "Blackwork",
    description: "Snažne crne površine, oštar kontrast i čist grafički izraz. Za one koji žele da se vidi.",
    image: "/images/stil-blackwork.jpg",
    imageAlt: "Blackwork tetovaža sa crnim geometrijskim šarama",
    galleryFilter: "blackwork",
    className: "lg:col-span-7 lg:h-[42rem]",
  },
  {
    id: "realizam",
    name: "Realizam",
    description: "Portreti, životinje i detalji koji izgledaju kao fotografija — sa dubinom, senkom i životom.",
    image: "/images/rad-oko.jpg",
    imageAlt: "Realistična tetovaža oka",
    galleryFilter: "realizam",
    className: "lg:col-span-5 lg:mt-24 lg:h-[34rem]",
  },
  {
    id: "fine-line",
    name: "Fine Line",
    description: "Tanke, precizne linije i suptilni detalji. Elegantno, nežno i vanvremenski.",
    image: "/images/stil-fine-line.jpg",
    imageAlt: "Fine line tetovaža sa tankim linijama",
    galleryFilter: "fine-line",
    className: "lg:col-span-4 lg:h-[30rem]",
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Debele konture, zasićene boje i simboli koji decenijama ostaju čitki i snažni.",
    image: "/images/stil-traditional.jpg",
    imageAlt: "Traditional tetovaža lobanje u boji",
    galleryFilter: "traditional",
    className: "lg:col-span-4 lg:mt-14 lg:h-[38rem]",
  },
  {
    id: "ornamental",
    name: "Ornamental",
    description: "Mandale, geometrija i ukrasni obrasci koji prate liniju tela kao nakit.",
    image: "/images/stil-ornamental.jpg",
    imageAlt: "Ornamentalna tetovaža na grudima",
    galleryFilter: "ornamental",
    className: "lg:col-span-4 lg:mt-5 lg:h-[34rem]",
  },
  {
    id: "custom",
    name: "Custom Design",
    description: "Ideja koja ne postoji nigde drugde. Crtamo je zajedno — od prve skice do poslednje linije.",
    image: "/images/studio-umetnost.jpg",
    imageAlt: "Umetnička knjiga i skice u studiju",
    galleryFilter: null,
    className: "lg:col-span-12 lg:h-[26rem]",
  },
];
