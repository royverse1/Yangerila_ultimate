import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, ChevronLeft, ChevronRight, Pause, Play, MessageCircle, MapPin } from 'lucide-react';

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
        gsap.to(revealSectionRef.current, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          ease: "power3.inOut",
          duration: 0.8
        });
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(background, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" })
          .fromTo(header, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(carousel, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      }
    }

    if (step === 12) {
      const content = revealSectionRef.current?.querySelector('.reveal-content-inner');

      gsap.fromTo(revealSectionRef.current,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power3.inOut",
          duration: 1.0,
          onComplete: () => {
            gsap.fromTo(content, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
          }
        }
      );
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
        <div ref={voicesRef} className="absolute inset-0 w-full h-dvh overflow-hidden flex flex-col justify-center bg-transparent py-10 lg:py-16 px-0 border-t-[3px] border-ink-dark/10">
          <div className="carousel-bg-container absolute inset-0 -z-20 overflow-hidden invisible pointer-events-none">
            <div className="absolute inset-0 bg-ink-dark"></div>
            <div ref={el => bokehRefs.current[0] = el} className="absolute top-[-20%] left-[-10%] w-screen h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_center,rgba(225,155,45,0.4)_0%,transparent_65%)] rounded-full will-change-transform"></div>
            <div ref={el => bokehRefs.current[1] = el} className="absolute bottom-[-20%] right-[-10%] w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] bg-[radial-gradient(circle_at_center,rgba(147,233,190,0.3)_0%,transparent_65%)] rounded-full will-change-transform"></div>
          </div>

          <div className="voices-header shrink-0 flex flex-col px-4 sm:px-6 md:px-12 xl:px-24 mb-8 md:mb-12 items-center text-center invisible">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black font-technical-sans text-paper-bg uppercase tracking-tight leading-none mb-3 md:mb-5">
              Voices of <span className="text-serif-italic font-medium text-pastel-mint lowercase">excellence</span>
            </h2>
            <div className="flex items-center gap-4 text-paper-bg/80 text-xs md:text-sm font-black font-technical-sans">
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
                        <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-technical-sans font-black border-[3px] transition-colors duration-700 ${isActive ? 'border-accent-teal text-white bg-accent-teal shadow-md' : 'border-ink-dark/20 text-ink-dark bg-white'}`}>
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col text-left justify-center overflow-hidden">
                          <h4 className={`font-black font-technical-sans leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-ink-dark text-base md:text-xl' : 'text-ink-medium text-sm md:text-base'}`}>{t.name}</h4>
                          <p className={`uppercase font-technical-sans tracking-[0.15em] mt-1.5 font-black leading-none truncate w-full transition-colors duration-700 ${isActive ? 'text-accent-teal text-[10px] md:text-xs' : 'text-ink-medium/50 text-[8px] md:text-[10px]'}`}>{t.role}</p>
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

        {/* SECTION 12: Reveal & Contact (WOOD-LIKE GRADIENT BACKGROUND - MOBILE OPTIMIZED) */}
        <section ref={revealSectionRef} className="reveal-section absolute inset-0 w-full h-dvh overflow-hidden z-50 border-t-[3px] border-ink-dark bg-gradient-to-br from-[#EADDCA] via-[#D4B895] to-[#AA7E51]" style={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}>

          <div className="w-full h-full relative overflow-y-auto scrollbar-hide">

            <div className="min-h-full w-full px-4 sm:px-6 md:px-12 lg:px-24 pt-6 pb-8 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-12 lg:gap-16 reveal-content-inner invisible">

              {/* Left Column: Text & Contact Info (Minimized on Mobile) */}
              <div className="flex flex-col justify-center text-center lg:text-left text-ink-dark w-full max-w-xl mx-auto lg:mx-0 pt-2 lg:pt-0 shrink-0">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-technical-sans uppercase tracking-tight mb-2 md:mb-6 leading-tight drop-shadow-sm">
                  Let's start your <br className="hidden lg:block" />
                  <span className="text-white">guitar journey</span>
                </h2>

                {/* Paragraph hidden on mobile to save space */}
                <p className="hidden md:block text-sm sm:text-base md:text-lg font-medium font-elegant-serif mb-8 md:mb-10 text-ink-dark/80">
                  Ready to take the next step? Fill out the form, and our team will get back to you to schedule your demo or start your admission process.
                </p>

                {/* Elegant Contact Card */}
                <div className="flex flex-col gap-2.5 md:gap-5 items-center lg:items-start bg-white/70 backdrop-blur-md p-3 sm:p-6 md:p-8 rounded-[1.25rem] md:rounded-3xl border border-white/50 shadow-sm w-full">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2.5 bg-ink-dark/5 rounded-full text-ink-dark/80"><MapPin className="w-4 h-4 md:w-[18px] md:h-[18px]" /></div>
                    <div className="text-left">
                      <p className="text-[8px] md:text-[10px] font-bold font-technical-sans text-ink-dark/60 uppercase tracking-widest">Headoffice</p>
                      <p className="text-[11px] md:text-base font-bold font-technical-sans text-ink-dark">Based in Delhi NCR</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-ink-dark/10 my-0 md:my-1"></div>

                  <div className="flex flex-row gap-2 md:gap-4 w-full justify-center lg:justify-start">
                    <a href="https://wa.me/918076530550" target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center lg:justify-start gap-1.5 md:gap-3 p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-green-50 transition-colors group">
                      <div className="p-1.5 md:p-2.5 bg-green-100 rounded-full text-green-600 group-hover:scale-110 transition-transform"><MessageCircle className="w-4 h-4 md:w-[18px] md:h-[18px]" /></div>
                      <div className="text-left">
                        <p className="text-[7px] md:text-[9px] font-bold font-technical-sans text-green-600/80 uppercase tracking-widest">WhatsApp</p>
                        <p className="text-[9px] md:text-sm font-black font-technical-sans text-ink-dark">+91 8076 530 550</p>
                      </div>
                    </a>

                    <a href="mailto:care@yangerila.com" className="flex flex-1 items-center justify-center lg:justify-start gap-1.5 md:gap-3 p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-blue-50 transition-colors group">
                      <div className="p-1.5 md:p-2.5 bg-blue-100 rounded-full text-accent-teal group-hover:scale-110 transition-transform"><Mail className="w-4 h-4 md:w-[18px] md:h-[18px]" /></div>
                      <div className="text-left">
                        <p className="text-[7px] md:text-[9px] font-bold font-technical-sans text-accent-teal/80 uppercase tracking-widest">Email Us</p>
                        <p className="text-[9px] md:text-sm font-black font-technical-sans text-ink-dark">care@yangerila.com</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Waitlist Form (Maximized on Mobile) */}
              <div className="flex-1 w-full flex justify-center lg:justify-end pb-6 md:pb-12 lg:pb-0">
                <div className="w-full max-w-md bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-10 shadow-[0_20px_60px_rgba(74,46,27,0.15)] border border-white/40 relative overflow-hidden">

                  {formStatus === 'success' ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-accent-teal text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-accent-teal/30">
                        <ChevronRight size={40} className="rotate-[-45deg]" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-2xl font-black font-technical-sans text-ink-dark uppercase tracking-tight mb-2">Thank You!</h3>
                      <p className="text-ink-medium/80 font-elegant-serif italic text-lg leading-relaxed">Your enquiry has been<br />succesfully submitted</p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className="mt-8 text-accent-teal font-bold font-technical-sans text-[10px] sm:text-xs uppercase tracking-widest hover:underline"
                      >
                        Send another request
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 md:mb-8 text-center lg:text-left">
                        <h3 className="text-xl md:text-3xl font-technical-sans font-black uppercase text-ink-dark tracking-wide mb-0.5 md:mb-1">Waitlist</h3>
                        <p className="text-[8px] md:text-[10px] text-[#AA7E51] uppercase tracking-widest font-black font-technical-sans">Secure your slot</p>
                      </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-8">

                        <div className="relative">
                          <input required type="text" placeholder="Full Name *" className="w-full bg-transparent border-b-2 border-ink-dark/20 px-1 py-1.5 md:py-2 text-xs md:text-base text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-accent-teal transition-colors placeholder:text-ink-dark/50 rounded-none" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                          <div className="relative">
                            <input required type="email" placeholder="Email Address *" className="w-full bg-transparent border-b-2 border-ink-dark/20 px-1 py-1.5 md:py-2 text-xs md:text-base text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-accent-teal transition-colors placeholder:text-ink-dark/50 rounded-none" />
                          </div>
                          <div className="relative">
                            <input required type="tel" placeholder="Phone number *" className="w-full bg-transparent border-b-2 border-ink-dark/20 px-1 py-1.5 md:py-2 text-xs md:text-base text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-accent-teal transition-colors placeholder:text-ink-dark/50 rounded-none" />
                          </div>
                        </div>

                        <div className="relative">
                          <select required defaultValue="" className="w-full bg-transparent border-b-2 border-ink-dark/20 px-1 py-1.5 md:py-2 text-xs md:text-base text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-accent-teal transition-colors appearance-none cursor-pointer invalid:text-ink-dark/50 rounded-none">
                            <option value="" disabled>Select an option</option>
                            <option value="admission" className="text-ink-dark">How do i take Admission?</option>
                            <option value="info" className="text-ink-dark">I want to know more</option>
                            <option value="demo" className="text-ink-dark">Shedule a Demo Session for me.</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink-dark/60">
                            <ChevronRight className="rotate-90 md:w-[18px] md:h-[18px] w-4 h-4" strokeWidth={2} />
                          </div>
                        </div>

                        <div className="relative">
                          <input type="text" placeholder="City / Message (Optional)" className="w-full bg-transparent border-b-2 border-ink-dark/20 px-1 py-1.5 md:py-2 text-xs md:text-base text-ink-dark font-medium font-technical-sans focus:outline-none focus:border-accent-teal transition-colors placeholder:text-ink-dark/50 rounded-none" />
                        </div>

                        <button type="submit" className="mt-2 md:mt-4 bg-pastel-mint hover:bg-accent-teal text-ink-dark hover:text-white font-technical-sans font-black px-6 md:px-8 py-2.5 md:py-3.5 rounded-full w-fit transition-colors shadow-sm text-xs md:text-sm tracking-wide self-center lg:self-start mx-auto lg:mx-0">
                          Submit
                        </button>
                      </form>
                    </>
                  )}

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
