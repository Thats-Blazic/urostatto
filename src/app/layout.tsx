import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Preloader } from "@/components/ui/Preloader";
import { contact, siteConfig } from "@/config/site";

// "latin-ext" je obavezan za srpsku latinicu (č, ć, š, ž, đ).
const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = `${siteConfig.name} | Tattoo Artist`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "/",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Strukturirani podaci za pretraživače — samo podaci koji su stvarno uneti.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  ...(contact.phone ? { telephone: contact.phone } : {}),
  ...(contact.address
    ? { address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "RS" } }
    : {}),
  ...(contact.instagramUrl ? { sameAs: [contact.instagramUrl] } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr-Latn"
      className={`${oswald.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <a
          href="#glavni-sadrzaj"
          className="fixed left-4 top-4 z-[80] -translate-y-24 bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-transform focus:translate-y-0"
        >
          Preskoči na sadržaj
        </a>
        {/* Ako je JavaScript isključen, loader se sakriva da ne blokira sajt. */}
        <noscript>
          <style>{"#preloader{display:none!important}"}</style>
        </noscript>
        <Providers>
          <Preloader />
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
