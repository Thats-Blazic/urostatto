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
  /** Pravi domen — koristi se za Open Graph, kanonski link, robots i sitemap. Može se pregaziti preko NEXT_PUBLIC_SITE_URL. */
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) || "https://www.djurdjevictatto.com").replace(/\/+$/, ""),
} as const;

/**
 * KONTAKT PODACI
 * Namerno su prazni — ne izmišljamo podatke. Popuni ih ovde ili preko
 * environment promenljivih (vidi .env.example). Dok su prazni, odgovarajuća
 * dugmad na sajtu su onemogućena i prikazuje se „Uskoro".
 */
const contactInput = {
  /** Instagram korisničko ime (npr. "djurdjevic.tattoo") ili pun link do profila. */
  instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM) || "djurdjevic_tattoo",
  /** Broj telefona u međunarodnom formatu (npr. "+381 60 000 0000"). */
  phone: clean(process.env.NEXT_PUBLIC_PHONE) || "+381 61 414 6811",
  /** Pun naziv adrese (ulica, broj, grad). Koristi se i za Google Maps navigaciju. */
  address: clean(process.env.NEXT_PUBLIC_ADDRESS) || "Obrenovac 11500",
};

/**
 * RADNO VREME
 * Upiši vreme kao tekst (npr. "10:00 – 18:00" ili "Zatvoreno").
 * Dok su sva polja prazna, prikazuje se poruka da radno vreme uskoro stiže.
 */
export const workingHours: { days: string; hours: string }[] = [
  { days: "Svaki dan", hours: "08:00 – 21:00" },
];

const instagramHandle = contactInput.instagram
  .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
  .replace(/^@/, "")
  .replace(/[/?#].*$/, "");

const phoneDigits = contactInput.phone.replace(/[^\d+]/g, "");

/** Međunarodni broj samo cifre (npr. 381614146811) — za WhatsApp/Viber/SMS linkove. */
const messagingDigits = (() => {
  const digits = phoneDigits.replace(/\+/g, "");
  if (digits.length < 6) return null;
  if (phoneDigits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `381${digits.slice(1)}`;
  return digits;
})();

export const contact = {
  /** Broj za poruke (samo cifre, bez +), ili null ako telefon nije podešen. */
  messagingNumber: messagingDigits,
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

/** Kredit za dizajn sajta — prikazuje se u footeru. */
export const designCredit = {
  name: "Ghost Force Studio",
  url: "https://www.instagram.com/ghostforcedesign/",
} as const;

export const bookingCta = { label: "ZAKAŽI TERMIN", id: "zakazivanje" } as const;
