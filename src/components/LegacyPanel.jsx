import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function LegacyPanel() {
  const containerRef = useRef(null);
  
  // Section refs for vertical navigation
  const wrapperRef = useRef(null);
  const textBlockRef = useRef(null);
  const timelineBlockRef = useRef(null);
  const statsBlockRef = useRef(null);
  
  // Inner refs
  const textContainerRef = useRef(null);
  const timelineWrapRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true,
      }
    });

    // Reset initial position
    gsap.set(wrapperRef.current, { y: 0 });

    // 1. Cinematic text word-by-word reveal
    const words = textContainerRef.current.querySelectorAll('.word');
    tl.fromTo(words, 
      { opacity: 0.1, y: 15 },
      { opacity: 1, y: 0, duration: 2.5, stagger: 0.05, ease: 'power4.out' }
    );
    
    tl.to({}, { duration: 0.5 }); // reading pause

    // 2. Scroll wrapper UP to center the timeline
    tl.to(wrapperRef.current, {
      y: () => {
        if (!timelineBlockRef.current) return 0;
        const top = timelineBlockRef.current.offsetTop;
        const h = timelineBlockRef.current.offsetHeight;
        const winH = window.innerHeight;
        return -(top + h / 2 - winH / 2);
      },
      duration: 1.8,
      ease: 'power2.inOut'
    });

    // 3. Horizontal scroll for the timeline
    const horizontalScroll = gsap.to(timelineWrapRef.current, {
      x: () => {
        // Evaluate dynamic width on resize or load
        const scrollW = timelineWrapRef.current?.scrollWidth || 0;
        const winW = window.innerWidth;
        // The +150 ensures the last item has breathing room on the right
        return -(scrollW - winW + 150);
      },
      ease: 'none',
      duration: 6 // Take plenty of the scrub duration for horizontal scrolling
    });
    tl.add(horizontalScroll, "+=0");

    // Reveal timeline nodes as they enter horizontally
    const nodes = gsap.utils.toArray('.timeline-node');
    nodes.forEach((node, i) => {
      const box = node.querySelector('.content-box');
      const line = node.querySelector('.vertical-line');
      const dot = node.querySelector('.center-dot');
      const isTop = i % 2 === 0;

      gsap.set([box, line, dot], { opacity: 0 });
      gsap.set(box, { y: isTop ? 40 : -40, scale: 0.95 });
      gsap.set(line, { scaleY: 0, transformOrigin: isTop ? "bottom" : "top" });
      gsap.set(dot, { scale: 0 });

      gsap.to(dot, {
        scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)",
        scrollTrigger: {
          trigger: node,
          containerAnimation: tl, // using outer timeline is valid since it animates wrapper
          start: "left 85%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.to(line, {
        scaleY: 1, opacity: 0.6, duration: 0.4, ease: "power4.out", delay: 0.1,
        scrollTrigger: {
          trigger: node,
          containerAnimation: tl,
          start: "left 85%",
          toggleActions: "play none none reverse"
        }
      });

      gsap.to(box, {
        y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power4.out", delay: 0.3,
        scrollTrigger: {
          trigger: node,
          containerAnimation: tl,
          start: "left 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // 4. Scroll wrapper UP to center the stats
    tl.to(wrapperRef.current, {
      y: () => {
        if (!statsBlockRef.current) return 0;
        const top = statsBlockRef.current.offsetTop;
        const h = statsBlockRef.current.offsetHeight;
        const winH = window.innerHeight;
        // We push it up enough so stats are visible above the fold
        return -(top + h / 2 - winH / 2);
      },
      duration: 1.8,
      ease: 'power2.inOut'
    }, "+=0.2");
    
    // Stats pop out
    const statCards = statsBlockRef.current.querySelectorAll('.stat-card');
    tl.fromTo(statCards, 
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "back.out(2)" },
      "-=1.0" // overlap with the upward scroll
    );

    // Stats counter up (scrubbed with scroll)
    const counters = statsBlockRef.current.querySelectorAll('.counter-val');
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      tl.fromTo(counter, 
        { innerText: 0 }, 
        { 
          innerText: target, 
          duration: 1.5, 
          snap: { innerText: 1 }, // GSAP built-in feature to round numbers
          ease: "power1.out"
        },
        "<" // start at the same time as pop out
      );
    });

    // final cushion
    tl.to({}, { duration: 0.5 });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="snap-section w-full h-[600vh] relative z-20">
      <section className="sticky top-0 w-full h-screen bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/30 via-obsidian-blue to-pitch-black overflow-hidden relative">
        
        {/* The entire sequence wrapper that mechanically moves up relative to sticky screen */}
        <div ref={wrapperRef} className="absolute top-0 left-0 w-full z-10 flex flex-col gap-[30vh] md:gap-[40vh] items-center text-center pb-[50vh] will-change-transform"> 
        
          {/* Cinematic Headline Block (Centered initially by pulling it down and transforming) */}
          <div ref={textBlockRef} className="px-6 md:px-24 w-full max-w-6xl mt-[50vh] -translate-y-1/2">
            <h2 ref={textContainerRef} className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-neutral-200 text-serif-italic shadow-none tracking-wide text-left md:text-center">
              {"Yangerila Creative Studio was born from a teacher's vision to revolutionize guitar education. What started as a modest endeavor to provide structured, progressive, and truly enjoyable music lessons has evolved into a comprehensive digital platform. Driven by an unwavering commitment to quality and a passion for student success, our method breaks down complex techniques into an accessible journey, ensuring that every learner—from complete beginners to advanced players—can find their rhythm and master their instrument with confidence.".split(' ').map((w, i) => (
                <span key={i} className="word inline-block mr-2 md:mr-3 mb-1 md:mb-2">{w}</span>
              ))}
            </h2>
          </div>

          {/* Horizontal Timeline Container Block */}
          <div ref={timelineBlockRef} className="w-full relative flex flex-col justify-center">
            
            {/* Glowing Continuous Central Thick Line */}
            <div className="absolute left-0 w-full h-[6px] md:h-[8px] rounded-full bg-white/10 top-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(255,255,255,0.1)] z-0">
               <div className="absolute inset-y-0 left-0 w-[200vw] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent blur-md opacity-30 animate-pulse"></div>
            </div>

            <div ref={timelineWrapRef} className="flex flex-nowrap items-center px-12 md:px-32 gap-0 w-max relative h-[60vh] md:h-[50vh]">
              {[
                { year: '2011', title: 'Rockford Academy', desc: "With this vision, our head guitar coach Micky Dixit started his own classes, 'Rockford Academy Of Music'. With over two decades of teaching experience, establishing our innovative styles.", color: 'text-blue-400', bg: 'bg-blue-400', border: 'border-blue-400' },
                { year: '2017', title: 'A New Identity', desc: "The academy was rebranded as a Guitar Specialty academy, giving birth to the new identity: 'Yangerila Creative Studio'.", color: 'text-purple-400', bg: 'bg-purple-400', border: 'border-purple-400' },
                { year: '2023', title: 'www.yangerila.com', desc: "We expanded our vision globally with our digital platform, breaking geographical barriers and connecting with passionate students worldwide.", color: 'text-fuchsia-400', bg: 'bg-fuchsia-400', border: 'border-fuchsia-400' },
                { year: '2025', title: 'Modular Structure', desc: "Integrating the Advanced Modular Grading Structure, a system that accelerates learning and helps everyone—school students, professionals, homemakers—make guitar a part of life.", color: 'text-neon-mint', bg: 'bg-neon-mint', border: 'border-neon-mint' },
                { year: 'Future', title: 'A Global Hub', desc: "Soon launching our learning app to host classes and serve as a hub for musicians to interact, dreaming of being a one-stop hub for all music learning.", color: 'text-teal-400', bg: 'bg-teal-400', border: 'border-teal-400' }
              ].map((item, idx) => {
                const isTop = idx % 2 === 0;
                return (
                  <div key={idx} className="timeline-node w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 relative flex flex-col items-center justify-center group h-full">
                    {/* Central Node */}
                    <div className={`center-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-4 ${item.border} shadow-[0_0_20px_rgba(255,255,255,0.6)] z-20 group-hover:scale-125 transition-transform duration-300`}></div>
                    
                    {/* Content Container (Alternating Top/Bottom) */}
                    <div className={`content-box absolute w-full px-6 flex flex-col ${isTop ? 'bottom-[55%] items-start text-left' : 'top-[55%] items-start text-left'}`}>
                      {/* Connecting Vertical Line */}
                      <div className={`vertical-line absolute left-1/2 ${isTop ? 'bottom-[-10%] h-[50px] border-l-2' : 'top-[-10%] h-[50px] border-l-2'} -translate-x-1/2 ${item.border} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:bg-white/10 group-hover:-translate-y-2 transition-all duration-300">
                        <h4 className={`text-3xl md:text-4xl font-black mb-2 ${item.color} drop-shadow-md`}>{item.year}</h4>
                        <h5 className="text-white font-bold tracking-widest uppercase mb-4 text-sm md:text-base opacity-90">{item.title}</h5>
                        <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liquid Glass Stat Cards with Heavy Glow Block */}
          <div ref={statsBlockRef} className="px-6 md:px-24 shrink-0 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 stat-cards-wrapper">
            <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
              <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"><span className="counter-val" data-target="20">0</span>+</span>
              <span className="text-sm tracking-widest text-[#a8b8b8] uppercase mt-3">Years Exp</span>
            </div>
            <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-neon-mint/30 shadow-[0_0_50px_rgba(46,211,162,0.25)]">
              <span className="text-5xl md:text-6xl font-black text-neon-mint drop-shadow-[0_0_20px_rgba(46,211,162,0.6)]"><span className="counter-val" data-target="4000">0</span>+</span>
              <span className="text-sm tracking-widest text-white uppercase mt-3">Students Taught</span>
            </div>
            <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
              <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"><span className="counter-val" data-target="12">0</span>+</span>
              <span className="text-sm tracking-widest text-[#a8b8b8] uppercase mt-3">Countries Worldwide</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
