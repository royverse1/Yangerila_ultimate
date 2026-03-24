import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function HeroReveal() {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const textRef = useRef(null);
  const letterYRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        if (nextSection) {
          gsap.to(window, {
            scrollTo: nextSection.offsetTop,
            duration: 1.5,
            ease: "power4.inOut"
          });
        }
      }
    });

    // Scale the 'Y' mask hole up massively
    tl.to(maskRef.current, {
      scale: 150,
      transformOrigin: '50% 40%',
      ease: 'expo.inOut',
      duration: 1.8
    })
    // Also fade out the Y border/fill
    .to(letterYRef.current, {
      opacity: 0,
      duration: 0.6
    }, "<0.8")
    // Fade in text behind it
    .fromTo(textRef.current, {
      opacity: 0,
      scale: 0.85,
      y: 60
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, "-=1.0");

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top -50px',
      end: '+=100%',
      pin: true,
      onEnter: () => {
        if (tl.progress() === 0) tl.play();
      },
      onLeaveBack: () => {
        tl.reverse();
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen w-full relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-[#041a1a] to-pitch-black overflow-hidden flex items-center justify-center">
      
      {/* Brand Mantra Content (Hidden behind the mask at first) */}
      <div 
        ref={textRef} 
        className="z-0 absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto"
      >
        <span className="text-neon-mint tracking-[0.3em] text-xs md:text-sm font-bold uppercase mb-8 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">
          Yangerila Creative Studio
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase leading-tight drop-shadow-2xl">
          Always Performance <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570] drop-shadow-[0_0_30px_rgba(46,211,162,0.5)]">Ready</span>
        </h1>
        <p className="mt-8 text-neutral-300 max-w-2xl mx-auto text-lg md:text-xl font-light text-serif-italic shadow-black drop-shadow-lg">
          A guitar-specialty academy bridging clinical precision and artistic mastery. Serving students nationwide and across 12 countries.
        </p>
      </div>

      {/* The Mask Layer: Deep Pitch Black with a transparent 'Y' hole */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <svg ref={maskRef} viewBox="0 0 100 100" className="w-[15vw] md:w-[8vw] h-auto overflow-visible">
           {/* 
             A compound vector path using fillRule="evenodd". 
             The outer rectangle is massive, and the inner Y shape punches a perfectly sharp hole.
             Because there is no <mask/> and no transform caching, it scales infinitely sharp and lightning fast. 
           */}
           <path 
             d="M-2000,-2000 L2100,-2000 L2100,2100 L-2000,2100 Z M20,10 L45,50 L45,90 L55,90 L55,50 L80,10 L65,10 L50,35 L35,10 Z" 
             fill="#050505" 
             fillRule="evenodd" 
           />
           {/* Glow around the initial Y before it scales */}
           <path ref={letterYRef} d="M20,10 L45,50 L45,90 L55,90 L55,50 L80,10 L65,10 L50,35 L35,10 Z" fill="transparent" stroke="#2ed3a2" strokeWidth="0.5" className="drop-shadow-[0_0_10px_rgba(46,211,162,1)]" />
        </svg>
      </div>

    </section>
  );
}
