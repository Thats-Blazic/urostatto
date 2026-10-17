/**
 * ============================================================
 *  GLAVNA PODEŠAVANJA SAJTA
 *  Ovde se menja naziv studija, kontakt podaci i radno vreme.
 * ============================================================
 */

const clean = (value: string | undefined) => (value ?? "").trim();

/** Naziv studija — menja se na jednom mestu, odmah važi svuda (navigacija, footer, SEO). */
export const siteConfig = {
  /** Prikazano u dva dela u logotipu: prvi deo bold, drugi deo lakši. */
  nameParts: ["DJURDJEVIC", "TATTOO"] as const,
  name: "DJURDJEVIC TATTOO",
  tagline: "Unikatne tetovaže, precizna izrada i dizajn prilagođen tvojoj priči.",
  description:
    "DJURDJEVIC TATTOO — tattoo umetnik i studio. Blackwork, realizam, fine line, traditional i ornamental tetovaže, uz potpuno individualan dizajn. Pogledaj radove i zakaži termin.",
  keywords: [
    "tattoo",
    "tetovaža",
    "tetovaže",
    "tattoo studio",
    "tattoo umetnik",
    "blackwork",
    "realizam tetovaža",
    "fine line tetovaža",
    "traditional tetovaža",
    "ornamental tetovaža",
    "custom tattoo",
    "zakazivanje tetovaže",
  ],
  /** Za Open Graph i kanonski link. Postavi pravi domen u NEXT_PUBLIC_SITE_URL pre objave. */
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
} as const;

/**
 * KONTAKT PODACI
 * Namerno su prazni — ne izmišljamo podatke. Popuni ih ovde ili preko
 * environment promenljivih (vidi .env.example). Dok su prazni, odgovarajuća
 * dugmad na sajtu su onemogućena i prikazuje se „Uskoro".
 */
const contactInput = {
  /** Instagram korisničko ime (npr. "djurdjevic.tattoo") ili pun link do profila. */
  instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM) || "",
  /** Broj telefona u međunarodnom formatu (npr. "+381 60 000 0000"). */
  phone: clean(process.env.NEXT_PUBLIC_PHONE) || "",
  /** Pun naziv adrese (ulica, broj, grad). Koristi se i za Google Maps navigaciju. */
  address: clean(process.env.NEXT_PUBLIC_ADDRESS) || "",
};

/**
 * RADNO VREME
 * Upiši vreme kao tekst (npr. "10:00 – 18:00" ili "Zatvoreno").
 * Dok su sva polja prazna, prikazuje se poruka da radno vreme uskoro stiže.
 */
export const workingHours: { days: string; hours: string }[] = [
  { days: "Ponedeljak – Petak", hours: "" },
  { days: "Subota", hours: "" },
  { days: "Nedelja", hours: "" },
];

const instagramHandle = contactInput.instagram
  .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
  .replace(/^@/, "")
  .replace(/[/?#].*$/, "");

const phoneDigits = contactInput.phone.replace(/[^\d+]/g, "");

export const contact = {
  instagramHandle: instagramHandle || null,
  instagramUrl: instagramHandle ? `https://www.instagram.com/${instagramHandle}/` : null,
  phone: contactInput.phone || null,
  telHref: phoneDigits.replace(/\+/g, "").length >= 6 ? `tel:${phoneDigits}` : null,
  address: contactInput.address || null,
  mapsUrl: contactInput.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInput.address)}`
    : null,
  hasHours: workingHours.some((row) => row.hours.trim().length > 0),
};

/** Linkovi u navigaciji i footeru. `id` mora da odgovara id-u sekcije. */
export const navLinks = [
  { label: "Početna", id: "pocetna" },
  { label: "O meni", id: "o-meni" },
  { label: "Radovi", id: "radovi" },
  { label: "Stilovi", id: "stilovi" },
  { label: "Kontakt", id: "kontakt" },
] as const;

export const bookingCta = { label: "ZAKAŽI TERMIN", id: "zakazivanje" } as const;
