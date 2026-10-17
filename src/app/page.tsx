import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Styles } from "@/components/sections/Styles";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="glavni-sadrzaj">
        <Hero />
        <Marquee />
        <About />
        <Gallery />
        <Styles />
        <Booking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
