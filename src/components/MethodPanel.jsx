import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Zap, Music, Star, Activity, X } from 'lucide-react';
import SmartVideo from './SmartVideo';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const courseData = [
  {
    id: 0, title: "Hobby Courses", price: "₹3200/Mo Onwards", stats: "2500+ Alums", icon: Music,
    colorPastel: 'var(--color-paper-bg)', colorText: 'var(--color-ink-dark)', colorGlow: 'rgba(58, 90, 140, 0.5)',
    videoWebm: 'hobby_guitar.webm', videoMp4: 'hobby_guitar.mp4', poster: 'hobby_guitar.jpg',
    desc: 'Perfect for casual learners. Master your favorite songs and basic chords through an easy, stress-free path designed to keep the joy in playing.'
  },
  {
    id: 1, title: "Rhythm Grades", price: "₹3200/Mo Onwards", stats: "2000+ Alums", icon: Activity,
    colorPastel: '#EBE6DF', colorText: 'var(--color-ink-dark)', colorGlow: 'rgba(227, 66, 52, 0.5)',
    videoWebm: 'rhythm_guitar.webm', videoMp4: 'rhythm_guitar.mp4', poster: 'rhythm_guitar.jpg',
    desc: 'The foundation of mastery. Precision grading focusing on complex strumming, timing, dynamic control, and essential music theory.'
  },
  {
    id: 2, title: "Lead Grades", price: "₹3600/Mo Onwards", stats: "1800+ Alums", icon: Star,
    colorPastel: 'var(--color-paper-bg)', colorText: 'var(--color-ink-dark)', colorGlow: 'rgba(147, 233, 190, 0.4)',
    videoWebm: 'lead_guitar.webm', videoMp4: 'lead_guitar.mp4', poster: 'lead_guitar.jpg',
    desc: 'Unleash your expression. Master scale proficiency, intricate techniques (bends, slides, taps), improvisation, and blistering solos.'
  },
  {
    id: 3, title: "Finger-picking", price: "₹3600/Mo Onwards", stats: "1250+ Alums", icon: Zap,
    colorPastel: '#EBE6DF', colorText: 'var(--color-ink-dark)', colorGlow: 'rgba(225, 155, 45, 0.4)',
    videoWebm: 'fingerpicking_guitar.webm', videoMp4: 'fingerpicking_guitar.mp4', poster: 'fingerpicking_guitar.jpg',
    desc: 'Clinical precision. Develop independent control of thumb and fingers, explore Travis picking, and master complex melodies.'
  }
];

