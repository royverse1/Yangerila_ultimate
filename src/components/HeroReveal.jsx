import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { Users, Globe, MapPin, TrendingUp, Headset, Award, FileText } from 'lucide-react';
import heroVideoDesktop from '../assets/hero_y.mp4';
import heroVideoMobile from '../assets/y_hero_v.mp4';
import SmartVideo from './SmartVideo';

gsap.registerPlugin(TextPlugin);

const AboutDivider = React.forwardRef((props, ref) => (
  <div ref={ref} className={`flex items-center justify-center gap-3 w-full max-w-[100px] md:max-w-[150px] my-5 md:my-7 opacity-0 will-change-[transform,opacity] ${props.className || ''}`}>
    <div className="h-px bg-ink-dark/40 flex-1"></div>
    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rotate-45 bg-ink-dark/80 rounded-sm"></div>
    <div className="h-px bg-ink-dark/40 flex-1"></div>
  </div>
));
AboutDivider.displayName = 'AboutDivider';

// Data matched exactly to the reference mockup with the requested "Teaching Experience" update
const bentoItems = [
  { icon: Users, stat: "4,000+", label: "Students\nTaught" },
  { icon: Globe, stat: "12+", label: "Countries" }, 
  { icon: MapPin, stat: "40+", label: "Indian\nCities" },
  { icon: Headset, stat: "24/7", label: "Student\nSupport" },
  { icon: Award, stat: "Certified", label: "Guitar\nCourses" },
  { icon: FileText, stat: "Interactive", label: "Smart\nSheets" },
  { icon: TrendingUp, stat: "Fastest", label: "Progress\nGuaranteed" },
  { icon: Users, stat: "20+ Years", label: "Teaching Experience" }, 
];

// Mobile Grid: 4 columns, 2 rows
const mobileBentoOrder = bentoItems;

// Desktop Left: Students, Countries, Cities, Fastest Progress
const desktopLeftBento = [bentoItems[0], bentoItems[1], bentoItems[2], bentoItems[6]];

// Desktop Right: Support, Certified, Smart Sheets, Teaching Exp
const desktopRightBento = [bentoItems[3], bentoItems[4], bentoItems[5], bentoItems[7]];

