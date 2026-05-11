import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Zap, Music, Star, Activity, X, Check, ChevronRight } from 'lucide-react';
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

const bonusData = [
  {
    id: 'referral',
    title: "Referral Reward",
    subtitle: "INR 1,000 Amazon Gift Card",
    validity: "Always Active",
    type: "form",
    heading: "Referral Reward",
    desc: "Know someone interested in learning guitar? Refer them to Yangerila Creative Studio for a free demo session. If they join, you'll receive an Amazon gift card worth ₹1000 as our thank-you for spreading the word.",
  },
  {
    id: 'group',
    title: "United We Stand",
    subtitle: "30% OFF - Group Discount",
    validity: "Always Active",
    type: "text",
    heading: "United we stand",
    desc: "Learning is more fun together! Bring a friend, colleague, or family member along, and everyone joining as a group will receive 30% off the first month's fee. This offer is always active and open for all new group admissions.",
  },
  {
    id: 'student_ref',
    title: "Student Referral",
    subtitle: "50% OFF - Next Fee",
    validity: "Always Active",
    type: "form",
    heading: "Student Referral",
    desc: "Share your experience and get 50% off your next month's fee when your referral joins! (Discount applies only to the referring student).",
  },
  {
    id: 'festive',
    title: "Festive Discount",
    subtitle: "Diwali 2025",
    validity: "Limited Period",
    type: "code",
    heading: "Celebrate Diwali with Us",
    desc: "Hurry! Come Grab this opportunity to learn a new skill in this festive season, Yangerila Creative Studio — Offers a limited-time Diwali offer: 20% off your first month.",
    code: "YangerilaDiwali25"
  }
];

