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

  // 5-Second Auto-Carousel
  useEffect(() => {
    if (step !== 11 || isHovered || userPaused) return;
    const interval = setInterval(() => {
      handleNav(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [step, isHovered, userPaused, handleNav]);

  // Keyboard Arrow Navigation
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

  // High-Efficiency Navy to Pink Moving Gradients (Zero CSS Filters)
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

  // Strict Hardware Pausing - Zero drain on device battery when offscreen
  useEffect(() => {
    if (step === 11) {
      bokehTweens.current.forEach(t => t.play());
    } else {
      bokehTweens.current.forEach(t => t.pause());
    }
  }, [step]);

  // GSAP Step Animations
  useGSAP(() => {
    // P1.3 — read at hook-fire time
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

      {/* SECTION 11: Cinematic Carousel */}
      <div ref={voicesRef} className="w-full h-dvh overflow-hidden flex flex-col justify-center bg-transparent relative py-10 lg:py-16 px-0 shrink-0 border-t border-ink-dark/10">

        {/* HIGH PERFORMANCE BOKEH: Deep Navy Base with Moving Pure CSS Radial Gradients */}
        <div className="carousel-bg-container absolute inset-0 -z-20 overflow-hidden invisible pointer-events-none">
          <div className="absolute inset-0 bg-[#020617]"></div>

          {/* Deep Navy Blue Gradient Wash */}
          <div ref={el => bokehRefs.current[0] = el} className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.5)_0%,transparent_65%)] rounded-full will-change-transform"></div>

          {/* Soft Pink Gradient Wash */}
          <div ref={el => bokehRefs.current[1] = el} className="absolute bottom-[-20%] right-[-10%] w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.3)_0%,transparent_65%)] rounded-full will-change-transform"></div>
        </div>

        {/* Header - White text for dark background */}
        <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-8 md:mb-12 items-center text-center invisible">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-3 md:mb-5">
            Voices of <span className="text-serif-italic font-light text-accent-teal lowercase">excellence</span>
          </h2>
          <div className="flex items-center gap-4 text-white/60 text-xs md:text-sm font-medium">
            <p>Use arrows or click to navigate.</p>
            {/* Play/Pause Button - Removed Unnecessary Blur */}
            <button
              onClick={() => setUserPaused(!userPaused)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 hover:bg-white hover:text-ink-dark transition-colors text-white"
            >
              {userPaused ? <Play size={12} /> : <Pause size={12} />}
              <span className="uppercase tracking-widest text-[9px] font-bold">{userPaused ? "Paused" : "Auto"}</span>
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          className="voices-carousel w-full h-[400px] sm:h-[500px] md:h-[600px] relative invisible pointer-events-auto flex items-center justify-center px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow - Removed Unnecessary Blur, made lighter */}
          <button onClick={() => { setUserPaused(true); handleNav(-1); }} className="absolute left-2 sm:left-6 md:left-12 z-40 p-3 md:p-4 rounded-full border border-white/30 bg-white/20 shadow-sm text-white transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark">
            <ChevronLeft size={24} />
          </button>

          {/* Cards Container */}
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
                      // LIQUID GLASS BLUR: Highly blurred, semi-transparent frosted card that reveals the navy/pink gradient behind it.
                      ? "bg-white/60 backdrop-blur-3xl border-white/60 shadow-[0_0_80px_20px_rgba(13,148,136,0.3)]"
                      // INACTIVE: Clean simple glass
                      : "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                    }`}
                  style={styles}
                >
                  {/* Clean text formatting that adapts to the card's active state */}
                  <div className="p-8 sm:p-10 md:p-16 relative z-10 h-full flex flex-col justify-between select-none">
                    <p className={`font-medium text-serif-italic leading-relaxed transition-colors duration-700 ${isActive ? 'text-ink-dark text-lg sm:text-xl md:text-3xl' : 'text-white text-sm sm:text-base md:text-xl'}`}>
                      "{t.text}"
                    </p>

                    <div className={`w-full flex items-center gap-4 pt-5 md:pt-8 border-t transition-colors duration-700 ${isActive ? 'border-ink-dark/10' : 'border-white/20'}`}>
                      <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-black border-2 transition-colors duration-700 ${isActive ? 'border-white text-ink-dark bg-pastel-blue shadow-md' : 'border-white/40 text-white bg-white/10'}`}>
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col text-left justify-center overflow-hidden">
                        <h4 className={`font-bold leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-ink-dark text-base md:text-xl' : 'text-white text-sm md:text-base'}`}>{t.name}</h4>
                        <p className={`uppercase tracking-[0.15em] mt-1.5 font-black leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-accent-teal text-[10px] md:text-xs' : 'text-white/50 text-[8px] md:text-[10px]'}`}>{t.role}</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Right Arrow - Removed Unnecessary Blur */}
          <button onClick={() => { setUserPaused(true); handleNav(1); }} className="absolute right-2 sm:right-6 md:right-12 z-40 p-3 md:p-4 rounded-full border border-white/30 bg-white/20 shadow-sm text-white transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark">
            <ChevronRight size={24} />
          </button>
        </div>

      </div>

      {/* SECTION 12: Reveal & Contact */}
      <section ref={revealSectionRef} className="reveal-section w-full h-dvh relative overflow-hidden shrink-0" style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}>
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
              <div className="p-6 md:p-10 xl:p-12 rounded-[2rem] md:rounded-[3rem] w-full max-w-md bg-white/85 backdrop-blur-xl border border-white relative shadow-[0_15px_50px_rgba(0,0,0,0.05)]">
                <h3 className="text-xl md:text-2xl font-black uppercase text-ink-dark tracking-widest mb-1">Waitlist</h3>
                <p className="text-[10px] md:text-xs text-accent-teal uppercase tracking-widest font-black mb-6 md:mb-8">Secure your slot</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
                  <input required type="text" placeholder="FULL NAME" className="bg-white/50 border border-ink-dark/10 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark focus:outline-none focus:border-accent-teal transition-colors" />
                  <input required type="email" placeholder="EMAIL ADDRESS" className="bg-white/50 border border-ink-dark/10 rounded-xl p-3 md:p-4 text-xs md:text-sm text-ink-dark focus:outline-none focus:border-accent-teal transition-colors" />
                  <button type="submit" className="bg-linear-to-r from-accent-teal to-[#2563EB] text-white font-black p-4 md:p-5 w-full rounded-xl shadow-md hover:shadow-xl transition-all uppercase tracking-widest text-[10px] md:text-sm">
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