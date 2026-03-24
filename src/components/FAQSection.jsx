import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';
import { Observer } from 'gsap/observer';

gsap.registerPlugin(ScrollTrigger, Observer);

const faqCategories = {
  "About The Academy": [
    { question: "What is Yangerila Creative Studio?", answer: "Yangerila Creative Studio was born from a vision to make guitar learning effective and progressive. We specialize in teaching guitar across multiple genres and skill levels globally." },
    { question: "Is there an age limit for enrolling?", answer: "We welcome students of all ages—from young school students to working professionals and homemakers. Our modular grading structure adapts to your learning pace and available time." },
    { question: "Who will be teaching me?", answer: "Classes are led by experienced guitar coaches trained under our Head Coach Micky Dixit, ensuring a rich, consistent, and highly personalized learning environment." }
  ],
  "Courses & Features": [
    { question: "What guitar styles do you teach?", answer: "We cover a diverse range of styles including Rhythm, Lead, Finger-picking, and general Hobby playing. You can choose the course that fits your exact musical goals." },
    { question: "How long until I can play my favorite songs?", answer: "While every student is different, our structured approach usually enables beginners to play basic versions of their favorite songs within the first 3 to 4 months." },
    { question: "Do you offer certification or grading?", answer: "Yes! We use an Advanced Modular Grading Structure that formally tracks your progress and accelerates your learning systematically." }
  ],
  "Classes & Online Learning": [
    { question: "Are the classes pre-recorded videos or live?", answer: "All our classes are 100% Live and Interactive. We believe real-time feedback from the coach is crucial for catching mistakes early and building the right habits." },
    { question: "What if I miss a class due to an emergency?", answer: "We understand life happens. We provide backup classes and session recordings so you never miss out on important concepts and maintain your progress." },
    { question: "Do I need to have my own guitar before joining?", answer: "Yes, having your own guitar is essential as consistent practice at home is key to progress. If you need help choosing one, our SRM can guide you during the demo session." }
  ],
  "Fees & Enrollment": [
    { question: "How do I enroll for classes?", answer: "You can start by booking a Free Demo Session or filling out the Admission form. Our team will contact you to finalize your slot." },
    { question: "Are there any group discounts available?", answer: "Yes, we offer a 30% group discount if you enroll together with friends or family members." },
    { question: "How are the monthly fees structured?", answer: "Fees generally start at ₹3200/month depending on your selected course and class frequency. Detailed pricing is shared during the demo session based on your personalized plan." }
  ]
};

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("About The Academy");
  const [openIndex, setOpenIndex] = useState(0);
  
  const containerRef = useRef(null);
  const contentRefs = useRef([]);
  const contentContainerRef = useRef(null);

  const categories = Object.keys(faqCategories);

  // Initialize GSAP states for accordion
  useGSAP(() => {
    contentRefs.current.forEach((el, i) => {
      if (el) {
        if (i === openIndex) {
          gsap.set(el, { height: "auto", opacity: 1 });
        } else {
          gsap.set(el, { height: 0, opacity: 0 });
        }
      }
    });
  }, { scope: containerRef, dependencies: [activeCategory, openIndex] });

  // Main reveal and pinning
  useGSAP(() => {
    const faqTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
        onEnter: () => obs.enable(),
        onEnterBack: () => obs.enable(),
        onLeave: () => obs.disable(),
        onLeaveBack: () => obs.disable(),
      }
    });

    const faqHeader = containerRef.current.querySelector('.faq-header');
    const faqTabs = containerRef.current.querySelector('.faq-tabs');
    const faqContent = containerRef.current.querySelector('.faq-content');

    gsap.set([faqHeader, faqTabs, faqContent], { y: 40, opacity: 0 });

    faqTl.to(faqHeader, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" })
         .to(faqTabs, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
         .to(faqContent, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8");

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onDown: () => {
        const nextSection = containerRef.current.nextElementSibling;
        if (nextSection) {
          gsap.to(window, {
            scrollTo: nextSection.offsetTop,
            duration: 1.5,
            ease: "power4.inOut"
          });
        }
      },
      onUp: () => {
        const prevSection = containerRef.current.previousElementSibling;
        if (prevSection) {
          gsap.to(window, {
            scrollTo: prevSection.offsetTop,
            duration: 1.5,
            ease: "power4.inOut"
          });
        }
      },
      tolerance: 20,
      preventDefault: true,
      paused: true
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      onEnter: () => obs.enable(),
      onEnterBack: () => obs.enable(),
      onLeave: () => obs.disable(),
      onLeaveBack: () => obs.disable(),
    });

    return () => {
      obs.kill();
    };

  }, { scope: containerRef });

  const toggleFaq = (idx) => {
    if (openIndex === idx) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(idx);
    }
  };

  useGSAP(() => {
    contentRefs.current.forEach((el, i) => {
      if (el) {
        if (i === openIndex) {
          gsap.to(el, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
        } else {
          gsap.to(el, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
        }
      }
    });
  }, { scope: containerRef, dependencies: [openIndex, activeCategory] });

  return (
    <section 
      ref={containerRef} 
      className="relative z-20 w-full min-h-screen pt-16 pb-32 flex flex-col items-center justify-start bg-pitch-black border-t border-white/5"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-neon-mint/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <div className="faq-header text-center mb-10 md:mb-16 w-full pt-10">
          <span className="text-neon-mint tracking-[0.4em] font-bold text-[10px] uppercase mb-4 block opacity-80">Support</span>
          <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
            Frequently Asked <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-teal-400 font-light text-serif-italic lowercase">insights</span>
          </h2>
        </div>

        {/* Categories - Simple Clean Navigation */}
        <div className="faq-tabs flex flex-wrap justify-center gap-4 md:gap-12 mb-12 md:mb-20 w-full border-b border-white/10 pb-6 md:pb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setOpenIndex(0);
                  setActiveCategory(cat);
                }}
                className={`relative py-2 text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-500 hover:text-neon-mint bg-transparent border-none cursor-pointer ${
                  isActive ? 'text-neon-mint' : 'text-neutral-500'
                }`}
              >
                {cat}
                {isActive && (
                  <div className="absolute -bottom-6 md:-bottom-8 left-1/2 -translate-x-1/2 w-6 md:w-8 h-[2px] bg-neon-mint shadow-[0_0_10px_#2ed3a2]"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Accordion Content */}
        <div ref={contentContainerRef} className="faq-content flex flex-col gap-3 md:gap-4 w-full max-w-4xl pb-20">
          {faqCategories[activeCategory].map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={`${activeCategory}-${idx}`} 
                className={`liquid-glass rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 ${isOpen ? 'border-neon-mint/30 bg-white/[0.03]' : 'border-white/5 hover:border-white/10'}`}
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 md:px-8 py-5 md:py-7 flex items-center justify-between text-left group bg-transparent focus:outline-none"
                >
                  <span className={`text-base md:text-xl font-bold uppercase tracking-tight transition-colors duration-300 ${isOpen ? 'text-neon-mint' : 'text-neutral-300 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-500 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-neon-mint' : 'text-neutral-600'}`} />
                </button>
                
                <div 
                  ref={el => contentRefs.current[idx] = el}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 text-neutral-400 font-light leading-relaxed text-sm md:text-lg">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
