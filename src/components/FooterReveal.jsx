import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const FooterReveal = React.memo(function FooterReveal({ step }) {
  const containerRef = useRef(null);
  const revealSectionRef = useRef(null);
  const revealPathRef = useRef(null);

  const funFactRef = useRef(null);
  const voicesRef = useRef(null);
  const tickerRow1Ref = useRef(null);
  const tickerRow2Ref = useRef(null);

  const tl1 = useRef(null);
  const tl2 = useRef(null);

  const [activeCardId, setActiveCardId] = useState(null);

  const testimonials = [
    { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
    { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
    { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
    { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
    { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
  ];

  const handleArrowClick = useCallback((tlRef, direction) => {
    if (!tlRef.current) return;
    const currentTotal = tlRef.current.totalTime();
    gsap.to(tlRef.current, { totalTime: currentTotal + (direction * 4), duration: 0.5, ease: "power2.out" });
  }, []);

  useGSAP(() => {
    function startTickers() {
      if (!tl1.current && tickerRow1Ref.current) {
        tl1.current = gsap.to(tickerRow1Ref.current, { xPercent: -50, repeat: -1, duration: 40, ease: 'none' });
      }
      if (!tl2.current && tickerRow2Ref.current) {
        gsap.set(tickerRow2Ref.current, { xPercent: -50 });
        tl2.current = gsap.to(tickerRow2Ref.current, { xPercent: 0, repeat: -1, duration: 45, ease: 'none' });
      }
      tl1.current?.play(); tl2.current?.play();
    }

    if (step === 10) {
      const elements = funFactRef.current?.querySelectorAll('.fun-fact-el');
      gsap.fromTo(elements, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }

    if (step === 11) {
      const header = voicesRef.current?.querySelector('.voices-header');
      const rows = voicesRef.current?.querySelector('.voices-rows');
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(header, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(rows, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      startTickers();
    }

    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');
      gsap.fromTo(revealPathRef.current,
        { attr: { d: "M 0 1 V 1 Q 0.5 1 1 1 V 1 z" } },
        {
          attr: { d: "M 0 1 V 0 Q 0.5 0 1 0 V 1 z" }, ease: "power2.inOut", duration: 1.0, delay: 0.2,
          onComplete: () => {
            gsap.fromTo(content, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
          }
        }
      );
    }
  }, { scope: containerRef, dependencies: [step] });

  const renderTestimonialRow = (ref, isRow1, rowId, tlRef) => {
    const hasActiveCard = activeCardId && activeCardId.startsWith(`${rowId}-`);

    return (
      <div
        className={`w-full relative py-3 md:py-8 group ${hasActiveCard ? 'z-50' : 'z-10'}`}
        onMouseEnter={() => tlRef.current?.pause()}
        onMouseLeave={() => tlRef.current?.play()}
      >
        <button
          onClick={() => handleArrowClick(tlRef, isRow1 ? -1 : 1)}
          className="absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-ink-dark p-1 md:p-3 rounded-full shadow-lg border border-ink-dark/10 backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="w-full flex whitespace-nowrap overflow-visible">
          <div ref={ref} className="flex gap-3 md:gap-6 items-center px-4 w-max text-left">
            {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => {
              const cardId = `${rowId}-${idx}`;
              const isActive = activeCardId === cardId;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveCardId(isActive ? null : cardId)}
                  // Tightly scaled dimensions for Mobile
                  className={`relative bg-white/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-[1.25rem] md:rounded-[2.5rem] w-[240px] sm:w-[320px] md:w-[380px] lg:w-[420px] whitespace-normal shrink-0 transition-all duration-500 overflow-visible cursor-pointer ${isActive
                      ? "scale-105 md:scale-110 z-50 border-2 border-accent-teal shadow-[0_0_20px_rgba(13,148,136,0.3)]"
                      : "scale-100 z-10 border border-white/80 premium-glow"
                    }`}
                >
                  <p className="text-ink-dark text-[11px] sm:text-sm md:text-lg font-medium text-serif-italic mb-3 md:mb-6 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-pastel-blue text-ink-dark flex items-center justify-center font-black text-[9px] md:text-sm border-2 border-white shrink-0">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-dark tracking-wide text-[10px] md:text-base leading-tight">{t.name}</h4>
                      <p className="text-[7px] md:text-[10px] text-accent-teal uppercase tracking-[0.15em] mt-[2px] font-bold opacity-90">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => handleArrowClick(tlRef, isRow1 ? 1 : -1)}
          className="absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-ink-dark p-1 md:p-3 rounded-full shadow-lg border border-ink-dark/10 backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 pointer-events-auto">

      {/* SECTION 10: Fun Fact */}
      <div ref={funFactRef} className="w-full h-[100dvh] flex flex-col items-center justify-center text-center bg-transparent relative px-4 sm:px-6 md:px-12 shrink-0">
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

      {/* SECTION 11: Voices */}
      <div ref={voicesRef} className="w-full h-[100dvh] overflow-hidden flex flex-col justify-center bg-transparent relative py-10 lg:py-16 px-0 shrink-0 border-t border-white/20">
        <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-2 md:mb-8 invisible">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-ink-dark uppercase tracking-tight leading-none">
            Voices of <br /><span className="text-serif-italic font-light text-accent-teal lowercase">excellence</span>
          </h2>
          <p className="text-ink-medium mt-2 md:mt-4 max-w-xl text-[10px] sm:text-xs md:text-sm lg:text-base font-medium">“Click arrows to navigate. Click a card to focus.”</p>
        </div>

        <div className="voices-rows shrink-0 w-full flex flex-col justify-center gap-0 overflow-visible relative pointer-events-auto invisible">
          {renderTestimonialRow(tickerRow1Ref, true, 1, tl1)}
          {renderTestimonialRow(tickerRow2Ref, false, 2, tl2)}
        </div>
      </div>

      {/* SECTION 12: Reveal & Contact */}
      <section ref={revealSectionRef} className="reveal-section w-full h-[100dvh] relative overflow-hidden bg-cover bg-center shrink-0">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <clipPath id="curve-reveal-presentation" clipPathUnits="objectBoundingBox">
              <path ref={revealPathRef} d="M 0 1 V 0 Q 0.5 1 1 0 V 1 z" />
            </clipPath>
          </defs>
        </svg>

        <div className="w-full h-full flex flex-col justify-center relative bg-linear-to-br from-pastel-mint via-white to-pastel-blue" style={{
          clipPath: "url(#curve-reveal-presentation)",
          WebkitClipPath: "url(#curve-reveal-presentation)"
        }}>
          <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 reveal-content-inner invisible">
            <div className="flex-1 text-center lg:text-left text-ink-dark w-full">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 md:mb-6">Ready to Start?</h2>
              <p className="text-base md:text-xl font-medium mb-8 md:mb-12 text-ink-medium">Enroll today and begin your premium guitar journey.</p>
              <div className="flex flex-col gap-4 items-center lg:items-start">
                <a href="tel:+918076530550" className="flex items-center gap-3 hover:text-accent-teal transition-colors tracking-widest uppercase font-bold text-xs md:text-sm"><Phone size={16} /> +91 8076 530 550</a>
                <a href="mailto:care@yangerila.com" className="flex items-center gap-3 hover:text-accent-teal transition-colors tracking-widest uppercase font-bold text-xs md:text-sm"><Mail size={16} /> care@yangerila.com</a>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-md bg-white/85 backdrop-blur-md border border-white premium-glow relative">
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