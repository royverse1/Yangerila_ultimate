import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function FooterReveal() {
  const containerRef = useRef(null);
  const tickerWrapRef = useRef(null);
  const contactRef = useRef(null);
  const contactContainerRef = useRef(null);

  useGSAP(() => {
    // 1. Horizontal Testimonial Endless Scroll
    if (tickerWrapRef.current) {
      gsap.to(tickerWrapRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 32, // 20% faster
        ease: 'none'
      });
    }

    // 2. Pinned Panels with Overscroll (Removed GSAP pinning - converted to native CSS sticky for 0 CLS)

    // (Residual GSAP grow-from-bottom effect entirely removed for smoother native transitions)
  }, { scope: containerRef });

  const testimonials = [
    { name: 'Amit Gulati', role: 'Banker', text: '“The group classes make me feel I am a part of something. I never thought this would be possible where I live.”' },
    { name: 'Maj. Amit Bhusan', role: 'Indian Army', text: '“No matter where we move, classes stay consistent. My son doesn’t lose track anymore. Thankful he can continue smoothly.”' },
    { name: 'Aarav Menon', role: 'Student, Canada', text: '“Tried taking classes here in Canada but couldn’t connect. The best part here is progress. Sir really pushed me but in a fun way.”' },
    { name: 'Tanvi Verma', role: 'Professional', text: '“Classes are super interactive. I usually don’t stick to things for long, but here I’ve been consistent. Started my own Instagram.”' },
    { name: 'Saloni Khanna', role: 'Homemaker', text: '“Learning guitar was a dream. Online classes fit perfectly into my routine. Now, I can confidently play and sing songs.”' }
  ];

  return (
    <div ref={containerRef} className="relative w-full flex flex-col z-20">
      
      {/* 1. FUN FACT SECTION */}
      <section className="panel sticky top-0 w-full section-padding min-h-screen flex flex-col items-center justify-center text-center bg-pitch-black bg-[linear-gradient(to_bottom,#0d2a1c,var(--color-pitch-black))] border-t border-emerald-900/50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-30">
        <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-12 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Fun Fact</h2>
        <div className="max-w-5xl mx-auto">
          <p className="text-4xl md:text-6xl text-white font-light text-serif-italic mb-12 leading-relaxed drop-shadow-xl">
            "Fender published a study stating that about 90% of guitar students quit playing within their first year."
          </p>
          <div className="w-full h-[1px] bg-white/10 my-12 relative overflow-hidden shadow-[0_0_20px_rgba(46,211,162,0.5)]">
             <div className="absolute inset-y-0 left-0 bg-neon-mint w-1/3 blur-md shadow-[0_0_20px_#2ed3a2]"></div>
          </div>
          <h3 className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter drop-shadow-2xl">
            At Yangerila, more than <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-[#1a9570] drop-shadow-[0_0_40px_rgba(46,211,162,0.6)]">90% don't quit.</span>
          </h3>
          <p className="text-xl text-neutral-300 font-light mt-8">
            This opposite statistic fills us with both happiness and confidence in our teaching methods.
          </p>
        </div>
      </section>

      {/* 2. DISCOUNT & REWARDS SECTION */}
      <section className="panel sticky top-0 w-full section-padding min-h-screen bg-pitch-black bg-[linear-gradient(to_bottom,#380a2b,var(--color-pitch-black))] border-t border-fuchsia-900/50 flex flex-col items-center justify-center overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-mint/10 rounded-full blur-[60px] pointer-events-none"></div>
        <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-16 text-center drop-shadow-[0_0_15px_rgba(46,211,162,0.5)] relative z-10">Exclusive Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto relative z-10">
          <div className="liquid-glass p-8 md:p-12 rounded-3xl text-center border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-shadow">
            <h4 className="text-3xl font-black text-white mb-4 drop-shadow-lg">INR 1,000</h4>
            <p className="text-sm tracking-widest text-[#a8b8b8] uppercase">Referral Reward<br/>(Amazon Gift Card)</p>
          </div>
          <div className="liquid-glass p-8 md:p-12 rounded-3xl text-center border border-neon-mint/30 shadow-[0_0_50px_rgba(46,211,162,0.15)] hover:shadow-[0_0_70px_rgba(46,211,162,0.3)] transition-shadow">
            <h4 className="text-3xl font-black text-neon-mint mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.6)]">30% OFF</h4>
            <p className="text-sm tracking-widest text-white uppercase">Group Discount<br/>United We Stand</p>
          </div>
          <div className="liquid-glass p-8 md:p-12 rounded-3xl text-center border border-neon-mint/30 shadow-[0_0_50px_rgba(46,211,162,0.15)] hover:shadow-[0_0_70px_rgba(46,211,162,0.3)] transition-shadow">
            <h4 className="text-3xl font-black text-neon-mint mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.6)]">50% OFF</h4>
            <p className="text-sm tracking-widest text-white uppercase">Next Fee<br/>Student Referral</p>
          </div>
          <div className="liquid-glass p-8 md:p-12 rounded-3xl text-center hidden md:block border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-shadow">
            <h4 className="text-3xl font-black text-white mb-4 drop-shadow-lg">Exclusive</h4>
            <p className="text-sm tracking-widest text-[#a8b8b8] uppercase">Festive<br/>Discounts</p>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION */}
      <section className="panel sticky top-0 w-full min-h-screen overflow-hidden flex flex-col justify-center bg-pitch-black bg-[linear-gradient(to_bottom,#08273d,var(--color-pitch-black))] border-t border-blue-900/50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-50">
        <div className="px-6 md:px-24 mb-16 pt-24">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-2xl">Voices of <br/><span className="text-serif-italic font-light text-neon-mint lowercase drop-shadow-[0_0_20px_rgba(46,211,162,0.5)]">excellence</span></h2>
          <p className="text-neutral-300 mt-6 max-w-2xl text-lg drop-shadow-md">“Out of hundreds of testimonials over the years, we’ve handpicked a few that highlight our core belief — Yangerila’s classes are for anyone, anywhere.”</p>
        </div>

        {/* Endless Horizontal Testimonial Ticker */}
        <div className="w-full flex whitespace-nowrap overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-pitch-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-pitch-black to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex">
            <div ref={tickerWrapRef} className="flex gap-8 items-center px-4 w-max">
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div key={idx} className="relative bg-gradient-to-br from-[#0c1821] to-[#040a0f] p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] w-[85vw] md:w-[650px] whitespace-normal flex-shrink-0 hover:border-neon-mint/30 hover:shadow-[0_30px_80px_rgba(46,211,162,0.15)] transition-all duration-500 overflow-hidden group">
                  <div className="absolute top-0 right-8 text-white/5 font-serif text-9xl leading-none rotate-6 group-hover:text-neon-mint/10 group-hover:scale-110 transition-all duration-500 pointer-events-none">"</div>
                  <div className="absolute -left-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[40px] group-hover:bg-neon-mint/20 transition-colors duration-700 pointer-events-none"></div>
                  
                  <p className="text-white text-xl md:text-2xl font-light text-serif-italic mb-12 leading-relaxed relative z-10 drop-shadow-md">"{t.text}"</p>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-mint/30 to-teal-900/50 text-neon-mint flex items-center justify-center font-black text-xl border border-neon-mint/40 shadow-[0_0_25px_rgba(46,211,162,0.3)]">
                      {t.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white tracking-wide text-lg drop-shadow-md">{t.name}</h4>
                      <p className="text-sm text-neon-mint uppercase tracking-[0.15em] mt-1 font-bold opacity-90">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT & FORM SECTION */}
      <section 
        className="panel sticky top-0 w-full min-h-screen flex flex-col justify-center bg-cover bg-center overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,1)] border-t border-white/10 z-[60]"
        style={{ backgroundImage: "url('./contact_bg.png')" }}
      >
          {/* Overlays for contrast and readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020505] via-transparent to-[#020505] z-0 pointer-events-none opacity-80"></div>

          <div className="relative z-10 w-full h-full section-padding max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 pt-32 lg:pt-0">
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tight mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Ready to<br/> Start?</h2>
              <p className="text-xl text-neutral-100 font-light mb-12 drop-shadow-md">Enroll today and begin your premium guitar journey.</p>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-6 items-center lg:items-start text-sm text-white font-black tracking-widest uppercase">
                <a href="tel:+918076530550" className="flex items-center gap-4 hover:text-neon-mint transition-colors hover:drop-shadow-[0_0_10px_rgba(46,211,162,0.8)]"><Phone size={20} className="text-neon-mint" /> +91 8076 530 550</a>
                <a href="mailto:care@yangerila.com" className="flex items-center gap-4 hover:text-neon-mint transition-colors hover:drop-shadow-[0_0_10px_rgba(46,211,162,0.8)]"><Mail size={20} className="text-neon-mint" /> care@yangerila.com</a>
                <span className="flex items-center gap-4 drop-shadow-md"><MapPin size={20} className="text-neon-mint" /> Indirapuram</span>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <div className="p-8 md:p-12 rounded-[3rem] w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_50px_rgba(46,211,162,0.15)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

                <h3 className="text-2xl font-black uppercase text-white tracking-widest mb-2 drop-shadow-lg">Waitlist</h3>
                <p className="text-sm text-neon-mint uppercase tracking-widest font-black mb-8 drop-shadow-[0_0_10px_rgba(46,211,162,1)]">Secure your slot</p>
                
                <form className="flex flex-col gap-6 relative z-10 border-t border-white/20 pt-8 mt-2">
                  <input type="text" placeholder="FULL NAME" className="bg-white/20 border border-white/40 placeholder-white/70 rounded-xl p-5 text-sm text-white font-bold focus:outline-none focus:border-neon-mint transition-colors shadow-inner" />
                  <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/20 border border-white/40 placeholder-white/70 rounded-xl p-5 text-sm text-white font-bold focus:outline-none focus:border-neon-mint transition-colors shadow-inner" />
                  <button type="button" className="bg-white text-black font-black uppercase tracking-widest text-sm p-6 w-full rounded-xl hover:bg-neon-mint transition-all duration-300 mt-4 shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:shadow-[0_0_60px_rgba(46,211,162,1)]">
                    Request Admission
                  </button>
                </form>
              </div>
            </div>
            
          </div>
        </section>
    </div>
  );
}
