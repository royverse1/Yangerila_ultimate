import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';

const LegacyPanel = React.memo(function LegacyPanel({ step, onComplete, isReversing }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const timelineBlockRef = useRef(null);
  const statsBlockRef = useRef(null);
  const timelineWrapRef = useRef(null);

  const [timelineIndex, setTimelineIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  // Sync refs to prevent stale closures in the Observer
  const timelineIndexRef = useRef(0);

  const timelineData = [
    { year: '2011', title: 'Rockford Academy', desc: "With this vision, our head guitar coach Micky Dixit started his own classes, 'Rockford Academy Of Music'. With over two decades of teaching experience, establishing our innovative styles.", color: 'text-blue-400', border: 'border-blue-400' },
    { year: '2017', title: 'A New Identity', desc: "The academy was rebranded as a Guitar Specialty academy, giving birth to the new identity: 'Yangerila Creative Studio'.", color: 'text-purple-400', border: 'border-purple-400' },
    { year: '2023', title: 'www.yangerila.com', desc: "We expanded our vision globally with our digital platform, breaking geographical barriers and connecting with passionate students worldwide.", color: 'text-fuchsia-400', border: 'border-fuchsia-400' },
    { year: '2025', title: 'Modular Structure', desc: "Integrating the Advanced Modular Grading Structure, a system that accelerates learning and helps everyone—school students, professionals, homemakers—make guitar a part of life.", color: 'text-neon-mint', border: 'border-neon-mint' },
    { year: 'Future', title: 'A Global Hub', desc: "Soon launching our learning app to host classes and serve as a hub for musicians to interact, dreaming of being a one-stop hub for all music learning.", color: 'text-teal-400', border: 'border-teal-400' }
  ];

  const isActive = step === 3 || step === 4;

  useGSAP(() => {
    const nodes = gsap.utils.toArray('.timeline-node');
    const statCards = statsBlockRef.current.querySelectorAll('.stat-card');
    const counters = statsBlockRef.current.querySelectorAll('.counter-val');

    // 1. EXIT SCENARIOS
    if (step < 3) {
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
      setShowArrows(false);
    }
    if (step > 4) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
      // Ensure local elements are hidden to prevent ghosting
      gsap.set([timelineBlockRef.current, statsBlockRef.current], { autoAlpha: 0, delay: 0.4 });
    }

    // 2. ENTRANCE SCENARIO: Step 3 (Timeline)
    if (step === 3) {
      const enterTl = gsap.timeline({
        onComplete: () => {
          setShowArrows(true);
          onComplete(); // Unlock scroll so the Observer below can take over
        }
      });

      if (isReversing) {
        gsap.set(timelineBlockRef.current, { autoAlpha: 1 });
        gsap.set(statsBlockRef.current, { autoAlpha: 0 });
        const timelineTop = -(timelineBlockRef.current.offsetTop + timelineBlockRef.current.offsetHeight / 2 - window.innerHeight / 2);
        enterTl.to(wrapperRef.current, { y: timelineTop, duration: 0.8, ease: "power3.inOut" });
      } else {
        gsap.set(timelineBlockRef.current, { autoAlpha: 1 });
        gsap.set(statsBlockRef.current, { autoAlpha: 0 });
        enterTl.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });

        const node = nodes[timelineIndex];
        const timelineTop = -(timelineBlockRef.current.offsetTop + timelineBlockRef.current.offsetHeight / 2 - window.innerHeight / 2);
        enterTl.to(wrapperRef.current, { y: timelineTop, duration: 0.8, ease: "power3.inOut" }, "-=0.4");

        // Set initial horizontal position
        const targetX = -node.offsetLeft + (window.innerWidth / 2 - node.offsetWidth / 2);
        gsap.set(timelineWrapRef.current, { x: targetX });

        // Reveal initial node
        const box = node.querySelector('.content-box');
        const line = node.querySelector('.vertical-line');
        const dot = node.querySelector('.center-dot');
        enterTl.to(dot, { scale: 1, autoAlpha: 1, duration: 0.4 }, "-=0.3");
        enterTl.to(line, { scaleY: 1, autoAlpha: 0.6, duration: 0.4 }, "-=0.2");
        enterTl.to(box, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6 }, "-=0.1");
      }
    }

    // 3. ENTRANCE SCENARIO: Step 4 (Stats)
    if (step === 4) {
      setShowArrows(false);
      const statsTop = -(statsBlockRef.current.offsetTop + statsBlockRef.current.offsetHeight / 2 - window.innerHeight / 2);

      gsap.set(statsBlockRef.current, { autoAlpha: 1 });
      const statsTl = gsap.timeline({ onComplete }); // Unlock scroll for global navigation after stats load

      // FIX: Safely pull container down if reversing from Step 5
      if (isReversing) {
        gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      }

      statsTl.to(wrapperRef.current, { y: statsTop, duration: 0.8, ease: "power3.inOut" });
      statsTl.to(statCards, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(2)" }, "-=0.2");

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        statsTl.fromTo(counter, { innerText: 0 }, {
          innerText: target,
          duration: 1.5,
          snap: { innerText: 1 },
          ease: "power1.out"
        }, "<");
      });
    }

  }, { scope: containerRef, dependencies: [step, isReversing] });

  // 4. ISOLATED HORIZONTAL NAVIGATION (Observer for Step 3)
  useGSAP(() => {
    if (step !== 3) return;

    const nodes = gsap.utils.toArray('.timeline-node');

    const moveTimeline = (index) => {
      const node = nodes[index];
      const targetX = -node.offsetLeft + (window.innerWidth / 2 - node.offsetWidth / 2);

      gsap.to(timelineWrapRef.current, { x: targetX, duration: 0.8, ease: "power3.inOut" });

      const box = node.querySelector('.content-box');
      const line = node.querySelector('.vertical-line');
      const dot = node.querySelector('.center-dot');
      gsap.to(dot, { scale: 1, autoAlpha: 1, duration: 0.4 });
      gsap.to(line, { scaleY: 1, autoAlpha: 0.6, duration: 0.4 });
      gsap.to(box, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6 });
    };

    const nextYear = () => {
      if (timelineIndexRef.current < timelineData.length - 1) {
        const next = timelineIndexRef.current + 1;
        timelineIndexRef.current = next;
        setTimelineIndex(next);
        moveTimeline(next);
      }
    };

    const prevYear = () => {
      if (timelineIndexRef.current > 0) {
        const prev = timelineIndexRef.current - 1;
        timelineIndexRef.current = prev;
        setTimelineIndex(prev);
        moveTimeline(prev);
      }
    };

    // Allows vertical exit from anywhere in the timeline
    const exitToNext = () => window.dispatchEvent(new CustomEvent('requestNextStep'));
    const exitToPrev = () => window.dispatchEvent(new CustomEvent('requestPrevStep'));

    // Bind to window for React onClick events below
    window.legacyNextYear = nextYear;
    window.legacyPrevYear = prevYear;
    window.legacyExitToNext = exitToNext;
    window.legacyExitToPrev = exitToPrev;

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onRight: nextYear,
      onLeft: prevYear,
      onDown: exitToNext,
      onUp: exitToPrev,
      onChange: (self) => {
        // Horizontal swiping priority
        if (Math.abs(self.deltaX) > Math.abs(self.deltaY) + 15) {
          if (self.deltaX > 20) nextYear();
          else if (self.deltaX < -20) prevYear();
        } else {
          // Vertical swiping priority allows breakout anytime
          if (self.deltaY > 30) exitToNext();
          else if (self.deltaY < -30) exitToPrev();
        }
      },
      preventDefault: false, // CRITICAL FIX: Allows the buttons below to actually be clicked
      tolerance: 20
    });

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextYear();
      else if (e.key === 'ArrowLeft') prevYear();
      else if (e.key === 'ArrowDown') exitToNext();
      else if (e.key === 'ArrowUp') exitToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      obs.kill();
      window.removeEventListener('keydown', handleKeyDown);
      delete window.legacyNextYear;
      delete window.legacyPrevYear;
      delete window.legacyExitToNext;
      delete window.legacyExitToPrev;
    };
  }, { scope: containerRef, dependencies: [step] });

  return (
    <div
      ref={containerRef}
      // CRITICAL: z-40 ensures Legacy is revealed correctly when Hero (z-50) slides up
      className={`fixed inset-0 w-full h-screen z-40 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/30 via-obsidian-blue to-pitch-black overflow-hidden ${!isActive ? 'pointer-events-none' : ''}`}
    >

      <div ref={wrapperRef} className="absolute top-0 left-0 w-full z-10 flex flex-col gap-[30vh] items-center text-center pb-[50vh] will-change-transform">
        <div className="h-screen shrink-0 invisible"></div>

        <div ref={timelineBlockRef} className="w-full relative flex flex-col justify-center h-screen invisible">
          <div className="absolute left-0 w-full h-[6px] md:h-[8px] rounded-full bg-white/10 top-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(255,255,255,0.1)] z-0">
            <div className="absolute inset-y-0 left-0 w-[200vw] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent blur-md opacity-30 animate-pulse"></div>
          </div>

          <div ref={timelineWrapRef} className="flex flex-nowrap items-center px-12 md:px-32 gap-0 w-max relative h-[60vh] md:h-[50vh]">
            {timelineData.map((item, idx) => {
              const isTop = idx % 2 === 0;
              return (
                <div key={idx} className="timeline-node w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 relative flex flex-col items-center justify-center group h-full">
                  <div className={`center-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border-4 ${item.border} shadow-[0_0_20px_rgba(255,255,255,0.6)] z-20 invisible scale-0`}></div>

                  <div className={`content-box absolute w-full px-6 flex flex-col invisible scale-95 translate-y-10 ${isTop ? 'bottom-[55%] items-start text-left' : 'top-[55%] items-start text-left'}`}>
                    <div className={`vertical-line absolute left-1/2 ${isTop ? 'bottom-[-10%] h-[50px] border-l-2' : 'top-[-10%] h-[50px] border-l-2'} -translate-x-1/2 ${item.border} invisible scale-y-0`}></div>
                    <div className="liquid-glass p-6 md:p-8 rounded-3xl w-full max-w-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10">
                      <h4 className={`text-3xl md:text-4xl font-black mb-2 ${item.color} drop-shadow-md`}>{item.year}</h4>
                      <h5 className="text-white font-bold tracking-widest uppercase mb-4 text-sm md:text-base opacity-90">{item.title}</h5>
                      <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={statsBlockRef} className="px-6 md:px-24 shrink-0 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 stat-cards-wrapper h-screen content-center invisible">
          <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-white/20 invisible scale-90 translate-y-10">
            <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"><span className="counter-val" data-target="20">0</span>+</span>
            <span className="text-sm tracking-widest text-[#a8b8b8] uppercase mt-3">Years Exp</span>
          </div>
          <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-neon-mint/30 invisible scale-90 translate-y-10">
            <span className="text-5xl md:text-6xl font-black text-neon-mint drop-shadow-[0_0_20px_rgba(46,211,162,0.6)]"><span className="counter-val" data-target="4000">0</span>+</span>
            <span className="text-sm tracking-widest text-white uppercase mt-3">Students Taught</span>
          </div>
          <div className="stat-card liquid-glass p-8 md:p-10 rounded-3xl flex flex-col justify-center items-start border border-white/20 invisible scale-90 translate-y-10">
            <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"><span className="counter-val" data-target="12">0</span>+</span>
            <span className="text-sm tracking-widest text-[#a8b8b8] uppercase mt-3">Countries Worldwide</span>
          </div>
        </div>

      </div>

      {showArrows && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex gap-6 items-center pointer-events-auto">
          <button
            onClick={() => window.legacyPrevYear && window.legacyPrevYear()}
            className={`p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white transition-opacity duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 ${timelineIndex > 0 ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-4 bg-pitch-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => window.legacyExitToPrev && window.legacyExitToPrev()}
              className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-neon-mint hover:text-pitch-black hover:border-neon-mint transition-all duration-300"
              title="Go Up"
            >
              <ArrowUp size={20} />
            </button>
            <button
              onClick={() => window.legacyExitToNext && window.legacyExitToNext()}
              className="p-3 bg-neon-mint/20 rounded-full border border-neon-mint/30 text-neon-mint hover:bg-neon-mint hover:text-pitch-black transition-all duration-300 shadow-[0_0_15px_rgba(46,211,162,0.2)]"
              title="Go Down"
            >
              <ArrowDown size={20} />
            </button>
          </div>

          <button
            onClick={() => window.legacyNextYear && window.legacyNextYear()}
            className={`p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white transition-opacity duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 ${timelineIndex < timelineData.length - 1 ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}

    </div>
  );
});

export default LegacyPanel;