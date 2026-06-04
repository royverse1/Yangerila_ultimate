import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';

const TOTAL_FRAMES = 164;
const WHEEL_SENSITIVITY = 0.15;
const TOUCH_SENSITIVITY = 0.25;
const BOUNDARY_THRESHOLD = 280;

const getFrameUrl = (index) => {
  const fileIndex = (1000 + index).toString().padStart(5, '0');
  return `${import.meta.env.BASE_URL}assets/y_scroll/frame_${fileIndex}.webp`;
};

const getDepthConfig = () => {
  const w = window.innerWidth;
  if (w < 480) {
    return { zBack: -320, zPass: 700, yBack: -70, yPass: 110, scaleMin: 0.72, passScale: 0.28 };
  }
  if (w < 768) {
    return { zBack: -460, zPass: 900, yBack: -95, yPass: 140, scaleMin: 0.74, passScale: 0.32 };
  }
  return { zBack: -680, zPass: 1200, yBack: -120, yPass: 180, scaleMin: 0.70, passScale: 0.40 };
};

const cardsData = [
  { title: 'Past', date: '2011 - 2017', desc: 'From Rockford Academy to A New Identity. Micky Dixit established our innovative styles.', textColor: 'text-paper-bg', dateColor: 'text-pastel-purple', bg: 'bg-ink-medium' },
  { title: 'Present', date: '2023 - 2025', desc: 'Expanding globally via our digital platform. We integrated the Advanced Modular Grading Structure.', textColor: 'text-paper-bg', dateColor: 'text-pastel-purple', bg: 'bg-ink-dark' },
  { title: 'Future', date: 'Beyond', desc: 'Launching our learning app to host classes and serve as a unified hub for musicians worldwide.', textColor: 'text-paper-bg', dateColor: 'text-pastel-purple', bg: 'bg-ink-medium' },
];

