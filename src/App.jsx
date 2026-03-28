import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/observer';
import { useGSAP } from '@gsap/react';

import Header from './components/Header';
import HeroReveal from './components/HeroReveal';
import LegacyPanel from './components/LegacyPanel';
import MethodPanel from './components/MethodPanel';
import FAQSection from './components/FAQSection';
import FooterReveal from './components/FooterReveal';

gsap.registerPlugin(ScrollTrigger, Observer);

const BackgroundGradients = React.memo(function BackgroundGradients() {
  const bgRef = useRef(null);

  useGSAP(() => {
    gsap.config({ force3D: true });

    gsap.to(".blob-1", {
      xPercent: 50,
      yPercent: 40,
      rotation: 90,
      scale: 1.8,
      duration: 9.6,
      repeat: -1,
      yoyo: true,
      ease: "power4.out"
    });

    gsap.to(".blob-2", {
      xPercent: -40,
      yPercent: -35,
      rotation: -60,
      scale: 1.5,
      duration: 11.2,
      repeat: -1,
      yoyo: true,
      ease: "power4.out"
    });
  }, { scope: bgRef });

  return (
    <div ref={bgRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-pitch-black">
      <div className="absolute inset-0 w-full h-full will-change-transform">
        <div className="blob-1 absolute top-[10%] left-[20%] w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] bg-[radial-gradient(circle_at_center,_rgba(46,211,162,0.15)_0%,_transparent_60%)] will-change-transform opacity-60" style={{ transform: 'translateZ(0)' }}></div>
        <div className="blob-2 absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] md:w-[40vw] md:h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(217,70,239,0.15)_0%,_transparent_60%)] will-change-transform opacity-60" style={{ transform: 'translateZ(0)' }}></div>
      </div>
      <div className="absolute inset-0 bg-[url('./noise.svg')] opacity-[0.02] will-change-transform" style={{ transform: 'translateZ(0)' }}></div>
    </div>
  );
});

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepRef = useRef(0);
  const isLockedRef = useRef(false);
  const isReversingRef = useRef(false);
  const lastTransitionTime = useRef(0);
  const COOLDOWN_MS = 1200;

  const elevatorRef = useRef(null);

  const onStepComplete = useCallback(() => {
    isLockedRef.current = false;
  }, []);

  const goToStep = useCallback((nextStep) => {
    const now = Date.now();
    if (isLockedRef.current) return;
    if (now - lastTransitionTime.current < COOLDOWN_MS) return;
    if (nextStep < 0 || nextStep > 12) return;

    lastTransitionTime.current = now;
    isReversingRef.current = nextStep < currentStepRef.current;
    isLockedRef.current = true;
    currentStepRef.current = nextStep;
    setCurrentStep(nextStep);
  }, []);

  useGSAP(() => {
    if (currentStepRef.current < 5) {
      gsap.to(elevatorRef.current, { y: '100vh', duration: 0.8, ease: "power3.inOut" });
    } else {
      const floor = currentStepRef.current - 5;
      gsap.to(elevatorRef.current, {
        y: `-${floor * 100}vh`,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          isLockedRef.current = false;
        }
      });
    }
  }, [currentStep]);

  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: () => {
        if (!isLockedRef.current && currentStepRef.current !== 3) goToStep(currentStepRef.current + 1);
      },
      onUp: () => {
        if (!isLockedRef.current && currentStepRef.current !== 3) goToStep(currentStepRef.current - 1);
      },
      preventDefault: false,
      tolerance: 40
    });

    const handleKeyDown = (e) => {
      if (isLockedRef.current) return;
      if (currentStepRef.current === 3) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToStep(currentStepRef.current + 1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') goToStep(currentStepRef.current - 1);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      obs.kill();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleNextStepRequested = () => goToStep(currentStepRef.current + 1);
    const handlePrevStepRequested = () => goToStep(currentStepRef.current - 1);

    window.addEventListener('requestNextStep', handleNextStepRequested);
    window.addEventListener('requestPrevStep', handlePrevStepRequested);

    return () => {
      window.removeEventListener('requestNextStep', handleNextStepRequested);
      window.removeEventListener('requestPrevStep', handlePrevStepRequested);
    };
  }, [goToStep]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-pitch-black selection:bg-neon-mint selection:text-pitch-black font-sans">
      <BackgroundGradients />
      <Header />

      <main className="relative z-10 w-full h-full">
        {/* Fixed Position Deck (Steps 0 - 4) */}
        <HeroReveal step={currentStep} onComplete={onStepComplete} isReversing={isReversingRef.current} />
        <LegacyPanel step={currentStep} onComplete={onStepComplete} isReversing={isReversingRef.current} />

        {/* The Elevator Shaft (Steps 5 - 12) */}
        <div
          ref={elevatorRef}
          className="fixed top-0 left-0 w-full flex flex-col will-change-transform z-30"
          style={{
            transform: 'translateY(100vh)',
            pointerEvents: currentStep >= 5 ? 'auto' : 'none'
          }}
        >
          <MethodPanel step={currentStep} isReversing={isReversingRef.current}>
            <FAQSection step={currentStep} isReversing={isReversingRef.current} />
          </MethodPanel>
          <FooterReveal step={currentStep} isReversing={isReversingRef.current} />
        </div>
      </main>
    </div>
  );
}