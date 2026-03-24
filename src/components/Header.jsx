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
      <div className="mx-4 md:mx-6 mt-4 liquid-glass rounded-2xl flex justify-between items-center px-4 md:px-6 py-3 md:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/20">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-neon-mint flex items-center justify-center font-black text-pitch-black text-[10px] md:text-xs">Y</div>
          <span className="text-white font-black tracking-widest uppercase text-[10px] md:text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Yangerila.</span>
        </div>
        
        <nav className="hidden lg:flex gap-8 text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
          <a href="#legacy" className="hover:text-neon-mint transition-all duration-300 hover:tracking-[0.3em] relative group">
            Legacy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-mint transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#method" className="hover:text-neon-mint transition-all duration-300 hover:tracking-[0.3em] relative group">
            Method
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-mint transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#testimonials" className="hover:text-neon-mint transition-all duration-300 hover:tracking-[0.3em] relative group">
            Testimonials
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-neon-mint transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <a href="https://www.yangerila.com/demo_form.html" target="_blank" rel="noreferrer" className="bg-white text-black px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] hover:bg-neon-mint shadow-[0_10px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_30px_rgba(46,211,162,0.4)] transition-all duration-500 hover:-translate-y-0.5 active:scale-95">
            Book Demo
          </a>
        </div>
      </div>
    </header>
  );
}