const LegacyPanel = React.memo(function LegacyPanel({ step, onComplete, isReversingRef }) {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const cardsRef = useRef([]);
  const canvasRef = useRef(null);

  const frameRef = useRef({ current: 0 });
  const cardIndexRef = useRef(0);
  const isActiveRef = useRef(false);
  const interactionTimeoutRef = useRef(null);
  const isActive = step === 3;
  const enginePausedRef = useRef(false);

  const imagesRef = useRef(new Array(TOTAL_FRAMES + 1).fill(null));
  const frameLoadQueueRef = useRef(new Set());
  const frameLoadTimerRef = useRef(null);

  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let targetIdx = Math.round(index);
    let img = imagesRef.current[targetIdx];

    if (!img) {
      let offset = 1;
      while (offset <= TOTAL_FRAMES) {
        if (targetIdx - offset >= 0 && imagesRef.current[targetIdx - offset]) {
          img = imagesRef.current[targetIdx - offset];
          break;
        }
        if (targetIdx + offset <= TOTAL_FRAMES && imagesRef.current[targetIdx + offset]) {
          img = imagesRef.current[targetIdx + offset];
          break;
        }
        offset++;
      }
    }

    if (!img) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;

    ctx.drawImage(
      img, 0, 0, img.naturalWidth, img.naturalHeight,
      centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
    );
  }, []);

  const loadFramePriority = useCallback((i) => {
    i = Math.round(i);
    if (i >= 0 && i <= TOTAL_FRAMES && !imagesRef.current[i]) {
      const img = new Image();
      img.onload = () => {
        imagesRef.current[i] = img;
        if (i === Math.round(frameRef.current.current)) renderFrame(i);
      };
      img.src = getFrameUrl(i);
    }
  }, [renderFrame]);

  const drainFrameQueue = useCallback(function drainQueuedFrames() {
    frameLoadTimerRef.current = null;

    let loadedThisPass = 0;
    const queuedFrames = frameLoadQueueRef.current;

    for (const frame of queuedFrames) {
      queuedFrames.delete(frame);
      loadFramePriority(frame);
      loadedThisPass++;
      if (loadedThisPass >= 8) break;
    }

    if (queuedFrames.size > 0) {
      frameLoadTimerRef.current = window.setTimeout(drainQueuedFrames, 120);
    }
  }, [loadFramePriority]);

  const scheduleFrameRange = useCallback((start, end, stepSize = 1) => {
    const from = Math.max(0, Math.min(TOTAL_FRAMES, Math.round(Math.min(start, end))));
    const to = Math.max(0, Math.min(TOTAL_FRAMES, Math.round(Math.max(start, end))));

    for (let i = from; i <= to; i += stepSize) {
      if (!imagesRef.current[i]) frameLoadQueueRef.current.add(i);
    }

    if (frameLoadTimerRef.current === null && frameLoadQueueRef.current.size > 0) {
      frameLoadTimerRef.current = window.setTimeout(drainFrameQueue, 0);
    }
  }, [drainFrameQueue]);

  const flyToCard = useCallback((targetIndex, dur = 0.9) => {
    if (enginePausedRef.current) return;

    const targetFrame = (TOTAL_FRAMES / 2) * targetIndex;

    loadFramePriority(targetFrame);
    loadFramePriority(targetFrame - 1);
    loadFramePriority(targetFrame + 1);
    scheduleFrameRange(frameRef.current.current, targetFrame, 1);

    gsap.to(frameRef.current, {
      current: targetFrame,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: () => renderFrame(frameRef.current.current)
    });

    const depth = getDepthConfig();
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - targetIndex;

      let zVal, yVal, scaleVal, alphaVal;
      if (offset < 0) {
        zVal = offset * -depth.zPass;
        yVal = offset * -depth.yPass;
        scaleVal = 1 + Math.abs(offset * depth.passScale);
        alphaVal = 1 + (offset * 2.8);
      } else {
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
  }, [loadFramePriority, renderFrame, scheduleFrameRange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frameQueue = frameLoadQueueRef.current;

    for (let i = 0; i <= 4; i++) loadFramePriority(i);
    loadFramePriority(82);
    loadFramePriority(164);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        renderFrame(frameRef.current.current);
      }, 100);
    };

    const handleOrientation = () => {
      enginePausedRef.current = true;
      setTimeout(() => {
        if (!canvas) { enginePausedRef.current = false; return; }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        renderFrame(frameRef.current.current);
        flyToCard(cardIndexRef.current, 0);
        enginePausedRef.current = false;
      }, 350);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      clearTimeout(resizeTimer);
      clearTimeout(frameLoadTimerRef.current);
      frameLoadTimerRef.current = null;
      frameQueue.clear();
    };
  }, [renderFrame, loadFramePriority, flyToCard]);

  useEffect(() => {
    if (step < 2 || step > 4) return;

    const activeFrame = frameRef.current.current;
    scheduleFrameRange(activeFrame - 18, activeFrame + 18, 1);

    if (step === 2) {
      scheduleFrameRange(0, TOTAL_FRAMES, 4);
      return;
    }

    scheduleFrameRange(0, TOTAL_FRAMES, 2);

    const fullSequenceTimer = window.setTimeout(() => {
      scheduleFrameRange(0, TOTAL_FRAMES, 1);
    }, 900);

    return () => clearTimeout(fullSequenceTimer);
  }, [step, scheduleFrameRange]);

  const handlePanelIntent = useCallback((intent, self) => {
    if (!isActiveRef.current || enginePausedRef.current) return;

    if (intent === 'next') {
      if (cardIndexRef.current < 2) {
        cardIndexRef.current++;
        flyToCard(cardIndexRef.current);
        isActiveRef.current = false;
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => { isActiveRef.current = true; }, 700);
      } else if (self.event.type !== 'wheel' || Math.abs(self.deltaY) > 20) {
        isActiveRef.current = false;
        window.dispatchEvent(new CustomEvent('requestNextStep'));
      }
    } else {
      if (cardIndexRef.current > 0) {
        cardIndexRef.current--;
        flyToCard(cardIndexRef.current);
        isActiveRef.current = false;
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => { isActiveRef.current = true; }, 700);
      } else if (self.event.type !== 'wheel' || Math.abs(self.deltaY) > 20) {
        isActiveRef.current = false;
        window.dispatchEvent(new CustomEvent('requestPrevStep'));
      }
    }
  }, [flyToCard]);

  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: 'wheel,touch',
      onDown: (self) => {
        handlePanelIntent(self.event.type === 'wheel' ? 'next' : 'prev', self);
      },
      onUp: (self) => {
        handlePanelIntent(self.event.type === 'wheel' ? 'prev' : 'next', self);
      },
      tolerance: 20,
      preventDefault: false,
    });

    const handleKeyDown = (e) => {
      if (!isActiveRef.current || enginePausedRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        handlePanelIntent('next', { event: { type: 'keyboard' }, deltaY: 100 });
      }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        handlePanelIntent('prev', { event: { type: 'keyboard' }, deltaY: -100 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { obs.kill(); window.removeEventListener('keydown', handleKeyDown); };
  }, [handlePanelIntent]);

  useEffect(() => {
    const isReversing = isReversingRef.current;

    if (step < 3) {
      isActiveRef.current = false;
      clearTimeout(interactionTimeoutRef.current);
      gsap.killTweensOf(frameRef.current);
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: 'power3.inOut', force3D: true });
      gsap.to(canvasRef.current, { opacity: 1, duration: 0.8 });
    }

    if (step > 3) {
      isActiveRef.current = false;
      clearTimeout(interactionTimeoutRef.current);
      gsap.killTweensOf(frameRef.current);
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: 'power3.inOut', force3D: true });
      gsap.set(cameraRef.current, { autoAlpha: 0, display: 'none', delay: 0.4 });
      gsap.to(canvasRef.current, { opacity: 1, duration: 0.8 });
    }

    if (step === 3) {
      gsap.to(containerRef.current, {
        yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', force3D: true,
        onComplete: () => { if (onComplete) onComplete(); },
      });
      gsap.to(canvasRef.current, { opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.set(cameraRef.current, { display: 'flex' });
      gsap.to(cameraRef.current, { autoAlpha: 1, duration: 0.4 });

      if (isReversing) {
        cardIndexRef.current = 2;
        frameRef.current.current = TOTAL_FRAMES;
        renderFrame(TOTAL_FRAMES);
        flyToCard(2, 0);
      } else {
        cardIndexRef.current = 0;
        frameRef.current.current = 0;
        renderFrame(0);
        flyToCard(0, 0);
      }

      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => { isActiveRef.current = true; }, 700);
    }
  }, [step, flyToCard, isReversingRef, onComplete, renderFrame]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-dvh z-20 bg-transparent overflow-hidden will-change-transform ${!isActive ? 'pointer-events-none' : ''}`}
      style={{ touchAction: isActive ? 'none' : 'auto' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" />

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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[65vw] lg:w-[50vw] will-change-[transform,opacity] backface-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
            >
              <div className={`p-8 md:p-12 xl:p-16 rounded-4xl md:rounded-[2.5rem] w-full border-[3px] md:border-4 border-pastel-purple ${item.bg} text-left flex flex-col gap-2 md:gap-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/40 pointer-events-none mix-blend-overlay" />
                <div className="relative z-10">
                  <span className={`text-[10px] md:text-sm xl:text-base tracking-[0.4em] font-black uppercase ${item.dateColor} opacity-90 mb-1 md:mb-2 block font-technical-sans`}>{item.date}</span>
                  <h4 className={`text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black ${item.textColor} font-technical-sans mb-3 md:mb-6 uppercase tracking-tighter leading-none`}>{item.title}</h4>
                  <p className={`${item.textColor} font-elegant-serif leading-relaxed text-sm sm:text-base md:text-xl xl:text-2xl opacity-90`}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default LegacyPanel;