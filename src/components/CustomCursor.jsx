import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MousePointer2, ArrowUp } from 'lucide-react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const nudgeRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  useEffect(() => {
    // 1. Detect Touch Device
    const touchCheck = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touchCheck);

    if (touchCheck) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    // 2. Main Cursor Animation
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Reset Idle Timer for Nudge
      setIsIdle(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        // Only nudge if we aren't at the very bottom
        if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 100) {
          setIsIdle(true);
        }
      }, 10000); // 10 seconds of idle
    };

    // 3. Hover States
    const onMouseEnterLink = () => {
      gsap.to(follower, { scale: 2.5, backgroundColor: 'rgba(46, 211, 162, 0.3)', duration: 0.3 });
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(follower, { scale: 1, backgroundColor: 'rgba(46, 211, 162, 0.1)', duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    };

    // 4. Scroll Up Button Visibility
    const onScroll = () => {
      if (window.scrollY > 800) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    const links = document.querySelectorAll('a, button, .cursor-pointer');
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    // Initial timer
    idleTimer.current = setTimeout(() => setIsIdle(true), 12000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer.current);
      links.forEach(link => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  if (isTouch) return (
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 z-[9999] p-4 rounded-full bg-neon-mint text-pitch-black shadow-[0_0_20px_rgba(46,211,162,0.5)] transition-all duration-500 scale-0 ${showScrollUp ? 'scale-100' : 'scale-0'}`}
    >
      <ArrowUp size={24} />
    </button>
  );

  return (
    <>
      {/* Scroll Up Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[9999] p-4 rounded-full bg-neon-mint/10 border border-neon-mint/30 text-neon-mint backdrop-blur-md shadow-[0_0_30px_rgba(46,211,162,0.2)] hover:bg-neon-mint hover:text-pitch-black transition-all duration-500 transform ${showScrollUp ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>

      {/* Idle Nudge Hint */}
      <div 
        ref={nudgeRef}
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 text-neon-mint transition-all duration-1000 ${isIdle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="w-[2px] h-12 bg-gradient-to-b from-transparent via-neon-mint to-transparent animate-bounce"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Scroll Down</span>
      </div>

      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-neon-mint rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-neon-mint/30 bg-neon-mint/10 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />
    </>
  );
}