const MethodPanel = React.memo(function MethodPanel({ step, children, isReversingRef }) {
  const containerRef = useRef(null);

  const founderContainerRef = useRef(null);
  const founderTitleRef = useRef(null);
  const founderQuoteRef = useRef(null);
  const founderAuthorRef = useRef(null);
  const tiltCardRef = useRef(null);
  const quoteParagraphsRef = useRef([]);

  const accordionRef = useRef(null);
  const panelsRef = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [activeBonus, setActiveBonus] = useState(null);
  const bonusesRef = useRef([]);
  const admissionSectionRef = useRef(null);

  const xTo = useRef(null);
  const yTo = useRef(null);
  const tiltRafRef = useRef(null);

  const resetAccordion = useCallback(() => {
    setExpandedIndex(null);
  }, []);

  useEffect(() => {
    if (step > 6) resetAccordion();
  }, [step, resetAccordion]);

  const handlePanelClick = useCallback((index) => {
    if (expandedIndex === index) {
      resetAccordion();
    } else {
      setExpandedIndex(index);
    }
  }, [expandedIndex, resetAccordion]);

  useGSAP(() => {
    const isReversing = isReversingRef.current;

    if (step < 5) {
      gsap.set(founderContainerRef.current, { autoAlpha: 0, pointerEvents: "none" });
    } else {
      gsap.set(founderContainerRef.current, { autoAlpha: 1, pointerEvents: "auto" });
    }

    if (tiltCardRef.current) {
      xTo.current = gsap.quickTo(tiltCardRef.current, "rotationY", { ease: "power4.out", duration: 0.5 });
      yTo.current = gsap.quickTo(tiltCardRef.current, "rotationX", { ease: "power4.out", duration: 0.5 });
    }

    if (step === 5) {
      const paragraphs = quoteParagraphsRef.current.filter(Boolean);
      if (isReversing) {
        gsap.set([founderTitleRef.current, founderAuthorRef.current, paragraphs], { autoAlpha: 1, y: 0 });
        gsap.set(tiltCardRef.current, { autoAlpha: 1, scale: 1 });
      } else {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo(founderTitleRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
        tl.fromTo(paragraphs, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.4");
        tl.fromTo(tiltCardRef.current, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.0, ease: "back.out(1.2)" }, "-=0.8");
        tl.fromTo(founderAuthorRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
      }
    }

    if (step === 6) {
      const panels = panelsRef.current.filter(Boolean);
      resetAccordion();
      if (!isReversing && panels.length > 0) {
        const isMobile = window.innerWidth < 768;
        gsap.fromTo(panels,
          { autoAlpha: 0, x: isMobile ? 0 : -100, y: isMobile ? 100 : 0 },
          { autoAlpha: 1, x: 0, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)", delay: 0.2 }
        );
      } else if (panels.length > 0) {
        gsap.set(panels, { autoAlpha: 1, x: 0, y: 0 });
      }
    }

    if (step === 8) {
      if (isReversing) {
        gsap.set(bonusesRef.current, { scale: 1, autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(bonusesRef.current,
          { scale: 0.9, autoAlpha: 0, y: 50 },
          { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)", delay: 0.2 }
        );
      }
    }

    if (step === 9) {
      const admissionContent = admissionSectionRef.current?.querySelector('.admission-headline');
      const admissionText = admissionSectionRef.current?.querySelector('.admission-text');
      const admissionBtns = admissionSectionRef.current?.querySelectorAll('a');

      if (isReversing) {
        gsap.set([admissionContent, admissionText, admissionBtns], { scale: 1, autoAlpha: 1, y: 0 });
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(admissionContent, { scale: 0.9, autoAlpha: 0, y: 50 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" })
          .fromTo(admissionText, { scale: 0.9, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");
        if (admissionBtns) tl.fromTo(admissionBtns, { scale: 0.9, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");
      }
    }
  }, { scope: containerRef, dependencies: [step, resetAccordion] });

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current || !founderContainerRef.current) return;
    cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      const rect = founderContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
      xTo.current(rotateY);
      yTo.current(rotateX);
    });
  };

  const handleMouseLeave = () => {
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 relative pointer-events-auto border-t-[3px] border-ink-dark/10 bg-transparent">

      <div
        ref={founderContainerRef}
        id="founder_section"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-dvh flex flex-col items-center justify-center relative shrink-0 bg-transparent px-4 sm:px-6 md:px-12 xl:px-24 overflow-hidden"
      >
        <div className="w-full max-w-screen-2xl mx-auto h-full flex flex-col items-center justify-center relative py-12 md:py-24">

          <div ref={founderTitleRef} className="invisible mb-6 md:mb-16 flex flex-col items-center md:items-start w-full max-w-7xl">
            <span className="block text-[10px] md:text-xs font-black font-technical-sans tracking-[0.4em] text-accent-teal uppercase mb-2">Founder's Note</span>
          </div>

          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-16 lg:gap-20 items-center justify-center max-w-7xl mx-auto flex-1 md:flex-none">

            <div className="flex flex-col items-start gap-3 md:gap-5 text-left relative w-full flex-1 md:flex-none justify-center">
              <h2 ref={founderQuoteRef} className="relative z-10 text-base sm:text-xl lg:text-3xl font-bold text-ink-dark leading-snug tracking-tight w-full font-elegant-serif">
                <p ref={el => quoteParagraphsRef.current[0] = el} className="quote-p1 invisible opacity-90 mb-2 md:mb-4 pr-1">
                  In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion.
                </p>
                <p ref={el => quoteParagraphsRef.current[1] = el} className="quote-p2 invisible mb-3 md:mb-5 pr-1">
                  I am confident in what we’ve created and in what we deliver.
                </p>
                <span ref={el => quoteParagraphsRef.current[2] = el} className="quote-p3 invisible italic text-lg sm:text-2xl lg:text-3xl tracking-tight leading-relaxed max-w-2xl text-ink-dark opacity-80 block mt-4 md:mt-6 pr-1">
                  Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.
                </span>
              </h2>

              <div ref={founderAuthorRef} className="mt-4 md:mt-14 invisible flex flex-col items-center md:items-start relative z-10 border-t-2 border-ink-dark/20 pt-4 md:pt-5 w-full max-w-sm shrink-0">
                <p className="text-[9px] md:text-[11px] font-black font-technical-sans uppercase tracking-[0.3em] text-ink-medium mb-1 opacity-80">Lead Guitar Coach</p>
                <h3 className="text-xl md:text-3xl lg:text-4xl font-black uppercase text-ink-dark font-technical-sans tracking-tighter tabular-nums leading-none">Micky Dixit</h3>
              </div>
            </div>

            <div ref={tiltCardRef} className="relative shrink-0 transform-style-3d cursor-crosshair invisible flex justify-center md:justify-end mt-4 md:mt-0 w-full h-[25vh] md:h-auto md:w-auto">
              <div className="founder_image_box w-auto h-full aspect-3/4 md:w-[320px] lg:w-[400px] md:h-auto bg-paper-bg border-10 md:border-16 border-paper-bg shadow-[0_20px_50px_rgba(26,26,26,0.3)] overflow-hidden pointer-events-none">
                <img src={`${import.meta.env.BASE_URL}founder-guitar.jpg`} alt="Micky Dixit - Y Studio Founder" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 lg:px-24 pt-6 md:pt-16 shrink-0 bg-transparent overflow-hidden">

        <div className="max-w-7xl mx-auto w-full text-center px-4 shrink-0 mb-4 md:mb-6">
          <h2 className="text-accent-teal tracking-[0.3em] font-black font-technical-sans text-[9px] md:text-xs uppercase mb-1.5">Our Curriculum</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-ink-dark font-technical-sans uppercase tracking-tight mb-2">Featured <span className="text-accent-teal">Courses</span></h3>
        </div>

        <div ref={accordionRef} className="w-full h-[65dvh] md:h-[60dvh] flex flex-col md:flex-row gap-2 md:gap-4 md:items-stretch group overflow-hidden pointer-events-auto shrink px-2 sm:px-0">
          {courseData.map((course, idx) => {
            const PanelIcon = course.icon;
            const isActive = idx === expandedIndex;

            return (
              <div
                key={course.id}
                ref={el => panelsRef.current[idx] = el}
                onClick={() => handlePanelClick(idx)}
                className={`panel-accordion flex flex-row md:flex-col relative overflow-hidden group cursor-pointer rounded-3xl md:rounded-[2.5rem] lg:rounded-4xl shrink border-2 border-ink-dark/10 shadow-sm ${isActive ? 'is-expanded' : (expandedIndex !== null ? 'is-collapsed' : '')}`}
                style={{
                  backgroundColor: course.colorPastel,
                  flex: expandedIndex === null ? '1 1 25%' : undefined
                }}
              >
                <div className="expanded-glow absolute inset-0 z-0">
                  <div className="absolute inset-[-100px] animate-[pulse_3s_ease-in-out_infinite]" style={{ boxShadow: `inset 0 0 100px 30px ${course.colorGlow}` }}></div>
                  <div className="absolute inset-0 bg-ink-dark/95 backdrop-blur-md"></div>
                  <div className="absolute inset-0 border-[6px] border-accent-teal rounded-3xl md:rounded-[2.5rem] lg:rounded-4xl pointer-events-none z-10" />
                </div>

                <div className="normal-content relative z-10 w-full h-full flex flex-row md:flex-col items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8">
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-3 w-full shrink">
                    <div className="p-2 sm:p-3 md:p-4 rounded-full border-2 border-ink-dark/10 bg-white/60 shadow-sm shrink-0">
                      <PanelIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 transition-transform group-hover:scale-110" style={{ color: course.colorText }} />
                    </div>
                    <div className="w-full text-left flex flex-col items-start gap-0.5 sm:gap-1">
                      <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-black font-technical-sans leading-tight uppercase tracking-tight tabular-nums truncate w-full" style={{ color: course.colorText }}>{course.title}</h3>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] tracking-widest font-black font-technical-sans uppercase tabular-nums" style={{ color: course.colorText, opacity: 0.8 }}>{course.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end md:items-start text-right md:text-left gap-1 md:gap-3 w-full shrink">
                    <div className="hidden md:block text-[8px] md:text-xs tracking-widest uppercase mb-1 font-black font-technical-sans tabular-nums opacity-80" style={{ color: course.colorText }}>{course.stats}</div>
                    <div className="bg-accent-teal border-2 border-transparent py-1.5 md:py-2 px-2 sm:px-3 md:px-5 rounded-md sm:rounded-lg md:rounded-xl text-[7px] sm:text-[8px] md:text-[9px] font-black font-technical-sans uppercase tracking-widest tabular-nums shadow-md flex gap-1 justify-center items-center text-white transition-colors cursor-pointer group-hover:bg-white group-hover:text-accent-teal group-hover:border-accent-teal">Explore</div>
                  </div>
                </div>

                <div className="normal-icon absolute inset-0 z-10 flex flex-row md:flex-col items-center justify-center p-2 md:p-0">
                  <div className="p-1.5 sm:p-2 md:p-3 rounded-full border-2 border-ink-dark/10 bg-white/60">
                    <PanelIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" style={{ color: course.colorText, opacity: 0.8 }} />
                  </div>
                </div>

                <div className="expanded-content absolute inset-0 z-20 p-4 sm:p-6 md:p-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-10 w-full h-full overflow-y-auto scrollbar-hide shrink">

                  <div className="stagger-item relative z-10 hidden md:block w-full md:w-1/2 aspect-video md:aspect-auto h-[30%] md:h-[80%] lg:h-[90%] rounded-xl md:rounded-3xl border-4 border-ink-dark shadow-2xl overflow-hidden shrink-0">
                    <SmartVideo
                      srcWebm={`${import.meta.env.BASE_URL}courses/${course.videoWebm}`}
                      srcMp4={`${import.meta.env.BASE_URL}courses/${course.videoMp4}`}
                      poster={`${import.meta.env.BASE_URL}courses/${course.poster}`}
                    />
                  </div>

                  <div className="relative z-10 flex-1 text-center md:text-left flex flex-col items-center md:items-start shrink justify-center h-full w-full text-paper-bg">
                    <div className="stagger-item flex items-center gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-6 shrink">
                      <div className="p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-accent-teal bg-ink-dark shadow-md shrink-0">
                        <PanelIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-paper-bg" />
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-3xl lg:text-5xl font-black uppercase font-technical-sans tracking-tighter leading-none tabular-nums shrink text-paper-bg">{course.title}</h2>
                    </div>
                    <p className="stagger-item text-[11px] sm:text-xs md:text-base lg:text-lg leading-snug md:leading-relaxed font-elegant-serif font-medium mb-4 sm:mb-5 md:mb-10 max-w-lg shrink text-paper-bg/90">{course.desc}</p>

                    <div className="stagger-item w-full flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-center justify-center md:justify-start shrink">
                      <div className="flex flex-col gap-0.5 sm:gap-1 items-center md:items-start border border-ink-dark/40 bg-ink-dark/50 p-1.5 sm:p-2 px-4 sm:px-5 rounded-lg sm:rounded-xl md:rounded-2xl shrink-0 tabular-nums text-paper-bg">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black font-technical-sans tracking-widest opacity-70 tabular-nums">Price</span>
                        <span className="text-sm sm:text-lg md:text-xl font-black font-technical-sans tabular-nums">{course.price}</span>
                      </div>
                      <a href="#" className="py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-8 rounded-md border-2 border-transparent hover:border-white hover:bg-transparent bg-accent-magenta text-white font-black font-technical-sans text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(227,66,52,0.4)] pointer-events-auto transition-all tabular-nums">Enroll Now</a>
                    </div>
                  </div>

                  <button onClick={(e) => { e.stopPropagation(); resetAccordion(); }} className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30 p-1.5 sm:p-2 md:p-3 rounded-full border-2 border-paper-bg/40 bg-ink-dark text-paper-bg hover:bg-paper-bg hover:text-ink-dark hover:border-paper-bg pointer-events-auto transition-all duration-300 shadow-sm">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full text-center mt-3 sm:mt-4 md:mt-6 z-10 relative px-4 shrink-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs xl:text-sm font-medium font-technical-sans text-ink-dark/90 tracking-wide">
            Are you interested to know about Yangerila Creative Studio? <a href="#" className="text-accent-teal hover:text-ink-dark underline transition-colors underline-offset-4 font-black">Download our brochure here.</a>
          </p>
        </div>

      </div>

      {children}

      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 bg-transparent border-t-[3px] border-ink-dark/10 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full text-center">
          <h2 className="text-accent-teal tracking-[0.3em] font-black text-xs uppercase mb-3 md:mb-4 font-technical-sans">Exclusive Perks</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-ink-dark uppercase tracking-tight mb-6 md:mb-16 tabular-nums font-technical-sans">Premium <span className="text-accent-teal">Rewards</span></h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 perspective-[1500px] w-full px-2 max-w-4xl mx-auto">
            {[
              { title: "INR 1,000", desc: "Referral Reward", offer: "Amazon Gift Card for every joining reference." },
              { title: "30% OFF", desc: "Group Discount", offer: "Valid for groups of 3 or more students." },
              { title: "50% OFF", desc: "Next Fee Reward", offer: "For your next month fee on student referral." },
              { title: "Exclusive", desc: "Festive Perks", offer: "Special discounts and events all year round." }
            ].map((bonus, idx) => (
              <div
                key={idx}
                ref={el => bonusesRef.current[idx] = el}
                onClick={() => setActiveBonus(activeBonus === idx ? null : idx)}
                className="relative h-[16vh] md:h-[25vh] min-h-[140px] w-full cursor-pointer preserve-3d transition-transform duration-1000 invisible premium-glow rounded-xl md:rounded-4xl"
                style={{ transform: activeBonus === idx ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                <div className="absolute inset-0 backface-hidden bg-paper-bg p-3 sm:p-5 md:p-8 rounded-xl md:rounded-4xl flex flex-col items-center justify-center border-2 border-ink-dark/20 text-center shadow-md">
                  <h4 className={`text-lg sm:text-2xl md:text-4xl font-technical-sans font-black mb-1 md:mb-3 uppercase tracking-tighter tabular-nums ${idx === 1 || idx === 2 ? 'text-accent-magenta' : 'text-ink-dark'}`}>{bonus.title}</h4>
                  <p className="text-ink-medium text-[7px] sm:text-[8px] md:text-xs font-black font-technical-sans uppercase tracking-widest md:tracking-widest tabular-nums">{bonus.desc}</p>
                  <p className="text-[6px] sm:text-[7px] md:text-[10px] text-ink-dark/60 font-black font-technical-sans mt-2 md:mt-4 uppercase tracking-widest">Tap to reveal</p>
                </div>
                <div className="absolute inset-0 backface-hidden bg-accent-magenta p-3 sm:p-5 md:p-8 rounded-xl md:rounded-4xl flex flex-col items-center justify-center border-4 border-accent-magenta shadow-[0_15px_40px_rgba(227,66,52,0.4)] text-center" style={{ transform: 'rotateY(180deg)' }}>
                  <h4 className="text-[9px] sm:text-sm md:text-xl font-black font-technical-sans text-white mb-1 md:mb-3 uppercase tracking-widest md:tracking-widest tabular-nums">{bonus.desc}</h4>
                  <p className="text-white/90 font-elegant-serif text-[8px] sm:text-xs md:text-sm font-medium leading-snug md:leading-relaxed">{bonus.offer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={admissionSectionRef} className="w-full h-dvh flex flex-col items-center justify-center text-center relative px-4 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 bg-transparent overflow-hidden">
        <h2 className="admission-headline text-3xl sm:text-5xl md:text-8xl font-black text-ink-dark font-technical-sans mb-4 md:mb-8 uppercase tracking-tight tabular-nums invisible">
          Admissions <br />
          <span className="text-accent-teal">Are Open</span>
        </h2>
        <p className="admission-text text-sm sm:text-xl md:text-2xl text-ink-medium font-medium max-w-3xl mx-auto mb-10 md:mb-16 text-serif-italic invisible px-2 sm:px-4">
          Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 lg:gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10 px-4">
          <a href="#" className="adm-btn bg-paper-bg hover:bg-white w-full sm:w-auto text-center px-6 py-3.5 sm:px-8 sm:py-5 md:px-12 md:py-6 rounded-full text-ink-dark font-black font-technical-sans tracking-widest uppercase border-2 border-ink-dark/20 premium-glow invisible text-[10px] md:text-sm tabular-nums transition-colors">Free Demo Session</a>
          <a href="#" className="adm-btn bg-accent-teal hover:bg-ink-dark w-full sm:w-auto text-center text-white px-6 py-3.5 sm:px-8 sm:py-5 md:px-12 md:py-6 rounded-full font-black font-technical-sans tracking-widest uppercase border-2 border-transparent premium-glow invisible text-[10px] md:text-sm tabular-nums transition-colors">Begin Admissions</a>
        </div>
      </div>

    </div>
  );
});

export default MethodPanel;
