import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  FileText, 
  Code2, 
  FileCheck, 
  GraduationCap, 
  CalendarCheck, 
  Briefcase, 
  Bot, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface SandboxModule {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconColor: string;
  bulletColor: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  accentRgb: string;
  glowShadow: string;
}

const SANDBOX_MODULES: SandboxModule[] = [
  {
    id: 'resume',
    title: 'AI Resume Builder & ATS Checker',
    shortTitle: 'ATS Resume',
    badge: 'REAL-TIME ATS SCORING',
    badgeBg: 'bg-indigo-100/90 border-indigo-200',
    badgeText: 'text-indigo-700',
    cardBg: 'bg-gradient-to-br from-indigo-50/90 via-white/80 to-indigo-50/50',
    cardBorder: 'border-indigo-200/90',
    iconBg: 'bg-indigo-100/90 border-indigo-200',
    iconColor: 'text-indigo-600',
    bulletColor: 'bg-indigo-600',
    metricLabel: 'ATS COMPATIBILITY',
    metricValue: '98% Pass Rate',
    description: 'Generates ATS-optimized, high-scoring single-column resumes aligned with precise corporate hiring models.',
    bullets: [
      'Interactive resume editor with live scoring metrics',
      'Auto-extracts missing technical requirements & keywords',
      'Direct single-column PDF compiles optimized for HR parsers',
    ],
    icon: FileText,
    accentRgb: '99, 102, 241',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(99,102,241,0.25)]',
  },
  {
    id: 'dsa',
    title: '375 DSA Roadmap & Compiler',
    shortTitle: '375 DSA',
    badge: 'CURATED PROBLEM SET',
    badgeBg: 'bg-amber-100/90 border-amber-200',
    badgeText: 'text-amber-800',
    cardBg: 'bg-gradient-to-br from-amber-50/90 via-white/80 to-amber-50/50',
    cardBorder: 'border-amber-200/90',
    iconBg: 'bg-amber-100/90 border-amber-200',
    iconColor: 'text-amber-600',
    bulletColor: 'bg-amber-600',
    metricLabel: 'CURATED DSA QUESTIONS',
    metricValue: '375 Problems',
    description: 'Master data structures & algorithms with topic-wise progress tracking, solution hints, and in-browser execution.',
    bullets: [
      'Topic-wise tracking from Arrays to Graphs & Segment Trees',
      'In-browser TypeScript/Python/Java execution sandbox',
      'Direct video walkthroughs and time-complexity telemetry',
    ],
    icon: Code2,
    accentRgb: '245, 158, 11',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'pdf',
    title: 'AI PDF Summarizer & Flashcards',
    shortTitle: 'PDF Summarizer',
    badge: 'INSTANT SYLLABUS PARSER',
    badgeBg: 'bg-purple-100/90 border-purple-200',
    badgeText: 'text-purple-700',
    cardBg: 'bg-gradient-to-br from-purple-50/90 via-white/80 to-purple-50/50',
    cardBorder: 'border-purple-200/90',
    iconBg: 'bg-purple-100/90 border-purple-200',
    iconColor: 'text-purple-600',
    bulletColor: 'bg-purple-600',
    metricLabel: 'EXAM PREP EFFICIENCY',
    metricValue: '10x Faster Study',
    description: 'Deconstruct extensive curriculum files into bite-sized study checklists, interactive flashcards, and exam keys.',
    bullets: [
      'Uploads 100+ page textbook PDFs in under 5 seconds',
      'Generates interactive flashcards and 2-minute chapter summaries',
      'Auto-creates practice quizzes based on previous exam patterns',
    ],
    icon: FileCheck,
    accentRgb: '168, 85, 247',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(168,85,247,0.25)]',
  },
  {
    id: 'courses',
    title: 'Interactive Coding Courses',
    shortTitle: 'Coding Courses',
    badge: 'VERIFIED CERTIFICATIONS',
    badgeBg: 'bg-emerald-100/90 border-emerald-200',
    badgeText: 'text-emerald-800',
    cardBg: 'bg-gradient-to-br from-emerald-50/90 via-white/80 to-emerald-50/50',
    cardBorder: 'border-emerald-200/90',
    iconBg: 'bg-emerald-100/90 border-emerald-200',
    iconColor: 'text-emerald-600',
    bulletColor: 'bg-emerald-600',
    metricLabel: 'STRUCTURED COURSES',
    metricValue: '12+ Full Tracks',
    description: 'Step-by-step full-stack web development, Python DSA, AI engineering, and system design learning paths.',
    bullets: [
      'Interactive progress checkboxes and module quizzes',
      'Authentic cryptographic certificate verification IDs',
      'Hands-on project repositories and capstone guides',
    ],
    icon: GraduationCap,
    accentRgb: '16, 185, 129',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'studyhub',
    title: 'AI Study Hub & Habit Tracker',
    shortTitle: 'Study Hub',
    badge: 'DAILY STREAK ENGINE',
    badgeBg: 'bg-cyan-100/90 border-cyan-200',
    badgeText: 'text-cyan-800',
    cardBg: 'bg-gradient-to-br from-cyan-50/90 via-white/80 to-cyan-50/50',
    cardBorder: 'border-cyan-200/90',
    iconBg: 'bg-cyan-100/90 border-cyan-200',
    iconColor: 'text-cyan-600',
    bulletColor: 'bg-cyan-600',
    metricLabel: 'STUDENT RETENTION',
    metricValue: '94% Consistency',
    description: 'Track daily study streaks, manage assignment deadlines, and review weak topics with AI revision prompts.',
    bullets: [
      'Gamified streak tracking with habit milestone badges',
      '7-day spaced repetition revision scheduling',
      'Pomodoro timer integrated with subject task logs',
    ],
    icon: CalendarCheck,
    accentRgb: '6, 182, 212',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(6,182,212,0.25)]',
  },
  {
    id: 'placement',
    title: 'Placement & Internship Alerts',
    shortTitle: 'Job Alerts',
    badge: 'MNC VACANCY DISPATCH',
    badgeBg: 'bg-rose-100/90 border-rose-200',
    badgeText: 'text-rose-700',
    cardBg: 'bg-gradient-to-br from-rose-50/90 via-white/80 to-rose-50/50',
    cardBorder: 'border-rose-200/90',
    iconBg: 'bg-rose-100/90 border-rose-200',
    iconColor: 'text-rose-600',
    bulletColor: 'bg-rose-600',
    metricLabel: 'VERIFIED OPPORTUNITIES',
    metricValue: '500+ Off-Campus Jobs',
    description: 'Discover verified off-campus hiring drives, tier-3 campus placement links, and MNC referral windows.',
    bullets: [
      'Real-time application link verification and deadline alerts',
      'Batch-wise hiring filters for 2024, 2025, and 2026 graduates',
      'Direct ATS resume matching for target corporate roles',
    ],
    icon: Briefcase,
    accentRgb: '244, 63, 94',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(244,63,94,0.25)]',
  },
  {
    id: 'interview',
    title: 'Interview Prep Hub',
    shortTitle: 'Interview Prep',
    badge: '256+ COMPANY SUBJECTS',
    badgeBg: 'bg-teal-100/90 border-teal-200',
    badgeText: 'text-teal-800',
    cardBg: 'bg-gradient-to-br from-teal-50/90 via-white/80 to-teal-50/50',
    cardBorder: 'border-teal-200/90',
    iconBg: 'bg-teal-100/90 border-teal-200',
    iconColor: 'text-teal-600',
    bulletColor: 'bg-teal-600',
    metricLabel: 'INTERVIEW PREPARATION',
    metricValue: '256+ Curated Questions',
    description: 'Master company-wise technical interview questions, practice MCQs, downloadable cheat sheets, and top interview questions.',
    bullets: [
      'Top company questions from Amazon, Google, Microsoft, and startups',
      'Topic-wise MCQs, cheat sheets, and structural practice sets',
      'Detailed step-by-step solutions and conceptual breakdowns',
    ],
    icon: Bot,
    accentRgb: '20, 184, 166',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(20,184,166,0.25)]',
  },
  {
    id: 'attendance',
    title: 'Attendance Predictor & Log',
    shortTitle: 'Attendance',
    badge: '75% THRESHOLD SAFEGUARD',
    badgeBg: 'bg-sky-100/90 border-sky-200',
    badgeText: 'text-sky-800',
    cardBg: 'bg-gradient-to-br from-sky-50/90 via-white/80 to-sky-50/50',
    cardBorder: 'border-sky-200/90',
    iconBg: 'bg-sky-100/90 border-sky-200',
    iconColor: 'text-sky-600',
    bulletColor: 'bg-sky-600',
    metricLabel: 'ELIGIBILITY RISK',
    metricValue: '0 Exam Bunk Penalties',
    description: 'Calculates exact class bunk allowances so you stay eligible for mid-sems without risking attendance shortage.',
    bullets: [
      'Smart predictor calculates how many classes you can safely skip',
      'Subject-wise timetable logging with instant alerts',
      'De-stress calculation based on college criteria',
    ],
    icon: Calculator,
    accentRgb: '14, 165, 233',
    glowShadow: 'shadow-[0_20px_50px_-12px_rgba(14,165,233,0.25)]',
  },
];

