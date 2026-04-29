import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Phone, Mail, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const testimonials = [
  { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
  { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
  { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
  { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
  { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
];

const FooterReveal = React.memo(function FooterReveal({ step, isReversingRef }) {
  const containerRef = useRef(null);
  const revealSectionRef = useRef(null);

  const funFactRef = useRef(null);
  const voicesRef = useRef(null);
  const carouselContainerRef = useRef(null);

  const bokehRefs = useRef([]);
  const bokehTweens = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  }, []);

  const handleNav = useCallback((direction) => {
    setActiveIndex((prev) => (prev + direction + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (step !== 11 || isHovered || userPaused) return;
    const interval = setInterval(() => {
      handleNav(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [step, isHovered, userPaused, handleNav]);

  useEffect(() => {
    if (step !== 11) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setUserPaused(true);
        handleNav(-1);
      }
      if (e.key === 'ArrowRight') {
        setUserPaused(true);
        handleNav(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleNav]);

  const initBokeh = useCallback(() => {
    bokehRefs.current.forEach((orb) => {
      if (!orb) return;
      const tween = gsap.to(orb, {
        x: "random(-15vw, 15vw)",
        y: "random(-10vh, 10vh)",
        scale: "random(0.9, 1.2)",
        duration: "random(12, 20)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true
      });
      bokehTweens.current.push(tween);
    });
  }, []);

  useEffect(() => {
    initBokeh();
    return () => {
      bokehTweens.current.forEach(t => t.kill());
      bokehTweens.current = [];
    };
  }, [initBokeh]);

  useEffect(() => {
    if (step === 11) {
      bokehTweens.current.forEach(t => t.play());
    } else {
      bokehTweens.current.forEach(t => t.pause());
    }
  }, [step]);

  useGSAP(() => {
    const isReversing = isReversingRef.current;

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
      const background = voicesRef.current?.querySelector('.carousel-bg-container');

      if (isReversing) {
        gsap.set([header, carousel, background], { autoAlpha: 1, y: 0 });
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(background, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" })
          .fromTo(header, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(carousel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      }
    }

    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');

      if (isReversing) {
        gsap.set(revealSectionRef.current, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(content, { autoAlpha: 1, y: 0 });
      } else {
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
  }, { scope: containerRef, dependencies: [step] });

  const getCardStyle = (idx) => {
    const total = testimonials.length;
    let offset = (idx - activeIndex) % total;

    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const isActive = offset === 0;
    const isVisible = Math.abs(offset) <= 2;

    const translateX = offset * 105;
    const scale = isActive ? 1 : 0.85;
    const opacity = isActive ? 1 : (Math.abs(offset) === 1 ? 0.35 : 0);
    const zIndex = 10 - Math.abs(offset);

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      visibility: isVisible ? 'visible' : 'hidden',
    };
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 pointer-events-auto border-t-[3px] border-ink-dark/10">

      {/* SECTION 10: Fun Fact */}
      <div ref={funFactRef} className="w-full h-dvh flex flex-col items-center justify-center text-center bg-transparent relative px-4 sm:px-6 md:px-12 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
          <h2 className="fun-fact-el text-accent-teal font-[family:var(--font-technical-sans)] tracking-[0.3em] font-black text-[10px] md:text-sm uppercase mb-8 md:mb-12 invisible">Fun Fact</h2>
          <p className="fun-fact-el text-2xl sm:text-4xl md:text-6xl text-ink-dark font-medium text-serif-italic mb-8 md:mb-12 leading-relaxed invisible px-2">
            "Fender published a study stating that about 90% of guitar students quit playing within their first year."
          </p>
          <div className="fun-fact-el w-full h-px bg-ink-dark/20 my-8 md:my-12 relative overflow-hidden max-w-5xl invisible">
            <div className="absolute inset-y-0 left-0 bg-accent-teal w-1/3"></div>
          </div>
          <h3 className="fun-fact-el text-2xl sm:text-4xl md:text-6xl font-[family:var(--font-technical-sans)] text-ink-dark font-black uppercase tracking-tighter invisible">
            At Yangerila, more than <br className="md:hidden" /> <span className="text-accent-magenta">90% don't quit.</span>
          </h3>
          <p className="fun-fact-el text-sm sm:text-base md:text-xl text-ink-dark/80 font-medium font-[family:var(--font-elegant-serif)] mt-6 md:mt-8 invisible max-w-2xl px-4">This opposite statistic fills us with both happiness and confidence in our teaching methods.</p>
        </div>
      </div>

      {/* SECTION 11: Cinematic Carousel */}
      <div ref={voicesRef} className="w-full h-dvh overflow-hidden flex flex-col justify-center bg-transparent relative py-10 lg:py-16 px-0 shrink-0 border-t-[3px] border-ink-dark/10">

        <div className="carousel-bg-container absolute inset-0 -z-20 overflow-hidden invisible pointer-events-none">
          <div className="absolute inset-0 bg-ink-dark"></div>
          {/* Vintage Amber Wash */}
          <div ref={el => bokehRefs.current[0] = el} className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_center,rgba(225,155,45,0.4)_0%,transparent_65%)] rounded-full will-change-transform"></div>
          {/* Seafoam Green Wash */}
          <div ref={el => bokehRefs.current[1] = el} className="absolute bottom-[-20%] right-[-10%] w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] bg-[radial-gradient(circle_at_center,rgba(147,233,190,0.3)_0%,transparent_65%)] rounded-full will-change-transform"></div>
        </div>

        <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-8 md:mb-12 items-center text-center invisible">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black font-[family:var(--font-technical-sans)] text-paper-bg uppercase tracking-tight leading-none mb-3 md:mb-5">
            Voices of <span className="text-serif-italic font-medium text-pastel-mint lowercase">excellence</span>
          </h2>
          <div className="flex items-center gap-4 text-paper-bg/80 text-xs md:text-sm font-black font-[family:var(--font-technical-sans)]">
            <p>Use arrows or click to navigate.</p>
            <button
              onClick={() => setUserPaused(!userPaused)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-white/30 hover:bg-white hover:text-ink-dark hover:border-white transition-colors text-white"
            >
              {userPaused ? <Play size={12} /> : <Pause size={12} />}
              <span className="uppercase tracking-widest text-[9px] font-black">{userPaused ? "Paused" : "Auto"}</span>
            </button>
          </div>
        </div>

        <div
          className="voices-carousel w-full h-[400px] sm:h-[500px] md:h-[600px] relative invisible pointer-events-auto flex items-center justify-center px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button onClick={() => { setUserPaused(true); handleNav(-1); }} className="absolute left-2 sm:left-6 md:left-12 z-40 p-3 md:p-4 rounded-full border-2 border-white/30 text-white transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark hover:border-white">
            <ChevronLeft size={24} />
          </button>

          <div ref={carouselContainerRef} className="relative w-full max-w-[85vw] sm:max-w-[450px] md:max-w-[600px] xl:max-w-[800px] h-[80%] flex justify-center items-center">
            {testimonials.map((t, idx) => {
              const isActive = activeIndex === idx;
              const styles = getCardStyle(idx);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setUserPaused(true);
                    if (activeIndex !== idx) setActiveIndex(idx);
                  }}
                  className={`absolute top-0 left-0 w-full h-full rounded-[1.5rem] md:rounded-4xl ease-[cubic-bezier(0.25,1,0.5,1)] transition-[transform,opacity,background-color,backdrop-filter] duration-[800ms] border cursor-pointer will-change-[transform,opacity]
                    ${isActive
                      ? "bg-paper-bg border-4 border-ink-dark shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                      : "bg-paper-bg border-2 border-ink-dark/40 hover:bg-white shadow-md"
                    }`}
                  style={styles}
                >
                  <div className="p-8 sm:p-10 md:p-16 relative z-10 h-full flex flex-col justify-between select-none">
                    <p className={`font-medium font-[family:var(--font-elegant-serif)] italic leading-relaxed transition-colors duration-700 ${isActive ? 'text-ink-dark text-lg sm:text-xl md:text-3xl' : 'text-ink-medium/80 text-sm sm:text-base md:text-xl'}`}>
                      "{t.text}"
                    </p>

                    <div className={`w-full flex items-center gap-4 pt-5 md:pt-8 border-t-[2px] transition-colors duration-700 ${isActive ? 'border-ink-dark/20' : 'border-ink-dark/10'}`}>
                      <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-[family:var(--font-technical-sans)] font-black border-[3px] transition-colors duration-700 ${isActive ? 'border-accent-teal text-white bg-accent-teal shadow-md' : 'border-ink-dark/20 text-ink-dark bg-white'}`}>
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col text-left justify-center overflow-hidden">
                        <h4 className={`font-black font-[family:var(--font-technical-sans)] leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-ink-dark text-base md:text-xl' : 'text-ink-medium text-sm md:text-base'}`}>{t.name}</h4>
                        <p className={`uppercase font-[family:var(--font-technical-sans)] tracking-[0.15em] mt-1.5 font-black leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-accent-teal text-[10px] md:text-xs' : 'text-ink-medium/50 text-[8px] md:text-[10px]'}`}>{t.role}</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <button onClick={() => { setUserPaused(true); handleNav(1); }} className="absolute right-2 sm:right-6 md:right-12 z-40 p-3 md:p-4 rounded-full border-2 border-white/30 text-white transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark hover:border-white">
            <ChevronRight size={24} />
          </button>
        </div>

      </div>

      {/* SECTION 12: Reveal & Contact */}
      <section ref={revealSectionRef} className="reveal-section w-full h-dvh relative overflow-hidden shrink-0 border-t-[3px] border-ink-dark" style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}>
        <div className="w-full h-full flex flex-col justify-center relative bg-linear-to-br from-pastel-blue via-paper-bg to-pastel-mint">
          <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 reveal-content-inner invisible">
            <div className="flex-1 text-center lg:text-left text-ink-dark w-full">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black font-[family:var(--font-technical-sans)] uppercase tracking-tight mb-4 md:mb-6">Ready to Start?</h2>
              <p className="text-sm md:text-lg xl:text-xl font-medium font-[family:var(--font-elegant-serif)] mb-8 md:mb-12 text-ink-dark/80">Enroll today and begin your premium guitar journey.</p>
              <div className="flex flex-col gap-4 items-center lg:items-start">
                <a href="tel:+918076530550" className="flex items-center gap-3 hover:text-accent-teal font-[family:var(--font-technical-sans)] transition-colors tracking-widest uppercase font-black text-xs md:text-sm"><Phone size={16} /> +91 8076 530 550</a>
                <a href="mailto:care@yangerila.com" className="flex items-center gap-3 hover:text-accent-teal font-[family:var(--font-technical-sans)] transition-colors tracking-widest uppercase font-black text-xs md:text-sm"><Mail size={16} /> care@yangerila.com</a>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="p-6 md:p-10 xl:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-md bg-paper-bg border-4 border-ink-dark relative shadow-[0_20px_50px_rgba(26,26,26,0.3)]">
                <h3 className="text-xl md:text-2xl font-[family:var(--font-technical-sans)] font-black uppercase text-ink-dark tracking-widest mb-1">Waitlist</h3>
                <p className="text-[10px] md:text-xs text-accent-teal uppercase tracking-widest font-black font-[family:var(--font-technical-sans)] mb-6 md:mb-8">Secure your slot</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
                  <input required type="text" placeholder="FULL NAME" className="bg-white border-2 border-ink-dark/20 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark font-black font-[family:var(--font-technical-sans)] focus:outline-none focus:border-accent-teal transition-colors shadow-sm placeholder:text-ink-dark/30" />
                  <input required type="email" placeholder="EMAIL ADDRESS" className="bg-white border-2 border-ink-dark/20 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark font-black font-[family:var(--font-technical-sans)] focus:outline-none focus:border-accent-teal transition-colors shadow-sm placeholder:text-ink-dark/30" />
                  <button type="submit" className="bg-accent-teal text-white font-[family:var(--font-technical-sans)] font-black p-4 md:p-5 w-full rounded-xl shadow-[0_10px_20px_rgba(58,90,140,0.4)] hover:shadow-xl border-2 border-transparent hover:border-accent-teal hover:bg-white hover:text-accent-teal transition-all uppercase tracking-widest text-[10px] md:text-sm">
                    {formStatus === 'success' ? 'Request Sent!' : 'Request Admission'}
                  </button>
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