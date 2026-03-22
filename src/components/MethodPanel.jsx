import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function MethodPanel() {
  const containerRef = useRef(null);
  const tiltCardRef = useRef(null);
  const marqueeRef = useRef(null);
  
  // New refs for animations
  const founderBoxRef = useRef(null);
  const founderImgRef = useRef(null);
  const founderTextRef = useRef(null);
  const coursesRef = useRef([]);
  const admissionRef = useRef(null);
  
  const founderOriginalText = "“In my 20+ years as a guitarist, I’ve learned, played, performed, and composed—but teaching has always had my heart. Helping students became my true passion. I am confident in what we’ve created and in what we deliver. Give us the opportunity to serve you, and I promise it will be one of the best decisions in your musical journey.”";

  const xTo = useRef(null);
  const yTo = useRef(null);

  useGSAP(() => {
    // Infinite Auto-looping Course Marquee calculation
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: 'none'
      });
    }

    // Initialize gsap.quickTo for hyper-performant cursor-driven 3D tilt
    if (tiltCardRef.current) {
      xTo.current = gsap.quickTo(tiltCardRef.current, "rotationY", { ease: "power4.out", duration: 0.5 });
      yTo.current = gsap.quickTo(tiltCardRef.current, "rotationX", { ease: "power4.out", duration: 0.5 });
    }

    // 1. Founder Note Bento Reveal + Typing Effect
    const founderTl = gsap.timeline({
      scrollTrigger: {
        trigger: founderBoxRef.current,
        start: "center center", 
        end: "+=40%",
        pin: true, // Forces a pause so the user reads it
        toggleActions: "play none none reverse"
      }
    });

    // Reset states
    gsap.set(founderBoxRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(founderImgRef.current, { scale: 0, opacity: 0, rotationY: -90 });
    if (founderTextRef.current) {
        founderTextRef.current.innerHTML = ""; // Clear text for typing
    }

    // Sequence
    founderTl.to(founderBoxRef.current, {
      scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)"
    });
    founderTl.to(founderImgRef.current, {
      scale: 1, opacity: 1, rotationY: 0, duration: 0.6, ease: "back.out(1.5)"
    }, "-=0.3");
    founderTl.to(founderTextRef.current, {
      text: founderOriginalText,
      duration: 3.2,
      ease: "none"
    }, "-=0.2");

    // 2. Featured Courses Bento Reveal
    gsap.set(coursesRef.current, { scale: 0.9, opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: coursesRef.current[0].parentElement,
      start: "center center",
      end: "+=40%",
      pin: true, // Forces a pause to showcase courses
      onEnter: () => {
        gsap.to(coursesRef.current, {
          scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)"
        });
      },
      onLeaveBack: () => {
        gsap.to(coursesRef.current, { scale: 0.9, opacity: 0, y: 40, duration: 0.3 });
      }
    });

    // 3. Admissions Open Bento Reveal
    const btnTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: admissionRef.current,
        start: "center center",
        end: "+=40%",
        pin: true, // Forces a pause on the CTA
        toggleActions: "play none none reverse"
      }
    });

    btnTimeline.fromTo(admissionRef.current,
      { scale: 0.9, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }
    );
    
    btnTimeline.fromTo(admissionRef.current.querySelectorAll('a'),
      { scale: 0.6, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" },
      "-=0.5"
    );

  }, { scope: containerRef });

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current || !xTo.current || !yTo.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-15 to 15 degrees max)
    const rotateX = ((y - centerY) / centerY) * -15; // Inverted for natural physical tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    // Use quickTo for zero-lag smooth interpolation
    xTo.current(rotateY);
    yTo.current(rotateX);
  };

  const handleMouseLeave = () => {
    if (xTo.current) xTo.current(0);
    if (yTo.current) yTo.current(0);
  };

  return (
    <section ref={containerRef} className="relative z-20 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-obsidian-purple to-pitch-black overflow-hidden flex flex-col pt-32 pb-0 rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,1)] border-t border-fuchsia-500/20">
      
      {/* SECTION 1: The Founder Note (Full Width & Height) */}
      <div className="w-full min-h-[80vh] section-padding flex flex-col items-center justify-center perspective-[1000px]">
        <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 text-center drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">A Note from the Founder</h2>
        
        <div 
          ref={founderBoxRef}
          className="liquid-glass p-12 md:p-20 rounded-[3rem] border border-white/20 relative overflow-hidden group max-w-5xl mx-auto w-full shadow-[0_0_80px_rgba(192,38,211,0.35)] hover:shadow-[0_0_120px_rgba(192,38,211,0.55)] transition-shadow duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay"></div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left relative z-10 perspective-[1000px]">
            <div 
              ref={tiltCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative shrink-0 will-change-transform transform-style-3d cursor-crosshair transform-gpu"
            >
               <div className="absolute inset-0 rounded-2xl bg-fuchsia-500/10 shadow-[0_0_50px_rgba(217,70,239,0.3)] translate-z-[10px]"></div>
               <img ref={founderImgRef} src="./founder-guitar.jpg" alt="Micky Dixit - Founder" className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-2xl object-cover border-2 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10 translate-z-[50px]" />
            </div>
            
            <div className="flex flex-col justify-center translate-z-[30px] transform-style-3d md:mt-4">
              <h3 className="text-4xl md:text-5xl font-light text-white mb-2 drop-shadow-lg">Micky Dixit</h3>
              <p className="text-neon-mint tracking-widest uppercase font-bold mb-8 drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">Founder & Head Guitar Coach</p>
              
              <p ref={founderTextRef} className="text-neutral-200 leading-relaxed font-light text-xl md:text-2xl text-serif-italic translate-z-[20px] transform-style-3d min-h-[150px]">
                {founderOriginalText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Featured Courses Display */}
      <div className="w-full py-32 my-12 relative overflow-hidden">
        {/* Soft immersive background for courses */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Our Curriculum</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500 drop-shadow-[0_0_20px_rgba(232,121,249,0.5)]">Courses</span></h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div ref={el => coursesRef.current[0] = el} className="liquid-glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 transition-all duration-500 group relative overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-[40px] group-hover:bg-fuchsia-500/40 transition-colors"></div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-fuchsia-300 transition-colors drop-shadow-md">Hobby Courses</h3>
              <p className="text-neutral-400 text-xs tracking-[0.2em] font-bold uppercase mb-8">₹3200/Mo Onwards</p>
              <div className="text-neon-mint font-bold text-xl drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">2500+ Students</div>
            </div>
            
            <div ref={el => coursesRef.current[1] = el} className="liquid-glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-teal-400/50 hover:bg-teal-400/10 transition-all duration-500 group relative overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/20 rounded-full blur-[40px] group-hover:bg-teal-500/40 transition-colors"></div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-teal-300 transition-colors drop-shadow-md">Rhythm Grades</h3>
              <p className="text-neutral-400 text-xs tracking-[0.2em] font-bold uppercase mb-8">₹3200/Mo Onwards</p>
              <div className="text-neon-mint font-bold text-xl drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">2000+ Students</div>
            </div>
            
            <div ref={el => coursesRef.current[2] = el} className="liquid-glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/10 transition-all duration-500 group relative overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] group-hover:bg-amber-500/40 transition-colors"></div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors drop-shadow-md">Lead Grades</h3>
              <p className="text-neutral-400 text-xs tracking-[0.2em] font-bold uppercase mb-8">₹3600/Mo Onwards</p>
              <div className="text-neon-mint font-bold text-xl drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">1800+ Students</div>
            </div>
            
            <div ref={el => coursesRef.current[3] = el} className="liquid-glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 hover:border-purple-400/50 hover:bg-purple-400/10 transition-all duration-500 group relative overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] group-hover:bg-purple-500/40 transition-colors"></div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors drop-shadow-md">Finger-picking</h3>
              <p className="text-neutral-400 text-xs tracking-[0.2em] font-bold uppercase mb-8">₹3600/Mo Onwards</p>
              <div className="text-neon-mint font-bold text-xl drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]">1250+ Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: High-impact Brochure CTA */}
      <div ref={admissionRef} className="w-full min-h-[60vh] section-padding flex flex-col items-center justify-center text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent pointer-events-none"></div>
        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tight drop-shadow-2xl relative z-10">
          Admissions <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570] drop-shadow-[0_0_40px_rgba(46,211,162,0.6)]">Are Open</span>
        </h2>
        <p className="text-2xl text-neutral-300 font-light max-w-3xl mx-auto mb-16 text-serif-italic relative z-10 drop-shadow-md">
          Whether you want to simply play your favourite songs, or pursue mastery of the instrument, our teaching style and courses adapt to your precise needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full max-w-2xl mx-auto relative z-10">
          <a href="https://www.yangerila.com/demo_form.html" target="_blank" rel="noreferrer" className="liquid-glass w-full sm:w-auto text-center px-12 py-6 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 border border-white/30">
            Free Demo Session
          </a>
          <a href="https://www.yangerila.com/admin_form.html" target="_blank" rel="noreferrer" className="bg-neon-mint w-full sm:w-auto text-center text-pitch-black px-12 py-6 rounded-full font-black tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(46,211,162,0.6)] hover:shadow-[0_0_60px_rgba(46,211,162,1)] border border-neon-mint">
            Begin Admissions
          </a>
        </div>
      </div>

    </section>
  );
}