const HeroReveal = React.memo(function HeroReveal({ step, onComplete, isReversingRef, onIntroComplete }) {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const letterYRef = useRef(null);
  const paragraphRef = useRef(null);
  const aboutRef = useRef(null);

  const mobileBentoRefs = useRef([]);
  const desktopBentoRefs = useRef([]);
  const aboutLinesRef = useRef([]);
  const maskProxy = useRef({ scale: 1, opacity: 1 });

  const [introDone, setIntroDone] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [videoBuffered, setVideoBuffered] = useState(false);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [videoSrc, setVideoSrc] = useState(heroVideoDesktop);

  const videoWrapperRef = useRef(null);
  const videoRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);

  const isAboutActive = step === 2;

  const yLogoPath = "M69.680,151.308 C65.149,152.644 63.920,157.974 64.907,158.322 C57.879,157.741 54.575,161.654 55.000,170.000 C55.019,169.981 84.536,170.483 107.052,170.235 C108.052,170.224 108.104,170.256 107.944,169.736 C107.904,159.734 103.470,159.279 101.510,158.878 C99.549,158.478 97.377,158.555 96.311,158.394 C96.038,156.229 94.973,154.539 93.693,152.899 C92.413,151.258 89.463,150.510 88.943,150.590 C88.423,150.670 86.693,152.438 87.036,123.967 C87.217,108.974 98.117,80.183 102.556,73.129 C107.865,62.596 121.867,48.795 126.684,45.962 C127.349,44.921 130.813,43.420 130.389,41.604 C129.542,40.515 116.559,46.173 113.465,47.445 C112.454,48.197 109.373,50.149 108.595,51.578 C108.428,51.935 105.909,51.179 107.487,46.361 C108.650,42.291 109.775,38.241 113.961,36.148 C113.961,36.148 123.893,35.069 132.364,32.785 C145.288,28.130 152.249,10.781 152.942,9.133 C153.636,7.485 156.342,1.949 156.342,1.949 C156.342,1.949 151.205,2.319 148.603,2.406 C132.903,2.753 122.983,1.980 111.822,14.630 C110.030,17.117 108.293,24.621 108.929,28.120 C109.565,31.618 111.630,39.065 106.904,41.428 C106.904,41.428 106.638,40.560 106.506,40.126 C113.973,28.926 101.117,16.040 89.544,16.040 C89.544,16.040 80.623,14.594 76.163,13.871 C82.238,16.908 80.325,40.741 104.517,40.741 C104.517,40.741 105.481,41.875 105.963,42.441 C105.963,42.441 102.533,53.291 105.457,53.291 C105.457,53.291 99.084,55.669 90.195,64.972 C88.284,67.049 81.150,75.668 80.154,77.413 C78.658,75.087 74.957,67.185 70.305,61.122 C56.682,37.781 35.593,19.753 29.446,15.766 C24.544,12.028 16.346,5.890 0.064,0.325 C38.608,33.218 64.638,97.620 65.451,107.031 C66.903,113.130 73.514,148.752 69.680,151.308 Z";

  const addToMobileBento = useCallback((el, index) => { if (el) mobileBentoRefs.current[index] = el; }, []);
  const addToDesktopBento = useCallback((el, index) => { if (el) desktopBentoRefs.current[index] = el; }, []);
  const addToAboutLines = useCallback((el, index) => { if (el) aboutLinesRef.current[index] = el; }, []);

  useEffect(() => {
    const checkOrientation = () => {
      const isVertical = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
      setVideoSrc(isVertical ? heroVideoMobile : heroVideoDesktop);
      setVideoBuffered(false);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = maskProxy.current.opacity;
    if (ctx.globalAlpha <= 0.01) return;

    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(dpr, dpr);

    const proxyScale = maskProxy.current.scale;
    ctx.scale(proxyScale, proxyScale);

    const vw = window.innerWidth;
    const baseWidth = vw >= 768 ? vw * 0.08 : vw * 0.25;
    const baseScale = baseWidth / 157;

    ctx.scale(baseScale, baseScale);
    ctx.translate(-157 / 2, -171 / 2);

    const p = new Path2D(yLogoPath);
    ctx.fill(p);
    ctx.lineWidth = 0.5;
    ctx.stroke(p);

    ctx.resetTransform();
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const resize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        if (canvasRef.current) {
          const dpr = window.devicePixelRatio || 1;
          canvasRef.current.width = window.innerWidth * dpr;
          canvasRef.current.height = window.innerHeight * dpr;
          renderCanvas();
        }
      }
    };
    window.addEventListener('resize', resize);
    if (canvasRef.current) {
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = window.innerWidth * dpr;
      canvasRef.current.height = window.innerHeight * dpr;
      renderCanvas();
    }
    return () => window.removeEventListener('resize', resize);
  }, [renderCanvas]);

  const handleVideoEnd = useCallback(() => {
    if (introDone) return;
    gsap.to(videoWrapperRef.current, {
      autoAlpha: 0, duration: 0.3, ease: "power2.inOut",
      onComplete: () => { setIntroDone(true); if (onIntroComplete) onIntroComplete(); }
    });
  }, [introDone, onIntroComplete]);

  useEffect(() => {
    const forceLoad = setTimeout(() => {
      if (!videoBuffered) setVideoBuffered(true);
    }, 4000);
    return () => clearTimeout(forceLoad);
  }, [videoSrc, videoBuffered]);

  useGSAP(() => {
    if (loadingPhase === 0) {
      gsap.to(progressBarRef.current, { width: "80%", duration: 0.6, ease: "power2.out" });
    }
  }, { scope: containerRef, dependencies: [loadingPhase] });

  useEffect(() => {
    if (videoBuffered && loadingPhase === 0) {
      gsap.to(progressBarRef.current, {
        width: "100%", duration: 0.3, ease: "power1.inOut",
        onComplete: () => {
          gsap.to(loadingScreenRef.current, { autoAlpha: 0, duration: 0.4, onComplete: () => setLoadingPhase(1) });
        }
      });
    }
  }, [videoBuffered, loadingPhase]);

  useEffect(() => {
    if (loadingPhase !== 1) return;

    const safetyTimer = setTimeout(() => handleVideoEnd(), 5200);
    const skipTimer = setTimeout(() => setShowSkip(true), 3000);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("Autoplay blocked by OS LPM:", e);
          setVideoBlocked(true);
          clearTimeout(safetyTimer);
          clearTimeout(skipTimer);
        });
      }
    }
    return () => { clearTimeout(safetyTimer); clearTimeout(skipTimer); };
  }, [loadingPhase, handleVideoEnd]);

  useGSAP(() => {
    const isReversing = isReversingRef.current;

    const getActiveBento = () => window.innerWidth < 768 ? mobileBentoRefs.current : desktopBentoRefs.current;
    const getAllBento = () => [...mobileBentoRefs.current, ...desktopBentoRefs.current];

    if (step > 2) {
      gsap.killTweensOf(getAllBento());
      gsap.killTweensOf(aboutLinesRef.current);
      gsap.to(maskRef.current, { autoAlpha: 0, duration: 0.1, force3D: true });
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut", force3D: true });
      gsap.to([textRef.current, paragraphRef.current, aboutRef.current], { autoAlpha: 0, duration: 0.4, delay: 0.2, force3D: true });
      gsap.to(aboutLinesRef.current, { autoAlpha: 0, duration: 0.4, force3D: true });
      return;
    }

    if (isReversing && step < 2) {
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", force3D: true });
    }

    if (isReversing && step === 2) {
      gsap.killTweensOf([containerRef.current, textRef.current, paragraphRef.current, maskRef.current, aboutRef.current, maskProxy.current]);
      gsap.killTweensOf(getAllBento());
      gsap.killTweensOf(aboutLinesRef.current);

      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", force3D: true, onComplete });
      gsap.set(maskRef.current, { autoAlpha: 0, scale: 120, force3D: true });
      maskProxy.current = { scale: 120, opacity: 0 };
      renderCanvas();
      gsap.set(letterYRef.current, { autoAlpha: 0, force3D: false });
      gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50 });
      gsap.set(getAllBento(), { autoAlpha: 0, scale: 1, boxShadow: "0px 0px 0px 0px rgba(240, 90, 0, 0)" });
      gsap.set(aboutRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(aboutLinesRef.current, { autoAlpha: 1, y: 0 });
      return;
    }

    if (step === 0) {
      gsap.killTweensOf(getAllBento());
      gsap.killTweensOf(aboutLinesRef.current);

      if (isReversing) {
        gsap.to(maskRef.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.inOut", force3D: true, transformOrigin: '50% 50%' });
        gsap.to(maskProxy.current, { scale: 1, opacity: 1, duration: 0.8, ease: "power3.inOut", onUpdate: renderCanvas });
        gsap.to(letterYRef.current, { autoAlpha: 1, duration: 0.4, delay: 0.4, force3D: false });
        gsap.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60, duration: 0.6, force3D: true, onComplete });
      } else {
        gsap.set(maskRef.current, { scale: 1, autoAlpha: 1, force3D: true });
        maskProxy.current = { scale: 1, opacity: 1 };
        renderCanvas();
        gsap.set(letterYRef.current, { autoAlpha: 1, force3D: false });
        gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60 });
        gsap.set(getAllBento(), { autoAlpha: 0, scale: 1, boxShadow: "0px 0px 0px 0px rgba(240, 90, 0, 0)" });
        gsap.set(aboutRef.current, { autoAlpha: 0, y: 50 });
        gsap.set(aboutLinesRef.current, { autoAlpha: 0, y: 30 });
        onComplete();
      }
    }

    if (step === 1) {
      gsap.killTweensOf(getAllBento());
      const activeBento = getActiveBento();

      if (isReversing) {
        gsap.killTweensOf([textRef.current, paragraphRef.current, maskRef.current, aboutRef.current, maskProxy.current, aboutLinesRef.current]);
        gsap.set(maskRef.current, { autoAlpha: 0, scale: 120, force3D: true });
        maskProxy.current = { scale: 120, opacity: 0 };
        renderCanvas();
        gsap.set(letterYRef.current, { autoAlpha: 0, force3D: false });
        gsap.to(aboutRef.current, { autoAlpha: 0, y: 50, duration: 0.6, force3D: true });
        gsap.to(aboutLinesRef.current, { autoAlpha: 0, y: 30, duration: 0.4, force3D: true });

        const tl = gsap.timeline({ onComplete });
        tl.to([textRef.current, paragraphRef.current], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true }, 0);
        tl.fromTo(activeBento,
          { scale: 0.95, autoAlpha: 0, boxShadow: "0px 0px 0px 0px rgba(240, 90, 0, 0)" },
          {
            scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.5)',
            onComplete: () => {
              gsap.to(activeBento, { 
                boxShadow: "0px 0px 30px 8px rgba(240, 90, 0, 0.7)", 
                duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.15 
              });
            }
          }, 0.2);
      } else {
        const tl = gsap.timeline({ onComplete });
        tl.to(maskRef.current, { scale: 120, transformOrigin: '50% 50%', ease: 'power3.inOut', duration: 1.2, force3D: true }, 0);
        tl.to(maskProxy.current, { scale: 120, ease: 'power3.inOut', duration: 1.2, onUpdate: renderCanvas }, 0);
        tl.to(letterYRef.current, { autoAlpha: 0, duration: 0.15, force3D: false }, 0);

        tl.to(textRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true }, 0.4);

        tl.fromTo(activeBento,
          { scale: 0.95, autoAlpha: 0, boxShadow: "0px 0px 0px 0px rgba(240, 90, 0, 0)" },
          {
            scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.08, force3D: true,
            onComplete: () => {
              gsap.to(activeBento, {
                boxShadow: "0px 0px 30px 8px rgba(240, 90, 0, 0.7)", 
                duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.15
              });
            }
          }, 0.6);
      }
    }

    if (step === 2 && !isReversing) {
      const activeBento = getActiveBento();
      gsap.killTweensOf(getAllBento());
      gsap.killTweensOf(aboutLinesRef.current);

      const tl = gsap.timeline({ onComplete });
      tl.to(activeBento, { autoAlpha: 0, scale: 0.95, boxShadow: "0px 0px 0px 0px rgba(240, 90, 0, 0)", duration: 0.4, stagger: 0.05, ease: 'power2.inOut' }, 0);
      tl.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50, duration: 0.6, ease: 'power3.inOut', force3D: true }, 0.2);
      tl.to(aboutRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', force3D: true }, "-=0.2");
      tl.fromTo(aboutLinesRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", force3D: true },
        "-=0.2"
      );
    }
  }, { scope: containerRef, dependencies: [step] });

  return (
    <section ref={containerRef} className={`fixed inset-0 w-full h-dvh z-50 bg-[#FDFBF7] overflow-hidden flex items-center justify-center will-change-transform ${step > 2 ? 'pointer-events-none' : ''}`}>
      {!introDone && (
        <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-100 bg-[radial-gradient(circle_at_center,#F4F0FF_0%,#D3C5F1_100%)]">
          <video
            key={videoSrc} ref={videoRef} src={videoSrc} preload="auto" muted playsInline
            onLoadedData={() => setVideoBuffered(true)} onCanPlayThrough={() => setVideoBuffered(true)}
            onEnded={handleVideoEnd} onError={handleVideoEnd}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 will-change-transform transform-[translateZ(0)] ${videoBlocked ? 'opacity-30 blur-sm scale-105' : 'opacity-100 blur-none scale-100'} ${loadingPhase === 0 ? 'invisible' : 'visible'}`}
          />

          {loadingPhase === 0 && (
            <div ref={loadingScreenRef} className="absolute inset-0 z-120 flex flex-col items-center justify-center bg-transparent">
              <h2 className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#1E293B] mb-3 md:mb-5 drop-shadow-sm font-sans">
                Welcome to <span className="text-[#64748B]">Yangerila</span>
              </h2>
              <p className="text-[9px] md:text-[11px] text-[#64748B] tracking-[0.2em] md:tracking-[0.3em] italic mb-8 md:mb-12 font-sans font-medium">
                Loading the Experience
              </p>
              <div className="w-48 md:w-64 h-px md:h-[2px] bg-[#1E293B]/10 overflow-hidden relative rounded-full">
                <div ref={progressBarRef} className="absolute top-0 left-0 h-full bg-[#1E293B] w-0 shadow-sm" />
              </div>
            </div>
          )}

          {loadingPhase === 1 && (
            <>
              {videoBlocked && (
                <div className="absolute inset-0 z-110 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                  <button
                    onClick={() => {
                      setVideoBlocked(false);
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => handleVideoEnd());
                        setTimeout(() => handleVideoEnd(), 5200);
                      }
                    }}
                    className="px-6 py-3 md:px-8 md:py-4 bg-[#1E293B]/95 hover:bg-[#1E293B] text-white rounded-4xl uppercase tracking-[0.25em] font-black text-[10px] md:text-xs animate-[pulse_2s_ease-in-out_infinite] shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 border border-white/10 hover:scale-105 active:scale-95 font-sans">
                    Tap to Enter
                  </button>
                </div>
              )}
              {showSkip && !videoBlocked && (
                <button onClick={handleVideoEnd} className="absolute bottom-10 right-8 z-101 text-[#1E293B] bg-white/80 hover:bg-white border-2 border-[#1E293B]/20 px-6 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg">Skip Intro</button>
              )}
            </>
          )}
        </div>
      )}

      {/* --- RESPONSIVE TYPOGRAPHY & BENTO GRID START --- */}
      <div ref={textRef} className="z-0 absolute inset-0 w-full h-full flex flex-col items-center invisible will-change-transform bg-[#FDFBF7] overflow-hidden">

        {/* Video Background (Fullscreen on Desktop, Masked/Gradient on Mobile) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#FDFBF7]">
          <div className="absolute top-0 left-0 w-full h-[60%] md:h-full [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] md:[mask-image:none]">
            <SmartVideo
              srcWebm={`${import.meta.env.BASE_URL}videos/hero_bg_clean.webm`}
              srcMp4={`${import.meta.env.BASE_URL}videos/hero_bg_clean.mp4`}
              poster={`${import.meta.env.BASE_URL}assets/hero_bg_clean.jpg`}
              className="w-full h-full [&>video]:object-cover md:[&>video]:object-center [&>video]:object-[50%_20%] opacity-90 mix-blend-multiply"
              loop={true}
            />
          </div>
          {/* Mobile Bottom Fade Mask - Hidden entirely on Desktop */}
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent md:hidden"></div>
        </div>

        {/* Text Block with updated labels and custom Y SVG */}
        <div className="relative z-10 flex flex-col items-center mt-[4vh] md:mt-[6vh] w-full px-4 pointer-events-none">
          <h1 className="text-[4rem] sm:text-6xl md:text-[6.5rem] lg:text-[8rem] font-black font-technical-sans text-ink-dark uppercase tracking-tighter leading-[0.8] mb-4 md:mb-6" style={{ transform: 'scaleY(1.15)' }}>
            Yangerila
          </h1>
          <h2 className="text-[10px] sm:text-sm md:text-xl lg:text-2xl font-bold font-technical-sans text-ink-dark uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-5">
            A Guitar Specialty Academy
          </h2>

          <div className="flex items-center gap-3 md:gap-4 w-full max-w-[260px] md:max-w-[400px] mb-3 md:mb-5">
            <div className="h-[1.5px] bg-ink-dark flex-1"></div>
            <div className="w-5 h-5 md:w-8 md:h-8 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 157 171" className="w-full h-full fill-current text-ink-dark">
                <path d={yLogoPath} />
              </svg>
            </div>
            <div className="h-[1.5px] bg-ink-dark flex-1"></div>
          </div>

          <h3 className="text-[10px] sm:text-xs md:text-lg lg:text-xl font-black font-technical-sans text-ink-dark uppercase tracking-[0.15em] md:tracking-[0.2em]">
            Start your guitar learning journey with us
          </h3>
        </div>

        {/* MOBILE VIEW GRID: 4 columns, 2 rows of vertical glassmorphism cards */}
        <div className="relative z-10 w-full h-full mx-auto flex-1 flex flex-col justify-end pb-8 md:hidden pointer-events-none">
          <div className="relative w-full pointer-events-auto mt-auto mb-6 px-2 z-20">
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-[480px] mx-auto">
              {mobileBentoOrder.map((btn, index) => (
                <div
                  key={`mobile-${index}`}
                  ref={el => addToMobileBento(el, index)}
                  className="flex flex-col items-center justify-center gap-1.5 bg-white/40 backdrop-blur-md p-2 py-4 rounded-2xl border-2 border-ink-dark shadow-none will-change-[transform,box-shadow] text-center aspect-[3/4] w-full"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-ink-dark flex items-center justify-center shrink-0 mb-0.5">
                    <btn.icon className="text-[#FDFBF7] w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-[11px] sm:text-[14px] font-black font-technical-sans text-ink-dark leading-none mb-1">{btn.stat}</span>
                    <span className="text-[7px] sm:text-[8px] font-bold font-technical-sans text-ink-dark/80 uppercase leading-tight whitespace-pre-line text-center px-0.5">{btn.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW PANELS: Hugging edges, +20% scaling on width, height, icons, text */}
        <div className="hidden md:flex absolute inset-0 w-full h-full justify-between items-center pointer-events-none px-6 lg:px-10 xl:px-16 pt-[12vh] pb-[8vh] z-10">

          {/* Left Side Group */}
          <div className="flex flex-col justify-center h-full pointer-events-auto w-[195px] lg:w-[210px] xl:w-[230px]">
            <div className="relative flex flex-col gap-2 lg:gap-2.5 w-full">
              
              {/* Left Flowchart Vertical Line */}
              <div className="hidden lg:block absolute top-[50px] lg:top-[55px] xl:top-[62.5px] bottom-[50px] lg:bottom-[55px] xl:bottom-[62.5px] -right-4 lg:-right-6 xl:-right-8 w-[1.5px] bg-ink-dark pointer-events-none"></div>
              {/* Left Flowchart Main Horizontal Line */}
              <div className="hidden lg:block absolute top-1/2 -right-4 lg:-right-6 xl:-right-8 w-8 lg:w-12 xl:w-20 h-[1.5px] bg-ink-dark translate-x-full pointer-events-none"></div>

              {desktopLeftBento.map((btn, index) => (
                <div
                  key={`desktop-left-${index}`}
                  ref={el => addToDesktopBento(el, index)}
                  className="relative flex items-center gap-3 bg-white/40 backdrop-blur-md px-3 lg:px-4 py-2 h-[100px] lg:h-[110px] xl:h-[125px] rounded-2xl border-2 border-ink-dark shadow-none will-change-[transform,box-shadow] w-full"
                >
                  <div className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] xl:w-[68px] xl:h-[68px] rounded-full bg-ink-dark flex items-center justify-center shrink-0">
                    <btn.icon className="text-[#FDFBF7] w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col z-10 text-left justify-center flex-1">
                    <span className="text-[16px] lg:text-[18px] xl:text-[22px] font-black font-technical-sans text-ink-dark leading-none tracking-tight mb-1">{btn.stat}</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-[12px] font-bold font-technical-sans text-ink-dark/80 uppercase leading-tight whitespace-pre-line">{btn.label}</span>
                  </div>
                  {/* Button Flowchart Connectors */}
                  <div className="hidden lg:block absolute top-1/2 -right-4 lg:-right-6 xl:-right-8 w-4 lg:w-6 xl:w-8 h-[1.5px] bg-ink-dark pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Group */}
          <div className="flex flex-col justify-center h-full pointer-events-auto w-[195px] lg:w-[210px] xl:w-[230px]">
            <div className="relative flex flex-col gap-2 lg:gap-2.5 w-full">
              
              {/* Right Flowchart Vertical Line */}
              <div className="hidden lg:block absolute top-[50px] lg:top-[55px] xl:top-[62.5px] bottom-[50px] lg:bottom-[55px] xl:bottom-[62.5px] -left-4 lg:-left-6 xl:-left-8 w-[1.5px] bg-ink-dark pointer-events-none"></div>
              {/* Right Flowchart Main Horizontal Line */}
              <div className="hidden lg:block absolute top-1/2 -left-4 lg:-left-6 xl:-left-8 w-8 lg:w-12 xl:w-20 h-[1.5px] bg-ink-dark -translate-x-full pointer-events-none"></div>

              {desktopRightBento.map((btn, index) => (
                <div
                  key={`desktop-right-${index}`}
                  ref={el => addToDesktopBento(el, index + 4)}
                  className="relative flex items-center flex-row-reverse gap-3 bg-white/40 backdrop-blur-md px-3 lg:px-4 py-2 h-[100px] lg:h-[110px] xl:h-[125px] rounded-2xl border-2 border-ink-dark shadow-none will-change-[transform,box-shadow] w-full text-right"
                >
                  <div className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] xl:w-[68px] xl:h-[68px] rounded-full bg-ink-dark flex items-center justify-center shrink-0">
                    <btn.icon className="text-[#FDFBF7] w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col z-10 text-right justify-center flex-1">
                    <span className="text-[16px] lg:text-[18px] xl:text-[22px] font-black font-technical-sans text-ink-dark leading-none tracking-tight mb-1">{btn.stat}</span>
                    <span className="text-[9px] lg:text-[10px] xl:text-[12px] font-bold font-technical-sans text-ink-dark/80 uppercase leading-tight whitespace-pre-line">{btn.label}</span>
                  </div>
                  {/* Button Flowchart Connectors */}
                  <div className="hidden lg:block absolute top-1/2 -left-4 lg:-left-6 xl:-left-8 w-4 lg:w-6 xl:w-8 h-[1.5px] bg-ink-dark pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div ref={paragraphRef} className="invisible hidden"></div>
      </div>
      {/* --- RESPONSIVE TYPOGRAPHY & BENTO GRID END --- */}

      {/* --- STATIC NEW ABOUT SECTION START --- */}
      <div ref={aboutRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center invisible translate-y-10 bg-paper-bg border-t-2 border-ink-dark shadow-[0_-10px_40px_rgba(0,0,0,0.15)] will-change-transform overflow-hidden">

        <picture className="absolute inset-0 z-0 pointer-events-none opacity-90 mix-blend-multiply flex items-center justify-center overflow-hidden">
          <source media="(min-width: 768px)" srcSet={`${import.meta.env.BASE_URL}assets/about_bg_landscape.jpeg`} />
          <img src={`${import.meta.env.BASE_URL}assets/about_bg_portrait.jpeg`} alt="Yangerila Parchment" className="w-full h-full object-cover object-center" />
        </picture>

        <div className="relative z-10 w-full h-full max-h-[100dvh] overflow-y-auto px-6 md:px-8 flex flex-col">
          <div className="m-auto w-full max-w-3xl py-16 md:py-20 flex flex-col items-center text-center">

            <div ref={el => addToAboutLines(el, 0)} className="w-8 h-8 md:w-10 md:h-10 mb-5 text-ink-dark opacity-0 will-change-[transform,opacity]">
              <svg viewBox="0 0 157 171" className="w-full h-full fill-current drop-shadow-sm">
                <path d={yLogoPath} />
              </svg>
            </div>

            <h4 ref={el => addToAboutLines(el, 1)} className="text-[11px] md:text-sm font-bold font-technical-sans tracking-[0.4em] md:tracking-[0.5em] text-ink-dark uppercase mb-1 opacity-0 will-change-[transform,opacity]">
              About
            </h4>

            <h2 ref={el => addToAboutLines(el, 2)} className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[7.5rem] font-black font-technical-sans text-ink-dark uppercase tracking-tighter leading-[0.85] mb-2 opacity-0 will-change-[transform,opacity]" style={{ transform: 'scaleY(1.15)' }}>
              Yangerila
            </h2>

            <h3 ref={el => addToAboutLines(el, 3)} className="text-[11px] md:text-sm font-bold font-technical-sans text-ink-dark uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 md:mb-6 opacity-0 will-change-[transform,opacity]">
              Creative Studio
            </h3>

            <AboutDivider ref={el => addToAboutLines(el, 4)} />

            <p ref={el => addToAboutLines(el, 5)} className="text-xs sm:text-sm md:text-base lg:text-[17px] font-medium font-technical-sans text-ink-dark leading-relaxed max-w-[95%] md:max-w-xl mx-auto opacity-0 will-change-[transform,opacity]">
              At Yangerila Creative Studio, we believe every guitarist has a unique voice waiting to be discovered. Our mission is to nurture that voice through the right guidance, structure, and inspiration.
            </p>

            <AboutDivider ref={el => addToAboutLines(el, 6)} />

            <p ref={el => addToAboutLines(el, 7)} className="text-xs sm:text-sm md:text-base lg:text-[17px] font-medium font-technical-sans text-ink-dark leading-relaxed max-w-[95%] md:max-w-2xl mx-auto opacity-0 will-change-[transform,opacity]">
              We blend traditional techniques with modern teaching methodologies to create a learning experience that is engaging, effective, and transformative. Whether you are a beginner or an advanced player, our programs are designed to help you grow with confidence.
            </p>

            <AboutDivider ref={el => addToAboutLines(el, 8)} />

            <p ref={el => addToAboutLines(el, 9)} className="text-xs sm:text-sm md:text-base lg:text-[17px] font-medium font-technical-sans text-ink-dark leading-relaxed max-w-[95%] md:max-w-2xl mx-auto opacity-0 will-change-[transform,opacity]">
              More than just a music academy, we are a community of passionate learners and dedicated mentors committed to excellence, creativity, and the joy of making music that lasts a lifetime.
            </p>

            <div ref={el => addToAboutLines(el, 10)} className="w-8 h-8 md:w-10 md:h-10 mt-10 md:mt-12 text-ink-dark opacity-0 will-change-[transform,opacity]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
                <path d="M9 3C9 2.45 9.45 2 10 2h4c.55 0 1 .45 1 1v12h-6V3z" />
                <rect x="10" y="15" width="4" height="7" />
                <circle cx="6.5" cy="5" r="1.25" />
                <circle cx="6.5" cy="9" r="1.25" />
                <circle cx="6.5" cy="13" r="1.25" />
                <circle cx="17.5" cy="5" r="1.25" />
                <circle cx="17.5" cy="9" r="1.25" />
                <circle cx="17.5" cy="13" r="1.25" />
                <rect x="7.75" y="4.5" width="1.25" height="1" />
                <rect x="7.75" y="8.5" width="1.25" height="1" />
                <rect x="7.75" y="12.5" width="1.25" height="1" />
                <rect x="15" y="4.5" width="1.25" height="1" />
                <rect x="15" y="8.5" width="1.25" height="1" />
                <rect x="15" y="12.5" width="1.25" height="1" />
              </svg>
            </div>

          </div>
        </div>
      </div>
      {/* --- STATIC NEW ABOUT SECTION END --- */}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ transform: 'translateZ(0)' }} />

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div ref={maskRef} className="w-[25vw] md:w-[8vw] aspect-157/171 will-change-transform" style={{ transform: 'translateZ(0)' }}>
          <svg viewBox="0 0 157 171" className="w-full h-full overflow-visible" style={{ shapeRendering: 'geometricPrecision' }}>
            <path ref={letterYRef} d={yLogoPath} fill="transparent" stroke="var(--color-accent-teal)" strokeWidth="1.5" className="md:drop-shadow-[0_0_10px_rgba(58,90,140,0.6)]" style={{ vectorEffect: 'non-scaling-stroke' }} />
          </svg>
        </div>
      </div>
    </section>
  );
});

export default HeroReveal;