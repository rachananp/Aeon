import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import GenomeSection from "@/components/sections/GenomeSection";
import CirculatorySection from "@/components/sections/CirculatorySection";
import ConsoleSection from "@/components/sections/ConsoleSection";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <GenomeSection />
        <CirculatorySection />
        <ConsoleSection />
      </main>
      <Footer />
    </>
  );
}
