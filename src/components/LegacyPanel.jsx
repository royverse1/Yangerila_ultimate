import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';
import statsBg from '../assets/stats.jpg';

const imagesGlob = import.meta.glob('../assets/y_scroll/*.jpg', { eager: true, query: '?url', import: 'default' });
const imageUrls = Object.keys(imagesGlob).sort().map(key => imagesGlob[key]);
const TOTAL_FRAMES = Math.max(0, imageUrls.length - 1);

const TRANSITION_DURATION = 0.8;
const INERTIA_LOCK_MS = 1400;

const LegacyPanel = React.memo(function LegacyPanel({ step, onComplete }) {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const cardsRef = useRef([]);
  const statsBlockRef = useRef(null);
  const canvasRef = useRef(null);

  const currentIndexRef = useRef(0);
  const prevGlobalStep = useRef(step);

  const lockFor = useCallback((ms) => {
    if (window.setGlobalLock) window.setGlobalLock(ms);
  }, []);
  const isLocked = useCallback(() => {
    return window.isGlobalLocked ? window.isGlobalLocked() : false;
  }, []);

  const imagesRef = useRef([]);
  const frameRef = useRef({ current: 0 });

  const [mountStatus, setMountStatus] = useState(() => {
    return (step === 3 || step === 4) ? 'mounted' : 'unmounted';
  });

  const cardsData = [
    { title: 'Past', date: '2011 - 2017', desc: "From Rockford Academy to A New Identity. Micky Dixit established our innovative styles.", textColor: 'text-[#0F172A]', dateColor: 'text-[#1E293B]', bg: 'bg-[var(--color-pastel-blue)]' },
    { title: 'Present', date: '2023 - 2025', desc: "Expanding globally via our digital platform. We integrated the Advanced Modular Grading Structure.", textColor: 'text-[#31102A]', dateColor: 'text-[#4A1D41]', bg: 'bg-[var(--color-pastel-pink)]' },
    { title: 'Future', date: 'Beyond', desc: "Launching our learning app to host classes and serve as a unified hub for musicians worldwide.", textColor: 'text-[#064E3B]', dateColor: 'text-[#065F46]', bg: 'bg-[var(--color-pastel-mint)]' }
  ];

  // Wake up heavy assets early if needed
  useEffect(() => {
    if ((step === 3 || step === 4) && mountStatus === 'unmounted') {
      setMountStatus('mounted');
    }
  }, [step, mountStatus]);

  // Initial off-screen state setup (Replaces the need for Tailwind translate-y-full)
  useEffect(() => {
    if (step < 3 && containerRef.current) {
      gsap.set(containerRef.current, { yPercent: 100, autoAlpha: 0 });
    } else if (step > 4 && containerRef.current) {
      gsap.set(containerRef.current, { yPercent: -100, autoAlpha: 0 });
    }
  }, []);

  const renderFrame = useCallback((index) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const img = imagesRef.current[index];

    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    ctx.drawImage(img, 0, 0, img.width, img.height);
  }, []);

  useEffect(() => {
    if (mountStatus === 'unmounted') {
      imagesRef.current.forEach(img => { if (img) img.src = ''; });
      imagesRef.current = [];
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
      return;
    }

    if (imageUrls.length === 0) return;

    imagesRef.current = new Array(imageUrls.length).fill(null);
    const targetIndex = Math.round(frameRef.current.current);

    const priorityImg = new Image();
    priorityImg.onload = () => {
      imagesRef.current[targetIndex] = priorityImg;
      if (Math.round(frameRef.current.current) === targetIndex) renderFrame(targetIndex);
    };
    priorityImg.src = imageUrls[targetIndex];

    imageUrls.forEach((url, i) => {
      if (i === targetIndex) return;
      const img = new Image();
      img.onload = () => {
        imagesRef.current[i] = img;
        if (Math.round(frameRef.current.current) === i) renderFrame(i);
      };
      img.src = url;
    });

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvasRef.current) {
          renderFrame(Math.round(frameRef.current.current));
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [mountStatus, renderFrame]);

  // Moves the 3D cards and math frames (Exclusively handles indices 0, 1, 2)
  const moveCamera = useCallback((targetStateIndex, duration = TRANSITION_DURATION) => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const isPast = i < targetStateIndex;
      const offset = i - targetStateIndex;

      let zVal = isPast ? 600 : offset * -800;
      let yVal = isPast ? 200 : offset * -140;
      let scaleVal = isPast ? 1.2 : 1 - (offset * 0.05);
      let alphaVal = isPast ? 0 : 1 - (offset * 0.15);

      if (duration === 0) {
        gsap.killTweensOf(card);
        gsap.set(card, { xPercent: -50, yPercent: -50, z: zVal, y: yVal, scale: scaleVal, autoAlpha: alphaVal, force3D: true });
      } else {
        gsap.to(card, {
          xPercent: -50, yPercent: -50,
          z: zVal, y: yVal, scale: scaleVal, autoAlpha: alphaVal,
          duration: duration, ease: "power2.out", overwrite: "auto", force3D: true
        });
      }
    });

    const targetFrame = Math.floor((targetStateIndex / 2) * TOTAL_FRAMES);

    if (duration === 0) {
      gsap.killTweensOf(frameRef.current);
      frameRef.current.current = targetFrame;
      renderFrame(targetFrame);
    } else {
      gsap.to(frameRef.current, {
        current: targetFrame,
        duration: duration,
        ease: "power2.out",
        roundProps: "current",
        onUpdate: () => {
          renderFrame(Math.round(frameRef.current.current));
        },
        overwrite: "auto"
      });
    }
  }, [renderFrame]);

  // Force initial positions immediately on mount
  useGSAP(() => {
    moveCamera(0, 0);
  }, []);

  // MASTER COMPONENT RENDER LOGIC
  useGSAP(() => {
    const oldStep = prevGlobalStep.current;

    // FIX: Container exit animations ALWAYS run regardless of `mountStatus` to prevent overlap bugs.
    if (step < 3) {
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut", force3D: true, onComplete: () => setMountStatus('unmounted') });
    }
    else if (step > 4) {
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut", force3D: true, onComplete: () => setMountStatus('unmounted') });
    }

    // Stop execution for internal contents if heavy assets are stripped
    if (mountStatus === 'unmounted') {
      if (step !== 3 && step !== 4) {
        prevGlobalStep.current = step;
      }
      return;
    }

    // ENTERING TIMELINE (Step 3)
    if (step === 3) {
      lockFor(1500);

      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", force3D: true, onComplete });

      // Decoupled Separation: Stats fully hidden, Canvas fully visible
      if (statsBlockRef.current) {
        const imgBg = statsBlockRef.current.querySelector('img');
        const statCards = statsBlockRef.current.querySelectorAll('.stat-card');
        
        if (imgBg) gsap.set(imgBg, { autoAlpha: 0 });
        if (canvasRef.current) gsap.set(canvasRef.current, { autoAlpha: 1 });

        if (oldStep > 3) {
          gsap.to(statCards, { 
            autoAlpha: 0, y: -30, duration: 1.2, ease: "power2.inOut", 
            onComplete: () => gsap.set(statsBlockRef.current, { display: "none" }) 
          });
        } else {
          gsap.set(statCards, { autoAlpha: 0, y: -30 });
          gsap.set(statsBlockRef.current, { display: "none", autoAlpha: 0 });
        }
      } else {
        if (canvasRef.current) gsap.set(canvasRef.current, { autoAlpha: 1 });
      }

      if (cameraRef.current) {
        gsap.killTweensOf(cameraRef.current);
        gsap.set(cameraRef.current, { display: "flex" });
        gsap.fromTo(cameraRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, delay: 0.2, ease: "power2.inOut" });
      }

      if (oldStep > 3) {
        // Came UP from Stats -> Lock securely to Future
        currentIndexRef.current = 2;
        moveCamera(2, 0);
      } else if (oldStep < 3) {
        // Came DOWN from Hero -> Lock securely to Past
        currentIndexRef.current = 0;
        moveCamera(0, 0);
      }
    }

    // ENTERING STATS (Step 4)
    else if (step === 4) {
      lockFor(1500);

      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", force3D: true, onComplete });

      // Decoupled Separation: Canvas fully hidden, Stats fully visible
      if (canvasRef.current) gsap.set(canvasRef.current, { autoAlpha: 0 });
      if (cameraRef.current) {
        gsap.killTweensOf(cameraRef.current);
        gsap.to(cameraRef.current, { autoAlpha: 0, duration: 1.5, ease: "power2.inOut", onComplete: () => gsap.set(cameraRef.current, { display: "none" }) });
      }

      // Reveal the bright glowing Stats block
      if (statsBlockRef.current) {
        gsap.set(statsBlockRef.current, { autoAlpha: 1, display: "flex" });
        const imgBg = statsBlockRef.current.querySelector('img');
        const statCards = statsBlockRef.current.querySelectorAll('.stat-card');
        const counters = statsBlockRef.current.querySelectorAll('.counter-val');

        if (imgBg) gsap.set(imgBg, { autoAlpha: 1 });

        gsap.fromTo(statCards,
          { scale: 0.8, autoAlpha: 0, y: 50 },
          { scale: 1, autoAlpha: 1, y: 0, stagger: 0.2, duration: 1.5, ease: "back.out(1.2)", force3D: true, delay: 0.3 }
        );

        if (counters) {
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            gsap.fromTo(counter, { innerText: 0 }, { innerText: target, duration: 1.5, snap: { innerText: 1 }, ease: "power1.out" });
          });
        }
      }
    }

    prevGlobalStep.current = step;
  }, { scope: containerRef, dependencies: [step, moveCamera, lockFor, mountStatus] });

  // LOCAL INTERNAL SCROLL FOR TIMELINE ONLY
  const handleLocalScroll = useCallback((direction) => {
    if (isLocked()) return;

    if (direction === 'next') {
      if (currentIndexRef.current < 2) {
        lockFor(1200);
        currentIndexRef.current++;
        moveCamera(currentIndexRef.current);
      } else {
        // Exit to Stats - App.jsx will handle the lock
        window.dispatchEvent(new CustomEvent('requestNextStep'));
      }
    } else {
      if (currentIndexRef.current > 0) {
        lockFor(1200);
        currentIndexRef.current--;
        moveCamera(currentIndexRef.current);
      } else {
        // Exit to Hero - App.jsx will handle the lock
        window.dispatchEvent(new CustomEvent('requestPrevStep'));
      }
    }
  }, [moveCamera, isLocked, lockFor]);

  // Observer is strictly attached to Step 3. 
  // Step 4 is now fully managed by the global App.jsx scroller.
  useGSAP(() => {
    if (step !== 3 || mountStatus === 'unmounted') return;

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: (self) => handleLocalScroll(self.event.type === "wheel" ? 'next' : 'prev'),
      onUp: (self) => handleLocalScroll(self.event.type === "wheel" ? 'prev' : 'next'),
      preventDefault: false,
      tolerance: 40
    });

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') handleLocalScroll('next');
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') handleLocalScroll('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { obs.kill(); window.removeEventListener('keydown', handleKeyDown); };
  }, { scope: containerRef, dependencies: [step, mountStatus, handleLocalScroll] });

  const isActive = step === 3 || step === 4;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-dvh z-20 bg-transparent overflow-hidden will-change-transform ${!isActive ? 'pointer-events-none' : ''}`}
    >
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 object-cover" />

      {/* Timeline 3D Cards Layer */}
      <div className="absolute inset-0 z-30 flex items-center justify-center will-change-transform pointer-events-none">
        <div
          ref={cameraRef}
          className="w-full relative flex flex-col justify-center items-center h-full will-change-transform"
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          {cardsData.map((item, idx) => (
            <div
              key={idx}
              ref={el => cardsRef.current[idx] = el}
              style={{ zIndex: 100 - idx }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[65vw] lg:w-[50vw] will-change-transform transform-style-3d backface-hidden drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]`}
            >
              <div className={`p-8 md:p-12 xl:p-16 rounded-[2rem] md:rounded-[2.5rem] w-full border-[4px] md:border-[6px] border-white/60 ${item.bg} text-left flex flex-col gap-2 md:gap-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-black/10 pointer-events-none mix-blend-overlay"></div>
                <div className="relative z-10">
                  <span className={`text-[10px] md:text-sm xl:text-base tracking-[0.4em] font-black uppercase ${item.dateColor} opacity-70 mb-1 md:mb-2 block`}>{item.date}</span>
                  <h4 className={`text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black ${item.textColor} mb-3 md:mb-6 uppercase tracking-tighter drop-shadow-sm leading-none`}>{item.title}</h4>
                  <p className={`${item.textColor} font-bold leading-relaxed text-sm sm:text-base md:text-xl xl:text-2xl opacity-90`}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Layer: Clean, original glowing UI */}
      <div ref={statsBlockRef} className="absolute inset-0 z-20 flex items-center justify-center invisible will-change-transform pointer-events-none">
        <img src={statsBg} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 relative z-10 px-4 sm:px-6 md:px-24">

          <div className="stat-card col-span-2 md:col-span-1 bg-white/60 backdrop-blur-xl p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-blue shadow-[0_0_50px_rgba(224,242,254,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-ink-dark relative z-10"><span className="counter-val" data-target="20">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-ink-dark/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Years Exp</span>
          </div>

          <div className="stat-card bg-white/60 backdrop-blur-xl p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-pink shadow-[0_0_50px_rgba(252,231,243,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-[#31102A] relative z-10"><span className="counter-val" data-target="4000">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-[#31102A]/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Students</span>
          </div>

          <div className="stat-card bg-white/60 backdrop-blur-xl p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-mint shadow-[0_0_50px_rgba(209,250,229,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-[#064E3B] relative z-10"><span className="counter-val" data-target="12">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-[#064E3B]/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Countries</span>
          </div>

        </div>
      </div>
    </div>
  );
});

export default LegacyPanel;