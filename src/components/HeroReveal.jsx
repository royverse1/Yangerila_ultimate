import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import heroVideoDesktop from '../assets/hero_y.mp4';
import heroVideoMobile from '../assets/y_hero_v.mp4';

gsap.registerPlugin(TextPlugin);

const HoverVideo = React.memo(({ src, poster, isActiveStep }) => {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const handlePlay = useCallback(() => {
    if (videoRef.current && isActiveStep) {
      setIsInteracting(true);
      clearTimeout(pauseTimeoutRef.current);
      playPromiseRef.current = videoRef.current.play();
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => { });
      }
    }
  }, [isActiveStep]);

  const handleStop = useCallback((delay = 0) => {
    if (delay > 0) {
      pauseTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
        if (videoRef.current) {
          if (playPromiseRef.current) {
            playPromiseRef.current.then(() => {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }).catch(() => {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            });
          } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      }, delay);
    } else {
      setIsInteracting(false);
      clearTimeout(pauseTimeoutRef.current);
      if (videoRef.current) {
        if (playPromiseRef.current) {
          playPromiseRef.current.then(() => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }).catch(() => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          });
        } else {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, []);

  const handleMouseEnter = useCallback(() => handlePlay(), [handlePlay]);
  const handleMouseLeave = useCallback(() => handleStop(0), [handleStop]);

  const handleTouchStart = useCallback(() => handlePlay(), [handlePlay]);
  const handleTouchEnd = useCallback(() => handleStop(3000), [handleStop]);

  useEffect(() => {
    if (!isActiveStep) {
      handleStop(0);
    }
  }, [isActiveStep, handleStop]);

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden rounded-[1.25rem] md:rounded-4xl cursor-pointer bg-white/50 shrink-0 transition-all duration-500 ${isInteracting ? 'scale-[1.05] shadow-[0_20px_50px_rgba(13,148,136,0.3)] -translate-y-2 border-2 border-accent-teal' : 'scale-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-white/80'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <video ref={videoRef} src={src} poster={poster} muted loop playsInline decoding="async" className="w-full h-full object-cover scale-[1.02]" />
      <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/5 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
});

