import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Phone, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FooterReveal() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const tickerWrapRef = useRef(null);
  const revealSectionRef = useRef(null);
  const revealPathRef = useRef(null);

  // Section refs
  const funFactRef = useRef(null);
  const rewardsRef = useRef(null);
  const voicesRef = useRef(null);

  useGSAP(() => {
    // 1. Horizontal Testimonial Endless Scroll
    if (tickerWrapRef.current) {
      gsap.to(tickerWrapRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 32,
        ease: 'none'
      });
    }

    // 2. CREATE MASTER SCRUB TIMELINE FOR SECTIONS 1-3
    const funFactElements = funFactRef.current?.children[0]?.children;
    const rewardsHeader = rewardsRef.current?.querySelector('.rewards-header');
    const rewardCards = rewardsRef.current?.querySelectorAll('.liquid-glass');
    const voicesHeader = voicesRef.current?.querySelector('.voices-header');
    const voicesTicker = voicesRef.current?.querySelector('.voices-ticker');

    // Set initial states for "fly-in"
    if (funFactElements) {
      const [ffHeader, ffQuote, ffLine, ffHeading, ffFooter] = funFactElements;
      if (ffHeader) gsap.set(ffHeader, { opacity: 0, y: -40, scale: 0.8 });
      if (ffQuote) gsap.set(ffQuote, { opacity: 0, x: -60, rotate: -3 });
      if (ffLine) gsap.set(ffLine, { scaleX: 0, opacity: 0, transformOrigin: "left center" });
      if (ffHeading) gsap.set(ffHeading, { opacity: 0, x: 60, rotate: 3 });
      if (ffFooter) gsap.set(ffFooter, { opacity: 0, y: 40 });
    }

    if (rewardsHeader) gsap.set(rewardsHeader, { opacity: 0, y: -30 });
    if (rewardCards) gsap.set(rewardCards, { scale: 0.8, opacity: 0, y: 50 });
    if (voicesHeader) gsap.set(voicesHeader, { opacity: 0, scale: 0.9 });
    if (voicesTicker) gsap.set(voicesTicker, { opacity: 0, x: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=450%", 
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    if (funFactElements) {
      const [ffHeader, ffQuote, ffLine, ffHeading, ffFooter] = funFactElements;
      
      const ffTl = gsap.timeline();
      if (ffHeader) ffTl.to(ffHeader, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
      if (ffQuote) ffTl.to(ffQuote, { opacity: 1, x: 0, rotate: 0, duration: 0.6, ease: 'power3.out' }, "-=0.35");
      if (ffLine) ffTl.to(ffLine, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.inOut' }, "-=0.4");
      if (ffHeading) ffTl.to(ffHeading, { opacity: 1, x: 0, rotate: 0, duration: 0.6, ease: 'power4.out' }, "-=0.5");
      if (ffFooter) ffTl.to(ffFooter, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "-=0.4");
      
      tl.add(ffTl);
      tl.to({}, { duration: 1.5 });
    }

    tl.to(wrapperRef.current, {
      y: () => rewardsRef.current ? -rewardsRef.current.offsetTop : 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    if (rewardsHeader) {
      tl.to(rewardsHeader, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      if (rewardCards) tl.to(rewardCards, { scale: 1, opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: 'back.out(1.5)' }, "-=0.4");
      tl.to({}, { duration: 1.5 });
    }

    tl.to(wrapperRef.current, {
      y: () => voicesRef.current ? -voicesRef.current.offsetTop : 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    if (voicesHeader) {
      tl.to(voicesHeader, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)' });
      if (voicesTicker) tl.to(voicesTicker, { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' }, "-=0.5");
      tl.to({}, { duration: 1.5 });
    }

    // 3. TRUE CURVE SWIPE REVEAL LOGIC
    if (revealPathRef.current && revealSectionRef.current) {
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: revealSectionRef.current,
          start: "top bottom", 
          end: "top top",
          scrub: 1,
        }
      });

      // Path states matched to demo logic (objectBoundingBox 0-1)
      // Initial (Flat): M 0 1 V 1 Q 0.5 1 1 1 V 1 z
      // Mid (Arched): M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z
      // End (Full): M 0 1 V 0 Q 0.5 0 1 0 V 1 z
      
      revealTl.to(revealPathRef.current, {
        attr: { d: "M 0 1 V 0.5 Q 0.5 0 1 0.5 V 1 z" },
        ease: "power2.in",
        duration: 0.5
      }).to(revealPathRef.current, {
        attr: { d: "M 0 1 V 0 Q 0.5 0 1 0 V 1 z" },
        ease: "power2.out",
        duration: 0.5
      });
    }

  }, { scope: containerRef });

  const testimonials = [
    { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
    { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
    { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
    { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
    { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
  ];

  return (
    <div className="relative w-full block z-20 bg-pitch-black">
      {/* SVG ClipPath Definition - Object Bounding Box is absolute 0 to 1 */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="curve-reveal" clipPathUnits="objectBoundingBox">
            <path ref={revealPathRef} d="M 0 1 V 1 Q 0.5 1 1 1 V 1 z" />
          </clipPath>
        </defs>
      </svg>
      
      {/* PINNED MASTER WRAPPER FOR SECTIONS 1-3 */}
      <section ref={containerRef} className="w-full h-screen relative overflow-hidden m-0 p-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-30">
        <div ref={wrapperRef} className="w-full h-full relative will-change-transform">
          
          <div ref={funFactRef} className="w-full h-screen flex flex-col items-center justify-center text-center bg-pitch-black bg-[linear-gradient(to_bottom,#0d2a1c,var(--color-pitch-black))] relative px-6 md:px-12 border-t border-emerald-900/50">
            <div className="fun-fact-content max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
              <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Fun Fact</h2>
              <p className="text-4xl md:text-6xl text-white font-light text-serif-italic mb-12 leading-relaxed drop-shadow-xl">
                "Fender published a study stating that about 90% of guitar students quit playing within their first year."
              </p>
              <div className="w-full h-[1px] bg-white/10 my-12 relative overflow-hidden max-w-5xl">
                 <div className="absolute inset-y-0 left-0 bg-neon-mint w-1/3 blur-md shadow-[0_0_20px_#2ed3a2]"></div>
              </div>
              <h3 className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter drop-shadow-2xl">
                At Yangerila, more than <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570]">90% don't quit.</span>
              </h3>
              <p className="text-xl text-neutral-300 font-light mt-8">This opposite statistic fills us with both happiness and confidence in our teaching methods.</p>
            </div>
          </div>

          <div ref={rewardsRef} className="w-full h-screen bg-pitch-black bg-[linear-gradient(to_bottom,#380a2b,var(--color-pitch-black))] border-t border-fuchsia-900/50 flex flex-col items-center justify-center overflow-hidden relative px-6 md:px-12">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-mint/10 rounded-full blur-[60px] pointer-events-none"></div>
            <h2 className="rewards-header text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-16 text-center">Exclusive Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-7xl mx-auto relative z-10">
              {['INR 1,000', '30% OFF', '50% OFF', 'Exclusive'].map((val, i) => (
                <div key={i} className="liquid-glass p-6 md:p-12 rounded-3xl text-center border-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                  <h4 className={`text-3xl font-black mb-4 ${i === 1 || i === 2 ? 'text-neon-mint' : 'text-white'}`}>{val}</h4>
                  <p className="text-xs lg:text-sm tracking-widest text-[#a8b8b8] uppercase">
                    {i === 0 ? 'Referral Reward' : i === 1 ? 'Group Discount' : i === 2 ? 'Next Fee' : 'Festive Discounts'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div ref={voicesRef} className="w-full h-screen overflow-hidden flex flex-col justify-center bg-pitch-black bg-[linear-gradient(to_bottom,#08273d,var(--color-pitch-black))] border-t border-blue-900/50 relative pt-10 pb-32 px-0">
            <div className="voices-header px-6 md:px-12 xl:px-24 mb-12">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight">Voices of <br/><span className="text-serif-italic font-light text-neon-mint lowercase">excellence</span></h2>
              <p className="text-neutral-300 mt-6 max-w-2xl text-lg">“Out of hundreds of testimonials over the years, we’ve handpicked a few.”</p>
            </div>
            <div className="voices-ticker w-full flex whitespace-nowrap overflow-hidden relative pb-10">
              <div ref={tickerWrapRef} className="flex gap-6 lg:gap-8 items-center px-4 w-max">
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <div key={idx} className="relative bg-gradient-to-br from-[#0c1821] to-[#040a0f] p-8 lg:p-14 rounded-[3rem] border border-white/10 w-[85vw] md:w-[650px] whitespace-normal flex-shrink-0 hover:border-neon-mint/30 transition-all duration-500 overflow-hidden group">
                    <p className="text-white text-lg md:text-2xl font-light text-serif-italic mb-12">"{t.text}"</p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-neon-mint/20 text-neon-mint flex items-center justify-center font-black text-xl border border-neon-mint/30">
                        {t.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-wide text-lg">{t.name}</h4>
                        <p className="text-sm text-neon-mint uppercase tracking-[0.15em] mt-1 font-bold">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={revealSectionRef}
        className="reveal-section w-full min-h-screen flex flex-col justify-center bg-cover bg-center overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,1)] -mt-1 relative z-[60]"
        style={{ 
          backgroundImage: "url('contact_bg.png')",
          clipPath: "url(#curve-reveal)",
          WebkitClipPath: "url(#curve-reveal)"
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020505] via-transparent to-[#020505] z-0 pointer-events-none opacity-80"></div>

        <div className="relative z-10 w-full h-full section-padding max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 pt-32 lg:pt-0 pb-20">
          <div className="flex-1 text-center lg:text-left text-white">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">Ready to Start?</h2>
            <p className="text-xl font-light mb-12">Enroll today and begin your premium guitar journey.</p>
            <div className="flex flex-col gap-4">
              <a href="tel:+918076530550" className="flex items-center gap-4 hover:text-neon-mint transition-colors tracking-widest uppercase font-bold text-sm"><Phone size={18} /> +91 8076 530 550</a>
              <a href="mailto:care@yangerila.com" className="flex items-center gap-4 hover:text-neon-mint transition-colors tracking-widest uppercase font-bold text-sm"><Mail size={18} /> care@yangerila.com</a>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="p-8 md:p-12 rounded-[3rem] w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative">
              <h3 className="text-2xl font-black uppercase text-white tracking-widest mb-1">Waitlist</h3>
              <p className="text-xs text-neon-mint uppercase tracking-widest font-black mb-8">Secure your slot</p>
              <form className="flex flex-col gap-4">
                <input type="text" placeholder="FULL NAME" className="bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neon-mint" />
                <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/10 border border-white/40 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-neon-mint" />
                <button type="button" className="bg-white text-black font-black p-5 w-full rounded-xl hover:bg-neon-mint transition-all">Request Admission</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
