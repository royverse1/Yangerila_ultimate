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
  
  // Smooth, slow-moving abstract gradients and edge lighting
  useGSAP(() => {
    // Edge lights breathing (Lowered opacity to blend better)
    gsap.to(".edge-light", {
      opacity: 0.3,
      scale: 1.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Abstract flowing blobs (Added more dynamic movement)
    gsap.to(".blob-1", {
      xPercent: 25,
      yPercent: 35,
      rotation: 45,
      scale: 1.4,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".blob-2", {
      xPercent: -30,
      yPercent: -25,
      rotation: -30,
      scale: 1.3,
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Change background edge light colors based on scroll
    gsap.to(".bg-color-cycle", {
      filter: "hue-rotate(360deg)",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
  }, { scope: bgRef });

  return (
    <div ref={bgRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050B0B]">
      
      <div className="bg-color-cycle absolute inset-0 w-full h-full">
        {/* Edge Lighting Top & Bottom - Lower base opacity and reduced blur for perf */}
        <div className="edge-light absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-teal-500/10 to-transparent blur-3xl opacity-20"></div>
        <div className="edge-light absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-fuchsia-600/10 to-transparent blur-3xl opacity-20"></div>
        
        {/* Edge Lighting Left & Right */}
        <div className="edge-light absolute top-0 left-0 w-[20vw] h-full bg-gradient-to-r from-emerald-500/10 to-transparent blur-3xl opacity-20"></div>
        <div className="edge-light absolute top-0 right-0 w-[20vw] h-full bg-gradient-to-l from-purple-500/10 to-transparent blur-3xl opacity-20"></div>

        {/* Abstract floating blobs, reduced scale and blur to improve Framerate */}
        <div className="blob-1 absolute top-[10%] left-[20%] w-[25vw] h-[25vw] md:w-[20vw] md:h-[20vw] rounded-full bg-teal-400/20 blur-3xl opacity-30"></div>
        <div className="blob-2 absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] md:w-[30vw] md:h-[30vw] rounded-full bg-fuchsia-500/20 blur-3xl opacity-20"></div>
      </div>
      
      {/* Noise overlay for texture, removed mix-blend for perf */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative w-full overflow-x-hidden bg-[#050B0B] selection:bg-neon-mint selection:text-pitch-black font-sans">
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
