/**
 * ============================================================
 *  UTISCI KLIJENATA
 *  Ovo su PLACEHOLDER tekstovi — nisu prave recenzije.
 *  Kada dobiješ autentične utiske, zameni `text`, `author`, `detail`
 *  i obriši `placeholder: true` (oznaka „Primer" nestaje sama).
 * ============================================================
 */

export interface Testimonial {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  author: string;
  detail: string;
  placeholder?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "utisak-1",
    rating: 5,
    text: "Ovde ide autentičan utisak klijenta o iskustvu u studiju — o razgovoru pre tetovaže, o dizajnu i o tome kako se osećao tokom izrade.",
    author: "Ime klijenta",
    detail: "Stil tetovaže",
    placeholder: true,
  },
  {
    id: "utisak-2",
    rating: 5,
    text: "Zameni ovaj tekst pravim komentarom. Dovoljno je dve do tri rečenice — kratko, iskreno i u klijentovim rečima.",
    author: "Ime klijenta",
    detail: "Stil tetovaže",
    placeholder: true,
  },
  {
    id: "utisak-3",
    rating: 5,
    text: "Prostor za treći utisak klijenta. Kada prikupiš prave recenzije, upiši ih ovde i oznaka „Primer\" će nestati.",
    author: "Ime klijenta",
    detail: "Stil tetovaže",
    placeholder: true,
  },
];
