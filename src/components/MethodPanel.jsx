import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const MethodPanel = React.memo(function MethodPanel({ step, onComplete, isReversing }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const tiltCardRef = useRef(null);

  const founderSectionRef = useRef(null);
  const coursesSectionRef = useRef(null);
  const bonusesSectionRef = useRef(null);
  const admissionSectionRef = useRef(null);

  const founderBoxRef = useRef(null);
  const founderImgRef = useRef(null);
  const founderTextRef = useRef(null);
  const coursesRef = useRef([]);
  const bonusesRef = useRef([]);

  const [activeBonus, setActiveBonus] = useState(null);

  const founderOriginalText = "“In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion. I am confident in what we’ve created and in what we deliver. Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.”";

  const xTo = useRef(null);
  const yTo = useRef(null);

  const isActive = [5, 6, 8, 9].includes(step);

  useGSAP(() => {
    if (tiltCardRef.current) {
      xTo.current = gsap.quickTo(tiltCardRef.current, "rotationY", { ease: "power4.out", duration: 0.5 });
      yTo.current = gsap.quickTo(tiltCardRef.current, "rotationX", { ease: "power4.out", duration: 0.5 });
    }

    // 1. EXIT SCENARIOS (Timings tightened to 0.8s)
    if (step < 5) {
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
    }
    if (step === 7 || step > 9) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
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

    // 2. STEP LOGIC

    // Step 5: Note from Founder
    if (step === 5) {
      if (isReversing) {
        onStepEntry(founderSectionRef.current, true);
        gsap.set([founderBoxRef.current, founderImgRef.current], { scale: 1, autoAlpha: 1, rotationY: 0 });
        gsap.set(founderTextRef.current, { text: founderOriginalText });
      } else {
        onStepEntry(founderSectionRef.current, false);
        const tl = gsap.timeline({ onComplete });
        tl.to(founderBoxRef.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.2");
        tl.to(founderImgRef.current, { scale: 1, autoAlpha: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6");
        tl.to(founderTextRef.current, { text: founderOriginalText, duration: 1.5, ease: "none" }, "-=0.4");
      }
    }

    // Step 6: Our Courses
    if (step === 6) {
      if (isReversing) {
        onStepEntry(coursesSectionRef.current, true);
        gsap.set(coursesRef.current, { scale: 1, autoAlpha: 1, y: 0 });
      } else {
        onStepEntry(coursesSectionRef.current, false);
        gsap.to(coursesRef.current, {
          scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)", onComplete
        });
      }
    }

    // Step 8: Bonuses
    if (step === 8) {
      if (isReversing) {
        onStepEntry(bonusesSectionRef.current, true);
        gsap.set(bonusesRef.current, { scale: 1, autoAlpha: 1, y: 0 });
      } else {
        onStepEntry(bonusesSectionRef.current, false);
        gsap.to(bonusesRef.current, {
          scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)", onComplete
        });
      }
    }

    // Step 9: Admission
    if (step === 9) {
      const admissionContent = admissionSectionRef.current?.querySelector('.admission-headline');
      const admissionText = admissionSectionRef.current?.querySelector('.admission-text');
      const admissionBtns = admissionSectionRef.current?.querySelectorAll('a');

      if (isReversing) {
        onStepEntry(admissionSectionRef.current, true);
        gsap.set([admissionContent, admissionText, admissionBtns], { scale: 1, autoAlpha: 1, y: 0 });
      } else {
        onStepEntry(admissionSectionRef.current, false);
        const tl = gsap.timeline({ onComplete });
        tl.to(admissionContent, { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" });
        tl.to(admissionText, { scale: 1, autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");
        if (admissionBtns) tl.to(admissionBtns, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");
      }
    }

  }, { scope: containerRef, dependencies: [step, isReversing] });

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -15;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15;
    xTo.current(rotateY);
    yTo.current(rotateX);
  };

  const handleMouseLeave = () => {
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
  };

  return (
    <section
      ref={containerRef}
      className={`fixed inset-0 z-30 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-obsidian-purple to-pitch-black block overflow-hidden h-screen shadow-[0_-30px_60px_rgba(0,0,0,1)] border-t border-fuchsia-500/20 invisible ${!isActive ? 'pointer-events-none' : ''}`}
    >

      <div ref={wrapperRef} className="w-full h-fit relative will-change-transform">

        {/* SECTION 5: The Founder Note */}
        <div ref={founderSectionRef} className="w-full h-screen flex flex-col items-center justify-center relative px-6 md:px-12">
          <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 text-center drop-shadow-[0_0_15px_rgba(46,211,162,0.8)] pt-20">A Note from the Founder</h2>
          <div ref={founderBoxRef} className="liquid-glass p-8 md:p-16 rounded-[3rem] border border-white/20 relative overflow-visible group max-w-5xl mx-auto w-full h-fit shadow-[0_0_80px_rgba(192,38,211,0.35)] invisible scale-90">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start text-center md:text-left relative z-10 perspective-[1000px]">
              <div ref={tiltCardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative shrink-0 transform-style-3d cursor-crosshair transition-transform duration-500">
                <img ref={founderImgRef} src="./founder-guitar.jpg" alt="Micky Dixit" className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-2xl object-cover border-2 border-white/30 shadow-2xl invisible scale-0" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h3 className="text-2xl lg:text-4xl font-light text-white mb-2 uppercase tracking-tighter">Micky Dixit</h3>
                <p className="text-neon-mint tracking-widest uppercase font-bold text-xs mb-6">Founder & Head Guitar Coach</p>
                <p ref={founderTextRef} className="text-neutral-200 leading-relaxed font-light text-base md:text-xl lg:text-2xl text-serif-italic min-h-[160px]"></p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Courses */}
        <div ref={coursesSectionRef} className="w-full h-screen flex flex-col justify-center relative px-6 md:px-12 pt-20">
          <div className="max-w-7xl mx-auto w-full text-center">
            <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4">Our Curriculum</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-16">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">Courses</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { title: "Hobby Courses", price: "₹3200/Mo Onwards", stats: "2500+ Alums" },
                { title: "Rhythm Grades", price: "₹3200/Mo Onwards", stats: "2000+ Alums" },
                { title: "Lead Grades", price: "₹3600/Mo Onwards", stats: "1800+ Alums" },
                { title: "Finger-picking", price: "₹3600/Mo Onwards", stats: "1250+ Alums" }
              ].map((course, idx) => (
                <div key={idx} ref={el => coursesRef.current[idx] = el} className="relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 invisible scale-90 translate-y-10 group">
                  <h3 className="text-2xl font-black text-white mb-2">{course.title}</h3>
                  <p className="text-neutral-500 text-[10px] tracking-[0.2em] font-bold uppercase mb-8">{course.price}</p>
                  <div className="text-neutral-400 font-medium text-sm tracking-widest uppercase mb-4 opacity-60">{course.stats}</div>
                  <div className="liquid-glass py-3 px-6 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] flex gap-2 justify-center text-white/50">Explore →</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 8: Bonuses */}
        <div ref={bonusesSectionRef} className="w-full h-screen flex flex-col justify-center relative px-6 md:px-12 pt-20">
          <div className="max-w-7xl mx-auto w-full text-center">
            <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4">Exclusive Perks</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-16">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-teal-400">Rewards</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 perspective-[1500px]">
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
                  className="relative h-[250px] w-full cursor-pointer preserve-3d transition-transform duration-1000 invisible scale-90 translate-y-10"
                  style={{ transform: activeBonus === idx ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  <div className="absolute inset-0 backface-hidden liquid-glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center border border-white/10">
                    <h4 className={`text-4xl font-black mb-4 uppercase tracking-tighter ${idx === 1 || idx === 2 ? 'text-neon-mint' : 'text-white'}`}>{bonus.title}</h4>
                    <p className="text-neutral-400 text-xs font-light uppercase tracking-widest">{bonus.desc}</p>
                    <p className="text-[10px] text-white/20 mt-4 uppercase tracking-widest">Click to reveal</p>
                  </div>
                  <div className="absolute inset-0 backface-hidden liquid-glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center border border-neon-mint/30 bg-neon-mint/5" style={{ transform: 'rotateY(180deg)' }}>
                    <h4 className="text-xl font-bold text-neon-mint mb-4 uppercase tracking-widest">{bonus.desc}</h4>
                    <p className="text-white text-sm font-light leading-relaxed">{bonus.offer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 9: Admission */}
        <div ref={admissionSectionRef} className="w-full h-screen flex flex-col items-center justify-center text-center relative px-6 md:px-12 pt-20">
          <h2 className="admission-headline text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tight invisible translate-y-10">
            Admissions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570]">Are Open</span>
          </h2>
          <p className="admission-text text-xl md:text-2xl text-neutral-300 font-light max-w-3xl mx-auto mb-16 text-serif-italic invisible translate-y-10">
            Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10">
            <a href="#" className="liquid-glass w-full sm:w-auto text-center px-12 py-6 rounded-full text-white font-bold tracking-widest uppercase border border-white/30 invisible translate-y-10">Free Demo Session</a>
            <a href="#" className="liquid-glass bg-neon-mint/20 w-full sm:w-auto text-center text-neon-mint px-12 py-6 rounded-full font-black tracking-widest uppercase border border-neon-mint/50 invisible translate-y-10">Begin Admissions</a>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MethodPanel;