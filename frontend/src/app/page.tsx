import Hero from "@/src/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import HowItWorks from "@/components/HowItWorks";
import InteractivePreview from "@/components/InteractivePreview";
import AITeam from "@/components/AITeam";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function Home(){
  return(
    <>
    <Navbar />
      <Hero/>
      <TrustedBy />
      <HowItWorks />
      <AITeam />
      <InteractivePreview />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <section className="bg-[#050816] py-20 px-6">
      </section>
    </>
  );
}