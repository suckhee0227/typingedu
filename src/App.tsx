import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingWidget from "./components/layout/FloatingWidget";
import EventPopup from "./components/layout/EventPopup";
import HeroSection from "./components/sections/HeroSection";
import ExpertiseSection from "./components/sections/ExpertiseSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import ProcessSection from "./components/sections/ProcessSection";
import PricingSection from "./components/sections/PricingSection";
import ContactSection from "./components/sections/ContactSection";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <ExpertiseSection />
        <PortfolioSection />
        <ProcessSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWidget />
      <EventPopup />
    </div>
  );
}
