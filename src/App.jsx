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

// --- OPTIMIZED STATIC PASTEL BACKGROUND ---
const StaticPastelBackground = React.memo(function StaticPastelBackground({ step }) {
  // Returns a soft gradient based on the current step section
  const getBgStyle = (currentStep) => {
    if (currentStep <= 2) return 'linear-gradient(135deg, var(--color-paper-bg) 0%, var(--color-pastel-blue) 100%)';
    if (currentStep <= 4) return 'linear-gradient(135deg, var(--color-paper-bg) 0%, var(--color-pastel-pink) 100%)';
    if (currentStep <= 9) return 'linear-gradient(135deg, var(--color-pastel-purple) 0%, var(--color-paper-bg) 100%)';
    return 'linear-gradient(135deg, var(--color-pastel-mint) 0%, var(--color-pastel-blue) 100%)';
  };

  return (
    <div
      className="fixed inset-0 z-[-3] pointer-events-none transition-all duration-1000 ease-in-out"
      style={{ background: getBgStyle(step) }}
    >
      {/* High-performance static radial gradients to fake the blurred blobs without the CSS blur filter */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply opacity-20" style={{ background: 'radial-gradient(circle, var(--color-pastel-pink) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply opacity-20" style={{ background: 'radial-gradient(circle, var(--color-pastel-blue) 0%, transparent 70%)' }}></div>
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

  // Intro Video State Lock
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const isIntroPlayingRef = useRef(true);

  const elevatorRef = useRef(null);

  const onStepComplete = useCallback(() => {
    isLockedRef.current = false;
  }, []);

  const handleIntroComplete = useCallback(() => {
    isIntroPlayingRef.current = false;
    setIsIntroPlaying(false);
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
        if (!isLockedRef.current && currentStepRef.current !== 3 && !isIntroPlayingRef.current) {
          goToStep(currentStepRef.current + 1);
        }
      },
      onUp: () => {
        if (!isLockedRef.current && currentStepRef.current !== 3 && !isIntroPlayingRef.current) {
          goToStep(currentStepRef.current - 1);
        }
      },
      preventDefault: false,
      tolerance: 40
    });

    const handleKeyDown = (e) => {
      if (isLockedRef.current || isIntroPlayingRef.current) return;
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
    <div className="relative w-full h-screen overflow-hidden bg-transparent font-sans">
      <StaticPastelBackground step={currentStep} />
      <Header />

      <main className="relative z-10 w-full h-full">
        <HeroReveal
          step={currentStep}
          onComplete={onStepComplete}
          isReversing={isReversingRef.current}
          onIntroComplete={handleIntroComplete}
        />
        <LegacyPanel step={currentStep} onComplete={onStepComplete} isReversing={isReversingRef.current} />

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