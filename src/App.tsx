import { useEffect } from "react";
import Lenis from "lenis";
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
  // 부드러운 관성 스크롤 (lusion 스타일). prefers-reduced-motion이면 건너뜀.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    // 다른 컴포넌트(데모 자동 스크롤 등)에서 쓰도록 전역 노출
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

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
