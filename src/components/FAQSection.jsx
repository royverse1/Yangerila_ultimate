import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("About The Academy");
  const [openIndex, setOpenIndex] = useState(0);
  
  const containerRef = useRef(null);
  const contentRefs = useRef([]);

  const categories = Object.keys(faqCategories);

  useGSAP(() => {
    // Reset and initialize GSAP states for the newly active category's accordion
    contentRefs.current.forEach((el, i) => {
      // Safely kill existing tweens if user spammed clicks
      if(el) gsap.killTweensOf(el);

      if (i !== openIndex && el) {
        gsap.set(el, { height: 0, opacity: 0 });
      } else if (el) {
        gsap.set(el, { height: "auto", opacity: 1 });
      }
    });

    // Pin the FAQ section while scrolling
    const faqTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        start: "center center",
        end: "+=100%", // Pause for 1 screen height
        scrub: 1
      }
    });

    const faqHeader = containerRef.current.querySelector('.faq-header');
    const faqTabs = containerRef.current.querySelector('.faq-tabs');
    const faqContent = containerRef.current.querySelector('.faq-content');

    gsap.set([faqHeader, faqTabs, faqContent], { y: 30, opacity: 0 });

    faqTl.to({}, { duration: 0.1 });
    faqTl.to(faqHeader, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    faqTl.to(faqTabs, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.3");
    faqTl.to(faqContent, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
    faqTl.to({}, { duration: 0.4 });

  }, { scope: containerRef, dependencies: [activeCategory] });

  const toggleFaq = (idx) => {
    if (openIndex === idx) {
      // Close currently open
      gsap.to(contentRefs.current[idx], { 
        height: 0, opacity: 0, duration: 0.4, ease: "power4.out" 
      });
      setOpenIndex(-1);
    } else {
      // Close previous
      if (openIndex !== -1 && contentRefs.current[openIndex]) {
        gsap.to(contentRefs.current[openIndex], { 
          height: 0, opacity: 0, duration: 0.4, ease: "power4.out" 
        });
      }
      // Open new
      const targetEl = contentRefs.current[idx];
      gsap.set(targetEl, { height: "auto" });
      const targetHeight = targetEl.offsetHeight;
      
      gsap.fromTo(targetEl, 
        { height: 0, opacity: 0 }, 
        { height: targetHeight, opacity: 1, duration: 0.4, ease: "power4.out" }
      );
      setOpenIndex(idx);
    }
  };

  return (
    <section ref={containerRef} className="snap-section w-full section-padding min-h-screen flex flex-col justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-950/80 via-pitch-black to-pitch-black border-t border-white/5 relative z-20 overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,1)]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 w-full pt-20">
        <div className="faq-header text-center mb-16">
          <h2 className="text-neon-mint tracking-[0.3em] font-bold text-sm uppercase mb-4 drop-shadow-[0_0_15px_rgba(46,211,162,0.8)]">Got Questions?</h2>
          <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">Frequently Asked <br/><span className="text-serif-italic font-light text-teal-400 lowercase drop-shadow-none">clarifications</span></h3>
        </div>

        {/* Categories 4-Column Tabs */}
        <div className="faq-tabs grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 relative z-20">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            // Splitting title to mimic user request: stack words vertically
            const words = cat === "Classes & Online Learning" 
              ? ["Classes", "& Online", "Learning"] 
              : cat === "Courses & Features"
              ? ["Courses", "&", "Features"]
              : cat === "Fees & Enrollment"
              ? ["Fees", "&", "Enrollment"]
              : cat.split(" ");
              
            return (
              <button
                key={cat}
                onClick={() => {
                  setOpenIndex(0); // Immediately open first item when switching tabs
                  setActiveCategory(cat);
                }}
                className={`p-6 rounded-3xl border transition-all duration-300 font-black tracking-widest uppercase text-sm md:text-md text-center flex flex-col justify-center items-center gap-1 ${
                  isActive 
                    ? 'bg-neon-mint text-pitch-black border-neon-mint shadow-[0_0_30px_rgba(46,211,162,0.4)] scale-105 z-10' 
                    : 'bg-white/5 border-white/10 text-white hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {words.map((word, i) => (
                  <span key={i} className="block leading-tight">{word}</span>
                ))}
              </button>
            );
          })}
        </div>

        {/* Dynamic Accordion Questions based on active tab */}
        <div className="faq-content flex flex-col gap-4 max-w-4xl mx-auto">
          {faqCategories[activeCategory].map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={`${activeCategory}-${idx}`} 
                className={`liquid-glass rounded-2xl overflow-hidden border transition-all duration-500 ${isOpen ? 'border-neon-mint/50 shadow-[0_0_30px_rgba(46,211,162,0.15)] bg-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}`}
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group relative z-10 bg-transparent"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors duration-500 ${isOpen ? 'text-neon-mint drop-shadow-[0_0_10px_rgba(46,211,162,0.5)]' : 'text-white group-hover:text-neon-mint/80'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`text-white transition-transform duration-600 ease-[cubic-bezier(0.87,0,0.13,1)] shrink-0 ${isOpen ? 'rotate-180 text-neon-mint' : ''}`} />
                </button>
                
                <div 
                  ref={el => contentRefs.current[idx] = el}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 pt-0 text-neutral-300 font-light leading-relaxed text-lg relative z-0">
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
