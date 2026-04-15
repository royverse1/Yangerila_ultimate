import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const MethodPanel = React.memo(function MethodPanel({ step, children }) {
  const containerRef = useRef(null);
  const tiltCardRef = useRef(null);

  const founderBoxRef = useRef(null);
  const founderImgRef = useRef(null);
  const founderTextRef = useRef(null);
  const coursesRef = useRef([]);
  const bonusesRef = useRef([]);
  const admissionSectionRef = useRef(null);

  const [activeBonus, setActiveBonus] = useState(null);

  const founderOriginalText = "In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion. I am confident in what we’ve created and in what we deliver. Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.";

  const xTo = useRef(null);
  const yTo = useRef(null);

  useGSAP(() => {
    if (tiltCardRef.current) {
      xTo.current = gsap.quickTo(tiltCardRef.current, "rotationY", { ease: "power4.out", duration: 0.5 });
      yTo.current = gsap.quickTo(tiltCardRef.current, "rotationX", { ease: "power4.out", duration: 0.5 });
    }

    if (step === 5) {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(founderBoxRef.current, { scale: 0.9, autoAlpha: 0, y: 50 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" });
      tl.fromTo(founderImgRef.current, { scale: 0, autoAlpha: 0, rotationY: 45 }, { scale: 1, autoAlpha: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6");
      gsap.set(founderTextRef.current, { text: "" });
      tl.to(founderTextRef.current, { text: founderOriginalText, duration: 1.5, ease: "none" }, "-=0.4");
    }

    if (step === 6) {
      gsap.fromTo(coursesRef.current,
        { scale: 0.9, autoAlpha: 0, y: 50 },
        { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)", delay: 0.2 }
      );
    }

    if (step === 8) {
      gsap.fromTo(bonusesRef.current,
        { scale: 0.9, autoAlpha: 0, y: 50 },
        { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)", delay: 0.2 }
      );
    }

    if (step === 9) {
      const admissionContent = admissionSectionRef.current?.querySelector('.admission-headline');
      const admissionText = admissionSectionRef.current?.querySelector('.admission-text');
      const admissionBtns = admissionSectionRef.current?.querySelectorAll('a');

      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(admissionContent, { scale: 0.9, autoAlpha: 0, y: 50 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" })
        .fromTo(admissionText, { scale: 0.9, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");
      if (admissionBtns) tl.fromTo(admissionBtns, { scale: 0.9, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.6 }, "-=0.4");
    }
  }, { scope: containerRef, dependencies: [step] });

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
    <div ref={containerRef} className="w-full flex flex-col shrink-0 relative pointer-events-auto border-t border-white/20 bg-transparent">

      {/* SECTION 5: The Founder Note */}
      <div className="w-full h-dvh flex flex-col items-center justify-center relative px-4 sm:px-6 md:px-12 shrink-0">
        <h2 className="text-accent-teal tracking-[0.3em] font-bold text-xs uppercase mb-8 md:mb-12 text-center">A Note from the Founder</h2>

        <div ref={founderBoxRef} className="bg-white/85 backdrop-blur-md p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/80 relative overflow-y-auto max-h-[80dvh] scrollbar-hide max-w-5xl mx-auto w-full shadow-xl invisible premium-glow">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start text-center md:text-left relative z-10 perspective-[1000px]">

            <div ref={tiltCardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative shrink-0 transform-style-3d cursor-crosshair transition-transform duration-500">
              <img ref={founderImgRef} src={`${import.meta.env.BASE_URL}founder-guitar.jpg`} alt="Micky Dixit" className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[320px] md:h-[320px] rounded-2xl object-cover border-4 border-white shadow-lg invisible" />
            </div>

            <div className="flex flex-col justify-center flex-1 relative">
              <h3 className="text-3xl md:text-5xl font-black text-ink-dark mb-1 uppercase tracking-tighter">Micky Dixit</h3>
              <p className="text-accent-teal tracking-widest uppercase font-bold text-[10px] md:text-xs mb-6 md:mb-8">Founder & Head Guitar Coach</p>

              <div className="relative">
                <span className="absolute -top-8 -left-4 md:-top-12 md:-left-8 text-7xl md:text-9xl text-pastel-mint/60 font-serif leading-none select-none">"</span>
                <p ref={founderTextRef} className="text-ink-dark leading-relaxed font-medium text-sm sm:text-lg md:text-2xl text-serif-italic relative z-10 min-h-[160px]"></p>
                <span className="absolute -bottom-12 right-0 text-7xl md:text-9xl text-pastel-blue/60 font-serif leading-none select-none">"</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 6: Courses (Perfect Mobile 2x2 Grid) */}
      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0">
        <div className="max-w-6xl mx-auto w-full text-center">
          <h2 className="text-accent-teal tracking-[0.3em] font-bold text-xs uppercase mb-3 md:mb-4">Our Curriculum</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-ink-dark uppercase tracking-tight mb-6 md:mb-16">Featured <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-magenta to-accent-teal">Courses</span></h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full px-2">
            {[
              { title: "Hobby Courses", price: "₹3200/Mo Onwards", stats: "2500+ Alums" },
              { title: "Rhythm Grades", price: "₹3200/Mo Onwards", stats: "2000+ Alums" },
              { title: "Lead Grades", price: "₹3600/Mo Onwards", stats: "1800+ Alums" },
              { title: "Finger-picking", price: "₹3600/Mo Onwards", stats: "1250+ Alums" }
            ].map((course, idx) => (
              <div key={idx} ref={el => coursesRef.current[idx] = el} className="relative p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white/85 backdrop-blur-md border border-white/80 invisible premium-glow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-xl md:text-2xl font-black text-ink-dark mb-1 md:mb-2 leading-tight">{course.title}</h3>
                  <p className="text-ink-medium text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] font-bold uppercase mb-3 md:mb-8">{course.price}</p>
                  <div className="text-ink-medium font-medium text-[9px] md:text-sm tracking-widest uppercase mb-3 md:mb-4 opacity-70">{course.stats}</div>
                </div>
                <div className="bg-white py-2 md:py-3 px-2 md:px-6 rounded-lg md:rounded-xl border border-ink-dark/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex gap-1 justify-center items-center text-ink-dark/70 hover:text-accent-teal transition-colors cursor-pointer">Explore &rarr;</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {children}

      {/* SECTION 8: Bonuses (Perfect Mobile 2x2 Grid) */}
      <div className="w-full h-dvh flex flex-col justify-center relative px-2 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0">
        <div className="max-w-6xl mx-auto w-full text-center">
          <h2 className="text-accent-teal tracking-[0.3em] font-bold text-xs uppercase mb-3 md:mb-4">Exclusive Perks</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-ink-dark uppercase tracking-tight mb-6 md:mb-16">Premium <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Rewards</span></h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 perspective-[1500px] w-full px-2">
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
                className="relative h-[130px] sm:h-[180px] md:h-[250px] w-full cursor-pointer preserve-3d transition-transform duration-1000 invisible premium-glow rounded-2xl md:rounded-[2.5rem]"
                style={{ transform: activeBonus === idx ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-white/85 backdrop-blur-md p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center border border-white/80 text-center">
                  <h4 className={`text-lg sm:text-2xl md:text-4xl font-black mb-1 md:mb-3 uppercase tracking-tighter ${idx === 1 || idx === 2 ? 'text-accent-teal' : 'text-ink-dark'}`}>{bonus.title}</h4>
                  <p className="text-ink-medium text-[8px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-widest">{bonus.desc}</p>
                  <p className="text-[7px] md:text-[10px] text-ink-dark/40 mt-2 md:mt-4 uppercase tracking-widest">Tap to reveal</p>
                </div>
                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden bg-white p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-pastel-mint shadow-lg text-center" style={{ transform: 'rotateY(180deg)' }}>
                  <h4 className="text-[10px] sm:text-sm md:text-xl font-bold text-accent-teal mb-1 md:mb-3 uppercase tracking-[0.1em] md:tracking-widest">{bonus.desc}</h4>
                  <p className="text-ink-dark text-[9px] sm:text-xs md:text-sm font-medium leading-snug md:leading-relaxed">{bonus.offer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 9: Admission */}
      <div ref={admissionSectionRef} className="w-full h-dvh flex flex-col items-center justify-center text-center relative px-4 sm:px-6 md:px-12 pt-16 md:pt-20 shrink-0">
        <h2 className="admission-headline text-4xl sm:text-5xl md:text-8xl font-black text-ink-dark mb-6 md:mb-8 uppercase tracking-tight invisible">
          Admissions <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Are Open</span>
        </h2>
        <p className="admission-text text-lg sm:text-xl md:text-2xl text-ink-medium font-light max-w-3xl mx-auto mb-12 md:mb-16 text-serif-italic invisible px-4">
          Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10 px-4">
          <a href="#" className="bg-white/90 backdrop-blur-md w-full sm:w-auto text-center px-8 md:px-12 py-5 md:py-6 rounded-full text-ink-dark font-black tracking-widest uppercase border border-ink-dark/10 premium-glow invisible text-xs md:text-sm">Free Demo Session</a>
          <a href="#" className="bg-linear-to-r from-pastel-mint to-pastel-blue w-full sm:w-auto text-center text-ink-dark px-8 md:px-12 py-5 md:py-6 rounded-full font-black tracking-widest uppercase border border-white premium-glow invisible text-xs md:text-sm">Begin Admissions</a>
        </div>
      </div>

    </div>
  );
});

export default MethodPanel;