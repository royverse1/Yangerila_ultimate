import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, ChevronLeft, ChevronRight, Pause, Play, MessageCircle, MapPin, Phone } from 'lucide-react';

import contactBg from '../assets/contact_bg.jpg';

const testimonials = [
  { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
  { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
  { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
  { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
  { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
];

const AnimatedHeading = ({ text, trigger, delayOffset = 0, className = "", charset = "uppercase" }) => {
  const charsRef = useRef([]);

  useEffect(() => {
    if (!trigger) return;

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    if (charset === "mixed") {
      letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    charsRef.current.forEach((charEl, i) => {
      if (!charEl) return;
      const orig = charEl.dataset.char;
      if (orig === ' ') return;

      gsap.killTweensOf(charEl);
      let obj = { value: 0 };

      gsap.fromTo(charEl,
        { rotationX: -90, autoAlpha: 0 },
        { rotationX: 0, autoAlpha: 1, duration: 0.8, ease: "back.out(2)", delay: delayOffset + (i * 0.04) }
      );

      gsap.to(obj, {
        value: 1,
        duration: 0.6 + (i * 0.04),
        delay: delayOffset,
        ease: "power2.inOut",
        onUpdate: () => {
          if (obj.value < 0.95) {
            charEl.innerText = letters[Math.floor(Math.random() * letters.length)];
          } else {
            charEl.innerText = orig;
          }
        },
        onComplete: () => { charEl.innerText = orig; }
      });
    });
  }, [trigger, delayOffset, charset]);

  return (
    <span className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
      {text.split('').map((char, cIdx) => {
        if (char === ' ') {
          return <span key={cIdx} className="inline-block w-[0.35em]">&nbsp;</span>;
        }
        return (
          <span key={cIdx} className="relative inline-block">
            <span className="invisible opacity-0">{char}</span>
            <span
              ref={el => charsRef.current[cIdx] = el}
              data-char={char}
              className="absolute top-0 left-0 inline-block transform-style-3d origin-bottom flex items-center justify-center w-full"
              style={{ opacity: 0, transform: 'rotateX(-90deg)' }}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
};

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
  const [headingTriggered, setHeadingTriggered] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setFormStatus('success');
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
        gsap.fromTo(revealSectionRef.current,
          { clipPath: "polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)" },
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            ease: "power3.inOut",
            duration: 1.0
          }
        );
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(background, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" })
          .fromTo(header, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(carousel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      }
    }

    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');

      gsap.set(content, { autoAlpha: 0, y: 50 });
      setHeadingTriggered(false);

      gsap.fromTo(revealSectionRef.current,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)",
          ease: "power3.inOut",
          duration: 1.0,
          onComplete: () => {
            gsap.to(content, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
            setHeadingTriggered(true);
          }
        }
      );
    } else {
      setHeadingTriggered(false);
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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Allura&family=Dancing+Script:wght@400..700&display=swap');
        .font-cursive { font-family: 'Dancing Script', 'Allura', cursive; }
      `}} />

      <div ref={containerRef} className="w-full flex flex-col shrink-0 pointer-events-auto">

        {/* SECTION 10: Fun Fact */}
        <div ref={funFactRef} className="w-full h-dvh flex flex-col items-center justify-center text-center bg-transparent relative px-4 sm:px-6 md:px-12 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
            <h2 className="fun-fact-el text-accent-teal font-technical-sans tracking-[0.3em] font-black text-[10px] md:text-sm uppercase mb-8 md:mb-12 invisible">Fun Fact</h2>
            <p className="fun-fact-el text-2xl sm:text-4xl md:text-6xl text-ink-dark font-medium text-serif-italic mb-8 md:mb-12 leading-relaxed invisible px-2">
              "Fender published a study stating that about 90% of guitar students quit playing within their first year."
            </p>
            <div className="fun-fact-el w-full h-px bg-ink-dark/20 my-8 md:my-12 relative overflow-hidden max-w-5xl invisible">
              <div className="absolute inset-y-0 left-0 bg-accent-teal w-1/3"></div>
            </div>
            <h3 className="fun-fact-el text-2xl sm:text-4xl md:text-6xl font-technical-sans text-ink-dark font-black uppercase tracking-tighter invisible">
              At Yangerila, more than <br className="md:hidden" /> <span className="text-accent-magenta">90% don't quit.</span>
            </h3>
            <p className="fun-fact-el text-sm sm:text-base md:text-xl text-ink-dark/80 font-medium font-elegant-serif mt-6 md:mt-8 invisible max-w-2xl px-4">This opposite statistic fills us with both happiness and confidence in our teaching methods.</p>
          </div>
        </div>

        <div className="relative w-full h-dvh shrink-0 -mt-px z-10">

          {/* SECTION 11: Cinematic Carousel */}
          <div ref={voicesRef} className="absolute inset-0 w-full h-dvh overflow-hidden flex flex-col justify-center bg-transparent py-10 lg:py-16 px-0">
            <div className="carousel-bg-container absolute inset-0 -z-20 overflow-hidden invisible pointer-events-none" style={{ background: 'linear-gradient(135deg, #4E3524 0%, #2D1B0E 50%, #1A0F0A 100%)' }}>
              <div ref={el => bokehRefs.current[0] = el} className="absolute top-[-20%] left-[-10%] w-screen h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_center,rgba(225,155,45,0.4)_0%,transparent_65%)] rounded-full will-change-transform"></div>
              <div ref={el => bokehRefs.current[1] = el} className="absolute bottom-[-20%] right-[-10%] w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] bg-[radial-gradient(circle_at_center,rgba(147,233,190,0.3)_0%,transparent_65%)] rounded-full will-change-transform"></div>
            </div>

            <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-8 md:mb-12 items-center text-center invisible">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black font-technical-sans text-white uppercase tracking-tight leading-none mb-3 md:mb-5 drop-shadow-md">
                Testimonials
              </h2>
              <div className="flex items-center gap-4 text-white/80 text-xs md:text-sm font-black font-technical-sans">
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
              <button onClick={() => { setUserPaused(true); handleNav(-1); }} className="absolute left-6 sm:left-12 md:left-24 lg:left-32 z-60 p-3 md:p-4 rounded-full border-2 border-white/40 text-white bg-ink-dark/30 backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark hover:border-white shadow-lg">
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
                      className={`absolute top-0 left-0 w-full h-full rounded-3xl md:rounded-4xl ease-[cubic-bezier(0.25,1,0.5,1)] transition-[transform,opacity,background-color,backdrop-filter] duration-800 border cursor-pointer will-change-[transform,opacity]
                        ${isActive
                          ? "bg-paper-bg border-4 border-ink-dark shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                          : "bg-paper-bg border-2 border-ink-dark/40 hover:bg-white shadow-md"
                        }`}
                      style={styles}
                    >
                      <div className="p-8 sm:p-10 md:p-16 relative z-10 h-full flex flex-col justify-between select-none">
                        <p className={`font-medium font-elegant-serif italic leading-relaxed transition-colors duration-700 ${isActive ? 'text-ink-dark text-lg sm:text-xl md:text-3xl' : 'text-ink-medium/80 text-sm sm:text-base md:text-xl'}`}>
                          "{t.text}"
                        </p>

                        <div className={`w-full flex items-center gap-4 pt-5 md:pt-8 border-t-2 transition-colors duration-700 ${isActive ? 'border-ink-dark/20' : 'border-ink-dark/10'}`}>
                          <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-technical-sans font-black border-[3px] transition-colors duration-700 ${isActive ? 'border-[#E19B2D] text-white bg-[#E19B2D] shadow-md' : 'border-ink-dark/20 text-ink-dark bg-white'}`}>
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex flex-col text-left justify-center overflow-hidden">
                            <h4 className={`font-black font-technical-sans leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-ink-dark text-base md:text-xl' : 'text-ink-medium text-sm md:text-base'}`}>{t.name}</h4>
                            <p className={`uppercase font-technical-sans tracking-[0.15em] mt-1.5 font-black leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-[#E19B2D] text-[10px] md:text-xs' : 'text-ink-medium/50 text-[8px] md:text-[10px]'}`}>{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => { setUserPaused(true); handleNav(1); }} className="absolute right-6 sm:right-12 md:right-24 lg:right-32 z-60 p-3 md:p-4 rounded-full border-2 border-white/40 text-white bg-ink-dark/30 backdrop-blur-md transition-transform duration-300 hover:scale-110 active:scale-95 hover:bg-white hover:text-ink-dark hover:border-white shadow-lg">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* SECTION 12: Reveal & Contact */}
          {/* FIX: bg-right md:bg-center keeps the guitar in view on mobile screens */}
          <section ref={revealSectionRef} className="reveal-section absolute inset-0 w-full h-dvh overflow-hidden z-50 bg-cover bg-right md:bg-center" style={{ backgroundImage: `url(${contactBg})`, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}>

            <div className="absolute inset-0 bg-black/40 mix-blend-overlay pointer-events-none"></div>

            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">

              <div className="w-full h-full px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-3 sm:gap-y-6 md:gap-y-12 lg:gap-x-16 reveal-content-inner invisible items-center content-center pt-8 pb-4 lg:py-0">

                {/* 1. Heading Block */}
                <div className="order-1 lg:col-start-1 lg:row-start-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full drop-shadow-sm shrink-0">
                  <div className="text-[8.5vw] sm:text-[3.2rem] md:text-[4rem] lg:text-[2.2rem] xl:text-[2.8rem] 2xl:text-[3.2rem] font-black font-technical-sans uppercase tracking-[0.05em] text-white leading-none whitespace-nowrap drop-shadow-lg">
                    <AnimatedHeading text="LET'S START YOUR" trigger={headingTriggered} />
                  </div>

                  <div className="text-[12.5vw] sm:text-[5rem] md:text-[6rem] lg:text-[3.5rem] xl:text-[4.2rem] 2xl:text-[5rem] text-[#E19B2D] mt-0 md:mt-2 font-normal tracking-wide leading-none font-cursive drop-shadow-[2px_4px_8px_rgba(0,0,0,0.5)] whitespace-nowrap">
                    <AnimatedHeading text="Guitar Journey" trigger={headingTriggered} delayOffset={0.3} charset="mixed" />
                  </div>

                  <p className="hidden lg:block text-base xl:text-lg font-medium font-elegant-serif mt-6 xl:mt-8 mb-2 text-white/90 max-w-[420px] leading-relaxed drop-shadow-sm">
                    Take the first step towards mastering the guitar today. Ready to take the next step? Fill out the waitlist form.
                  </p>
                </div>

                {/* 2. Waitlist Form */}
                <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 w-full flex justify-center lg:justify-end shrink-0 z-10">
                  <div className="w-full max-w-[95%] sm:max-w-md bg-white rounded-[1.5rem] md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">

                    {formStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E19B2D] text-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-[#E19B2D]/30">
                          <ChevronRight size={32} className="rotate-[-45deg] md:w-10 md:h-10" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black font-technical-sans text-ink-dark uppercase tracking-tight mb-2">Thank You!</h3>
                        <p className="text-ink-medium/80 font-elegant-serif italic text-sm md:text-lg leading-relaxed">Your enquiry has been<br />succesfully submitted</p>
                        <button
                          onClick={() => setFormStatus('idle')}
                          className="mt-6 md:mt-8 text-[#E19B2D] font-bold font-technical-sans text-[9px] md:text-xs uppercase tracking-widest hover:underline"
                        >
                          Send another request
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6 md:mb-8 text-center lg:text-left">
                          <h3 className="text-xl md:text-2xl font-technical-sans font-black uppercase text-ink-dark tracking-wide mb-0.5 md:mb-1">Waitlist</h3>
                          <p className="text-[8px] md:text-[10px] text-[#E19B2D] uppercase tracking-widest font-black font-technical-sans">Secure your slot</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
                          <input required type="text" placeholder="Full Name *" className="w-full bg-transparent border-b border-ink-dark/20 px-1 py-2 text-sm text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-[#E19B2D] transition-colors placeholder:text-ink-dark/50 rounded-none" />
                          <input required type="tel" placeholder="Phone number *" className="w-full bg-transparent border-b border-ink-dark/20 px-1 py-2 text-sm text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-[#E19B2D] transition-colors placeholder:text-ink-dark/50 rounded-none" />

                          <div className="relative">
                            <select required defaultValue="" className="w-full bg-transparent border-b border-ink-dark/20 px-1 py-2 text-sm text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-[#E19B2D] transition-colors appearance-none cursor-pointer invalid:text-ink-dark/50 rounded-none">
                              <option value="" disabled>Select an option</option>
                              <option value="admission" className="text-ink-dark">How do i take Admission?</option>
                              <option value="info" className="text-ink-dark">I want to know more</option>
                              <option value="demo" className="text-ink-dark">Shedule a Demo Session for me.</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink-dark/50">
                              <ChevronRight size={16} className="rotate-90" strokeWidth={2} />
                            </div>
                          </div>

                          <input type="text" placeholder="Message" className="w-full bg-transparent border-b border-ink-dark/20 px-1 py-2 text-sm text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-[#E19B2D] transition-colors placeholder:text-ink-dark/50 rounded-none" />

                          <button type="submit" className="mt-4 bg-[#E19B2D] hover:bg-ink-dark text-white hover:text-[#E19B2D] font-technical-sans font-black py-3 px-8 rounded-full transition-colors shadow-sm text-sm tracking-widest w-fit self-center lg:self-start cursor-pointer">
                            Submit
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Contact Details Grid */}
                <div className="order-3 lg:col-start-1 lg:row-start-2 grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-y-6 md:gap-y-8 w-full max-w-[320px] sm:max-w-[400px] mx-auto lg:mx-0 shrink-0">
                  <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
                    <span className="text-[8px] md:text-[10px] font-bold font-technical-sans text-white/70 uppercase tracking-widest">Headoffice</span>
                    <div className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-[10px] md:text-sm font-black font-technical-sans text-white">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E19B2D] drop-shadow-sm shrink-0" /> Delhi NCR
                    </div>
                  </div>

                  <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
                    <span className="text-[8px] md:text-[10px] font-bold font-technical-sans text-white/70 uppercase tracking-widest">Call Us</span>
                    <a href="tel:+918076530550" className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-[10px] md:text-sm font-black font-technical-sans text-white hover:text-[#E19B2D] transition-colors">
                      <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E19B2D] drop-shadow-sm shrink-0" /> +91 8076 530 550
                    </a>
                  </div>

                  <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
                    <span className="text-[8px] md:text-[10px] font-bold font-technical-sans text-white/70 uppercase tracking-widest">WhatsApp</span>
                    <a href="https://wa.me/918076530550" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-[10px] md:text-sm font-black font-technical-sans text-white hover:text-[#E19B2D] transition-colors">
                      <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E19B2D] drop-shadow-sm shrink-0" /> +91 8076 530 550
                    </a>
                  </div>

                  <div className="flex flex-col items-center lg:items-start gap-1 text-center lg:text-left">
                    <span className="text-[8px] md:text-[10px] font-bold font-technical-sans text-white/70 uppercase tracking-widest">Email Us</span>
                    <a href="mailto:care@yangerila.com" className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-[10px] md:text-sm font-black font-technical-sans text-white hover:text-[#E19B2D] transition-colors">
                      <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E19B2D] drop-shadow-sm shrink-0" /> care@yangerila.com
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
});

export default FooterReveal;