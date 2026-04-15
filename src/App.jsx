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

// HIGH-PERFORMANCE STATIC BACKGROUND
const StaticPastelBackground = React.memo(function StaticPastelBackground({ step }) {
  const getBgStyle = (currentStep) => {
    if (currentStep <= 2) return 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%)';
    if (currentStep <= 4) return '#0A0A0A'; // Dark for timeline
    if (currentStep <= 9) return 'linear-gradient(135deg, #F3E8FF 0%, #F8FAFC 100%)';
    return 'linear-gradient(135deg, #D1FAE5 0%, #E0F2FE 100%)';
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
  const isReversingRef = useRef(false);
  const lastTransitionTime = useRef(0);
  const COOLDOWN_MS = 1200;

  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const isIntroPlayingRef = useRef(true);
  const elevatorRef = useRef(null);

  const onStepComplete = useCallback(() => { isLockedRef.current = false; }, []);
  const handleIntroComplete = useCallback(() => {
    isIntroPlayingRef.current = false;
    setIsIntroPlaying(false);
  }, []);

  const goToStep = useCallback((nextStep) => {
    const now = Date.now();
    if (isLockedRef.current || now - lastTransitionTime.current < COOLDOWN_MS) return;
    if (nextStep < 0 || nextStep > 12) return;

    lastTransitionTime.current = now;
    isReversingRef.current = nextStep < currentStepRef.current;
    isLockedRef.current = true;
    currentStepRef.current = nextStep;
    setCurrentStep(nextStep);
  }, []);

  useGSAP(() => {
    if (currentStepRef.current < 5) {
      gsap.to(elevatorRef.current, { y: '100dvh', duration: 0.8, ease: "power3.inOut", force3D: true });
    } else {
      const floor = currentStepRef.current - 5;
      gsap.to(elevatorRef.current, {
        y: `-${floor * 100}dvh`,
        duration: 0.8,
        ease: "power3.inOut",
        force3D: true,
        onComplete: () => { isLockedRef.current = false; }
      });
    }
  }, [currentStep]);

  useGSAP(() => {
    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      // NORMALIZED SCROLL: onDown = swipe up/scroll down (Next). onUp = swipe down/scroll up (Prev).
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
      tolerance: 30
    });

    const handleKeyDown = (e) => {
      if (isLockedRef.current || isIntroPlayingRef.current || currentStepRef.current === 3) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToStep(currentStepRef.current + 1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') goToStep(currentStepRef.current - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { obs.kill(); window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  useEffect(() => {
    const handleNextStep = () => goToStep(currentStepRef.current + 1);
    const handlePrevStep = () => goToStep(currentStepRef.current - 1);
    window.addEventListener('requestNextStep', handleNextStep);
    window.addEventListener('requestPrevStep', handlePrevStep);
    return () => {
      window.removeEventListener('requestNextStep', handleNextStep);
      window.removeEventListener('requestPrevStep', handlePrevStep);
    };
  }, [goToStep]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-transparent font-sans">
      <StaticPastelBackground step={currentStep} />
      <Header />

      <main className="relative z-10 w-full h-full">
        <HeroReveal step={currentStep} onComplete={onStepComplete} isReversing={isReversingRef.current} onIntroComplete={handleIntroComplete} />
        <LegacyPanel step={currentStep} onComplete={onStepComplete} isReversing={isReversingRef.current} />

        <div
          ref={elevatorRef}
          className="fixed top-0 left-0 w-full flex flex-col will-change-transform z-30"
          style={{ transform: 'translateY(100dvh)', pointerEvents: currentStep >= 5 ? 'auto' : 'none' }}
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