const HeroReveal = React.memo(function HeroReveal({ step, onComplete, isReversing, onIntroComplete }) {
  const containerRef = useRef(null);
  const maskRef = useRef(null);
  const textRef = useRef(null);
  const letterYRef = useRef(null);
  const paragraphRef = useRef(null);
  const aboutRef = useRef(null);
  const bentoRowsRef = useRef([]);

  const [introDone, setIntroDone] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0); // 0 = Loader, 1 = Video
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [videoSrc, setVideoSrc] = useState(heroVideoDesktop);

  const videoWrapperRef = useRef(null);
  const videoRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);

  const isActive = step >= 0 && step <= 2;
  const isAboutActive = step === 2;

  useEffect(() => {
    const checkOrientation = () => {
      const isVertical = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
      setVideoSrc(isVertical ? heroVideoMobile : heroVideoDesktop);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const yLogoPath = "M69.680,151.308 C65.149,152.644 63.920,157.974 64.907,158.322 C57.879,157.741 54.575,161.654 55.000,170.000 C55.019,169.981 84.536,170.483 107.052,170.235 C108.052,170.224 108.104,170.256 107.944,169.736 C107.904,159.734 103.470,159.279 101.510,158.878 C99.549,158.478 97.377,158.555 96.311,158.394 C96.038,156.229 94.973,154.539 93.693,152.899 C92.413,151.258 89.463,150.510 88.943,150.590 C88.423,150.670 86.693,152.438 87.036,123.967 C87.217,108.974 98.117,80.183 102.556,73.129 C107.865,62.596 121.867,48.795 126.684,45.962 C127.349,44.921 130.813,43.420 130.389,41.604 C129.542,40.515 116.559,46.173 113.465,47.445 C112.454,48.197 109.373,50.149 108.595,51.578 C108.428,51.935 105.909,51.179 107.487,46.361 C108.650,42.291 109.775,38.241 113.961,36.148 C113.961,36.148 123.893,35.069 132.364,32.785 C145.288,28.130 152.249,10.781 152.942,9.133 C153.636,7.485 156.342,1.949 156.342,1.949 C156.342,1.949 151.205,2.319 148.603,2.406 C132.903,2.753 122.983,1.980 111.822,14.630 C110.030,17.117 108.293,24.621 108.929,28.120 C109.565,31.618 111.630,39.065 106.904,41.428 C106.904,41.428 106.638,40.560 106.506,40.126 C113.973,28.926 101.117,16.040 89.544,16.040 C89.544,16.040 80.623,14.594 76.163,13.871 C82.238,16.908 80.325,40.741 104.517,40.741 C104.517,40.741 105.481,41.875 105.963,42.441 C105.963,42.441 102.533,53.291 105.457,53.291 C105.457,53.291 99.084,55.669 90.195,64.972 C88.284,67.049 81.150,75.668 80.154,77.413 C78.658,75.087 74.957,67.185 70.305,61.122 C56.682,37.781 35.593,19.753 29.446,15.766 C24.544,12.028 16.346,5.890 0.064,0.325 C38.608,33.218 64.638,97.620 65.451,107.031 C66.903,113.130 73.514,148.752 69.680,151.308 Z";

  const handleVideoEnd = useCallback(() => {
    if (introDone) return;
    gsap.to(videoWrapperRef.current, {
      autoAlpha: 0, duration: 0.3, ease: "power2.inOut",
      onComplete: () => { setIntroDone(true); if (onIntroComplete) onIntroComplete(); }
    });
  }, [introDone, onIntroComplete]);

  useGSAP(() => {
    if (loadingPhase === 0) {
      gsap.to(progressBarRef.current, {
        width: "100%",
        duration: 0.5, // Reduced from 1.5s to 0.5s for a snappy entrance
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(loadingScreenRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => setLoadingPhase(1)
          });
        }
      });
    }
  }, { scope: containerRef, dependencies: [loadingPhase] });

  useEffect(() => {
    if (loadingPhase !== 1) return;

    const safetyTimer = setTimeout(() => handleVideoEnd(), 5200);
    const skipTimer = setTimeout(() => setShowSkip(true), 3000);
    let playTimeout;

    // Removed videoRef.current.load() to prevent native autoplay race conditions
    if (videoRef.current) {
      playTimeout = setTimeout(() => {
        if (videoRef.current && videoRef.current.paused) {
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
      }, 100);
    }

    return () => { clearTimeout(safetyTimer); clearTimeout(skipTimer); clearTimeout(playTimeout); };
  }, [loadingPhase, handleVideoEnd, videoSrc]);

  useGSAP(() => {
    if (step > 2) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut", force3D: true });
      gsap.set([textRef.current, paragraphRef.current, maskRef.current, aboutRef.current], { autoAlpha: 0, delay: 0.4 });
      gsap.set(bentoRowsRef.current, { autoAlpha: 0 });
      return;
    }
    if (isReversing && step === 2) {
      gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", force3D: true, onComplete });
      gsap.set(maskRef.current, { autoAlpha: 0, scale: 180 });
      gsap.set(letterYRef.current, { opacity: 0 });
      gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50 });
      gsap.set(aboutRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(bentoRowsRef.current, { autoAlpha: 1, y: 0 });
      return;
    }
    if (step === 0) {
      if (isReversing) {
        gsap.to(maskRef.current, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.inOut", force3D: true });
        gsap.to(letterYRef.current, { opacity: 1, duration: 0.6, force3D: true });
        gsap.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60, duration: 0.6, force3D: true, onComplete });
      } else {
        gsap.set(maskRef.current, { scale: 1, autoAlpha: 1 });
        gsap.set(letterYRef.current, { opacity: 1 });
        gsap.set([textRef.current, paragraphRef.current], { autoAlpha: 0, y: 60 });
        gsap.set(aboutRef.current, { autoAlpha: 0, y: 50 });
        gsap.set(bentoRowsRef.current, { autoAlpha: 0, y: 50 });
        onComplete();
      }
    }
    if (step === 1) {
      if (isReversing) {
        gsap.to(aboutRef.current, { autoAlpha: 0, y: 50, duration: 0.6, force3D: true });
        gsap.to(bentoRowsRef.current, { autoAlpha: 0, y: 30, duration: 0.4, force3D: true });
        gsap.to([textRef.current, paragraphRef.current], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true, onComplete });
      } else {
        const tl = gsap.timeline({ onComplete });
        tl.to(maskRef.current, { scale: 180, transformOrigin: '50% 50%', ease: 'power3.inOut', duration: 1.2, force3D: true })
          .to(letterYRef.current, { opacity: 0, duration: 0.3, force3D: true }, "<0.4")
          .to(textRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true }, "-=0.6")
          .to(paragraphRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true }, "-=0.5");
      }
    }
    if (step === 2 && !isReversing) {
      const tl = gsap.timeline({ onComplete });
      tl.to([textRef.current, paragraphRef.current], { autoAlpha: 0, y: -50, duration: 0.6, ease: 'power3.inOut', force3D: true });
      tl.to(aboutRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', force3D: true }, "-=0.2");
      tl.fromTo(bentoRowsRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", force3D: true, clearProps: "transform" },
        "-=0.2"
      );
    }
  }, { scope: containerRef, dependencies: [step, isReversing] });

  const addToBentoRefs = useCallback((el, index) => { if (el) bentoRowsRef.current[index] = el; }, []);

  return (
    <section ref={containerRef} className={`fixed inset-0 w-full h-dvh z-50 bg-transparent overflow-hidden flex items-center justify-center will-change-transform ${step > 2 ? 'pointer-events-none' : ''}`}>
      {!introDone && (
        <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-100 bg-paper-bg">

          {/* Loading Phase */}
          {loadingPhase === 0 && (
            <div ref={loadingScreenRef} className="absolute inset-0 z-120 flex flex-col items-center justify-center bg-paper-bg">
              <h2 className="text-xs sm:text-sm md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-ink-dark mb-4 drop-shadow-sm">Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB]">Yangerila</span></h2>
              <p className="text-[10px] md:text-xs text-ink-medium tracking-widest font-serif italic mb-8 md:mb-12">Loading the Experience</p>
              <div className="w-48 md:w-64 h-px md:h-[2px] bg-ink-dark/10 overflow-hidden relative rounded-full">
                <div ref={progressBarRef} className="absolute top-0 left-0 h-full bg-accent-teal w-0 shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
              </div>
            </div>
          )}

          {/* Video Phase */}
          {loadingPhase === 1 && (
            <>
              <video
                key={videoSrc}
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                playsInline
                decoding="async"
                onEnded={handleVideoEnd}
                onError={handleVideoEnd}
                className={`w-full h-full object-cover transition-all duration-1000 ${videoBlocked ? 'opacity-30 blur-sm scale-105' : 'opacity-100 blur-none scale-100'}`}
              />

              {/* Battery Saver Fallback */}
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
                    className="px-6 py-3 md:px-8 md:py-4 bg-ink-dark/95 hover:bg-ink-dark text-white rounded-4xl uppercase tracking-[0.25em] font-black text-[10px] md:text-xs animate-[pulse_2s_ease-in-out_infinite] shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 border border-white/10 hover:scale-105 active:scale-95">
                    Tap to Enter
                  </button>
                </div>
              )}

              {showSkip && !videoBlocked && (
                <button onClick={handleVideoEnd} className="absolute bottom-10 right-8 z-101 text-ink-dark bg-white/60 hover:bg-white border border-ink-dark/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300 shadow-lg">Skip Intro</button>
              )}
            </>
          )}

        </div>
      )}

      <div ref={textRef} className="z-0 absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-5xl mx-auto invisible translate-y-10 will-change-transform">
        <span className="text-ink-medium tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm font-bold uppercase mb-4 md:mb-8 block">Yangerila Creative Studio</span>
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-ink-dark tracking-tighter mb-4 md:mb-6 uppercase leading-tight">Always Performance <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-accent-teal to-[#2563EB] drop-shadow-sm">Ready</span></h1>
        <p ref={paragraphRef} className="mt-4 md:mt-8 text-ink-dark max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-serif-italic shadow-sm invisible translate-y-10 will-change-transform">A guitar-specialty academy bridging clinical precision and artistic mastery. Serving students nationwide and across 12 countries.</p>
      </div>

      <div ref={aboutRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center invisible translate-y-10 px-4 sm:px-6 md:px-12 lg:px-24 bg-white/85 backdrop-blur-md border-t border-white/80 shadow-2xl will-change-transform">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 sm:gap-8 md:gap-12 relative z-10 max-h-[85dvh] overflow-y-auto md:max-h-none md:overflow-visible pb-8 scrollbar-hide">

          <div className="w-full border-t-2 border-pastel-mint pt-4 md:pt-6 mb-2 shrink-0">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-ink-dark uppercase tracking-tighter leading-none mb-1">About</h2>
            <h3 className="text-lg md:text-2xl text-ink-medium font-light text-serif-italic">Yangerila.</h3>
          </div>

          <div ref={el => addToBentoRefs(el, 0)} className="flex flex-row items-center gap-4 md:gap-16 w-full invisible will-change-[transform,opacity] shrink-0">
            <div className="flex-1">
              <span className="block text-[9px] md:text-xs font-bold tracking-[0.2em] text-accent-teal uppercase mb-1 md:mb-3">01 // Origin</span>
              <p className="text-ink-dark font-sans font-medium md:font-light text-sm sm:text-lg md:text-3xl lg:text-4xl leading-snug md:leading-tight tracking-tight">
                <span className="font-bold">Yangerila Creative Studio</span> is a guitar-specialty academy based in Indirapuram. We offer carefully designed courses that cover multiple aspects of guitar playing.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 aspect-square">
              <HoverVideo src={`${import.meta.env.BASE_URL}videos/1.mp4`} isActiveStep={isAboutActive} />
            </div>
          </div>

          <div ref={el => addToBentoRefs(el, 1)} className="flex flex-row-reverse items-center gap-4 md:gap-16 w-full invisible will-change-[transform,opacity] shrink-0">
            <div className="flex-1 text-right md:text-left">
              <span className="block text-[9px] md:text-xs font-bold tracking-[0.2em] text-accent-teal uppercase mb-1 md:mb-3">02 // Approach</span>
              <p className="text-ink-dark font-serif italic text-sm sm:text-base md:text-2xl lg:text-3xl leading-relaxed">
                Our online classes are redefining the way guitar is taught, combining live interactive sessions, structured courses, and constant teacher support.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 aspect-square">
              <HoverVideo src={`${import.meta.env.BASE_URL}videos/2.mp4`} isActiveStep={isAboutActive} />
            </div>
          </div>

          <div ref={el => addToBentoRefs(el, 2)} className="flex flex-row items-center gap-4 md:gap-16 w-full invisible will-change-[transform,opacity] shrink-0">
            <div className="flex-1">
              <span className="block text-[9px] md:text-xs font-bold tracking-[0.2em] text-accent-teal uppercase mb-1 md:mb-3">03 // Vision</span>
              <p className="text-ink-dark font-sans font-medium text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
                At Yangerila, we believe music is more than just a talent — it's a life skill that everyone can and should learn. With this vision, we are proud to serve students across India.
              </p>
            </div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 aspect-square">
              <HoverVideo src={`${import.meta.env.BASE_URL}videos/3.mp4`} isActiveStep={isAboutActive} />
            </div>
          </div>

        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <svg ref={maskRef} viewBox="0 0 157 171" className="w-[25vw] md:w-[8vw] h-auto overflow-visible will-change-transform">
          <path d={`M -2000 -2000 L 2100 -2000 L 2100 2100 L -2000 2100 Z ${yLogoPath}`} fill="#000000" fillRule="evenodd" />
          <path ref={letterYRef} d={yLogoPath} fill="transparent" stroke="#0D9488" strokeWidth="1.5" className="drop-shadow-[0_0_10px_rgba(13,148,136,0.6)]" />
        </svg>
      </div>
    </section>
  );
});

export default HeroReveal;