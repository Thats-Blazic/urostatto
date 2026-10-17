/**
 * ============================================================
 *  UTISCI KLIJENATA
 *  `detail` je opciono (npr. stil tetovaže) — ako ga ne upišeš, ne prikazuje se.
 *  Za tekstove koji su tek primer postavi `placeholder: true`
 *  (pojaviće se oznaka „Primer" i napomena iznad kartica).
 * ============================================================
 */

export interface Testimonial {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  author: string;
  detail?: string;
  placeholder?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "utisak-1",
    rating: 5,
    text: "Prezadovoljan sam kako je tetovaža ispala! Sve je urađeno profesionalno, linije su perfektne, a atmosfera u studiju je vrhunska. Sve preporuke za svakoga ko želi kvalitetnu tetovažu.",
    author: "Vasilije",
  },
  {
    id: "utisak-2",
    rating: 5,
    text: "Od prve konsultacije do završetka tetovaže sve je bilo na nivou. Majstor je pažljivo saslušao moje ideje i pretvorio ih u dizajn bolji nego što sam zamišljala. Definitivno dolazim ponovo!",
    author: "Vanja",
  },
  {
    id: "utisak-3",
    rating: 5,
    text: "Odličan pristup, profesionalan rad i maksimalna posvećenost detaljima. Studio je čist i uredan, a rezultat je tačno ono što sam želeo. Ako tražite dobrog tattoo majstora, ovo je prava adresa!",
    author: "Ognjen",
  },
];
