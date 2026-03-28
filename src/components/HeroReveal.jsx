import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const HeroReveal = React.memo(function HeroReveal({ step, onComplete, isReversing }) {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const textRef = useRef(null);
  const letterYRef = useRef(null);
  const paragraphRef = useRef(null);

  const aboutRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);

  const isActive = step >= 0 && step <= 2;

  const text1 = "Yangerila Creative Studio is a guitar-specialty academy based in Indirapuram. We offer carefully designed courses that cover multiple aspects of guitar playing — from foundational skills to advanced performance.";
  const text2 = "Our online classes are redefining the way guitar is taught, combining live interactive sessions, structured courses, and constant teacher support to make learning engaging and effective.";
  const text3 = "At Yangerila, we believe music is more than just a talent — it’s a life skill that everyone can and should learn. With this vision, we are proud to serve students across India as well as Indian students in 12+ countries worldwide.";

  useGSAP(() => {
    if (step > 2) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
      gsap.set([textRef.current, paragraphRef.current, maskRef.current, aboutRef.current], { autoAlpha: 0, delay: 0.4 });
      return;
    }

    if (isReversing && step === 2) {
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", onComplete });
      gsap.set(maskRef.current, { autoAlpha: 0, scale: 180 });
      gsap.set(letterYRef.current, { opacity: 0 });
      gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50 });

      gsap.set(aboutRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(p1Ref.current, { text: text1 });
      gsap.set(p2Ref.current, { text: text2 });
      gsap.set(p3Ref.current, { text: text3 });
      return;
    }

    if (step === 0) {
      if (isReversing) {
        gsap.to(maskRef.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.inOut" });
        gsap.to(letterYRef.current, { opacity: 1, duration: 0.6 });
        gsap.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60, duration: 0.6, onComplete });
      } else {
        gsap.set(maskRef.current, { scale: 1, autoAlpha: 1 });
        gsap.set(letterYRef.current, { opacity: 1 });
        gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60 });
        gsap.set(aboutRef.current, { autoAlpha: 0, y: 50 });
        onComplete();
      }
    }

    if (step === 1) {
      if (isReversing) {
        gsap.to(aboutRef.current, { autoAlpha: 0, y: 50, duration: 0.6 });
        gsap.to([textRef.current, paragraphRef.current], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', onComplete });
      } else {
        const tl = gsap.timeline({ onComplete });
        tl.to(maskRef.current, { scale: 180, transformOrigin: '50% 40%', ease: 'power3.inOut', duration: 1.2, force3D: true })
          .to(letterYRef.current, { opacity: 0, duration: 0.3 }, "<0.4")
          .to(textRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
          .to(paragraphRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.5");
      }
    }

    if (step === 2 && !isReversing) {
      const tl = gsap.timeline({ onComplete });
      tl.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50, duration: 0.6, ease: 'power3.inOut' });
      tl.to(aboutRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.2");

      gsap.set([p1Ref.current, p2Ref.current, p3Ref.current], { text: "" });
      tl.to(p1Ref.current, { text: text1, duration: 1.2, ease: "none" })
        .to(p2Ref.current, { text: text2, duration: 1.2, ease: "none" })
        .to(p3Ref.current, { text: text3, duration: 1.2, ease: "none" });
    }

  }, { scope: containerRef, dependencies: [step, isReversing] });

  return (
    <section
      ref={containerRef}
      className={`fixed inset-0 w-full h-screen z-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-[#041a1a] to-pitch-black overflow-hidden flex items-center justify-center ${step > 2 ? 'pointer-events-none' : ''}`}
    >
      <div
        ref={textRef}
        className="z-0 absolute inset-0 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto invisible translate-y-10"
      >
        <span className="text-neon-mint tracking-[0.3em] text-xs md:text-sm font-bold uppercase mb-8 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)] block">
          Yangerila Creative Studio
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase leading-tight drop-shadow-2xl">
          Always Performance <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570] drop-shadow-[0_0_30px_rgba(46,211,162,0.5)]">Ready</span>
        </h1>

        <p
          ref={paragraphRef}
          className="mt-8 text-neutral-300 max-w-2xl mx-auto text-lg md:text-xl font-light text-serif-italic shadow-black drop-shadow-lg invisible translate-y-10"
        >
          A guitar-specialty academy bridging clinical precision and artistic mastery. Serving students nationwide and across 12 countries.
        </p>
      </div>

      <div ref={aboutRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center invisible translate-y-10 px-6 md:px-12 bg-[#081010]/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('./noise.svg')] opacity-[0.03]"></div>
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-12 items-start relative z-10">
          <div className="md:w-1/3 border-t-2 border-neon-mint pt-6">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2">About</h2>
            <h3 className="text-2xl md:text-3xl text-neon-mint font-light text-serif-italic">Yangerila.</h3>
          </div>

          <div className="md:w-2/3 border-t border-white/20 pt-6 flex flex-col gap-6">
            <p ref={p1Ref} className="text-neutral-300 font-light text-lg md:text-xl leading-relaxed font-serif min-h-[80px]"></p>
            <p ref={p2Ref} className="text-neutral-300 font-light text-lg md:text-xl leading-relaxed font-serif min-h-[80px]"></p>
            <p ref={p3Ref} className="text-neutral-300 font-light text-lg md:text-xl leading-relaxed font-serif min-h-[80px]"></p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <svg ref={maskRef} viewBox="0 0 100 100" className="w-[15vw] md:w-[8vw] h-auto overflow-visible will-change-transform">
          <path d="M-2000,-2000 L2100,-2000 L2100,2100 L-2000,2100 Z M20,10 L45,50 L45,90 L55,90 L55,50 L80,10 L65,10 L50,35 L35,10 Z" fill="#050505" fillRule="evenodd" />
          <path ref={letterYRef} d="M20,10 L45,50 L45,90 L55,90 L55,50 L80,10 L65,10 L50,35 L35,10 Z" fill="transparent" stroke="#2ed3a2" strokeWidth="0.5" className="drop-shadow-[0_0_10px_rgba(46,211,162,1)]" />
        </svg>
      </div>
    </section>
  );
});

export default HeroReveal;