const MethodPanel = React.memo(function MethodPanel({ step, children, isReversingRef }) {
  const containerRef = useRef(null);

  const founderContainerRef = useRef(null);
  const founderContainerRect = useRef(null);
  const founderTitleRef = useRef(null);
  const founderQuoteRef = useRef(null);
  const founderAuthorRef = useRef(null);
  const tiltCardRef = useRef(null);
  const quoteParagraphsRef = useRef([]);

  const accordionRef = useRef(null);
  const panelsRef = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [activeBonus, setActiveBonus] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Swipe gesture tracking ref
  const touchStartData = useRef({ y: 0, isAtTop: false, valid: false });

  const bonusesRef = useRef([]);
  const admissionSectionRef = useRef(null);

  const [activeAdmissionTab, setActiveAdmissionTab] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('demo');

  const xTo = useRef(null);
  const yTo = useRef(null);
  const tiltRafRef = useRef(null);

  // Cache founder bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (founderContainerRef.current) {
        founderContainerRect.current = founderContainerRef.current.getBoundingClientRect();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetAccordion = useCallback(() => {
    setExpandedIndex(null);
  }, []);

  useEffect(() => {
    if (step > 6) resetAccordion();
    if (step !== 8) setActiveBonus(null);
    if (step !== 9) {
      setActiveAdmissionTab(null);
      setIsModalOpen(false);
    }
    // Update rect when entering founder step
    if (step === 5 && founderContainerRef.current) {
      founderContainerRect.current = founderContainerRef.current.getBoundingClientRect();
    }
  }, [step, resetAccordion]);

  const handlePanelClick = useCallback((index) => {
    if (expandedIndex === index) {
      resetAccordion();
    } else {
      setExpandedIndex(index);
    }
  }, [expandedIndex, resetAccordion]);

  const handleBonusClick = useCallback((idx) => {
    if (activeBonus !== idx) {
      if (isMobile) {
        window.history.pushState({ bonusOpen: true }, '');
      }
      setActiveBonus(idx);
    }
  }, [activeBonus, isMobile]);

  const handleCloseBonus = useCallback((e) => {
    if (e) e.stopPropagation();
    if (window.history.state?.bonusOpen) {
      window.history.back();
    } else {
      setActiveBonus(null);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e) => {
      if (activeBonus !== null) {
        setActiveBonus(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeBonus]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // NATIVE SWIPE-BACK LOGIC
  const handleSwipeStart = (e) => {
    if (e.target.closest('input, textarea, select, button')) {
      touchStartData.current.valid = false;
      return;
    }
    touchStartData.current = {
      y: e.touches[0].clientY,
      isAtTop: e.currentTarget.scrollTop <= 5,
      valid: true
    };
  };

  const handleSwipeEnd = (e, backAction) => {
    if (!touchStartData.current.valid || !touchStartData.current.isAtTop) return;
    const deltaY = e.changedTouches[0].clientY - touchStartData.current.y;

    if (deltaY > 70) {
      e.stopPropagation();
      setTimeout(() => {
        backAction();
      }, 50);
    }
  };

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
        const isMobileView = window.innerWidth < 768;
        gsap.fromTo(panels,
          { autoAlpha: 0, x: isMobileView ? 0 : -100, y: isMobileView ? 100 : 0 },
          { autoAlpha: 1, x: 0, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)", delay: 0.2 }
        );
      } else if (panels.length > 0) {
        gsap.set(panels, { autoAlpha: 1, x: 0, y: 0 });
      }
    }

    if (step === 8) {
      if (isReversing) {
        gsap.fromTo(bonusesRef.current,
          { scale: 0.9, autoAlpha: 0, y: -50 },
          { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)", delay: 0.2 }
        );
      } else {
        gsap.fromTo(bonusesRef.current,
          { scale: 0.8, autoAlpha: 0, y: 80 },
          { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)", delay: 0.2 }
        );
      }
    } else {
      gsap.to(bonusesRef.current, { autoAlpha: 0, duration: 0.3 });
    }

    if (step === 9) {
      const mainBlock = admissionSectionRef.current?.querySelector('.admission-main-block');
      if (isReversing) {
        gsap.set(mainBlock, { autoAlpha: 1, y: 0, scale: 1 });
      } else {
        gsap.fromTo(mainBlock, { autoAlpha: 0, y: 50, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)", delay: 0.2 });
      }
    }
  }, { scope: containerRef, dependencies: [step, resetAccordion] });

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current || !founderContainerRect.current) return;
    cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      const rect = founderContainerRect.current;
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

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCardLayout = (idx, activeIndex) => {
    const gap = isMobile ? 6 : 16;

    if (activeIndex === null) {
      const isRight = idx % 2 === 1;
      const isBottom = idx >= 2;
      return {
        width: `calc(50% - ${gap / 2}px)`,
        height: `calc(50% - ${gap / 2}px)`,
        left: isRight ? `calc(50% + ${gap / 2}px)` : '0px',
        top: isBottom ? `calc(50% + ${gap / 2}px)` : '0px',
        zIndex: 10
      };
    } else {
      if (idx === activeIndex) {
        if (isMobile) {
          return {
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            zIndex: 20
          };
        } else {
          return {
            width: '100%',
            height: `calc(68% - ${gap / 2}px)`,
            left: '0px',
            top: '0px',
            zIndex: 20
          };
        }
      } else {
        if (isMobile) {
          const isRight = idx % 2 === 1;
          const isBottom = idx >= 2;
          return {
            width: `calc(50% - ${gap / 2}px)`,
            height: `calc(50% - ${gap / 2}px)`,
            left: isRight ? '150%' : '-50%',
            top: isBottom ? '150%' : '-50%',
            zIndex: 5
          };
        } else {
          let inactivePosition = idx;
          if (idx > activeIndex) inactivePosition -= 1;
          const wCalc = `calc((100% - ${gap * 2}px) / 3)`;
          let leftCalc = '0px';
          if (inactivePosition === 1) leftCalc = `calc(${wCalc} + ${gap}px)`;
          if (inactivePosition === 2) leftCalc = `calc((${wCalc} * 2) + ${gap * 2}px)`;

          return {
            width: wCalc,
            height: `calc(32% - ${gap / 2}px)`,
            left: leftCalc,
            top: `calc(68% + ${gap / 2}px)`,
            zIndex: 5
          };
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col shrink-0 relative pointer-events-auto border-t-[3px] border-ink-dark/10 bg-transparent">

      {/* Founder Section */}
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
              <div className="founder_image_box w-auto h-full aspect-[3/4] md:w-[320px] lg:w-[400px] md:h-auto bg-paper-bg border-10 md:border-16 border-paper-bg shadow-[0_20px_50px_rgba(26,26,26,0.3)] overflow-hidden pointer-events-none">
                <img src={`${import.meta.env.BASE_URL}founder-guitar.jpg`} alt="Micky Dixit - Y Studio Founder" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Curriculum Section */}
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

      {/* Bonuses & Discount FLIP-style Layout Section */}
      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 bg-transparent border-t-[3px] border-ink-dark/10 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full pb-8">

          <div className="text-center shrink-0 mb-4 md:mb-10 w-full">
            <h3 className="text-4xl sm:text-5xl md:text-7xl font-elegant-serif font-black text-ink-dark tracking-tighter leading-tight">
              Bonuses & <span className="text-accent-teal">Discount</span>
            </h3>
            <p className="text-accent-teal font-elegant-serif italic text-lg sm:text-xl md:text-3xl mt-1 md:mt-2">
              Regularly Updated Offers
            </p>
          </div>

          <div className="relative flex-1 w-full max-w-4xl lg:max-w-5xl mx-auto min-h-[400px] perspective-[2000px]">
            {bonusData.map((bonus, idx) => {
              const isActive = activeBonus === idx;
              const hasActive = activeBonus !== null;
              const isInactive = hasActive && !isActive;

              const layoutStyle = getCardLayout(idx, activeBonus);

              return (
                <div
                  key={idx}
                  ref={el => bonusesRef.current[idx] = el}
                  className="absolute opacity-0"
                  style={{
                    width: layoutStyle.width,
                    height: layoutStyle.height,
                    left: layoutStyle.left,
                    top: layoutStyle.top,
                    zIndex: layoutStyle.zIndex,
                    transition: 'width 0.8s cubic-bezier(0.25, 1, 0.4, 1), height 0.8s cubic-bezier(0.25, 1, 0.4, 1), left 0.8s cubic-bezier(0.25, 1, 0.4, 1), top 0.8s cubic-bezier(0.25, 1, 0.4, 1)'
                  }}
                >
                  <div
                    onClick={() => { if (!isActive) handleBonusClick(idx); }}
                    className="w-full h-full relative cursor-pointer preserve-3d premium-glow"
                    style={{
                      transform: isActive ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.4, 1)'
                    }}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden bg-paper-bg rounded-2xl md:rounded-3xl border-2 border-ink-dark/15 shadow-sm overflow-hidden group hover:border-accent-teal/50 transition-colors duration-300">
                      <div className={`w-full h-full flex flex-col items-center justify-center text-center p-3 sm:p-5 md:p-8 origin-center transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.4,1)] ${isInactive ? 'scale-50 sm:scale-75 opacity-90' : 'scale-100 opacity-100 group-hover:scale-105'}`}>
                        <h4 className={`text-base sm:text-xl md:text-3xl lg:text-4xl font-technical-sans font-black mb-1 md:mb-2 tracking-tighter leading-tight uppercase ${idx === 1 || idx === 2 ? 'text-accent-magenta' : 'text-accent-teal'}`}>
                          {bonus.title}
                        </h4>
                        <p className="text-ink-dark font-bold font-technical-sans tracking-wide text-[9px] sm:text-xs md:text-sm mb-2 md:mb-4 uppercase">
                          {bonus.subtitle}
                        </p>
                        <p className="text-ink-medium/70 font-bold font-technical-sans text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-widest">
                          Valid till: {bonus.validity}
                        </p>

                        <div className={`overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.4,1)] flex items-center justify-center ${isInactive ? 'h-0 opacity-0 mt-0' : 'h-5 md:h-6 opacity-100 mt-2 md:mt-5'}`}>
                          <p className="text-[6px] sm:text-[7px] md:text-[9px] text-ink-dark/50 font-black font-technical-sans uppercase tracking-[0.2em] bg-ink-dark/5 px-3 py-1.5 rounded-full whitespace-nowrap">
                            Tap to reveal
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card (Expanded Content with Swipe Logic) */}
                    <div className="absolute inset-0 backface-hidden bg-accent-magenta rounded-2xl md:rounded-3xl border-4 border-accent-magenta shadow-[0_15px_40px_rgba(227,66,52,0.4)] overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>

                      <button
                        onClick={handleCloseBonus}
                        className={`absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 bg-white/20 hover:bg-white text-white hover:text-accent-magenta rounded-full transition-all z-50 pointer-events-auto ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                      >
                        <X size={isMobile ? 14 : 20} strokeWidth={3} />
                      </button>

                      <div
                        onTouchStart={handleSwipeStart}
                        onTouchEnd={(e) => handleSwipeEnd(e, handleCloseBonus)}
                        className={`w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto scrollbar-hide transition-all duration-700 delay-[100ms] pointer-events-auto ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${isActive && isMobile ? 'mobile-scroll-lock' : ''}`}
                      >

                        <h4 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black font-technical-sans text-white mb-2 md:mb-4 uppercase tracking-tighter leading-none shrink-0">
                          {bonus.heading}
                        </h4>
                        <p className="text-white/95 font-elegant-serif text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-2xl mb-4 md:mb-6 shrink-0">
                          {bonus.desc}
                        </p>

                        {bonus.type === "form" && (
                          <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-[95%] sm:max-w-md md:max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 shrink-0 mx-auto">
                            <input type="text" placeholder="Your Name *" required className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-[9px] sm:text-[11px] md:text-xs font-technical-sans font-bold focus:outline-none focus:border-white transition-colors" />
                            <input type="text" placeholder="Your Contact Number *" required className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-[9px] sm:text-[11px] md:text-xs font-technical-sans font-bold focus:outline-none focus:border-white transition-colors" />
                            <input type="text" placeholder={bonus.id === 'student_ref' ? "New Student's Name *" : "Referred Person's Name *"} required className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-[9px] sm:text-[11px] md:text-xs font-technical-sans font-bold focus:outline-none focus:border-white transition-colors" />
                            <input type="text" placeholder={bonus.id === 'student_ref' ? "New Student's Contact *" : "Referred Person's Contact *"} required className="w-full bg-white/10 border border-white/30 text-white placeholder:text-white/60 px-3 py-2 sm:py-2.5 md:py-3 rounded-lg text-[9px] sm:text-[11px] md:text-xs font-technical-sans font-bold focus:outline-none focus:border-white transition-colors" />
                            <button type="submit" className="md:col-span-2 mt-1 sm:mt-2 md:mt-0 bg-white text-accent-magenta hover:bg-ink-dark hover:border-ink-dark hover:text-white border-2 border-transparent px-4 py-2 sm:py-3 rounded-lg text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest transition-all w-full cursor-pointer">Submit Referral</button>
                          </form>
                        )}

                        {bonus.type === "text" && (
                          <button className="bg-white text-accent-magenta hover:bg-ink-dark hover:border-ink-dark hover:text-white border-2 border-transparent px-6 sm:px-8 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all mt-2 shrink-0 cursor-pointer">
                            Claim Group Offer
                          </button>
                        )}

                        {bonus.type === "code" && (
                          <div className="flex flex-col items-center gap-3 shrink-0">
                            <div className="flex items-center gap-3 border-2 border-dashed border-white/50 bg-white/10 rounded-xl px-4 py-3 sm:px-6 sm:py-4">
                              <span className="text-white font-technical-sans font-black tracking-widest text-sm sm:text-lg md:text-xl">{bonus.code}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCopyCode(bonus.code); }}
                                className="ml-2 sm:ml-4 bg-white text-accent-magenta hover:bg-ink-dark hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedCode ? <><Check size={12} /> Copied!</> : 'Copy'}
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Interactive Admission & Demo Section */}
      <div ref={admissionSectionRef} className="w-full h-dvh flex flex-col items-center justify-center text-center relative px-4 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0 overflow-hidden transition-colors duration-700 pointer-events-auto" style={{ backgroundColor: activeAdmissionTab === 'demo' ? 'var(--color-pastel-mint)' : activeAdmissionTab === 'admission' ? 'var(--color-pastel-blue)' : 'transparent' }}>

        {/* Dynamic Background Overlays for smooth tinting */}
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${activeAdmissionTab === 'demo' ? 'bg-pastel-mint/30 opacity-100' : activeAdmissionTab === 'admission' ? 'bg-pastel-blue/20 opacity-100' : 'opacity-0'}`} />

        <div className="admission-main-block relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full invisible">

          {/* Default Start State */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeAdmissionTab === null ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-16 scale-95 pointer-events-none'}`}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-ink-dark font-technical-sans mb-4 md:mb-8 uppercase tracking-tighter tabular-nums leading-none">
              Start Your <br className="hidden sm:block" />
              <span className="text-accent-teal">Journey</span>
            </h2>
            <p className="text-sm sm:text-lg md:text-2xl text-ink-medium font-medium max-w-2xl mx-auto mb-10 md:mb-16 text-serif-italic px-2 sm:px-4 leading-relaxed">
              Curious about mastering the guitar? Whether you want to explore our teaching style or are ready to enroll, choose your path below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full px-4">
              <button onClick={() => setActiveAdmissionTab('demo')} className="bg-paper-bg hover:bg-white w-full sm:w-auto text-center px-8 py-4 md:px-12 md:py-5 rounded-full text-ink-dark font-black font-technical-sans tracking-widest uppercase border-2 border-ink-dark/20 premium-glow text-[10px] md:text-sm tabular-nums transition-colors cursor-pointer">
                Free Demo
              </button>
              <span className="text-ink-dark/40 italic font-medium font-elegant-serif">or</span>
              <button onClick={() => setActiveAdmissionTab('admission')} className="bg-ink-dark hover:bg-accent-teal w-full sm:w-auto text-center px-8 py-4 md:px-12 md:py-5 rounded-full text-white font-black font-technical-sans tracking-widest uppercase premium-glow text-[10px] md:text-sm tabular-nums transition-colors cursor-pointer">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Expanded Demo State */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] delay-100 ${activeAdmissionTab === 'demo' ? 'opacity-100 visible translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 invisible translate-y-16 scale-95 pointer-events-none'}`}>
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
              <div className="w-full flex justify-center mb-6 md:mb-10">
                <button onClick={() => setActiveAdmissionTab(null)} className="flex items-center gap-2 text-ink-dark/60 hover:text-ink-dark font-black font-technical-sans uppercase tracking-widest text-[9px] sm:text-[10px] transition-colors cursor-pointer border-b-2 border-transparent hover:border-ink-dark pb-1">
                  ← Back to Options
                </button>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-ink-dark font-technical-sans mb-4 md:mb-6 uppercase tracking-tighter tabular-nums leading-none">
                Demo <span className="text-accent-teal">Session</span>
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-ink-dark/90 font-medium max-w-3xl mx-auto mb-8 md:mb-12 font-elegant-serif px-2 sm:px-4 leading-relaxed">
                Come and experience our uniquely designed demo session. Unlike typical trial classes, this session gives you a complete overview of guitar types, playing techniques, and all the essential information every beginner should know before starting their journey. Best of all—it's completely free and online.
              </p>
              <button onClick={() => openModal('demo')} className="bg-ink-dark hover:bg-white hover:text-ink-dark w-full sm:w-auto text-center text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-black font-technical-sans tracking-widest uppercase border-2 border-ink-dark shadow-xl text-[10px] md:text-sm tabular-nums transition-all cursor-pointer">
                Book Demo Now
              </button>
            </div>
          </div>

          {/* Expanded Admission State */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] delay-100 ${activeAdmissionTab === 'admission' ? 'opacity-100 visible translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 invisible translate-y-16 scale-95 pointer-events-none'}`}>
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
              <div className="w-full flex justify-center mb-6 md:mb-10">
                <button onClick={() => setActiveAdmissionTab(null)} className="flex items-center gap-2 text-ink-dark/60 hover:text-ink-dark font-black font-technical-sans uppercase tracking-widest text-[9px] sm:text-[10px] transition-colors cursor-pointer border-b-2 border-transparent hover:border-ink-dark pb-1">
                  ← Back to Options
                </button>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-ink-dark font-technical-sans mb-4 md:mb-6 uppercase tracking-tighter tabular-nums leading-none">
                Admissions
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-ink-dark/90 font-medium max-w-3xl mx-auto mb-8 md:mb-12 font-elegant-serif px-2 sm:px-4 leading-relaxed">
                Interested in joining us? Simply fill out this form, and our Student Relationship Manager (SRM) will contact you to answer all your queries. Every student is given a demo session first, and once that's complete, your SRM will personally guide you through the admission process.
              </p>
              <button onClick={() => openModal('join')} className="bg-ink-dark hover:bg-white hover:text-ink-dark w-full sm:w-auto text-center text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-black font-technical-sans tracking-widest uppercase border-2 border-ink-dark shadow-xl text-[10px] md:text-sm tabular-nums transition-all cursor-pointer">
                Fill This Form
              </button>
            </div>
          </div>

        </div>

        {/* Global On-Screen Popup Modal for Forms (Absolute to Section instead of Fixed) */}
        {isModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink-dark/80 backdrop-blur-md transition-opacity duration-300 pointer-events-auto">
            <div className="bg-ink-dark/95 border border-accent-teal/30 p-6 md:p-8 lg:p-10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative flex flex-col transform transition-transform duration-500 scale-100">

              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/5 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer">
                <X size={20} strokeWidth={2.5} />
              </button>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-technical-sans text-accent-teal mb-4 md:mb-6 text-center uppercase tracking-tight">
                {modalType === 'demo' ? 'Demo Session Form' : 'Admission Form'}
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="flex flex-col gap-3 sm:gap-4 w-full">

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">What brings you here? *</label>
                  <div className="relative">
                    <select defaultValue={modalType === 'demo' ? 'demo' : 'join'} className="w-full bg-white/5 border border-white/20 text-white px-4 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-technical-sans focus:outline-none focus:border-accent-teal transition-colors appearance-none cursor-pointer">
                      <option value="join" className="text-ink-dark">I want to join the academy</option>
                      <option value="know" className="text-ink-dark">I want to know more</option>
                      <option value="demo" className="text-ink-dark">I want to book a demo class</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">Name *</label>
                  <input type="text" placeholder="Enter your full name" required className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 px-4 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-technical-sans focus:outline-none focus:border-accent-teal transition-colors" />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">Phone Number *</label>
                  <input type="tel" placeholder="+91 98765 43210" required className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 px-4 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-technical-sans focus:outline-none focus:border-accent-teal transition-colors" />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">Age</label>
                  <input type="number" placeholder="Enter your age" className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 px-4 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-sm font-technical-sans focus:outline-none focus:border-accent-teal transition-colors" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-1 sm:mt-2">
                  <div className="flex flex-col gap-2 text-left flex-1">
                    <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">Have you learned guitar before? *</label>
                    <div className="flex gap-4 ml-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] sm:text-sm text-white font-technical-sans"><input type="radio" name="learned" value="yes" required className="accent-teal w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer" /> Yes</label>
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] sm:text-sm text-white font-technical-sans"><input type="radio" name="learned" value="no" required className="accent-teal w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer" /> No</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-left flex-1">
                    <label className="text-[10px] sm:text-xs font-bold text-white/80 font-technical-sans ml-1">Do you have a guitar? *</label>
                    <div className="flex gap-4 ml-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] sm:text-sm text-white font-technical-sans"><input type="radio" name="guitar" value="yes" required className="accent-teal w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer" /> Yes</label>
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] sm:text-sm text-white font-technical-sans"><input type="radio" name="guitar" value="no" required className="accent-teal w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer" /> No</label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="mt-2 sm:mt-4 bg-accent-teal hover:bg-white text-white hover:text-ink-dark font-black font-technical-sans py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm uppercase tracking-widest transition-colors shadow-lg cursor-pointer">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
});

export default MethodPanel;