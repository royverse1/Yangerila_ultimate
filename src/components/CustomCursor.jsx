import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

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
    };

    const onMouseEnterLink = () => {
      gsap.to(follower, {
        scale: 2.5,
        backgroundColor: 'rgba(46, 211, 162, 0.3)',
        duration: 0.3
      });
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'rgba(46, 211, 162, 0.1)',
        duration: 0.3
      });
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    const links = document.querySelectorAll('a, button, .cursor-pointer');
    links.forEach(link => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      links.forEach(link => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
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
