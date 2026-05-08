import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Music, BookOpen, TrendingUp, Headset, ChevronRight, Plus, Minus, Award, ShieldCheck } from 'lucide-react';

const faqData = [
  {
    id: 'about',
    title: 'About Yangerila',
    icon: Music,
    questions: [
      {
        question: "Why choose Yangerila Creative Studio over others?",
        answer: (
          <div className="space-y-3">
            <p><span className="text-accent-teal font-bold">Superior Courses:</span> With over 20 years of teaching experience, we have crafted courses that are far more effective and performance-driven than standard online lessons. Our structured approach ensures students progress efficiently while enjoying the learning journey.</p>
            <p><span className="text-accent-teal font-bold">Expert Teachers:</span> We carefully select and train only the best instructors. While our teaching team may be small, each teacher is highly skilled, experienced, and dedicated to helping students succeed.</p>
            <p><span className="text-accent-teal font-bold">Innovative Tools & Techniques:</span> We are redefining online guitar learning. Our Advanced Modular Grading Structure, Smart Sheets, and Batch Hub create a seamless and interactive learning experience that feels premium and personalized.</p>
            <p><span className="text-accent-teal font-bold">Fast Progress:</span> Combining exceptional teachers, innovative teaching methods, and comprehensive support, Yangerila students achieve rapid skill development and can perform confidently in a short time.</p>
          </div>
        )
      },
      {
        question: "How does the Advanced Modular Grading Structure work?",
        answer: (
          <div className="space-y-3">
            <p>To understand the Advanced Modular Grading Structure, we first need to understand the guitar. <span className="text-accent-teal font-bold">Guitar isn't just one instrument</span>—it includes electric, acoustic, classical, and more. On top of that, there are many techniques you can play: Rhythm, Lead, Fingerpicking, Percussive styles, and others.</p>
            <p>At Yangerila, we believe a student should be fluent in playing <span className="text-accent-teal font-bold">multiple techniques to become a well-rounded guitarist</span>. Our Modular Grading Structure achieves this by dividing each technique into small, manageable grades. Students can then choose their next course based on their musical interests and guidance from their counsellor or teacher, allowing them to become their own unique musician.</p>
            <p>Other grading structures, if taught at other academies, follow a fixed path designed for an average student, often teaching only one technique and restricting flexibility. <span className="text-accent-teal font-bold">Our approach ensures freedom, variety, and command on the instrument.</span></p>
          </div>
        )
      },
      {
        question: "What are Yangerila's Smart Sheets?",
        answer: (
          <div className="space-y-3">
            <p>No education is complete without proper course material. And if you already have an amazing course, then adding resources that support learning makes it truly exceptional. <span className="text-accent-teal font-bold">That's the vision behind Yangerila's Smart Sheets.</span></p>
            <p>Smart Sheets are a <span className="text-accent-teal font-bold">full, comprehensive set of course materials</span>, organized into individual lesson sheets. As the course progresses, students receive the relevant sheets in their Batch Hub, accessible anytime, anywhere—no notebooks or printouts needed.</p>
            <p>Each sheet is enriched with supporting resources like <span className="text-accent-teal font-bold">supporting audios, explanatory videos, and helpful tips</span>, making practice more efficient and enhancing the overall learning experience.</p>
            <p>This took us years to build, but it makes learning <span className="text-accent-teal font-bold">highly organized and effortless</span> for students.</p>
          </div>
        )
      },
      {
        question: "What is 'Batch Hub'?",
        answer: (
          <div className="space-y-3">
            <p><span className="text-accent-teal font-bold">Batch Hub is a centralized page</span> that students get access to. It serves as the main hub where all resources needed for the course are shared.</p>
            <p>Resources include <span className="text-accent-teal font-bold">online meeting links, notices, ongoing tasks, and most importantly, the course sheets</span> for that batch are shared on this page.</p>
            <p>Students can access everything anytime, anywhere using their Google account, making learning <span className="text-accent-teal font-bold">organized and seamless</span>.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'courses',
    title: 'Courses and Features',
    icon: BookOpen,
    questions: [
      {
        question: "What courses does Yangerila offer?",
        answer: (
          <div className="space-y-3">
            <p><span className="text-accent-teal font-bold">Yangerila Creative Studio</span> offers a range of guitar courses designed for all types of learners. Our main offerings include Rhythm Grades, Lead Grades, Fingerpicking Grades, and Hobby Grades, each structured to help students progress step by step.</p>
            <p>For those who want to enjoy guitar as a hobby, we also have <span className="text-accent-teal font-bold">Hobby Courses,</span> designed for working professionals, housewives, and music lovers. These courses focus on playing songs and performing confidently without diving deep into complex theory or techniques.</p>
            <p>All our courses are crafted with <span className="text-accent-teal font-bold">performance, practical learning, and flexibility</span> in mind, so students can choose a path that suits their goals and interests.</p>
          </div>
        )
      },
      {
        question: "Are there certificate courses?",
        answer: (
          <p>All courses at Yangerila, except the Hobby Courses, are certificate courses. To earn a certificate, students must complete assessments designed to ensure they have achieved the learning outcomes of the course.</p>
        )
      },
      {
        question: "How do Hobby Courses differ from graded courses?",
        answer: (
          <div className="space-y-3">
            <p>As the name suggests, <span className="text-accent-teal font-bold">Hobby Courses</span> are designed for students who want to add music into their lives but may not have the time or interest to dive into all the details required to become a professional musician. These courses fast-track progress, focusing only on what's needed to perform favorite songs confidently.</p>
            <p><span className="text-accent-teal font-bold">Graded courses,</span> on the other hand, cover more theory, technical exercises, and detailed learning to build complete musicianship. While Graded courses are structured courses and students have to keep up with the course, Hobby courses are much more flexible in keeping up with the progress of student.</p>
          </div>
        )
      },
      {
        question: "What is the recommended course for absolute beginners?",
        answer: (
          <div className="space-y-3">
            <p>For absolute beginners, we recommend <span className="text-accent-teal font-bold">Rhythm Grade 1.</span> Rhythm is the fastest-progressing technique among all, and Rhythm Grade 1 also includes basic singing tips and some introductory lead lessons. This allows students to start performing their favorite songs sooner, which ignites their passion and motivates them to tackle more advanced courses confidently.</p>
            <p>That said, students can still choose <span className="text-accent-teal font-bold">Fingerpicking Grade 1 or Lead Grade 1</span> as their starting course. However, if either is taken before completing Rhythm Grade 1, the course duration will extend to 24 months instead of 6, as many foundational elements from Rhythm Grade 1 are also included in these courses.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'learning',
    title: 'Classes & Online Learning',
    icon: TrendingUp,
    questions: [
      {
        question: "I am not sure about online classes.",
        answer: (
          <div className="space-y-3">
            <p>We don't provide just any online classes. Our sessions are <span className="text-accent-teal font-bold">live, interactive classes with expert teachers</span> and your batchmates. Teachers use multi-camera setups and professional audio, offering continuous feedback and support throughout the class. Learning with the same batchmates creates a mini classroom environment, making it social, engaging, and motivating.</p>
            <p>When people think of online classes, they often imagine YouTube lessons or short pre-recorded courses. While YouTube is a great source of information, it doesn't provide a structured course, and short lessons lack the feedback and guidance that live classes offer.</p>
            <p>At Yangerila, our teachers follow <span className="text-accent-teal font-bold">comprehensive courses</span> that are paired with checks such as <span className="text-accent-teal font-bold">performance classes, regular assessments, and tasks</span>. This ensures every student progresses efficiently while staying supported and engaged. Attend our free Online demo session to see how we excel online guitar classes. Many students overcome their initial skepticism during the demo session itself.</p>
          </div>
        )
      },
      {
        question: "Tell me about the class schedule?",
        answer: (
          <div className="space-y-3">
            <p>In short the <span className="text-accent-teal font-bold">Schedule</span> goes like:</p>
            <ul className="list-disc pl-5 my-2 space-y-1">
              <li>Number of classes per week: <span className="text-accent-teal font-bold">2</span></li>
              <li>Length of class: <span className="text-accent-teal font-bold">1 Hour</span></li>
              <li>Held in small batches of up to <span className="text-accent-teal font-bold">8 students</span></li>
              <li>Meeting app used - <span className="text-accent-teal font-bold">Zoom</span></li>
              <li>Backup options available <span className="text-accent-teal font-bold">(read below)</span></li>
            </ul>
            <p>When a student joins, they are given available slots for new batches. Once the student chooses their timings, they are added to that batch. A batch consists of about 8 students of similar level. For example, if a beginner joins, everyone in their batch will be a beginner. Classes then run <span className="text-accent-teal font-bold">twice a week</span> on the selected timings.</p>
            <p>Each student is also allotted a backup batch timing. Students cover their pre-informed missed classes in the backup batch. No backup classes are provided for uninformed absence.</p>
          </div>
        )
      },
      {
        question: "Are the classes live or pre-recorded?",
        answer: (
          <div className="space-y-3">
            <p>All classes we take are <span className="text-accent-teal font-bold">live interactive sessions</span> with our teachers. We don't believe in learning through pre-recorded classes, as they lack the feedback from the teacher which is essential to learn faster and properly.</p>
            <p>In our <span className="text-accent-teal font-bold">Smart Sheets,</span> we do provide video lessons and tips as resources to help students more while practicing after our classes.</p>
          </div>
        )
      },
      {
        question: "What equipment do I need to join?",
        answer: (
          <div className="space-y-3">
            <p>To join our classes, you'll need three essentials:</p>
            <ul className="list-disc pl-5 my-2 space-y-1">
              <li><span className="text-accent-teal font-bold">Your guitar or chosen instrument</span></li>
              <li><span className="text-accent-teal font-bold">A device with a working camera</span></li>
              <li><span className="text-accent-teal font-bold">A stable internet connection</span></li>
            </ul>
            <p><span className="text-accent-teal font-bold">Any device</span> that can run Zoom is sufficient, but having a camera is mandatory. Ensure your camera is positioned so both you and your guitar are clearly visible. This allows our coaches to spot mistakes and guide your practice effectively. A stable internet connection is crucial to ensure uninterrupted learning.</p>
          </div>
        )
      },
      {
        question: "What if I miss a class? Do I get a recording?",
        answer: (
          <p>We don't share class recordings. Instead, for any missed classes that were pre-informed, we provide a <span className="text-accent-teal font-bold">full-length backup class</span>. Live classes are more effective than recorded sessions, as students get real-time feedback and guidance, which helps them learn faster and more accurately.</p>
        )
      }
    ]
  },
  {
    id: 'fees',
    title: 'Fee & Enrollment',
    icon: Headset,
    questions: [
      {
        question: "More about fee",
        answer: (
          <div className="space-y-3">
            <p>We’ve kept the <span className="text-accent-teal font-bold">fee</span> and <span className="text-accent-teal font-bold">payment structure</span> simple:</p>
            <ul className="list-disc pl-5 my-2 space-y-1">
              <li>Fees are charged <span className="text-accent-teal font-bold">monthly</span> only.</li>
              <li>No <span className="text-accent-teal font-bold">registration fee</span>.</li>
              <li><span className="text-accent-teal font-bold">Smart Sheets</span> access is completely free.</li>
              <li>No <span className="text-accent-teal font-bold">fee hikes</span> mid-course.</li>
            </ul>
            <p>Unlike other academies, we don’t require <span className="text-accent-teal font-bold">upfront payment</span> for the entire course. We are confident in the quality of our teaching and the value students get—our <span className="text-accent-teal font-bold">90%+ retention rates</span> speak for themselves. <span className="text-accent-teal font-bold">Monthly payments</span> make it easier for students and ensure we give full attention to everyone regularly.</p>
            <p>There are <span className="text-accent-teal font-bold">no hidden charges</span> or extra payments for study materials. Although <span className="text-accent-teal font-bold">Smart Sheets</span> were initially developed as paid resources, their transformative impact on learning led us to make them <span className="text-accent-teal font-bold">completely free</span> for all students.</p>
          </div>
        )
      },
      {
        question: "Enrollment process",
        answer: (
          <div className="space-y-3">
            <p>To join <span className="text-accent-teal font-bold">Yangerila Creative Studio</span>, simply fill out the form on our website or call us on the provided numbers. You’ll be assigned a <span className="text-accent-teal font-bold">Student Relationship Manager (SRM)</span> who will answer all your queries and guide you through the process.</p>
            <p><span className="text-accent-teal font-bold">Demo Session:</span> Every student starts with a mandatory demo session. Our uniquely designed demo doesn’t begin teaching guitar immediately; instead, it gives a complete overview—types of guitars, playing techniques, course duration, potential challenges, and what to expect. This ensures students get a clear picture of the course before enrolling.</p>
            <p><span className="text-accent-teal font-bold">Admission:</span> After discussing suitable class timings, your <span className="text-accent-teal font-bold">SRM</span> will guide you through the admission process. Once enrolled, classes begin, and your <span className="text-accent-teal font-bold">SRM</span> remains your primary point of contact for any support or queries throughout your learning journey.</p>
          </div>
        )
      },
      {
        question: "Mode of payments",
        answer: (
          <div className="space-y-3">
            <p>Please find the details of <span className="text-accent-teal font-bold">payment modes</span> below:</p>
            <ul className="list-disc pl-5 my-2 space-y-1">
              <li><span className="text-accent-teal font-bold">UPI / Bank Transfer</span> – Most commonly used by students ✅</li>
              <li><span className="text-accent-teal font-bold">Cheque</span> – Accepted but not recommended ❌</li>
              <li><span className="text-accent-teal font-bold">Cash</span> – Not accepted ❌</li>
            </ul>
            <p>All payments must be made to <span className="text-accent-teal font-bold">Yangerila Creative Studio’s official account</span> only. Payment details will be provided by your assigned <span className="text-accent-teal font-bold">Student Relationship Manager (SRM)</span>.</p>
          </div>
        )
      },
      {
        question: "Can I pause or discontinue the course midway?",
        answer: (
          <div className="space-y-3">
            <p>Students can <span className="text-accent-teal font-bold">take breaks</span> from the course at any time, though it is generally discouraged. Since we charge only a <span className="text-accent-teal font-bold">monthly fee</span>, students can pause after completing a month.</p>
            <p>When rejoining, students will be charged the <span className="text-accent-teal font-bold">updated fee</span> and any applicable <span className="text-accent-teal font-bold">registration charges</span> of that time. A thorough <span className="text-accent-teal font-bold">assessment</span> will be conducted by our coach, and the student will be placed in a suitable batch based on their level.</p>
          </div>
        )
      },
      {
        question: "Is the fee Refundable or Transferable?",
        answer: (
          <div className="space-y-3">
            <p>There are <span className="text-accent-teal font-bold">no refunds</span>. As we charge a <span className="text-accent-teal font-bold">monthly fee</span> which makes it easier for a student to complete their pending classes before leaving the academy.</p>
            <p><span className="text-accent-teal font-bold">Fee is transferable.</span> If a student, due to any reason, cannot complete their classes, they can <span className="text-accent-teal font-bold">transfer</span> the remaining classes to any new joining students of their reference. The remaining classes will be provided to the <span className="text-accent-teal font-bold">new student</span> upon joining.</p>
          </div>
        )
      }
    ]
  }
];

const FAQSection = React.memo(function FAQSection({ step, isReversingRef }) {
  const [activeCategoryId, setActiveCategoryId] = useState(faqData[0].id);
  const [openIndex, setOpenIndex] = useState(-1);

  const containerRef = useRef(null);
  const contentRefs = useRef([]);

  const activeCategory = faqData.find(cat => cat.id === activeCategoryId);

  useGSAP(() => {
    const isReversing = isReversingRef.current;
    const faqHeader = containerRef.current.querySelector('.faq-header');
    const faqBox = containerRef.current.querySelector('.faq-box');

    if (step === 7) {
      if (isReversing) {
        gsap.set([faqHeader, faqBox], { autoAlpha: 1, y: 0 });
      } else {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.fromTo(faqHeader, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
          .fromTo(faqBox, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      }
    }
  }, { scope: containerRef, dependencies: [step] });

  useGSAP(() => {
    contentRefs.current.forEach((el, i) => {
      if (el) {
        if (i === openIndex) gsap.to(el, { height: 'auto', autoAlpha: 1, duration: 0.4, ease: "power2.out" });
        else gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.4, ease: "power2.out" });
      }
    });
  }, { scope: containerRef, dependencies: [activeCategoryId, openIndex] });

  const handleCategoryChange = (id) => {
    if (activeCategoryId === id) return;

    contentRefs.current.forEach(el => {
      if (el) gsap.set(el, { height: 0, autoAlpha: 0 });
    });
    contentRefs.current = [];
    setOpenIndex(-1);
    setActiveCategoryId(id);
  };

  return (
    <section ref={containerRef} className="w-full h-dvh shrink-0 relative flex flex-col items-center justify-center bg-transparent pt-12 md:pt-16 pb-8 border-t-[3px] border-ink-dark/10 overflow-hidden">
      <div className="max-w-[95%] xl:max-w-[85vw] 2xl:max-w-[80vw] mx-auto w-full h-full flex flex-col items-center relative z-10">

        <div className="faq-header text-center mb-4 md:mb-10 w-full pt-4 md:pt-6 invisible shrink-0">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-elegant-serif font-black text-ink-dark tracking-tighter leading-tight">
            FAQs
          </h2>
          <p className="text-accent-teal font-elegant-serif italic text-lg sm:text-xl md:text-3xl mt-1 md:mt-2">
            We've got the answers!
          </p>
        </div>

        <div className="faq-box invisible flex flex-col bg-paper-bg border border-ink-dark/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-3xl md:rounded-[2.5rem] w-full max-h-[75dvh] md:max-h-[70dvh] overflow-hidden flex-1">

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

            <div className="w-full lg:w-[35%] xl:w-[30%] bg-white/40 p-4 sm:p-6 md:p-8 flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide border-b lg:border-b-0 lg:border-r border-ink-dark/10 shrink-0">
              {faqData.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center justify-between px-4 py-4 md:py-6 rounded-2xl w-full text-left transition-all duration-300 border-2 min-w-[240px] lg:min-w-0 cursor-pointer shrink-0 ${isActive
                        ? 'bg-white border-accent-teal/60 shadow-[0_10px_30px_rgba(58,90,140,0.1)] scale-[1.02]'
                        : 'bg-white/60 border-transparent hover:bg-white hover:border-ink-dark/10'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 md:p-3 rounded-full shrink-0 border border-ink-dark/5 ${isActive ? 'bg-accent-teal/10 text-accent-teal' : 'bg-white text-ink-dark/70'}`}>
                        <Icon size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-sm md:text-base font-black font-technical-sans transition-colors ${isActive ? 'text-ink-dark' : 'text-ink-dark/80'}`}>
                          {cat.title}
                        </span>
                        <span className={`text-[10px] md:text-xs font-technical-sans font-bold transition-colors ${isActive ? 'text-accent-teal' : 'text-accent-teal/60'}`}>
                          {cat.questions.length} Questions
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={`shrink-0 transition-all ${isActive ? 'text-accent-teal opacity-100 translate-x-1' : 'text-ink-dark/30 opacity-0 -translate-x-2'}`} />
                  </button>
                );
              })}
            </div>

            <div className="faq-content w-full lg:w-[65%] xl:w-[70%] p-4 sm:p-6 md:p-8 lg:px-12 overflow-y-auto scrollbar-hide bg-white/20 overscroll-contain">
              <div className="flex flex-col w-full">
                {activeCategory.questions.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={`${activeCategoryId}-${idx}`} className="border-b border-ink-dark/10 last:border-b-0">
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="w-full py-5 md:py-6 flex items-center justify-between text-left group bg-transparent focus:outline-none cursor-pointer gap-4"
                      >
                        <span className={`text-sm sm:text-base md:text-lg font-black font-technical-sans transition-colors duration-300 pr-4 ${isOpen ? 'text-ink-dark' : 'text-ink-dark/80 group-hover:text-accent-teal'}`}>
                          {faq.question}
                        </span>
                        <div className={`shrink-0 p-1 rounded-full border border-ink-dark/20 transition-all duration-300 flex items-center justify-center ${isOpen ? 'border-accent-teal text-accent-teal bg-accent-teal/5' : 'text-ink-dark/60 bg-white'}`}>
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </button>
                      <div ref={el => contentRefs.current[idx] = el} className="overflow-hidden invisible h-0">
                        <div className="pb-6 pt-1 text-ink-medium/90 font-elegant-serif leading-relaxed text-xs sm:text-sm md:text-base pr-4 md:pr-12">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="hidden md:block w-full bg-ink-dark/5 border-t border-ink-dark/10 p-5 md:p-8 shrink-0">
            <div className="grid grid-cols-4 gap-6 w-full px-2">
              <div className="flex items-center gap-4">
                <Award size={28} className="text-accent-teal shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-black font-technical-sans md:text-sm text-ink-dark leading-tight">Expert Instructors</span>
                  <span className="font-medium font-technical-sans md:text-[11px] text-ink-dark/60 mt-0.5">Learn from industry professionals</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-ink-dark/10 pl-6">
                <BookOpen size={28} className="text-accent-teal shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-black font-technical-sans md:text-sm text-ink-dark leading-tight">Flexible Learning</span>
                  <span className="font-medium font-technical-sans md:text-[11px] text-ink-dark/60 mt-0.5">Learn at your own pace</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-ink-dark/10 pl-6">
                <ShieldCheck size={28} className="text-accent-teal shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-black font-technical-sans md:text-sm text-ink-dark leading-tight">Quality Education</span>
                  <span className="font-medium font-technical-sans md:text-[11px] text-ink-dark/60 mt-0.5">Structured & up-to-date content</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-ink-dark/10 pl-6">
                <Headset size={28} className="text-accent-teal shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="font-black font-technical-sans md:text-sm text-ink-dark leading-tight">Support Anytime</span>
                  <span className="font-medium font-technical-sans md:text-[11px] text-ink-dark/60 mt-0.5">We're here to help you</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

export default FAQSection;