import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Showreel } from "@/components/sections/Showreel";
import { Styles } from "@/components/sections/Styles";
import { Testimonials } from "@/components/sections/Testimonials";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="glavni-sadrzaj">
        <Hero />
        <Marquee />
        <About />
        <Gallery />
        <Showreel />
        <Styles />
        <Booking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
