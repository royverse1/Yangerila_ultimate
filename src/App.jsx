import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Header from './components/Header';
import HeroReveal from './components/HeroReveal';
import LegacyPanel from './components/LegacyPanel';
import MethodPanel from './components/MethodPanel';
import FAQSection from './components/FAQSection';
import FooterReveal from './components/FooterReveal';

gsap.registerPlugin(ScrollTrigger);

function BackgroundGradients() {
  const bgRef = useRef(null);
  
  // Faster, smoother, GPU-accelerated blobs
  useGSAP(() => {
    // Make force3D global to ensure all GSAP transforms use GPU matrix translation
    gsap.config({ force3D: true });

    // Abstract flowing blobs - Much faster now without heavy filters
    gsap.to(".blob-1", {
      xPercent: 50,
      yPercent: 40,
      rotation: 90,
      scale: 1.8,
      duration: 9.6, // 20% Faster
      repeat: -1,
      yoyo: true,
      ease: "power4.out" // More aggressive ease
    });

    gsap.to(".blob-2", {
      xPercent: -40,
      yPercent: -35,
      rotation: -60,
      scale: 1.5,
      duration: 11.2, // 20% Faster
      repeat: -1,
      yoyo: true,
      ease: "power4.out"
    });
  }, { scope: bgRef });

  return (
    <div ref={bgRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-pitch-black">
      
      <div className="absolute inset-0 w-full h-full will-change-transform">
        {/* Soft radial gradients completely replace expensive CSS blur-3xl */}
        <div className="blob-1 absolute top-[10%] left-[20%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] bg-[radial-gradient(circle_at_center,_rgba(46,211,162,0.15)_0%,_transparent_60%)] will-change-transform opacity-60" style={{ transform: 'translateZ(0)' }}></div>
        <div className="blob-2 absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(217,70,239,0.15)_0%,_transparent_60%)] will-change-transform opacity-60" style={{ transform: 'translateZ(0)' }}></div>
      </div>
      
      {/* Noise overlay hardware accelerated */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] will-change-transform" style={{ transform: 'translateZ(0)' }}></div>
    </div>
  );
}

export default function App() {
  useGSAP(() => {
    // Advanced Global Snapping Architecture
    ScrollTrigger.create({
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: ".snap-section",
        duration: { min: 0.2, max: 0.6 },
        delay: 0.05,
        ease: "power3.inOut"
      }
    });

    // Mobile specific layout recalibrations
    ScrollTrigger.refresh();
  });

  return (
    <div className="relative w-full overflow-x-hidden bg-pitch-black selection:bg-neon-mint selection:text-pitch-black font-sans">
      <BackgroundGradients />
      <Header />
      
      {/* The main content runs in a isolated z-10 index completely covering the base */}
      <main className="relative z-10 w-full">
        <HeroReveal />
        <LegacyPanel />
        <MethodPanel />
        <FAQSection />
        <FooterReveal />
      </main>
    </div>
  );
}
