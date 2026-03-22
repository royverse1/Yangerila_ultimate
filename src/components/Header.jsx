import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-6 mt-4 liquid-glass rounded-2xl flex justify-between items-center px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/20">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-neon-mint flex items-center justify-center font-black text-pitch-black text-xs">Y</div>
          <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Yangerila.</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase text-neutral-300">
          <a href="#" className="hover:text-neon-mint transition-colors hover:drop-shadow-[0_0_10px_rgba(46,211,162,0.8)]">Legacy</a>
          <a href="#" className="hover:text-neon-mint transition-colors hover:drop-shadow-[0_0_10px_rgba(46,211,162,0.8)]">Method</a>
          <a href="#" className="hover:text-neon-mint transition-colors hover:drop-shadow-[0_0_10px_rgba(46,211,162,0.8)]">Testimonials</a>
        </nav>

        <a href="https://www.yangerila.com/demo_form.html" target="_blank" rel="noreferrer" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-neon-mint shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(46,211,162,1)] transition-all">
          Book Demo
        </a>
      </div>
    </header>
  );
}
