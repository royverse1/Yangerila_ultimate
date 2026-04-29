import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';
import statsBg from '../assets/stats.jpg';

const TOTAL_FRAMES = 164;
// P3.1 — Dual sensitivity profiles
const WHEEL_SENSITIVITY = 0.15;   // frames per normalised pixel (mouse wheel)
const TOUCH_SENSITIVITY = 0.25;   // frames per px (touch / pointer drag)
// Accumulated excess scroll needed to exit the timeline at either boundary
const BOUNDARY_THRESHOLD = 280;

const getFrameUrl = (index) => {
  const fileIndex = (1000 + index).toString().padStart(5, '0');
  return `${import.meta.env.BASE_URL}assets/y_scroll/frame_${fileIndex}.webp`;
};

// P3.4 — Z-Space Breakpoints: vanishing point depths scale with viewport width
const getDepthConfig = () => {
  const w = window.innerWidth;
  if (w < 480) {
    // Small phone – tight z-depths so cards don't occlude the whole screen
    return { zBack: -320, zPass: 700, yBack: -70, yPass: 110, scaleMin: 0.72, passScale: 0.28 };
  }
  if (w < 768) {
    return { zBack: -460, zPass: 900, yBack: -95, yPass: 140, scaleMin: 0.74, passScale: 0.32 };
  }
  // Desktop
  return { zBack: -680, zPass: 1200, yBack: -120, yPass: 180, scaleMin: 0.70, passScale: 0.40 };
};

const cardsData = [
  { title: 'Past',    date: '2011 - 2017', desc: 'From Rockford Academy to A New Identity. Micky Dixit established our innovative styles.',                                       textColor: 'text-[#0F172A]', dateColor: 'text-[#1E293B]', bg: 'bg-[var(--color-pastel-blue)]'  },
  { title: 'Present', date: '2023 - 2025', desc: 'Expanding globally via our digital platform. We integrated the Advanced Modular Grading Structure.',                          textColor: 'text-[#31102A]', dateColor: 'text-[#4A1D41]', bg: 'bg-[var(--color-pastel-pink)]'  },
  { title: 'Future',  date: 'Beyond',       desc: 'Launching our learning app to host classes and serve as a unified hub for musicians worldwide.',                               textColor: 'text-[#064E3B]', dateColor: 'text-[#065F46]', bg: 'bg-[var(--color-pastel-mint)]'  },
];

