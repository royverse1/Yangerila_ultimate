import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';
import { Menu, X, Play } from 'lucide-react';

import ambientMusic from './assets/bg_music.mp3';

import HeroReveal from './components/HeroReveal';
import LegacyPanel from './components/LegacyPanel';
import MethodPanel from './components/MethodPanel';
import FAQSection from './components/FAQSection';
import FooterReveal from './components/FooterReveal';

gsap.registerPlugin(ScrollTrigger, Observer);

const StaticPastelBackground = React.memo(function StaticPastelBackground({ step }) {
  const getBgStyle = (s) => {
    if (s <= 2) return 'linear-gradient(135deg, var(--color-paper-bg) 0%, var(--color-pastel-mint) 100%)';
    if (s === 3 || s === 4) return 'linear-gradient(135deg, var(--color-ink-dark) 0%, #2E151B 100%)';
    if (s <= 9) return 'linear-gradient(135deg, var(--color-pastel-purple) 0%, var(--color-ink-medium) 100%)';
    return 'linear-gradient(135deg, var(--color-pastel-blue) 0%, var(--color-paper-bg) 100%)';
  };
  return (
    <div
      className="fixed inset-0 z-[-3] pointer-events-none transition-colors duration-1000 ease-in-out"
      style={{ background: getBgStyle(step) }}
    />
  );
});

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepRef = useRef(0);
  const isLockedRef = useRef(false);
  const isReversingRef = useRef(false);   // ← full ref object passed to children
  const lastTransitionTime = useRef(0);
  const COOLDOWN_MS = 600;

  const INERTIA_WINDOW = 50;
  const inertiaDeadTime = useRef(0);

  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const isIntroPlayingRef = useRef(true);
  const elevatorRef = useRef(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUIMinimized, setIsUIMinimized] = useState(false);
  const [musicExpanded, setMusicExpanded] = useState(false);

  const audioRef = useRef(null);
  const musicExpandTimeoutRef = useRef(null);
  // P5.1 — guard so autoplay effect never double-fires
  const hasStartedAudioRef = useRef(false);

  const attemptAudioAutoplay = useCallback(() => {
    if (hasStartedAudioRef.current || !audioRef.current) return;
    const p = audioRef.current.play();
    if (p !== undefined) {
      p.then(() => {
        hasStartedAudioRef.current = true;
        setIsMusicPlaying(true);
        gsap.to(audioRef.current, { volume: 0.4, duration: 2, ease: 'power2.inOut' });
      }).catch(e => console.log('Autoplay prevented:', e));
    }
  }, []);

  const onStepComplete = useCallback(() => { isLockedRef.current = false; }, []);
  const handleIntroComplete = useCallback(() => {
    isIntroPlayingRef.current = false;
    setIsIntroPlaying(false);
  }, []);

  useEffect(() => {
    const extendInertia = () => {
      const now = Date.now();
      if (isLockedRef.current || now < inertiaDeadTime.current) {
        inertiaDeadTime.current = now + INERTIA_WINDOW;
      }
    };
    window.addEventListener('wheel', extendInertia, { passive: true });
    window.addEventListener('touchmove', extendInertia, { passive: true });
    return () => {
      window.removeEventListener('wheel', extendInertia);
      window.removeEventListener('touchmove', extendInertia);
    };
  }, []);

  const goToStep = useCallback((nextStep, isFromMenu = false) => {
    const now = Date.now();
    if (isLockedRef.current || now - lastTransitionTime.current < COOLDOWN_MS) return;

    let finalStep = nextStep;
    if (currentStepRef.current >= 1 && finalStep < 1) finalStep = 1;
    if (finalStep < 0 || finalStep > 12) return;
    if (finalStep === currentStepRef.current) return;

    lastTransitionTime.current = now;
    isReversingRef.current = finalStep < currentStepRef.current;
    isLockedRef.current = true;
    inertiaDeadTime.current = now + INERTIA_WINDOW;

    currentStepRef.current = finalStep;
    setCurrentStep(finalStep);
    setIsMenuOpen(false);

    setTimeout(() => { isLockedRef.current = false; }, COOLDOWN_MS);
  }, []);

  // P1.1 — Listen for exit events from LegacyPanel timeline
  useEffect(() => {
    const handleReqNext = () => goToStep(currentStepRef.current + 1);
    const handleReqPrev = () => goToStep(currentStepRef.current - 1);
    window.addEventListener('requestNextStep', handleReqNext);
    window.addEventListener('requestPrevStep', handleReqPrev);
    return () => {
      window.removeEventListener('requestNextStep', handleReqNext);
      window.removeEventListener('requestPrevStep', handleReqPrev);
    };
  }, [goToStep]);

  // P5.1 — Music autoplay runs exactly once; toggle handled by handleMusicClick
  useEffect(() => {
    if (!audioRef.current || hasStartedAudioRef.current) return;

    audioRef.current.volume = 0;
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        hasStartedAudioRef.current = true;
        setIsMusicPlaying(true);
        gsap.to(audioRef.current, { volume: 0.4, duration: 2, ease: 'power2.inOut' });
      }).catch(() => {
        const handleFirstInteraction = () => {
          attemptAudioAutoplay();
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('wheel', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('wheel', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
      });
    }
  }, [attemptAudioAutoplay]); // ← runs once, no dependency on isMusicPlaying

  const handleMusicClick = () => {
    if (!audioRef.current) return;
    setIsUIMinimized(false);
    setMusicExpanded(true);
    clearTimeout(musicExpandTimeoutRef.current);
    musicExpandTimeoutRef.current = setTimeout(() => setMusicExpanded(false), 3500);

    if (isMusicPlaying) {
      gsap.to(audioRef.current, {
        volume: 0,
        duration: 0.5,
        onComplete: () => { audioRef.current.pause(); setIsMusicPlaying(false); }
      });
    } else {
      audioRef.current.play();
      setIsMusicPlaying(true);
      gsap.to(audioRef.current, { volume: 0.4, duration: 1, ease: 'power2.out' });
    }
  };

  const handleMenuClick = () => { setIsUIMinimized(false); setIsMenuOpen(!isMenuOpen); };

  const handleDesktopHoverEnter = () => {
    if (window.innerWidth >= 768) { setIsUIMinimized(false); setMusicExpanded(true); }
  };
  const handleDesktopHoverLeave = () => {
    if (window.innerWidth >= 768) { clearTimeout(musicExpandTimeoutRef.current); setMusicExpanded(false); }
  };

  useGSAP(() => {
    const speed = isReversingRef.current ? 0.3 : 0.8;
    if (currentStepRef.current < 5) {
      gsap.to(elevatorRef.current, { y: '100dvh', duration: speed, ease: 'power3.inOut', force3D: true });
    } else {
      const floor = currentStepRef.current - 5;
      gsap.to(elevatorRef.current, {
        y: `-${floor * 100}dvh`,
        duration: speed,
        ease: 'power3.inOut',
        force3D: true,
        onComplete: () => { isLockedRef.current = false; }
      });
    }
  }, [currentStep]);

  const handleScrollIntent = useCallback((direction) => {
    const now = Date.now();
    if (isLockedRef.current || currentStepRef.current === 3 || isIntroPlayingRef.current) return;
    if (now - lastTransitionTime.current < COOLDOWN_MS) return;
    if (now < inertiaDeadTime.current) return;
    if (direction === 'next') goToStep(currentStepRef.current + 1);
    else goToStep(currentStepRef.current - 1);
  }, [goToStep]);

  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      onDown: (self) => {
        // P1.2 — Complete yield during step 3: no UI state updates, no nav
        if (currentStepRef.current === 3) return;

        const targetElement = self.event?.target?.closest?.('.scrollbar-hide, .about-scroll-container, .expanded-content, .faq-content') ?? null;
        if (targetElement) {
          if (targetElement.scrollHeight - targetElement.scrollTop > targetElement.clientHeight + 2) return;
        }
        attemptAudioAutoplay();
        setIsUIMinimized(true);
        setMusicExpanded(false);
        if (isMenuOpen) setIsMenuOpen(false);
        handleScrollIntent('next');
      },
      onUp: (self) => {
        // P1.2 — Complete yield during step 3
        if (currentStepRef.current === 3) return;

        const targetElement = self.event?.target?.closest?.('.scrollbar-hide, .about-scroll-container, .expanded-content, .faq-content') ?? null;
        if (targetElement) {
          if (targetElement.scrollTop > 2) return;
        }
        attemptAudioAutoplay();
        setIsUIMinimized(true);
        setMusicExpanded(false);
        if (isMenuOpen) setIsMenuOpen(false);
        handleScrollIntent('prev');
      },
      preventDefault: false,
      tolerance: 40
    });

    const handleKeyDown = (e) => {
      if (isLockedRef.current || isIntroPlayingRef.current || currentStepRef.current === 3) return;
      if (Date.now() < inertiaDeadTime.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        attemptAudioAutoplay();
        setIsUIMinimized(true); setMusicExpanded(false); setIsMenuOpen(false);
        goToStep(currentStepRef.current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        attemptAudioAutoplay();
        setIsUIMinimized(true); setMusicExpanded(false); setIsMenuOpen(false);
        goToStep(currentStepRef.current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { obs.kill(); window.removeEventListener('keydown', handleKeyDown); };
  }, [isMenuOpen, handleScrollIntent]);

  const navLinks = [
    { label: 'Welcome', step: 1 },
    { label: 'Our Legacy', step: 3 },
    { label: "Founder's Note", step: 5 },
    { label: 'Curriculum', step: 6 },
    { label: 'Insights (FAQ)', step: 7 },
    { label: 'Premium Rewards', step: 8 },
    { label: 'Admissions', step: 9 },
    { label: 'Testimonials', step: 11 },
  ];



  return (
    <div className="relative w-full h-dvh overflow-hidden bg-transparent font-sans">
      <StaticPastelBackground step={currentStep} />

      <audio ref={audioRef} src={ambientMusic} loop preload="auto" />

      <div className={`fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[100] pointer-events-none flex justify-between items-end transition-opacity duration-1000 ${isIntroPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={handleMusicClick}
          onMouseEnter={handleDesktopHoverEnter}
          onMouseLeave={handleDesktopHoverLeave}
          className={`pointer-events-auto relative flex items-center bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-full overflow-hidden ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-left cursor-pointer focus:outline-none touch-manipulation
            transition-[width,transform,opacity,background-color] duration-500
            ${isUIMinimized ? 'scale-75 opacity-50 bg-white/40' : 'scale-100 opacity-100 hover:bg-white/90'}
            ${musicExpanded ? 'w-[160px] md:w-[180px]' : 'w-[42px] md:w-[46px]'}
            h-[42px] md:h-[46px]
          `}
        >
          <div className="w-[42px] md:w-[46px] h-[42px] md:h-[46px] shrink-0 flex items-center justify-center text-ink-dark transition-transform hover:scale-95 pointer-events-none">
            {isMusicPlaying ? (
              <div className="flex gap-[2px] items-end h-3">
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out] origin-bottom" style={{ height: '60%' }} />
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out_0.2s] origin-bottom" style={{ height: '100%' }} />
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out_0.4s] origin-bottom" style={{ height: '40%' }} />
              </div>
            ) : (
              <Play size={14} className="text-ink-dark ml-0.5" />
            )}
          </div>
          <div className={`whitespace-nowrap transition-opacity duration-300 pointer-events-none flex flex-col justify-center ${musicExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-accent-teal leading-none mb-1">
              {isMusicPlaying ? 'Now Playing' : 'Paused'}
            </p>
            <p className="text-[10px] md:text-xs font-bold text-ink-dark truncate pr-4 leading-none">Yangerila Theme</p>
          </div>
        </button>

        <div className="pointer-events-auto relative">
          <div className={`absolute bottom-full right-0 mb-3 bg-white/30 backdrop-blur-2xl border border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-2 w-[140px] md:w-[160px] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right
            ${isMenuOpen ? 'scale-100 opacity-100 visible translate-y-0' : 'scale-90 opacity-0 invisible translate-y-4'}
          `}>
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(link.step, true)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[9px] md:text-[10px] font-bold transition-all duration-300 focus:outline-none ${currentStep === link.step ? 'bg-white/70 shadow-sm text-accent-teal' : 'text-ink-dark hover:bg-white/40 hover:text-accent-teal'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleMenuClick}
            className={`flex items-center justify-center bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-full text-ink-dark hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right focus:outline-none touch-manipulation
              w-[42px] md:w-[46px] h-[42px] md:h-[46px]
              ${isUIMinimized && !isMenuOpen ? 'scale-75 opacity-50 bg-white/40' : 'scale-100 opacity-100 active:scale-95'}
            `}
          >
            {isMenuOpen ? <X size={18} className="text-accent-teal" /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={ambientMusic} loop preload="auto" />

      <div className={`fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[100] pointer-events-none flex justify-between items-end transition-opacity duration-1000 ${isIntroPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={handleMusicClick}
          onMouseEnter={handleDesktopHoverEnter}
          onMouseLeave={handleDesktopHoverLeave}
          className={`pointer-events-auto relative flex items-center bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-full overflow-hidden ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-left cursor-pointer focus:outline-none touch-manipulation
            transition-[width,transform,opacity,background-color] duration-500
            ${isUIMinimized ? 'scale-75 opacity-50 bg-white/40' : 'scale-100 opacity-100 hover:bg-white/90'} 
            ${musicExpanded ? 'w-[160px] md:w-[180px]' : 'w-[42px] md:w-[46px]'} 
            h-[42px] md:h-[46px]
          `}
        >
          <div className="w-[42px] md:w-[46px] h-[42px] md:h-[46px] shrink-0 flex items-center justify-center text-ink-dark transition-transform hover:scale-95 pointer-events-none">
            {isMusicPlaying ? (
              <div className="flex gap-[2px] items-end h-3">
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out] origin-bottom" style={{ height: '60%' }}></div>
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out_0.2s] origin-bottom" style={{ height: '100%' }}></div>
                <div className="w-[3px] bg-accent-teal rounded-full animate-[bounce_1s_infinite_ease-in-out_0.4s] origin-bottom" style={{ height: '40%' }}></div>
              </div>
            ) : (
              <Play size={14} className="text-ink-dark ml-0.5" />
            )}
          </div>

          <div className={`whitespace-nowrap transition-opacity duration-300 pointer-events-none flex flex-col justify-center ${musicExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-accent-teal leading-none mb-1">
              {isMusicPlaying ? "Now Playing" : "Paused"}
            </p>
            <p className="text-[10px] md:text-xs font-bold text-ink-dark truncate pr-4 leading-none">
              Yangerila Theme
            </p>
          </div>
        </button>

        <div className="pointer-events-auto relative">
          <div className={`absolute bottom-full right-0 mb-3 bg-white/30 backdrop-blur-2xl border border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-2 w-[140px] md:w-[160px] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right 
            ${isMenuOpen ? 'scale-100 opacity-100 visible translate-y-0' : 'scale-90 opacity-0 invisible translate-y-4'}
          `}>
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(link.step)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[9px] md:text-[10px] font-bold transition-all duration-300 focus:outline-none ${currentStep === link.step ? 'bg-white/70 shadow-sm text-accent-teal' : 'text-ink-dark hover:bg-white/40 hover:text-accent-teal'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleMenuClick}
            className={`flex items-center justify-center bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-full text-ink-dark hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom-right focus:outline-none touch-manipulation
              w-[42px] md:w-[46px] h-[42px] md:h-[46px]
              ${isUIMinimized && !isMenuOpen ? 'scale-75 opacity-50 bg-white/40' : 'scale-100 opacity-100 active:scale-95'}
            `}
          >
            {isMenuOpen ? <X size={18} className="text-accent-teal" /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <main className="relative z-10 w-full h-full">
        {/* P1.3 — pass full isReversingRef object so children read .current inside GSAP hooks */}
        <HeroReveal step={currentStep} onComplete={onStepComplete} isReversingRef={isReversingRef} onIntroComplete={handleIntroComplete} />
        <LegacyPanel step={currentStep} onComplete={onStepComplete} isReversingRef={isReversingRef} />

        {/* P5.4 — pointerEvents via className, not inline style, to prevent paint thrash */}
        <div
          ref={elevatorRef}
          className={`fixed top-0 left-0 w-full flex flex-col will-change-transform z-30 ${currentStep >= 5 ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ transform: 'translateY(100dvh)' }}
        >
          <MethodPanel step={currentStep} isReversingRef={isReversingRef}>
            <FAQSection step={currentStep} isReversingRef={isReversingRef} />
          </MethodPanel>
          <FooterReveal step={currentStep} isReversingRef={isReversingRef} />
        </div>
      </main>
    </div>
  );
}