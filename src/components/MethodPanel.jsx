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
    colorPastel: '#E0F2FE', colorText: '#075985', colorGlow: 'rgba(56, 189, 248, 0.4)',
    videoWebm: 'hobby_guitar.webm', videoMp4: 'hobby_guitar.mp4', poster: 'hobby_guitar.jpg',
    desc: 'Perfect for casual learners. Master your favorite songs and basic chords through an easy, stress-free path designed to keep the joy in playing.'
  },
  {
    id: 1, title: "Rhythm Grades", price: "₹3200/Mo Onwards", stats: "2000+ Alums", icon: Activity,
    colorPastel: '#F3E8FF', colorText: '#6B21A8', colorGlow: 'rgba(192, 132, 252, 0.4)',
    videoWebm: 'rhythm_guitar.webm', videoMp4: 'rhythm_guitar.mp4', poster: 'rhythm_guitar.jpg',
    desc: 'The foundation of mastery. Precision grading focusing on complex strumming, timing, dynamic control, and essential music theory.'
  },
  {
    id: 2, title: "Lead Grades", price: "₹3600/Mo Onwards", stats: "1800+ Alums", icon: Star,
    colorPastel: '#D1FAE5', colorText: '#065F46', colorGlow: 'rgba(52, 211, 153, 0.4)',
    videoWebm: 'lead_guitar.webm', videoMp4: 'lead_guitar.mp4', poster: 'lead_guitar.jpg',
    desc: 'Unleash your expression. Master scale proficiency, intricate techniques (bends, slides, taps), improvisation, and blistering solos.'
  },
  {
    id: 3, title: "Finger-picking", price: "₹3600/Mo Onwards", stats: "1250+ Alums", icon: Zap,
    colorPastel: '#FFE4E6', colorText: '#9F1239', colorGlow: 'rgba(251, 113, 133, 0.4)',
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
  const accordionTimelineRef = useRef(null);

  const [activeBonus, setActiveBonus] = useState(null);
  const bonusesRef = useRef([]);
  const admissionSectionRef = useRef(null);

  const xTo = useRef(null);
  const yTo = useRef(null);
  // P5.2 — RAF ref to throttle mousemove layout calculations
  const tiltRafRef = useRef(null);

  const resetAccordion = useCallback((instant = false) => {
    if (!panelsRef.current || panelsRef.current.length !== 4) return;
    setExpandedIndex(null);
    if (accordionTimelineRef.current) accordionTimelineRef.current.kill();

    const panels = panelsRef.current;
    const initialFlex = '1 1 25%';

    gsap.to(panels, {
      flex: initialFlex, duration: instant ? 0 : 0.5, ease: "power2.inOut", overwrite: "auto", force3D: true
    });

    panels.forEach((panel) => {
      if (!panel) return;
      const normalContent = panel.querySelector('.normal-content');
      const expandedContent = panel.querySelector('.expanded-content');
      const expandedGlow = panel.querySelector('.expanded-glow');
      const normalIcon = panel.querySelector('.normal-icon');
      gsap.set([normalContent, normalIcon], { autoAlpha: 1 });
      gsap.set([expandedContent, expandedGlow], { autoAlpha: 0 });
    });
  }, []);

  useEffect(() => {
    if (step > 6) resetAccordion(true);
  }, [step, resetAccordion]);

  const handlePanelClick = useCallback((index) => {
    if (!panelsRef.current || panelsRef.current.length !== 4) return;
    if (expandedIndex === index) { resetAccordion(); return; }

    setExpandedIndex(index);
    const panels = panelsRef.current;
    const isMobile = window.innerWidth < 768;

    if (accordionTimelineRef.current) accordionTimelineRef.current.kill();
    const tl = gsap.timeline();
    accordionTimelineRef.current = tl;

    panels.forEach((panel, i) => {
      if (!panel) return;
      const normalContent = panel.querySelector('.normal-content');
      const expandedContent = panel.querySelector('.expanded-content');
      const expandedGlow = panel.querySelector('.expanded-glow');
      const normalIcon = panel.querySelector('.normal-icon');
      const expandedStaggers = expandedContent.querySelectorAll('.stagger-item');

      if (i === index) {
        tl.to(panel, { flex: isMobile ? '1 1 70%' : '1 1 80%', duration: 0.6, ease: "power3.inOut", force3D: true }, 0);
        tl.to(normalContent, { autoAlpha: 0, duration: 0.2, force3D: true }, 0);
        tl.to(normalIcon, { autoAlpha: 0, duration: 0.2, force3D: true }, 0);
        tl.set(expandedContent, { autoAlpha: 1 }, 0.6);
        tl.set(expandedStaggers, { autoAlpha: 0, y: 20 }, 0);
        tl.to(expandedStaggers, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", force3D: true }, 0.6);
        tl.to(expandedGlow, { autoAlpha: 1, duration: 0.3, force3D: true }, 0.6);
      } else {
        tl.to(panel, { flex: isMobile ? '1 1 10%' : '1 1 6.66%', duration: 0.6, ease: "power3.inOut", force3D: true }, 0);
        tl.set(normalContent, { autoAlpha: 0 }, 0);
        tl.set(expandedContent, { autoAlpha: 0 }, 0);
        tl.set(expandedGlow, { autoAlpha: 0 }, 0);
        tl.to(normalIcon, { autoAlpha: 1, scale: isMobile ? 0.75 : 0.9, duration: 0.4, ease: "back.out(2)", force3D: true }, 0.2);
      }
    });
  }, [expandedIndex, resetAccordion]);

  useGSAP(() => {
    // P1.3 — read at animation-fire time
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
      resetAccordion(true);
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

  // P5.2 — RAF-throttled tilt card handler
  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current || !founderContainerRef.current) return;
    cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      const rect    = founderContainerRef.current.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
      const rotateY = ((x - rect.width  / 2) / (rect.width  / 2)) *  10;
      xTo.current(rotateY);
      yTo.current(rotateX);
    });
  };

  const handleMouseLeave = () => {
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 relative pointer-events-auto border-t border-white/20 bg-transparent">

      <div
        ref={founderContainerRef}
        id="founder_section"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-dvh flex flex-col items-center justify-center relative shrink-0 bg-transparent px-4 sm:px-6 md:px-12 xl:px-24 overflow-hidden"
      >
        <div className="w-full max-w-screen-2xl mx-auto h-full flex flex-col items-center justify-center relative py-12 md:py-24">

          <div ref={founderTitleRef} className="invisible mb-6 md:mb-16 flex flex-col items-center md:items-start w-full max-w-7xl">
            <span className="block text-[10px] md:text-xs font-black tracking-[0.4em] text-accent-teal uppercase mb-2">Founder's Note</span>
          </div>

          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-16 lg:gap-20 items-center justify-center max-w-7xl mx-auto flex-1 md:flex-none">

            <div className="flex flex-col items-start gap-3 md:gap-5 text-left relative w-full flex-1 md:flex-none justify-center">
              <h2 ref={founderQuoteRef} className="relative z-10 text-base sm:text-xl lg:text-3xl font-extrabold text-ink-dark leading-snug tracking-tight w-full">
                <p ref={el => quoteParagraphsRef.current[0] = el} className="quote-p1 invisible font-medium text-ink-dark opacity-90 mb-2 md:mb-4 pr-1">
                  In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion.
                </p>
                <p ref={el => quoteParagraphsRef.current[1] = el} className="quote-p2 invisible font-bold text-ink-dark mb-3 md:mb-5 pr-1">
                  I am confident in what we’ve created and in what we deliver.
                </p>
                <span ref={el => quoteParagraphsRef.current[2] = el} className="quote-p3 invisible font-semibold italic text-lg sm:text-2xl lg:text-3xl tracking-tight leading-relaxed max-w-2xl text-ink-dark opacity-80 block mt-4 md:mt-6 pr-1">
                  Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.
                </span>
              </h2>

              <div ref={founderAuthorRef} className="mt-4 md:mt-14 invisible flex flex-col items-center md:items-start relative z-10 border-t border-ink-dark/10 pt-4 md:pt-5 w-full max-w-sm shrink-0">
                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-ink-medium mb-1 opacity-70">Lead Guitar Coach</p>
                <h3 className="text-xl md:text-3xl lg:text-4xl font-black uppercase text-ink-dark tracking-tighter tabular-nums leading-none">Micky Dixit</h3>
              </div>
            </div>

            <div ref={tiltCardRef} className="relative shrink-0 transform-style-3d cursor-crosshair invisible flex justify-center md:justify-end mt-4 md:mt-0 w-full h-[25vh] md:h-auto md:w-auto">
              <div className="founder_image_box w-auto h-full aspect-[3/4] md:w-[320px] lg:w-[400px] md:h-auto rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] bg-ink-dark/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden pointer-events-none">
                <img src={`${import.meta.env.BASE_URL}founder-guitar.jpg`} alt="Micky Dixit - Y Studio Founder" className="w-full h-full object-cover scale-[1.03]" />
              </div>
              <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(255,255,255,0.05)] pointer-events-none overflow-hidden"></div>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 lg:px-24 pt-6 md:pt-16 shrink-0 bg-[#bae6fd] overflow-hidden">

        <div className="max-w-7xl mx-auto w-full text-center px-4 shrink-0 mb-4 md:mb-6">
          <h2 className="text-accent-teal tracking-[0.3em] font-bold text-[9px] md:text-xs uppercase mb-1.5">Our Curriculum</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-ink-dark uppercase tracking-tight mb-2">Featured <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Courses</span></h3>
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
                className="panel-accordion flex flex-row md:flex-col relative overflow-hidden group cursor-pointer rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-4xl shrink border border-white/40 will-change-[flex]"
                style={{
                  backgroundColor: course.colorPastel,
                  flex: '1 1 25%',
                  boxShadow: isActive ? `inset 0 0 50px 10px ${course.colorGlow}` : 'none'
                }}
              >
                <div className="expanded-glow absolute inset-0 autoAlpha-0 pointer-events-none transition-opacity duration-300 z-0">
                  <div className="absolute inset-[-100px] animate-[pulse_3s_ease-in-out_infinite]" style={{ boxShadow: `0 0 80px 30px ${course.colorGlow}` }}></div>
                  <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent"></div>
                </div>

                <div className="normal-content relative z-10 w-full h-full flex flex-row md:flex-col items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
                  <div className="flex flex-row md:flex-col items-center md:items-start gap-3 w-full shrink">
                    <div className="p-2 sm:p-3 md:p-4 rounded-full border-2 border-white/60 bg-white/40 shadow-md shrink-0">
                      <PanelIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-8 md:h-8 transition-transform group-hover:scale-110" style={{ color: course.colorText }} />
                    </div>
                    <div className="w-full text-left flex flex-col items-start gap-0.5 sm:gap-1">
                      <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-black leading-tight uppercase tracking-tight tabular-nums truncate w-full" style={{ color: course.colorText }}>{course.title}</h3>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.1em] font-black uppercasetabular-nums" style={{ color: course.colorText, opacity: 0.7 }}>{course.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end md:items-start text-right md:text-left gap-1 md:gap-3 w-full shrink">
                    <div className="hidden md:block text-[8px] md:text-xs tracking-widest uppercase mb-1 font-bold tabular-nums opacity-60" style={{ color: course.colorText }}>{course.stats}</div>
                    <div className="border border-white/60 bg-white/80 py-1.5 md:py-2 px-2 sm:px-3 md:px-5 rounded-md sm:rounded-lg md:rounded-xl text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest tabular-nums shadow-sm flex gap-1 justify-center items-center text-ink-dark transition-colors cursor-pointer hover:bg-white hover:text-accent-teal">Explore</div>
                  </div>
                </div>

                <div className="normal-icon absolute inset-0 z-10 autoAlpha-0 pointer-events-none flex flex-row md:flex-col items-center justify-center p-2 md:p-0">
                  <div className="p-1.5 sm:p-2 md:p-3 rounded-full border border-white/40 bg-white/20">
                    <PanelIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" style={{ color: course.colorText, opacity: 0.6 }} />
                  </div>
                </div>

                <div className="expanded-content absolute inset-0 z-20 autoAlpha-0 pointer-events-none p-4 sm:p-6 md:p-10 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-10 w-full h-full overflow-y-auto scrollbar-hide shrink">
                  <div className="absolute inset-0 bg-white/20 md:bg-white/15 backdrop-blur-3xl border border-white/40 pointer-events-none z-0"></div>

                  <div className="stagger-item relative z-10 hidden md:block w-full md:w-1/2 aspect-video md:aspect-auto h-[30%] md:h-[80%] lg:h-[90%] rounded-xl md:rounded-3xl border-2 md:border-4 border-white shadow-xl overflow-hidden shrink-0">
                    <SmartVideo
                      srcWebm={`${import.meta.env.BASE_URL}courses/${course.videoWebm}`}
                      srcMp4={`${import.meta.env.BASE_URL}courses/${course.videoMp4}`}
                      poster={`${import.meta.env.BASE_URL}courses/${course.poster}`}
                    />
                  </div>

                  <div className="relative z-10 flex-1 text-center md:text-left flex flex-col items-center md:items-start shrink justify-center h-full w-full" style={{ color: course.colorText }}>
                    <div className="stagger-item flex items-center gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-6 shrink">
                      <div className="p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-white/80 bg-white/80 shadow-md shrink-0">
                        <PanelIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" style={{ color: course.colorText }} />
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-none tabular-nums shrink">{course.title}</h2>
                    </div>
                    <p className="stagger-item text-[11px] sm:text-xs md:text-base lg:text-lg leading-snug md:leading-relaxed font-serif italic mb-4 sm:mb-5 md:mb-10 max-w-lg shrink">{course.desc}</p>

                    <div className="stagger-item w-full flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-center justify-center md:justify-start shrink">
                      <div className="flex flex-col gap-0.5 sm:gap-1 items-center md:items-start border border-white/40 bg-white/40 p-1.5 sm:p-2 px-4 sm:px-5 rounded-lg sm:rounded-xl md:rounded-2xl shrink-0 tabular-nums">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest opacity-60 tabular-nums">Price</span>
                        <span className="text-sm sm:text-lg md:text-xl font-black tabular-nums">{course.price}</span>
                      </div>
                      <a href="#" className="py-2.5 px-6 sm:py-3 sm:px-8 md:py-4 md:px-8 rounded-full border-2 border-white bg-white/95 text-ink-dark font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95 tabular-nums">Enroll Now</a>
                    </div>
                  </div>

                  <button onClick={(e) => { e.stopPropagation(); resetAccordion(); }} className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30 p-1.5 sm:p-2 md:p-3 rounded-full border border-white/60 bg-white/50 text-ink-dark/80 hover:bg-white hover:text-accent-teal hover:border-white pointer-events-auto transition-all duration-300 shadow-sm">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full text-center mt-3 sm:mt-4 md:mt-6 z-10 relative px-4 shrink-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs xl:text-sm font-medium text-ink-dark/70 tracking-wide">
            Are you interested to know about Yangerila Creative Studio? <a href="#" className="text-accent-teal hover:text-ink-dark underline transition-colors underline-offset-4 font-bold">Download our brochure here.</a>
          </p>
        </div>

      </div>

      {children}

      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 bg-transparent border-t border-white/10 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full text-center">
          <h2 className="text-accent-teal tracking-[0.3em] font-bold text-xs uppercase mb-3 md:mb-4">Exclusive Perks</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-ink-dark uppercase tracking-tight mb-6 md:mb-16 tabular-nums">Premium <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Rewards</span></h3>
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
                className="relative h-[16vh] md:h-[25vh] min-h-[140px] w-full cursor-pointer preserve-3d transition-transform duration-1000 invisible premium-glow rounded-2xl md:rounded-[2.5rem]"
                style={{ transform: activeBonus === idx ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                <div className="absolute inset-0 backface-hidden bg-white/85 backdrop-blur-md p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center border border-white/80 text-center">
                  <h4 className={`text-lg sm:text-2xl md:text-4xl font-black mb-1 md:mb-3 uppercase tracking-tighter tabular-nums ${idx === 1 || idx === 2 ? 'text-accent-teal' : 'text-ink-dark'}`}>{bonus.title}</h4>
                  <p className="text-ink-medium text-[7px] sm:text-[8px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-widest tabular-nums">{bonus.desc}</p>
                  <p className="text-[6px] sm:text-[7px] md:text-[10px] text-ink-dark/40 mt-2 md:mt-4 uppercase tracking-widest">Tap to reveal</p>
                </div>
                <div className="absolute inset-0 backface-hidden bg-white p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-pastel-mint shadow-lg text-center" style={{ transform: 'rotateY(180deg)' }}>
                  <h4 className="text-[9px] sm:text-sm md:text-xl font-bold text-accent-teal mb-1 md:mb-3 uppercase tracking-[0.1em] md:tracking-widest tabular-nums">{bonus.desc}</h4>
                  <p className="text-ink-dark text-[8px] sm:text-xs md:text-sm font-medium leading-snug md:leading-relaxed">{bonus.offer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={admissionSectionRef} className="w-full h-dvh flex flex-col items-center justify-center text-center relative px-4 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 bg-transparent overflow-hidden">
        <h2 className="admission-headline text-3xl sm:text-5xl md:text-8xl font-black text-ink-dark mb-4 md:mb-8 uppercase tracking-tight tabular-nums invisible">
          Admissions <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Are Open</span>
        </h2>
        <p className="admission-text text-sm sm:text-xl md:text-2xl text-ink-medium font-light max-w-3xl mx-auto mb-10 md:mb-16 text-serif-italic invisible px-2 sm:px-4">
          Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 lg:gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10 px-4">
          <a href="#" className="adm-btn bg-white/90 backdrop-blur-md w-full sm:w-auto text-center px-6 py-3.5 sm:px-8 sm:py-5 md:px-12 md:py-6 rounded-full text-ink-dark font-black tracking-widest uppercase border border-ink-dark/10 premium-glow invisible text-[10px] md:text-sm tabular-nums">Free Demo Session</a>
          <a href="#" className="adm-btn bg-linear-to-r from-pastel-mint to-pastel-blue w-full sm:w-auto text-center text-ink-dark px-6 py-3.5 sm:px-8 sm:py-5 md:px-12 md:py-6 rounded-full font-black tracking-widest uppercase border border-white premium-glow invisible text-[10px] md:text-sm tabular-nums">Begin Admissions</a>
        </div>
      </div>

    </div>
  );
});

export default MethodPanel;