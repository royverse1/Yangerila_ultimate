import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Phone, Mail } from 'lucide-react';

const FooterReveal = React.memo(function FooterReveal({ step, onComplete, isReversing }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const revealSectionRef = useRef(null);
  const revealPathRef = useRef(null);

  const funFactRef = useRef(null);
  const voicesRef = useRef(null);
  const tickerRow1Ref = useRef(null);
  const tickerRow2Ref = useRef(null);
  const tickerRow3Ref = useRef(null);

  // Timers to allow play/pause on hover
  const tl1 = useRef(null);
  const tl2 = useRef(null);
  const tl3 = useRef(null);

  const testimonials = [
    { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
    { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
    { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
    { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
    { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
  ];

  const isActive = step >= 10 && step <= 12;

  useGSAP(() => {
    // 1. EXIT SCENARIO
    if (step < 10) {
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
    }

    // Shared transition helper
    function onStepEntry(section, isReverseSnap) {
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      gsap.to(wrapperRef.current, {
        y: -section.offsetTop,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: isReverseSnap ? onComplete : undefined
      });
    }

    function startTickers() {
      if (!tl1.current && tickerRow1Ref.current) {
        tl1.current = gsap.to(tickerRow1Ref.current, { xPercent: -50, repeat: -1, duration: 35, ease: 'none' });
      }
      if (!tl2.current && tickerRow2Ref.current) {
        gsap.set(tickerRow2Ref.current, { xPercent: -50 });
        tl2.current = gsap.to(tickerRow2Ref.current, { xPercent: 0, repeat: -1, duration: 45, ease: 'none' });
      }
      if (!tl3.current && tickerRow3Ref.current) {
        tl3.current = gsap.to(tickerRow3Ref.current, { xPercent: -50, repeat: -1, duration: 32, ease: 'none' });
      }

      tl1.current?.play();
      tl2.current?.play();
      tl3.current?.play();
    }

    // 2. STEP LOGIC

    // Step 10: Fun Fact
    if (step === 10) {
      const elements = funFactRef.current?.querySelectorAll('.fun-fact-el');
      if (isReversing) {
        onStepEntry(funFactRef.current, true);
        gsap.set(elements, { autoAlpha: 1, y: 0 });
      } else {
        onStepEntry(funFactRef.current, false);
        gsap.to(elements, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", onComplete });
      }
    }

    // Step 11: Voices (Testimonials)
    if (step === 11) {
      const header = voicesRef.current?.querySelector('.voices-header');
      const rows = voicesRef.current?.querySelector('.voices-rows');

      if (isReversing) {
        onStepEntry(voicesRef.current, true);
        gsap.set(header, { autoAlpha: 1, y: 0 });
        gsap.set(rows, { autoAlpha: 1, y: 0 });
        startTickers();
      } else {
        onStepEntry(voicesRef.current, false);
        const tl = gsap.timeline({ onComplete });
        tl.to(header, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
        tl.to(rows, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
        startTickers();
      }
    }

    // Step 12: Final Reveal (Contact)
    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');

      if (isReversing) {
        onStepEntry(revealSectionRef.current, true);
      } else {
        gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8 });
        gsap.to(wrapperRef.current, { y: -revealSectionRef.current.offsetTop, duration: 0.8, ease: "power3.inOut" });

        // Curved reveal animation
        gsap.to(revealPathRef.current, {
          attr: { d: "M 0 1 V 0 Q 0.5 0 1 0 V 1 z" },
          ease: "power2.inOut",
          duration: 1.0,
          onComplete: () => {
            // Unlock only AFTER the curve has finished and content starts showing
            gsap.to(content, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              onComplete // FINAL UNLOCK
            });
          }
        });
      }
    }

  }, { scope: containerRef, dependencies: [step, isReversing] });

  // Interactive Card Click Logic (Scale & Glow)
  const handleCardClick = (e) => {
    const card = e.currentTarget;
    const isScale = card.classList.contains('scale-110');

    // Close all other cards first
    document.querySelectorAll('.testimonial-card').forEach(c => {
      c.classList.remove('scale-110', 'shadow-[0_0_30px_rgba(46,211,162,0.6)]', 'z-50', 'border-neon-mint');
      c.classList.add('border-white/10');
    });

    // If it wasn't already scaled, scale it up
    if (!isScale) {
      card.classList.add('scale-110', 'shadow-[0_0_30px_rgba(46,211,162,0.6)]', 'z-50', 'border-neon-mint');
      card.classList.remove('border-white/10');
    }
  };

  const renderTestimonialRow = (ref) => (
    // Tightly packed rows: py-1 on PC keeps them almost touching
    <div className="w-full flex whitespace-nowrap overflow-visible relative py-1 md:py-2">
      <div ref={ref} className="flex gap-3 md:gap-4 items-center px-4 w-max text-left">
        {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
          <div
            key={idx}
            onClick={handleCardClick}
            // Scaled down the box width to 320px/340px and reduced padding to p-5/p-6
            className="testimonial-card relative bg-gradient-to-br from-[#0c1821] to-[#040a0f] p-5 lg:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 w-[65vw] md:w-[320px] lg:w-[340px] whitespace-normal flex-shrink-0 transition-all duration-500 overflow-visible group cursor-pointer"
          >
            {/* Shrunk text so it fits properly without expanding the box height */}
            <p className="text-white text-sm md:text-base font-light text-serif-italic mb-4 md:mb-5 leading-relaxed italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neon-mint/20 text-neon-mint flex items-center justify-center font-black text-[10px] md:text-xs border border-neon-mint/30 shrink-0">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-bold text-white tracking-wide text-xs md:text-sm">{t.name}</h4>
                <p className="text-[8px] md:text-[9px] text-neon-mint uppercase tracking-[0.15em] mt-0.5 font-bold opacity-80">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-screen z-10 bg-pitch-black overflow-hidden invisible ${!isActive ? 'pointer-events-none' : ''}`}
    >

      <div ref={wrapperRef} className="w-full h-fit relative will-change-transform">

        {/* SECTION 10: Fun Fact */}
        <div ref={funFactRef} className="w-full h-screen flex flex-col items-center justify-center text-center bg-pitch-black bg-[linear-gradient(to_bottom,#0d2a1c,var(--color-pitch-black))] relative px-6 md:px-12 border-t border-emerald-900/50">
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
            <h2 className="fun-fact-el text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)] invisible translate-y-10">Fun Fact</h2>
            <p className="fun-fact-el text-4xl md:text-6xl text-white font-light text-serif-italic mb-12 leading-relaxed drop-shadow-xl invisible translate-y-10">
              "Fender published a study stating that about 90% of guitar students quit playing within their first year."
            </p>
            <div className="fun-fact-el w-full h-[1px] bg-white/10 my-12 relative overflow-hidden max-w-5xl invisible translate-y-10">
              <div className="absolute inset-y-0 left-0 bg-neon-mint w-1/3 blur-md shadow-[0_0_20px_#2ed3a2]"></div>
            </div>
            <h3 className="fun-fact-el text-4xl md:text-6xl text-white font-black uppercase tracking-tighter drop-shadow-2xl invisible translate-y-10">
              At Yangerila, more than <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570]">90% don't quit.</span>
            </h3>
            <p className="fun-fact-el text-xl text-neutral-300 font-light mt-8 invisible translate-y-10">This opposite statistic fills us with both happiness and confidence in our teaching methods.</p>
          </div>
        </div>

        {/* SECTION 11: Voices */}
        <div ref={voicesRef} className="w-full h-screen overflow-hidden flex flex-col justify-between bg-pitch-black bg-[linear-gradient(to_bottom,#08273d,var(--color-pitch-black))] border-t border-blue-900/50 relative py-10 lg:py-16 px-0">

          {/* Dynamic Flex Header: Takes only the space it needs */}
          <div className="voices-header shrink-0 flex flex-col px-6 md:px-12 xl:px-24 invisible translate-y-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Voices of <br /><span className="text-serif-italic font-light text-neon-mint lowercase">excellence</span>
            </h2>
            <p className="text-neutral-300 mt-3 md:mt-4 max-w-xl text-xs md:text-sm lg:text-base opacity-80">
              “Out of hundreds of testimonials over the years, we’ve handpicked a few.”
            </p>
          </div>

          {/* Dynamic Flex Rows: Takes the remaining space centered without clipping */}
          <div
            className="voices-rows flex-1 w-full flex flex-col justify-center gap-0 md:gap-1 overflow-visible relative pointer-events-auto mt-4 md:mt-8 invisible translate-y-10"
            onMouseEnter={() => { tl1.current?.pause(); tl2.current?.pause(); tl3.current?.pause(); }}
            onMouseLeave={() => { tl1.current?.play(); tl2.current?.play(); tl3.current?.play(); }}
          >
            {renderTestimonialRow(tickerRow1Ref)}
            {renderTestimonialRow(tickerRow2Ref)}
            {renderTestimonialRow(tickerRow3Ref)}
          </div>
        </div>

        {/* SECTION 12: Reveal & Contact */}
        <section ref={revealSectionRef} className="reveal-section w-full h-screen relative overflow-hidden bg-cover bg-center">
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <clipPath id="curve-reveal-presentation" clipPathUnits="objectBoundingBox">
                <path ref={revealPathRef} d="M 0 1 V 0 Q 0.5 1 1 0 V 1 z" />
              </clipPath>
            </defs>
          </svg>

          <div className="w-full h-full flex flex-col justify-center md:bg-fixed relative" style={{
            backgroundImage: "url('contact_bg.png')",
            clipPath: "url(#curve-reveal-presentation)",
            WebkitClipPath: "url(#curve-reveal-presentation)",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <div className="relative z-10 w-full section-padding max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 reveal-content-inner invisible translate-y-10">
              <div className="flex-1 text-center lg:text-left text-white">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">Ready to Start?</h2>
                <p className="text-xl font-light mb-12">Enroll today and begin your premium guitar journey.</p>
                <div className="flex flex-col gap-4">
                  <a href="tel:+918076530550" className="flex items-center gap-4 hover:text-neon-mint transition-colors tracking-widest uppercase font-bold text-sm"><Phone size={18} /> +91 8076 530 550</a>
                  <a href="mailto:care@yangerila.com" className="flex items-center gap-4 hover:text-neon-mint transition-colors tracking-widest uppercase font-bold text-sm"><Mail size={18} /> care@yangerila.com</a>
                </div>
              </div>

              <div className="flex-1 w-full flex justify-center lg:justify-end">
                <div className="p-8 md:p-12 rounded-[3rem] w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative">
                  <h3 className="text-2xl font-black uppercase text-white tracking-widest mb-1">Waitlist</h3>
                  <p className="text-xs text-neon-mint uppercase tracking-widest font-black mb-8">Secure your slot</p>
                  <form className="flex flex-col gap-4">
                    <input type="text" placeholder="FULL NAME" className="bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neon-mint" />
                    <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/10 border border-white/40 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neon-mint" />
                    <button type="button" className="liquid-glass bg-white/10 text-white border border-white/20 font-black p-5 w-full rounded-xl hover:bg-neon-mint hover:text-pitch-black transition-all">Request Admission</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export default FooterReveal;