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

const FAQSection = React.memo(function FAQSection({ step }) {
  const [activeCategory, setActiveCategory] = useState("About The Academy");
  const [openIndex, setOpenIndex] = useState(0);
  const containerRef = useRef(null);
  const contentRefs = useRef([]);

  useGSAP(() => {
    const faqHeader = containerRef.current.querySelector('.faq-header');
    const faqTabs = containerRef.current.querySelector('.faq-tabs');
    const faqContent = containerRef.current.querySelector('.faq-content');

    if (step === 7) {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(faqHeader, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(faqTabs, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(faqContent, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");
    }
  }, { scope: containerRef, dependencies: [step] });

  useGSAP(() => {
    contentRefs.current.forEach((el, i) => {
      if (el) {
        if (i === openIndex) gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.4 });
        else gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.4 });
      }
    });
  }, { scope: containerRef, dependencies: [activeCategory, openIndex] });

  const categories = Object.keys(faqCategories);

  return (
    <section ref={containerRef} className="w-full h-[100dvh] shrink-0 relative flex flex-col items-center justify-start bg-transparent pt-12 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full flex flex-col items-center h-full">

        <div className="faq-header text-center mb-6 md:mb-10 w-full pt-4 md:pt-10 invisible shrink-0">
          <span className="text-accent-teal tracking-[0.4em] font-bold text-[10px] uppercase mb-2 md:mb-4 block">Support</span>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-ink-dark uppercase tracking-tighter leading-tight">
            Frequently Asked <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-magenta to-accent-teal font-light text-serif-italic lowercase">insights</span>
          </h2>
        </div>

        <div className="faq-tabs flex flex-wrap justify-center gap-3 md:gap-12 mb-6 md:mb-12 w-full border-b border-ink-dark/10 pb-4 md:pb-8 invisible shrink-0">
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setOpenIndex(0); setActiveCategory(cat); }} className={`relative py-1 md:py-2 text-[9px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all duration-500 hover:text-accent-teal bg-transparent border-none cursor-pointer ${activeCategory === cat ? 'text-accent-teal' : 'text-ink-medium'}`}>
              {cat}
              {activeCategory === cat && <div className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent-teal"></div>}
            </button>
          ))}
        </div>

        {/* Scrollable area for FAQ questions to prevent cutoffs on short phones */}
        <div className="faq-content flex flex-col gap-3 w-full max-w-4xl pb-4 invisible flex-1 overflow-y-auto scrollbar-hide px-2">
          {faqCategories[activeCategory].map((faq, idx) => (
            <div key={`${activeCategory}-${idx}`} className={`bg-white/85 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border transition-all duration-500 shrink-0 ${openIndex === idx ? 'border-accent-teal premium-glow' : 'border-white/80 shadow-sm'}`}>
              <button onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)} className="w-full px-5 md:px-8 py-4 md:py-6 flex items-center justify-between text-left group bg-transparent focus:outline-none cursor-pointer">
                <span className={`text-sm sm:text-base md:text-xl font-bold uppercase tracking-tight transition-colors duration-300 pr-4 ${openIndex === idx ? 'text-accent-teal' : 'text-ink-dark group-hover:text-accent-teal'}`}>{faq.question}</span>
                <ChevronDown size={18} className={`transition-transform duration-500 shrink-0 ${openIndex === idx ? 'rotate-180 text-accent-teal' : 'text-ink-medium'}`} />
              </button>
              <div ref={el => contentRefs.current[idx] = el} className="overflow-hidden invisible h-0">
                <div className="px-5 md:px-8 pb-5 md:pb-8 pt-0 text-ink-medium font-medium leading-relaxed text-xs sm:text-sm md:text-lg">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FAQSection;