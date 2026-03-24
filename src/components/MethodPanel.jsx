import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/observer';

gsap.registerPlugin(ScrollTrigger, TextPlugin, Observer);

export default function MethodPanel() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const tiltCardRef = useRef(null);
  
  // Section refs
  const founderSectionRef = useRef(null);
  const coursesSectionRef = useRef(null);
  const bonusesSectionRef = useRef(null);
  const admissionSectionRef = useRef(null);

  // Animation targets
  const founderBoxRef = useRef(null);
  const founderImgRef = useRef(null);
  const founderTextRef = useRef(null);
  const coursesRef = useRef([]);
  const bonusesRef = useRef([]);

  const founderOriginalText = "“In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion. I am confident in what we’ve created and in what we deliver. Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.”";

  const xTo = useRef(null);
  const yTo = useRef(null);

  useGSAP(() => {
    // Initialize 3D tilt
    if (tiltCardRef.current) {
      xTo.current = gsap.quickTo(tiltCardRef.current, "rotationY", { ease: "power4.out", duration: 0.5 });
      yTo.current = gsap.quickTo(tiltCardRef.current, "rotationX", { ease: "power4.out", duration: 0.5 });
    }

    const steps = [
      { id: 'founder', ref: founderSectionRef },
      { id: 'courses', ref: coursesSectionRef },
      { id: 'bonuses', ref: bonusesSectionRef },
      { id: 'admissions', ref: admissionSectionRef }
    ];

    let currentStepIndex = 0;
    let isAnimating = false;

    // Initial States
    gsap.set(founderBoxRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(founderImgRef.current, { scale: 0, opacity: 0, rotationY: -90 });
    if (founderTextRef.current) founderTextRef.current.innerHTML = "";
    gsap.set(coursesRef.current, { scale: 0.8, opacity: 0, y: 100 });
    gsap.set(bonusesRef.current, { scale: 0.8, opacity: 0, y: 80 });
    
    // Set admission states
    const admissionContent = admissionSectionRef.current?.querySelector('.admission-headline');
    const admissionText = admissionSectionRef.current?.querySelector('.admission-text');
    const admissionBtns = admissionSectionRef.current?.querySelectorAll('a');
    gsap.set([admissionContent, admissionText], { scale: 0.9, opacity: 0, y: 50 });
    if (admissionBtns) gsap.set(admissionBtns, { scale: 0.6, opacity: 0, y: 30 });

    const goToStep = (index, direction) => {
      if (isAnimating || index < 0 || index >= steps.length) return;
      isAnimating = true;
      currentStepIndex = index;
      const step = steps[index];
      const duration = direction === -1 ? 1.5 : 1.2;
      const ease = "power3.inOut";

      const masterTl = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        }
      });

      // Move wrapper to center the current section
      masterTl.to(wrapperRef.current, {
        y: -step.ref.current.offsetTop,
        duration: duration,
        ease: ease
      });

      // Trigger animations for the specific section
      if (step.id === 'founder') {
        masterTl.to(founderBoxRef.current, { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }, "-=0.6");
        masterTl.to(founderImgRef.current, { scale: 1, opacity: 1, rotationY: 0, duration: 1, ease: "back.out(1.5)" }, "-=0.8");
        masterTl.to(founderTextRef.current, { text: founderOriginalText, duration: 1.5, ease: "none" }, "-=0.4");
      } 
      else if (step.id === 'courses') {
        masterTl.to(coursesRef.current, { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "back.out(1.5)" }, "-=0.6");
      }
      else if (step.id === 'bonuses') {
        masterTl.to(bonusesRef.current, { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "back.out(1.5)" }, "-=0.6");
      }
      else if (step.id === 'admissions') {
        masterTl.to(admissionContent, { scale: 1, opacity: 1, y: 0, duration: 1.0, ease: "back.out(1.5)" }, "-=0.6");
        masterTl.to(admissionText, { scale: 1, opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
        if (admissionBtns) masterTl.to(admissionBtns, { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 0.8 }, "-=0.4");
      }
    };

    // First reveal
    goToStep(0, 1);

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: () => {
        if (!isAnimating) {
          if (currentStepIndex < steps.length - 1) {
            goToStep(currentStepIndex + 1, 1);
          } else {
            // Fling to FAQ
            const nextSection = containerRef.current.nextElementSibling;
            if (nextSection) {
              gsap.to(window, {
                scrollTo: nextSection.offsetTop,
                duration: 1.5,
                ease: "power4.inOut"
              });
            }
          }
        }
      },
      onUp: () => {
        if (!isAnimating) {
          if (currentStepIndex > 0) {
            goToStep(currentStepIndex - 1, -1);
          } else {
            // Fling to Legacy
            const prevSection = containerRef.current.previousElementSibling;
            if (prevSection) {
              gsap.to(window, {
                scrollTo: prevSection.offsetTop,
                duration: 1.5,
                ease: "power4.inOut"
              });
            }
          }
        }
      },
      onChange: (self) => {
        if (isAnimating) return;
        if (self.deltaY > 0 && currentStepIndex < steps.length - 1) self.event.preventDefault();
        if (self.deltaY < 0 && currentStepIndex > 0) self.event.preventDefault();
      },
      tolerance: 20
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=350%",
      pin: true,
      onEnter: () => obs.enable(),
      onEnterBack: () => obs.enable(),
      onLeave: () => { obs.disable(); isAnimating = false; },
      onLeaveBack: () => { obs.disable(); isAnimating = false; },
    });

    return () => {
      obs.kill();
    };

  }, { scope: containerRef });

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    xTo.current(rotateY);
    yTo.current(rotateX);
  };

  const handleMouseLeave = () => {
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
  };

  return (
    <section ref={containerRef} className="relative z-20 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-obsidian-purple to-pitch-black block rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,1)] border-t border-fuchsia-500/20 m-0 p-0 overflow-hidden h-screen">
      
      <div ref={wrapperRef} className="w-full h-full relative will-change-transform">

        {/* SECTION 1: The Founder Note */}
        <div ref={founderSectionRef} className="w-full h-screen flex flex-col items-center justify-center perspective-[1000px] relative px-6 md:px-12">
          <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 text-center drop-shadow-[0_0_15px_rgba(46,211,162,0.8)] pt-20">A Note from the Founder</h2>
          
          <div ref={founderBoxRef} className="liquid-glass p-8 md:p-16 rounded-[3rem] border border-white/20 relative overflow-hidden group max-w-5xl mx-auto w-full shadow-[0_0_80px_rgba(192,38,211,0.35)] hover:shadow-[0_0_120px_rgba(192,38,211,0.55)] transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay"></div>
            
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start text-center md:text-left relative z-10 perspective-[1000px]">
              <div 
                ref={tiltCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative shrink-0 will-change-transform transform-style-3d cursor-crosshair transform-gpu"
              >
                 <div className="absolute inset-0 rounded-2xl bg-fuchsia-500/10 shadow-[0_0_50px_rgba(217,70,239,0.3)] translate-z-[10px]"></div>
                 <img ref={founderImgRef} src="./founder-guitar.jpg" alt="Micky Dixit - Founder" className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-2xl object-cover border-2 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10 translate-z-[50px]" />
              </div>
              
              <div className="flex flex-col justify-center translate-z-[30px] transform-style-3d md:mt-4">
                <h3 className="text-3xl lg:text-5xl font-light text-white mb-2 drop-shadow-lg">Micky Dixit</h3>
                <p className="text-neon-mint tracking-widest uppercase font-bold text-xs lg:text-sm mb-6 drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">Founder & Head Guitar Coach</p>
                <p ref={founderTextRef} className="text-neutral-200 leading-relaxed font-light text-xl md:text-2xl text-serif-italic translate-z-[20px] transform-style-3d min-h-[150px]">
                  {/* Typed dynamically  */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Featured Courses Display */}
        <div ref={coursesSectionRef} className="w-full h-screen flex flex-col justify-center relative px-6 md:px-12 pt-20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent"></div>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Our Curriculum</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500 drop-shadow-[0_0_20px_rgba(232,121,249,0.5)]">Courses</span></h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { title: "Hobby Courses", price: "₹3200/Mo Onwards", stats: "2500+ Alums", color: "fuchsia" },
                { title: "Rhythm Grades", price: "₹3200/Mo Onwards", stats: "2000+ Alums", color: "teal" },
                { title: "Lead Grades", price: "₹3600/Mo Onwards", stats: "1800+ Alums", color: "amber" },
                { title: "Finger-picking", price: "₹3600/Mo Onwards", stats: "1250+ Alums", color: "purple" }
              ].map((course, idx) => (
                <div 
                  key={idx}
                  ref={el => coursesRef.current[idx] = el} 
                  className={`relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-${course.color}-400/50 hover:bg-${course.color}-500/[0.05] transition-all duration-500 group overflow-hidden shadow-2xl flex flex-col items-center text-center`}
                >
                  <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${course.color}-500/10 rounded-full blur-[40px] group-hover:bg-${course.color}-500/20 transition-colors`}></div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-white/90 transition-colors">{course.title}</h3>
                  <p className="text-neutral-500 text-[10px] tracking-[0.2em] font-bold uppercase mb-8">{course.price}</p>
                  
                  <div className="mt-auto space-y-4 w-full">
                    <div className="text-neutral-400 font-medium text-sm tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">{course.stats}</div>
                    <div className="h-px w-0 bg-white/20 group-hover:w-full transition-all duration-700 mx-auto"></div>
                    <div className={`liquid-glass py-3 px-6 rounded-xl border border-white/20 text-[10px] items-center justify-center font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-2 text-${course.color}-400`}>
                      Explore <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: The Bonuses Display */}
        <div ref={bonusesSectionRef} className="w-full h-screen flex flex-col justify-center relative px-6 md:px-12 pt-20">
           <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent"></div>
           <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Academy Perks</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-teal-400 drop-shadow-[0_0_20px_rgba(46,211,162,0.5)]">Bonuses</span></h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
               {[
                { title: "Mentor Support", desc: "Direct access to mentors for your doubts anytime.", icon: "💎", color: "blue" },
                { title: "Backup Classes", desc: "Missed a session? We provide backup recordings.", icon: "📼", color: "emerald" },
                { title: "Certificates", desc: "Formal grading certificates for every module.", icon: "📜", color: "amber" },
                { title: "Performances", desc: "Stage opportunities to showcase your talent.", icon: "🎸", color: "rose" }
              ].map((bonus, idx) => (
                <div 
                  key={idx}
                  ref={el => bonusesRef.current[idx] = el}
                  className={`bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:bg-${bonus.color}-500/[0.05] hover:border-${bonus.color}-500/30 transition-all duration-500 group shadow-2xl h-full`}
                >
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{bonus.icon}</div>
                  <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{bonus.title}</h4>
                  <p className="text-neutral-400 text-sm font-light leading-relaxed">{bonus.desc}</p>
                </div>
              ))}
            </div>
           </div>
        </div>

        {/* SECTION 4: High-impact Brochure CTA */}
        <div ref={admissionSectionRef} className="w-full h-screen flex flex-col items-center justify-center text-center relative px-6 md:px-12 pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="admission-headline text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tight drop-shadow-2xl relative z-10 block w-full">
            Admissions <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570] drop-shadow-[0_0_40px_rgba(46,211,162,0.6)]">Are Open</span>
          </h2>
          <p className="admission-text text-xl md:text-2xl text-neutral-300 font-light max-w-3xl mx-auto mb-16 text-serif-italic relative z-10 drop-shadow-md">
            Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10">
            <a href="https://www.yangerila.com/demo_form.html" target="_blank" rel="noreferrer" className="liquid-glass w-full sm:w-auto text-center px-12 py-6 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 border border-white/30">
              Free Demo Session
            </a>
            <a href="https://www.yangerila.com/admin_form.html" target="_blank" rel="noreferrer" className="liquid-glass bg-neon-mint/20 w-full sm:w-auto text-center text-neon-mint px-12 py-6 rounded-full font-black tracking-widest uppercase hover:bg-neon-mint hover:text-pitch-black transition-all duration-300 shadow-[0_0_40px_rgba(46,211,162,0.6)] hover:shadow-[0_0_60px_rgba(46,211,162,1)] border border-neon-mint/50">
              Begin Admissions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