interface AgentSandboxesCarouselProps {
  onOpenAuth?: (mode: 'register') => void;
}

export const AgentSandboxesCarousel: React.FC<AgentSandboxesCarouselProps> = ({ onOpenAuth }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? SANDBOX_MODULES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === SANDBOX_MODULES.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (idx: number) => {
    if (idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const prevIndex = activeIndex === 0 ? SANDBOX_MODULES.length - 1 : activeIndex - 1;
  const nextIndex = activeIndex === SANDBOX_MODULES.length - 1 ? 0 : activeIndex + 1;

  const currentModule = SANDBOX_MODULES[activeIndex];
  const prevModule = SANDBOX_MODULES[prevIndex];
  const nextModule = SANDBOX_MODULES[nextIndex];

  // Motion Variants for Sliding Transitions
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 180 : -180,
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? 10 : -10,
      filter: 'blur(6px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { type: 'spring', stiffness: 300, damping: 25 },
        filter: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? -10 : 10,
      filter: 'blur(6px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <section id="sandboxes" className="py-20 bg-transparent border-t border-white/40 overflow-hidden relative">
      
      {/* Background Lighting Aura Glow (2D & Lighting Effect) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px] opacity-35 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${currentModule.accentRgb}, 0.5) 0%, rgba(${currentModule.accentRgb}, 0.15) 50%, transparent 80%)`
        }}
      />

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-indigo-200/90 inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            DYNAMIC 2D & LIGHTING MODULE CAROUSEL
          </motion.span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Explore the Placivo Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-3 max-w-2xl mx-auto">
            Interact with our animated 2D carousel with lighting spotlights to discover how each module powers your placement journey.
          </p>
        </div>

        {/* QUICK MODULE PILL SELECTOR WITH SMOOTH 2D SLIDING HIGHLIGHT */}
        <div className="mb-10 max-w-4xl mx-auto overflow-x-auto no-scrollbar py-2 px-1">
          <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max">
            {SANDBOX_MODULES.map((mod, idx) => {
              const isActive = activeIndex === idx;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelect(idx)}
                  className={`relative px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer select-none ${
                    isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeModuleTab"
                      className="absolute inset-0 bg-white rounded-2xl border border-slate-200 shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 p-1 rounded-lg ${isActive ? mod.iconBg + ' ' + mod.iconColor : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="relative z-10 tracking-tight">{mod.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D/2D SLIDING CAROUSEL CONTAINER */}
        <div className="relative max-w-5xl mx-auto min-h-[490px] flex items-center justify-center perspective-[1200px]">
          
          {/* PREVIOUS CARD (LEFT DEPTH PREVIEW) */}
          <motion.div 
            onClick={handlePrev}
            whileHover={{ scale: 0.94, opacity: 0.7 }}
            className={`hidden md:block absolute left-0 lg:-left-6 w-[320px] p-6 rounded-3xl ${prevModule.cardBg} backdrop-blur-xl border ${prevModule.cardBorder} shadow-lg opacity-40 scale-90 -rotate-3 transition-all duration-500 cursor-pointer pointer-events-auto z-10 select-none`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${prevModule.iconBg} ${prevModule.iconColor}`}>
                <prevModule.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${prevModule.badgeBg} ${prevModule.badgeText}`}>
                {prevModule.badge}
              </span>
            </div>
            <h4 className="font-extrabold text-base text-slate-900 mb-1 truncate">{prevModule.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-2">{prevModule.description}</p>
          </motion.div>

          {/* MAIN ACTIVE CARD (SLIDING MOTION WITH DYNAMIC SPOTLIGHT & 2D TILT) */}
          <div className="w-full max-w-xl z-20 relative">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={currentModule.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-8 sm:p-10 rounded-3xl ${currentModule.cardBg} backdrop-blur-2xl border-2 ${currentModule.cardBorder} ${currentModule.glowShadow} relative overflow-hidden group transition-shadow duration-500`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* LIGHTING EFFECT 1: Top Animated Light Beam Sweep */}
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1.5 }}
                  className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none z-30"
                />

                {/* LIGHTING EFFECT 2: Interactive Mouse Spotlight Radial Gradient */}
                <div 
                  className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
                  style={{
                    background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${currentModule.accentRgb}, 0.22), transparent 75%)`
                  }}
                />

                {/* LIGHTING EFFECT 3: Glowing Radial Center Flare */}
                <div 
                  className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-0"
                  style={{
                    background: `radial-gradient(circle, rgba(${currentModule.accentRgb}, 0.4) 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-20">
                  {/* Header Row: Icon & Tag Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`p-3.5 rounded-2xl ${currentModule.iconBg} ${currentModule.iconColor} shadow-md border border-white/90 relative group/icon`}
                    >
                      {/* Icon Ambient Lighting Pulse */}
                      <span 
                        className="absolute inset-0 rounded-2xl blur-md opacity-40 group-hover/icon:opacity-80 transition-opacity duration-300"
                        style={{ background: `rgba(${currentModule.accentRgb}, 0.6)` }}
                      />
                      <currentModule.icon className="w-7 h-7 relative z-10" />
                    </motion.div>

                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-xs backdrop-blur-md ${currentModule.badgeBg} ${currentModule.badgeText} flex items-center gap-1.5`}
                    >
                      <Sparkles className="w-3 h-3 opacity-70 animate-spin" style={{ animationDuration: '6s' }} />
                      {currentModule.badge}
                    </motion.span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                    {currentModule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    {currentModule.description}
                  </p>

                  {/* Bullet Points with 2D Stagger Lighting Checkboxes */}
                  <ul className="space-y-3 mb-8">
                    {currentModule.bullets.map((bullet, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                        className="flex items-start gap-3 group/bullet"
                      >
                        <span 
                          className={`w-2.5 h-2.5 rounded-full ${currentModule.bulletColor} shrink-0 mt-1 shadow-xs group-hover/bullet:scale-125 transition-transform duration-300`} 
                          style={{
                            boxShadow: `0 0 10px rgba(${currentModule.accentRgb}, 0.6)`
                          }}
                        />
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                          {bullet}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Bottom Metrics Bar & CTA Button */}
                  <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4">
                    <div className="p-2.5 px-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs">
                      <p className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                        {currentModule.metricValue}
                      </p>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                        {currentModule.metricLabel}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onOpenAuth && onOpenAuth('register')}
                      className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden group/btn"
                      style={{
                        boxShadow: `0 10px 25px -5px rgba(${currentModule.accentRgb}, 0.4)`
                      }}
                    >
                      {/* Button Lighting Sweep */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10">Try Sandbox</span>
                      <ArrowUpRight className="w-4 h-4 text-sky-400 relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* NEXT CARD (RIGHT DEPTH PREVIEW) */}
          <motion.div 
            onClick={handleNext}
            whileHover={{ scale: 0.94, opacity: 0.7 }}
            className={`hidden md:block absolute right-0 lg:-right-6 w-[320px] p-6 rounded-3xl ${nextModule.cardBg} backdrop-blur-xl border ${nextModule.cardBorder} shadow-lg opacity-40 scale-90 rotate-3 transition-all duration-500 cursor-pointer pointer-events-auto z-10 select-none`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${nextModule.iconBg} ${nextModule.iconColor}`}>
                <nextModule.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${nextModule.badgeBg} ${nextModule.badgeText}`}>
                {nextModule.badge}
              </span>
            </div>
            <h4 className="font-extrabold text-base text-slate-900 mb-1 truncate">{nextModule.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-2">{nextModule.description}</p>
          </motion.div>

        </div>

        {/* CAROUSEL CONTROLS: PREV BUTTON, DOT INDICATORS, NEXT BUTTON */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous Module"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Dot Indicators with 2D Lighting Expansion */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200/80 shadow-xs">
            {SANDBOX_MODULES.map((mod, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelect(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer relative ${
                    isActive ? 'w-8 bg-slate-900' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to ${mod.title}`}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="activeDotGlow"
                      className="absolute inset-0 rounded-full blur-xs opacity-70"
                      style={{ background: `rgb(${mod.accentRgb})` }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-md flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next Module"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

