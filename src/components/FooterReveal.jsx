import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
  { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
  { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
  { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
  { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
];

const FooterReveal = React.memo(function FooterReveal({ step, isReversing }) {
  const containerRef = useRef(null);
  const revealSectionRef = useRef(null);

  const funFactRef = useRef(null);
  const voicesRef = useRef(null);
  const carouselContainerRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNav = useCallback((direction) => {
    setActiveIndex((prev) => (prev + direction + testimonials.length) % testimonials.length);
  }, []);

  // Center the active card in scroll view
  useEffect(() => {
    if (carouselContainerRef.current) {
      const activeCard = carouselContainerRef.current.children[activeIndex];
      if (activeCard) {
        const containerWidth = carouselContainerRef.current.clientWidth;
        const cardOffset = activeCard.offsetLeft;
        const cardWidth = activeCard.clientWidth;

        carouselContainerRef.current.scrollTo({
          left: cardOffset - (containerWidth / 2) + (cardWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  // Auto-Carousel Loop (Pauses on Hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNav(1);
    }, 4000); // Rotates every 4 seconds
    return () => clearInterval(interval);
  }, [handleNav, isHovered]);

  // Entrance/Exit Animations
  useGSAP(() => {
    if (step === 10) {
      const elements = funFactRef.current?.querySelectorAll('.fun-fact-el');
      if (isReversing) {
        gsap.set(elements, { autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(elements, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.2 });
      }
    }

    if (step === 11) {
      const header = voicesRef.current?.querySelector('.voices-header');
      const carousel = voicesRef.current?.querySelector('.voices-carousel');
      if (isReversing) {
        gsap.set([header, carousel], { autoAlpha: 1, y: 0 });
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(header, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .fromTo(carousel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      }
    }

    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');

      if (isReversing) {
        // Immediate static state for reverse, no jumping
        gsap.set(revealSectionRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(content, { autoAlpha: 1, y: 0 });
      } else {
        // SVG clip path removed. This pure CSS polygon animation is 100x smoother and stops double jumps.
        gsap.fromTo(revealSectionRef.current,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power3.inOut",
            duration: 1.0,
            delay: 0.2,
            onComplete: () => {
              gsap.fromTo(content, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
            }
          }
        );
      }
    }
  }, { scope: containerRef, dependencies: [step, isReversing] });

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 pointer-events-auto">

      {/* SECTION 10: Fun Fact */}
      <div ref={funFactRef} className="w-full h-dvh flex flex-col items-center justify-center text-center bg-transparent relative px-4 sm:px-6 md:px-12 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
          <h2 className="fun-fact-el text-accent-teal tracking-[0.3em] font-bold text-[10px] md:text-sm uppercase mb-8 md:mb-12 invisible">Fun Fact</h2>
          <p className="fun-fact-el text-2xl sm:text-4xl md:text-6xl text-ink-dark font-medium text-serif-italic mb-8 md:mb-12 leading-relaxed invisible px-2">
            "Fender published a study stating that about 90% of guitar students quit playing within their first year."
          </p>
          <div className="fun-fact-el w-full h-px bg-ink-dark/10 my-8 md:my-12 relative overflow-hidden max-w-5xl invisible">
            <div className="absolute inset-y-0 left-0 bg-accent-teal w-1/3"></div>
          </div>
          <h3 className="fun-fact-el text-2xl sm:text-4xl md:text-6xl text-ink-dark font-black uppercase tracking-tighter invisible">
            At Yangerila, more than <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-magenta to-accent-teal">90% don't quit.</span>
          </h3>
          <p className="fun-fact-el text-sm sm:text-base md:text-xl text-ink-medium font-medium mt-6 md:mt-8 invisible max-w-2xl px-4">This opposite statistic fills us with both happiness and confidence in our teaching methods.</p>
        </div>
      </div>

      {/* SECTION 11: Standard Apple Carousel with Auto-Play */}
      <div ref={voicesRef} className="w-full h-dvh overflow-hidden flex flex-col justify-center bg-transparent relative py-10 lg:py-16 px-0 shrink-0 border-t border-ink-dark/10">
        <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-6 md:mb-16 items-center text-center invisible">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-ink-dark uppercase tracking-tight leading-none mb-4 md:mb-6">
            Voices of <span className="text-serif-italic font-light text-accent-teal lowercase">excellence</span>
          </h2>
          <p className="text-ink-medium text-sm md:text-lg font-medium max-w-md">Click arrows to navigate or a card to focus.</p>
        </div>

        {/* Carousel Container (pauses autoplay when hovered) */}
        <div
          className="voices-carousel w-full relative invisible pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          <button onClick={() => handleNav(-1)} className="absolute left-3 md:left-10 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full border border-ink-dark/10 bg-white/90 backdrop-blur-md shadow-lg text-ink-dark transition-all duration-300 hover:scale-110 active:scale-95">
            <ChevronLeft size={24} />
          </button>

          <div ref={carouselContainerRef} className="w-full flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[20vw] md:px-[35vw] py-12 items-center">
            {testimonials.map((t, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`snap-center shrink-0 w-[60vw] md:w-[400px] xl:w-[450px] relative rounded-[1.5rem] md:rounded-4xl transition-all duration-700 ease-out border overflow-hidden cursor-pointer
                    ${isActive
                      ? "scale-105 z-20 bg-white shadow-[0_25px_60px_rgba(13,148,136,0.1)] opacity-100 border-white"
                      : "scale-90 z-10 bg-white/40 backdrop-blur-md opacity-40 border-white/40 hover:opacity-70 hover:scale-95"
                    }`}
                >
                  <div className={`expanded-glow absolute inset-0 autoAlpha-0 pointer-events-none transition-all duration-700 ${isActive ? 'autoAlpha-100' : ''}`} style={{ opacity: isActive ? 1 : 0 }}>
                    <div className="absolute inset-[-60px] animate-[pulse_3s_ease-in-out_infinite]" style={{ boxShadow: `0 0 60px 15px rgba(13, 148, 136, 0.15)` }}></div>
                  </div>

                  <div className="p-6 sm:p-8 xl:p-10 relative z-10 h-full flex flex-col justify-between">
                    <p className={`text-ink-dark font-medium text-serif-italic transition-all duration-700 ${isActive ? 'text-sm md:text-xl leading-relaxed mb-6 md:mb-10' : 'text-xs md:text-sm leading-snug mb-4'}`}>"{t.text}"</p>

                    <div className="w-full flex items-center gap-3 md:gap-5 pt-3 md:pt-6 border-t border-ink-dark/10">
                      <div className={`rounded-full flex items-center justify-center font-black border-2 border-white text-ink-dark transition-all duration-700 ${isActive ? 'w-12 h-12 md:w-16 md:h-16 text-sm md:text-lg bg-pastel-blue shadow-lg' : 'w-8 h-8 md:w-10 md:h-10 text-xs bg-ink-dark/10'}`}>
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className={`font-bold text-ink-dark leading-tight transition-all duration-700 ${isActive ? 'text-xs md:text-lg' : 'text-[10px] md:text-xs'}`}>{t.name}</h4>
                        <p className={`uppercase tracking-[0.15em] mt-1 font-black transition-all duration-700 ${isActive ? 'text-accent-teal text-[9px] md:text-[10px]' : 'text-accent-teal/60 text-[7px] md:text-[8px]'}`}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => handleNav(1)} className="absolute right-3 md:right-10 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full border border-ink-dark/10 bg-white/90 backdrop-blur-md shadow-lg text-ink-dark transition-all duration-300 hover:scale-110 active:scale-95">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* SECTION 12: Reveal & Contact (Pure CSS Clip Path prevents the SVG double jump glitch) */}
      <section ref={revealSectionRef} className="reveal-section w-full h-dvh relative overflow-hidden bg-cover bg-center shrink-0" style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}>
        <div className="w-full h-full flex flex-col justify-center relative bg-linear-to-br from-pastel-mint via-white to-pastel-blue">
          <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 reveal-content-inner invisible">
            <div className="flex-1 text-center lg:text-left text-ink-dark w-full">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 md:mb-6">Ready to Start?</h2>
              <p className="text-sm md:text-lg xl:text-xl font-medium mb-8 md:mb-12 text-ink-medium">Enroll today and begin your premium guitar journey.</p>
              <div className="flex flex-col gap-4 items-center lg:items-start">
                <a href="tel:+918076530550" className="flex items-center gap-3 hover:text-accent-teal transition-colors tracking-widest uppercase font-bold text-xs md:text-sm"><Phone size={16} /> +91 8076 530 550</a>
                <a href="mailto:care@yangerila.com" className="flex items-center gap-3 hover:text-accent-teal transition-colors tracking-widest uppercase font-bold text-xs md:text-sm"><Mail size={16} /> care@yangerila.com</a>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="p-6 md:p-10 xl:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-md bg-white/85 backdrop-blur-xl border border-white premium-glow relative shadow-[0_15px_50px_rgba(0,0,0,0.05)]">
                <h3 className="text-xl md:text-2xl font-black uppercase text-ink-dark tracking-widest mb-1">Waitlist</h3>
                <p className="text-[10px] md:text-xs text-accent-teal uppercase tracking-widest font-black mb-6 md:mb-8">Secure your slot</p>
                <form className="flex flex-col gap-3 md:gap-4">
                  <input type="text" placeholder="FULL NAME" className="bg-white/50 border border-ink-dark/10 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark focus:outline-none focus:border-accent-teal transition-colors" />
                  <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/50 border border-ink-dark/10 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark focus:outline-none focus:border-accent-teal transition-colors" />
                  <button type="button" className="bg-linear-to-r from-accent-teal to-[#2563EB] text-white font-black p-4 md:p-5 w-full rounded-xl shadow-md hover:shadow-xl transition-all uppercase tracking-widest text-[10px] md:text-sm">Request Admission</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
});

export default FooterReveal;