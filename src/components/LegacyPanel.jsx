import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';

// --- VITE IMAGE SEQUENCE IMPORTER ---
const imagesGlob = import.meta.glob('../assets/y_scroll/*.jpg', { eager: true, query: '?url', import: 'default' });
const imageUrls = Object.keys(imagesGlob).sort().map(key => imagesGlob[key]);
const TOTAL_FRAMES = Math.max(0, imageUrls.length - 1);

const TRANSITION_DURATION = 1.4;
const SCROLL_COOLDOWN = 1500;

const LegacyPanel = React.memo(function LegacyPanel({ step, onComplete, isReversing }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const cameraRef = useRef(null);
  const cardsRef = useRef([]);
  const statsBlockRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  const [zIndexPos, setZIndexPos] = useState(0);
  const zIndexPosRef = useRef(0);
  const lastScrollTime = useRef(0);

  // Canvas Image Sequence Refs
  const imagesRef = useRef([]);
  const frameRef = useRef({ current: 0 });
  const isLoadedRef = useRef(false);

  const cardsData = [
    {
      title: 'Past',
      date: '2011 - 2017',
      desc: "From Rockford Academy to A New Identity. Micky Dixit established our innovative styles, giving birth to the vision of Yangerila Creative Studio.",
      textColor: 'text-[#0F172A]',
      dateColor: 'text-[#1E293B]',
      bg: 'bg-[var(--color-pastel-blue)]',
    },
    {
      title: 'Present',
      date: '2023 - 2025',
      desc: "Expanding globally via our digital platform. We integrated the Advanced Modular Grading Structure to help everyone make guitar a part of life.",
      textColor: 'text-[#31102A]',
      dateColor: 'text-[#4A1D41]',
      bg: 'bg-[var(--color-pastel-pink)]',
    },
    {
      title: 'Future',
      date: 'Beyond',
      desc: "Launching our learning app to host classes and serve as a unified hub for musicians to interact and grow worldwide.",
      textColor: 'text-[#064E3B]',
      dateColor: 'text-[#065F46]',
      bg: 'bg-[var(--color-pastel-mint)]',
    }
  ];

  const isActive = step === 3 || step === 4;

  // --- CANVAS RENDERING LOGIC ---
  const renderFrame = (index) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  };

  useEffect(() => {
    if (imageUrls.length === 0) {
      console.warn("No images found in src/assets/y_scroll/. Check your folder path!");
      return;
    }

    imageUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      imagesRef.current.push(img);

      if (i === 0) {
        img.onload = () => {
          isLoadedRef.current = true;
          renderFrame(0);
        };
      }
    });

    const handleResize = () => {
      renderFrame(Math.round(frameRef.current.current));
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const moveCamera = (targetIndex, duration = TRANSITION_DURATION) => {
    cardsRef.current.forEach((card, i) => {
      const isPast = i < targetIndex;
      const offset = i - targetIndex;

      let zVal, yVal, scaleVal, alphaVal;

      if (isPast) {
        zVal = 600;
        yVal = 200;
        scaleVal = 1.2;
        alphaVal = 0;
      } else {
        zVal = offset * -800;
        yVal = offset * -140;
        scaleVal = 1 - (offset * 0.05);
        alphaVal = 1 - (offset * 0.15);
      }

      // We no longer tween zIndex here. The static CSS handles stacking flawlessly.
      gsap.to(card, {
        z: zVal,
        y: yVal,
        scale: scaleVal,
        autoAlpha: alphaVal,
        duration: duration,
        ease: "power3.inOut",
        overwrite: "auto"
      });
    });

    const targetFrame = Math.floor((targetIndex / (cardsData.length - 1)) * TOTAL_FRAMES);

    gsap.to(frameRef.current, {
      current: targetFrame,
      duration: duration,
      ease: "power3.inOut",
      onUpdate: () => {
        renderFrame(Math.round(frameRef.current.current));
      },
      overwrite: "auto"
    });
  };

  useGSAP(() => {
    const statCards = statsBlockRef.current.querySelectorAll('.stat-card');
    const counters = statsBlockRef.current.querySelectorAll('.counter-val');

    const bgElements = [canvasRef.current, cameraRef.current, overlayRef.current];

    if (step < 3) {
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
      gsap.to(bgElements, { filter: "blur(0px)", opacity: 1, duration: 0.8 });
    }

    if (step > 4) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
      gsap.set([cameraRef.current, statsBlockRef.current], { autoAlpha: 0, delay: 0.4 });
      gsap.to(bgElements, { filter: "blur(0px)", opacity: 1, duration: 0.8 });
    }

    if (step === 3) {
      const enterTl = gsap.timeline({ onComplete });

      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      gsap.to(bgElements, { filter: "blur(0px)", opacity: 1, duration: 0.8, ease: "power3.out" });

      if (isReversing) {
        zIndexPosRef.current = cardsData.length - 1;
        setZIndexPos(cardsData.length - 1);

        gsap.set(cameraRef.current, { autoAlpha: 1 });
        gsap.set(statsBlockRef.current, { autoAlpha: 0 });
        const cameraTop = -(cameraRef.current.offsetTop + cameraRef.current.offsetHeight / 2 - window.innerHeight / 2);
        enterTl.to(wrapperRef.current, { y: cameraTop, duration: 0.8, ease: "power3.inOut" });

        moveCamera(zIndexPosRef.current, 0.8);
      } else {
        zIndexPosRef.current = 0;
        setZIndexPos(0);

        gsap.set(cameraRef.current, { autoAlpha: 1 });
        gsap.set(statsBlockRef.current, { autoAlpha: 0 });
        const cameraTop = -(cameraRef.current.offsetTop + cameraRef.current.offsetHeight / 2 - window.innerHeight / 2);
        enterTl.to(wrapperRef.current, { y: cameraTop, duration: 0.8, ease: "power3.inOut" }, "-=0.4");

        moveCamera(0, 0);
      }
    }

    if (step === 4) {
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      gsap.to(bgElements, { filter: "blur(15px)", opacity: 0.3, duration: 0.8, ease: "power3.inOut" });

      const statsTop = -(statsBlockRef.current.offsetTop + statsBlockRef.current.offsetHeight / 2 - window.innerHeight / 2);
      gsap.set(statsBlockRef.current, { autoAlpha: 1 });

      const statsTl = gsap.timeline({ onComplete });

      if (isReversing) {
        gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      }

      statsTl.to(wrapperRef.current, { y: statsTop, duration: 0.8, ease: "power3.inOut" });
      statsTl.to(statCards, { scale: 1, autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(2)" }, "-=0.2");

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        statsTl.fromTo(counter, { innerText: 0 }, { innerText: target, duration: 1.5, snap: { innerText: 1 }, ease: "power1.out" }, "<");
      });
    }
  }, { scope: containerRef, dependencies: [step, isReversing] });

  useGSAP(() => {
    if (step !== 3) return;

    lastScrollTime.current = Date.now() + 600;

    const advanceZ = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      if (zIndexPosRef.current < cardsData.length - 1) {
        lastScrollTime.current = now;
        const next = zIndexPosRef.current + 1;
        zIndexPosRef.current = next;
        setZIndexPos(next);
        moveCamera(next);
      } else {
        window.dispatchEvent(new CustomEvent('requestNextStep'));
      }
    };

    const reverseZ = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      if (zIndexPosRef.current > 0) {
        lastScrollTime.current = now;
        const prev = zIndexPosRef.current - 1;
        zIndexPosRef.current = prev;
        setZIndexPos(prev);
        moveCamera(prev);
      } else {
        window.dispatchEvent(new CustomEvent('requestPrevStep'));
      }
    };

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: advanceZ,
      onUp: reverseZ,
      preventDefault: false,
      tolerance: 50
    });

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') advanceZ();
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') reverseZ();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      obs.kill();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, { scope: containerRef, dependencies: [step] });

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-screen z-20 bg-[#0A0A0A] overflow-hidden ${!isActive ? 'pointer-events-none' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 object-cover"
      />

      <div ref={overlayRef} className="absolute inset-0 z-0 bg-black/20 pointer-events-none"></div>

      <div ref={wrapperRef} className="absolute top-0 left-0 w-full z-10 flex flex-col gap-[30vh] items-center text-center pb-[50vh] will-change-transform">
        <div className="h-screen shrink-0 invisible"></div>

        <div
          ref={cameraRef}
          className="w-full relative flex flex-col justify-center items-center h-screen"
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          {cardsData.map((item, idx) => (
            <div
              key={idx}
              ref={el => cardsRef.current[idx] = el}
              // STATIC Z-INDEX FIX: The first card (idx 0) gets 100, the second gets 99, etc.
              // This permanently locks the visual stacking order to match the physical 3D order.
              style={{ zIndex: 100 - idx }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[65vw] lg:w-[50vw] will-change-transform transform-style-3d drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
            >
              <div className={`p-10 md:p-16 rounded-[2.5rem] w-full border-[6px] border-white/40 backdrop-blur-md ${item.bg} text-left flex flex-col gap-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-transparent to-black/5 pointer-events-none mix-blend-overlay"></div>

                <div className="relative z-10">
                  <span className={`text-sm md:text-base tracking-[0.4em] font-black uppercase ${item.dateColor} opacity-70 mb-2 block`}>{item.date}</span>
                  <h4 className={`text-6xl md:text-8xl font-black ${item.textColor} mb-6 uppercase tracking-tighter drop-shadow-sm leading-none`}>{item.title}</h4>
                  <p className={`${item.textColor} font-medium leading-relaxed text-lg md:text-2xl opacity-90`}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={statsBlockRef} className="px-6 md:px-24 shrink-0 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 stat-cards-wrapper h-screen content-center invisible">
          <div className="stat-card bg-white p-8 md:p-12 rounded-3xl flex flex-col justify-center items-start border-4 border-pastel-blue invisible scale-90 translate-y-10 shadow-xl relative overflow-hidden">
            <span className="text-5xl md:text-7xl font-black text-ink-dark relative z-10"><span className="counter-val" data-target="20">0</span>+</span>
            <span className="text-sm md:text-base tracking-widest text-ink-dark/70 uppercase mt-4 font-bold relative z-10">Years Exp</span>
          </div>
          <div className="stat-card bg-white p-8 md:p-12 rounded-3xl flex flex-col justify-center items-start border-4 border-pastel-pink invisible scale-90 translate-y-10 shadow-xl relative overflow-hidden">
            <span className="text-5xl md:text-7xl font-black text-[#31102A] relative z-10"><span className="counter-val" data-target="4000">0</span>+</span>
            <span className="text-sm md:text-base tracking-widest text-[#31102A]/70 uppercase mt-4 font-bold relative z-10">Students Taught</span>
          </div>
          <div className="stat-card bg-white p-8 md:p-12 rounded-3xl flex flex-col justify-center items-start border-4 border-pastel-mint invisible scale-90 translate-y-10 shadow-xl relative overflow-hidden">
            <span className="text-5xl md:text-7xl font-black text-[#064E3B] relative z-10"><span className="counter-val" data-target="12">0</span>+</span>
            <span className="text-sm md:text-base tracking-widest text-[#064E3B]/70 uppercase mt-4 font-bold relative z-10">Countries Worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LegacyPanel;