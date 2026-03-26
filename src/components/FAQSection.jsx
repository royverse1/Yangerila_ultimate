import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

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

const FAQSection = React.memo(function FAQSection({ step, onComplete, isReversing }) {
  const [activeCategory, setActiveCategory] = useState("About The Academy");
  const [openIndex, setOpenIndex] = useState(0);

  const containerRef = useRef(null);
  const contentRefs = useRef([]);

  const isActive = step === 7;

  useGSAP(() => {
    const faqHeader = containerRef.current.querySelector('.faq-header');
    const faqTabs = containerRef.current.querySelector('.faq-tabs');
    const faqContent = containerRef.current.querySelector('.faq-content');

    // 1. EXIT SCENARIOS
    if (step < 7) {
      gsap.to(containerRef.current, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
    }
    if (step > 7) {
      gsap.to(containerRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" });
    }

    // 2. ENTRANCE & REVERSE
    if (step === 7) {
      if (isReversing) {
        gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
        gsap.set([faqHeader, faqTabs, faqContent], { y: 0, autoAlpha: 1 });
        gsap.delayedCall(0.8, onComplete);
      } else {
        gsap.to(containerRef.current, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });

        const tl = gsap.timeline({ onComplete });
        tl.to(faqHeader, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" })
          .to(faqTabs, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.4")
          .to(faqContent, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.4");
      }
    }

  }, { scope: containerRef, dependencies: [step, isReversing] });

  useGSAP(() => {
    contentRefs.current.forEach((el, i) => {
      if (el) {
        if (i === openIndex) {
          gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.4 });
        } else {
          gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.4 });
        }
      }
    });
  }, { scope: containerRef, dependencies: [activeCategory, openIndex] });

  const categories = Object.keys(faqCategories);

  return (
    <section
      ref={containerRef}
      // CRITICAL FIX: z-[35] forces FAQ to cleanly slide over MethodPanel (which is z-30)
      className={`fixed inset-0 z-[35] w-full min-h-screen pt-16 pb-32 flex flex-col items-center justify-start bg-pitch-black overflow-hidden invisible ${!isActive ? 'pointer-events-none' : ''}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-neon-mint/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <div className="faq-header text-center mb-8 md:mb-16 w-full pt-10 invisible translate-y-10">
          <span className="text-neon-mint tracking-[0.4em] font-bold text-[8px] md:text-[10px] uppercase mb-2 md:mb-4 block opacity-80">Support</span>
          <h2 className="text-2xl sm:text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
            Frequently Asked <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-teal-400 font-light text-serif-italic lowercase">insights</span>
          </h2>
        </div>

        <div className="faq-tabs flex flex-wrap justify-center gap-3 md:gap-12 mb-8 md:mb-20 w-full border-b border-white/10 pb-4 md:pb-8 invisible translate-y-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setOpenIndex(0); setActiveCategory(cat); }}
              className={`relative py-2 text-[8px] md:text-sm font-black uppercase tracking-[0.15em] transition-all duration-500 hover:text-neon-mint bg-transparent border-none cursor-pointer ${activeCategory === cat ? 'text-neon-mint' : 'text-neutral-500'}`}
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 w-6 md:w-8 h-[2px] bg-neon-mint shadow-[0_0_10px_#2ed3a2]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="faq-content flex flex-col gap-3 md:gap-4 w-full max-w-4xl pb-20 invisible translate-y-10">
          {faqCategories[activeCategory].map((faq, idx) => (
            <div key={`${activeCategory}-${idx}`} className={`liquid-glass rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 ${openIndex === idx ? 'border-neon-mint/30 bg-white/[0.03]' : 'border-white/5'}`}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-5 md:px-8 py-4 md:py-7 flex items-center justify-between text-left group bg-transparent focus:outline-none cursor-pointer"
              >
                <span className={`text-sm sm:text-base md:text-xl font-bold uppercase tracking-tight transition-colors duration-300 ${openIndex === idx ? 'text-neon-mint' : 'text-neutral-300 group-hover:text-white'}`}>{faq.question}</span>
                <ChevronDown size={16} className={`transition-transform duration-500 shrink-0 ml-4 ${openIndex === idx ? 'rotate-180 text-neon-mint' : 'text-neutral-600'}`} />
              </button>
              <div ref={el => contentRefs.current[idx] = el} className="overflow-hidden invisible h-0">
                <div className="px-5 md:px-8 pb-4 md:pb-8 pt-0 text-neutral-400 font-light leading-relaxed text-[11px] sm:text-sm md:text-lg">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FAQSection;