const LegacyPanel = React.memo(function LegacyPanel({ step, onComplete, isReversingRef }) {
  const containerRef  = useRef(null);
  const cameraRef     = useRef(null);
  const cardsRef      = useRef([]);
  const statsBlockRef = useRef(null);
  const canvasRef     = useRef(null);
  const [mountStatus, setMountStatus] = useState('unmounted');

  // Physics engine refs — no state, never trigger re-renders
  const frameRef          = useRef({ current: 0 });   // decimal frame (tweened)
  const cardIndexRef      = useRef(0);                 // Tracks 0 (Past), 1 (Present), 2 (Future)
  const isActiveRef       = useRef(false);
  const enginePausedRef   = useRef(false);             // P3.5 orientation lock

  // P4.1 — track which images are actually loaded
  const imagesRef         = useRef(new Array(TOTAL_FRAMES + 1).fill(null));

  // Wake up heavy assets early if needed
  useEffect(() => {
    if ((step === 3 || step === 4) && mountStatus === 'unmounted') {
      setMountStatus('mounted');
    }
  }, [step, mountStatus]);

  // ─── Canvas render ──────────────────────────────────────────────────────────
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[Math.round(index)];
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const hRatio = canvas.width  / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio  = Math.max(hRatio, vRatio);
    const cx = (canvas.width  - img.naturalWidth  * ratio) / 2;
    const cy = (canvas.height - img.naturalHeight * ratio) / 2;
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, cx, cy, img.naturalWidth * ratio, img.naturalHeight * ratio);
  };

  // ─── Reverted Discrete Drone Flight Engine ────────────────────────────────
  const flyToCard = (targetIndex, dur = 1.2) => {
    if (enginePausedRef.current) return;
    
    // 1. Move the canvas frames smoothly to match the card
    const targetFrame = (TOTAL_FRAMES / 2) * targetIndex;
    gsap.to(frameRef.current, {
      current: targetFrame,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: () => renderFrame(frameRef.current.current)
    });

    // 2. Fly the 3D cards in Z-space
    const depth = getDepthConfig();
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - targetIndex;

      let zVal, yVal, scaleVal, alphaVal;
      if (offset < 0) {
        // Pushing past the camera
        zVal = offset * -depth.zPass;
        yVal = offset * -depth.yPass;
        scaleVal = 1 + Math.abs(offset * depth.passScale);
        alphaVal = 1 + (offset * 1.5); 
      } else {
        // Waiting deep in the background
        zVal = offset * depth.zBack;
        yVal = offset * depth.yBack;
        scaleVal = Math.max(depth.scaleMin, 1 - (offset * 0.14));
        alphaVal = offset > 1 ? 0 : Math.max(0, 1 - (offset * 0.55));
      }

      gsap.to(card, {
        z: zVal,
        y: yVal,
        scale: scaleVal,
        autoAlpha: Math.max(0, Math.min(1, alphaVal)),
        duration: dur,
        ease: 'power3.inOut',
        force3D: true,
        overwrite: 'auto'
      });
    });
  };

  // ─── P4.1 — Chunked image preloading ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const loadFrame = (i) => {
      if (imagesRef.current[i]) return;
      const img = new Image();
      img.onload = () => {
        imagesRef.current[i] = img;
        if (i === 0) renderFrame(0);
      };
      img.src = getFrameUrl(i);
    };

    // Critical first 11 frames — needed immediately for initial display
    for (let i = 0; i <= 10; i++) loadFrame(i);

    // Remaining frames after the heavy initial load settles
    const lazyTimer = setTimeout(() => {
      for (let i = 11; i <= TOTAL_FRAMES; i++) loadFrame(i);
    }, 2000);

    // ── P3.3 — debounced resize ────────────────────────────────────────────
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(Math.round(frameRef.current.current));
      }, 100);
    };

    // ── P3.5 — Orientation Change Interceptor ────────────────────────────
    const handleOrientation = () => {
      enginePausedRef.current = true;
      // Brief pause while browser reflows the viewport
      setTimeout(() => {
        if (!canvas) { enginePausedRef.current = false; return; }
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(Math.round(frameRef.current.current));
        flyToCard(cardIndexRef.current, 0);
        enginePausedRef.current = false;
      }, 350);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      clearTimeout(resizeTimer);
      clearTimeout(lazyTimer);
    };
  }, []);

  // ─── Observer: created once, keyed to isActiveRef ───────────────────────────
  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      onDown: (self) => {
        if (!isActiveRef.current || enginePausedRef.current) return;
        // Scroll down / swipe up -> Move forward
        if (cardIndexRef.current < 2) {
          cardIndexRef.current++;
          flyToCard(cardIndexRef.current);
          isActiveRef.current = false; // Lock temporarily
          setTimeout(() => { isActiveRef.current = true; }, 1200); // 1.2s cooldown
        } else if (self.event.type !== 'wheel' || self.deltaY > 20) {
          // At the end, apply pressure to exit to Stats
          window.dispatchEvent(new CustomEvent('requestNextStep'));
        }
      },
      onUp: (self) => {
        if (!isActiveRef.current || enginePausedRef.current) return;
        // Scroll up / swipe down -> Move backward
        if (cardIndexRef.current > 0) {
          cardIndexRef.current--;
          flyToCard(cardIndexRef.current);
          isActiveRef.current = false; // Lock temporarily
          setTimeout(() => { isActiveRef.current = true; }, 1200);
        } else if (self.event.type !== 'wheel' || self.deltaY < -20) {
          // At the beginning, apply pressure to exit to About
          window.dispatchEvent(new CustomEvent('requestPrevStep'));
        }
      },
      tolerance: 20,
      preventDefault: false,
    });

    const handleKeyDown = (e) => {
      if (!isActiveRef.current || enginePausedRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (cardIndexRef.current < 2) { cardIndexRef.current++; flyToCard(cardIndexRef.current); }
        else window.dispatchEvent(new CustomEvent('requestNextStep'));
      }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (cardIndexRef.current > 0) { cardIndexRef.current--; flyToCard(cardIndexRef.current); }
        else window.dispatchEvent(new CustomEvent('requestPrevStep'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { obs.kill(); window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  // ─── Step-driven GSAP logic ─────────────────────────────────────────────────
  // Reads isReversingRef.current at animation-fire time (P1.3 fix)
  useEffect(() => {
    const isReversing = isReversingRef.current;

    const statCards = statsBlockRef.current?.querySelectorAll('.stat-card') ?? [];
    const counters  = statsBlockRef.current?.querySelectorAll('.counter-val') ?? [];

    if (step < 3) {
      isActiveRef.current = false;
      gsap.killTweensOf(frameRef.current);
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: 'power3.inOut', force3D: true });
      gsap.to(canvasRef.current,    { opacity: 1,   duration: 0.8 });
    }

    if (step > 4) {
      isActiveRef.current = false;
      gsap.killTweensOf(frameRef.current);
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: 'power3.inOut', force3D: true });
      gsap.set([cameraRef.current, statsBlockRef.current], { autoAlpha: 0, display: 'none', delay: 0.4 });
      gsap.to(canvasRef.current,    { opacity: 1, duration: 0.8 });
    }

    if (step === 3) {
      gsap.to(containerRef.current, {
        yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', force3D: true,
        onComplete: () => { if (onComplete) onComplete(); },
      });
      gsap.to(canvasRef.current,  { opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.set(cameraRef.current, { display: 'flex' });
      gsap.to(cameraRef.current,  { autoAlpha: 1, duration: 0.4 });

      if (isReversing) {
        // Coming back from Stats → land on Future (frame 164)
        cardIndexRef.current = 2;
        frameRef.current.current = TOTAL_FRAMES;
        renderFrame(TOTAL_FRAMES);
        flyToCard(2, 0); // snap to Future without animating
        gsap.to(statsBlockRef.current, { autoAlpha: 0, duration: 0.4 });
        gsap.to(statCards, { y: 50, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
      } else {
        // Coming from Hero → land on Past (frame 0)
        cardIndexRef.current = 0;
        frameRef.current.current = 0;
        renderFrame(0);
        flyToCard(0, 0); // snap to Past without animating
        gsap.set(statsBlockRef.current, { autoAlpha: 0 });
        gsap.set(statCards, { scale: 0.9, autoAlpha: 0, y: 20 });
      }

      // Activate engine with a brief ghost absorber delay
      setTimeout(() => { isActiveRef.current = true; }, 900);
    }

    if (step === 4) {
      isActiveRef.current = false;
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' });
      gsap.to(canvasRef.current,    { opacity: 1, duration: 0.8, ease: 'power3.inOut' });

      gsap.killTweensOf(frameRef.current);
      cardsRef.current.forEach(c => { if (c) gsap.killTweensOf(c); });

      gsap.set(cameraRef.current, { autoAlpha: 0, display: 'none' });
      frameRef.current.current = TOTAL_FRAMES;
      renderFrame(TOTAL_FRAMES);

      gsap.set(statsBlockRef.current, { autoAlpha: 1, display: 'flex' });
      const statsTl = gsap.timeline({ onComplete: () => { if (onComplete) onComplete(); } });
      statsTl.to(statCards, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(2)', force3D: true }, '+=0.2');
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        statsTl.fromTo(counter, { innerText: 0 }, { innerText: target, duration: 1.5, snap: { innerText: 1 }, ease: 'power1.out' }, '<');
      });
    }
  }, [step]);   // isReversingRef is a ref — read inside, not in deps

  return (
    // P3.2 — touch-action: none locks native mobile rubber-banding out
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-dvh z-20 bg-transparent overflow-hidden will-change-transform ${!isActive ? 'pointer-events-none' : ''}`}
      style={{ touchAction: isActive ? 'none' : 'auto' }}
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[65vw] lg:w-[50vw] will-change-transform backface-hidden drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
            >
              <div className={`p-8 md:p-12 xl:p-16 rounded-[2rem] md:rounded-[2.5rem] w-full border-[4px] md:border-[6px] border-white/60 ${item.bg} text-left flex flex-col gap-2 md:gap-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-black/10 pointer-events-none mix-blend-overlay" />
                <div className="relative z-10">
                  <span className={`text-[10px] md:text-sm xl:text-base tracking-[0.4em] font-black uppercase ${item.dateColor} opacity-70 mb-1 md:mb-2 block`}>{item.date}</span>
                  <h4 className={`text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black ${item.textColor} mb-3 md:mb-6 uppercase tracking-tighter drop-shadow-sm leading-none`}>{item.title}</h4>
                  <p  className={`${item.textColor} font-bold leading-relaxed text-sm sm:text-base md:text-xl xl:text-2xl opacity-90`}>{item.desc}</p>
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

          <div className="stat-card col-span-2 md:col-span-1 bg-white/60 p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-blue shadow-[0_0_50px_rgba(224,242,254,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-ink-dark relative z-10"><span className="counter-val" data-target="20">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-ink-dark/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Years Exp</span>
          </div>

          <div className="stat-card bg-white/60 p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-pink shadow-[0_0_50px_rgba(252,231,243,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-[#31102A] relative z-10"><span className="counter-val" data-target="4000">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-[#31102A]/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Students</span>
          </div>

          <div className="stat-card bg-white/60 p-6 md:p-12 rounded-[1.5rem] md:rounded-3xl flex flex-col justify-center items-start border-[3px] md:border-4 border-pastel-mint shadow-[0_0_50px_rgba(209,250,229,0.7)] relative overflow-hidden">
            <span className="text-4xl md:text-5xl xl:text-7xl font-black text-[#064E3B] relative z-10"><span className="counter-val" data-target="12">0</span>+</span>
            <span className="text-[10px] md:text-xs xl:text-base tracking-widest text-[#064E3B]/70 uppercase mt-2 md:mt-4 font-bold relative z-10">Countries</span>
          </div>

        </div>
      </div>
    </div>
  );
});

export default LegacyPanel;