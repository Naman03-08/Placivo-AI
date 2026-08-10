import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import namanImg from './Naman.png';
import { 
  ArrowLeft, 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles, 
  Award, 
  Code2, 
  BookOpen, 
  Cpu, 
  CheckCircle2, 
  UserCheck, 
  Target, 
  Zap, 
  Flame, 
  Globe, 
  FileText, 
  Layers, 
  Rocket, 
  Quote,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  Star,
  Compass,
  Trophy
} from 'lucide-react';

interface FounderDetailsPageProps {
  onBack: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLaunchApp?: () => void;
}

export const FounderDetailsPage: React.FC<FounderDetailsPageProps> = ({ 
  onBack, 
  onOpenAuth, 
  onLaunchApp 
}) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'tech' | 'modules' | 'contact'>('journey');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-indigo-50/30 to-slate-50 text-slate-900 font-sans relative selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Top Floating Background Accents */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-sky-200/50 via-blue-200/30 to-indigo-200/40 rounded-full blur-3xl pointer-events-none"
      />
      
      <motion.div 
        animate={{ 
          y: [0, 25, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-gradient-to-tl from-purple-200/40 via-pink-200/30 to-cyan-200/40 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer group border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Main Page</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 hidden sm:inline">
              Founder Profile & Details
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200/60"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </motion.a>
            {onLaunchApp && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLaunchApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5 text-sky-200" />
                <span>Launch App</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 relative z-10">
        
        {/* Founder Hero Card (Light Theme with Animations) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-white/90 backdrop-blur-xl text-slate-900 p-6 sm:p-10 lg:p-12 overflow-hidden border-2 border-sky-200/80 shadow-2xl bg-gradient-to-br from-sky-50/80 via-white to-purple-50/60"
        >
          {/* Animated Decorative Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-dashed border-sky-300/60 pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Avatar & Badges */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.04, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 blur-lg"
                />
                
                <div className="relative w-48 h-60 sm:w-56 sm:h-72 rounded-2xl bg-gradient-to-b from-sky-100 via-slate-50 to-indigo-100 border-4 border-sky-300 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img 
                    src={namanImg} 
                    alt="Naman Pandey - Founder" 
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                </div>

                {/* Floating Badge */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute -bottom-2 z-20 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lead System Architect</span>
                </motion.div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Founder
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 pt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Naman Pandey
                </h1>
                <p className="text-xs font-black text-blue-600 tracking-wider uppercase">
                  Founder & Chief Architect
                </p>
                <p className="text-xs text-slate-600 font-bold flex items-center justify-center gap-1 pt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  Academic Innovator
                </p>
              </div>

              {/* Social Buttons */}
              <div className="flex items-center gap-3 pt-5">
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-200 transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://github.com/Naman03-08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-900 border border-slate-300 transition-all shadow-sm"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="mailto:naman08mgs@gmail.com"
                  className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:text-white hover:bg-purple-600 border border-purple-200 transition-all shadow-sm"
                  title="Email Naman"
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Right: Bio Summary & Vision */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-md border border-purple-200">
                  Mission Statement
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "Reimagining How Students Learn, Code, and Secure Top Software Engineering Careers"
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Placivo AI was created by Naman Pandey out of a firsthand realization: engineering undergraduates spend more time managing chaotic tools, searching for reliable DSA roadmaps, and struggling with ATS resume formatting than actually acquiring skills.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                By synthesizing AI-driven document summarization, voice-simulated interviewers, curated 375 DSA problem sets, and habit tracking into a single unified Academic Operating System, Naman is empowering students to build consistency and excel in top-tier campus recruitment.
              </p>

              {/* Stat Counters (3 Cards - Removed 100% Free Access Goal) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/90">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-3.5 rounded-2xl bg-white border border-sky-200/80 shadow-2xs space-y-0.5"
                >
                  <p className="text-2xl font-black text-slate-900">100K+</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Students Target</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 shadow-2xs space-y-0.5"
                >
                  <p className="text-2xl font-black text-blue-600">375</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Curated DSA Problems</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-3.5 rounded-2xl bg-white border border-purple-200/80 shadow-2xs space-y-0.5"
                >
                  <p className="text-2xl font-black text-purple-600">15+</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Core Modules Built</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabbed Navigation with Animated Indicators */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('journey')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'journey' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>The Founder's Journey</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('tech')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tech' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Technical Architecture</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('modules')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'modules' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modules Built</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('contact')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect & Contact</span>
          </motion.button>
        </div>

        {/* Animated Tab Content Sections */}
        <AnimatePresence mode="wait">
          
          {/* Tab 1: Founder's Journey */}
          {activeTab === 'journey' && (
            <motion.div 
              key="journey"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-sky-200/80 shadow-md space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200">
                    Background & Motivation
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Solving College Fragmented Learning
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  During his college engineering years, Naman noticed that student success wasn't hindered by a lack of intelligence, but by overwhelming disorganization. Students were constantly juggling between YouTube playlists for DSA, Google Drives for notes, third-party ATS checkers, and manual attendance calculation spread across physical notebooks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/50 border border-sky-200/80 space-y-2 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">The Problem Identified</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Tool fatigue, paid paywalls for basic resume ATS checks, lack of personal accountability, and unorganized academic study materials.
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 space-y-2 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">The Solution Engineered</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Placivo AI—an all-in-one Academic Operating System with instant PDF summarization, DSA trackers, simulated voice interviewers, and habit analytics.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-white border border-sky-200 shadow-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">1. Laser Focus on Placements</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Providing curated 375 DSA problems, company-wise interview questions, ATS resume analysis, and cover letter generators.
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-white border border-purple-200 shadow-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">2. Instantaneous Assistance</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Powered by Google Gemini models for real-time document dissection, logical proofs, and algorithmic code debugging.
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">3. Habiturex Habit OS</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Ensuring daily student consistency through streak tracking, daily coding goals, and academic milestone rewards.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Technical Architecture */}
          {activeTab === 'tech' && (
            <motion.div 
              key="tech"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-md border border-purple-200">
                  Full-Stack Engineering
                </span>
                <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  How Naman Built Placivo AI
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Engineered from the ground up for extreme speed, real-time persistence, and responsive visual design.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 to-blue-50/50 border border-sky-200 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900">Frontend & Visual Canvas</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>React 18 + Vite:</strong> Fast component lifecycle and modular architecture.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Tailwind CSS v4:</strong> Custom light theme layout system with fluid typography.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Motion (framer-motion):</strong> Smooth spring layout physics and view transitions.</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/50 border border-purple-200 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <h4 className="text-sm font-bold text-slate-900">Backend & API Logic</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Google Gemini SDK:</strong> Server-proxied API routes for notes summarization, interview simulations, and resume evaluations.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Firebase Firestore:</strong> Cloud database sync for attendance, solved DSA, and user profiles.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Web Speech API:</strong> Audio synthesis for real-time voice-interactive interview simulations.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Modules Built */}
          {activeTab === 'modules' && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-sky-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold border border-sky-200">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">375 Curated DSA Sheet</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Structured problem roadmap with difficulty filters, topic breakdown, and hint generators.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-purple-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">ATS Resume Builder</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Automated resume scoring engine testing keyword density against tech job descriptions.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Habiturex Tracker</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Habit consistency logger tracking daily study streaks, gold credits, and attendance.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Mock Interviewer</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Real-time voice-interactive interview simulator evaluating technical articulation and confidence.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-rose-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold border border-rose-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Academic Notes Summarizer</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Upload dense academic PDFs to generate instant chapter bullet points and exam flashcards.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Academic Command Center</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Central dashboard providing study schedules, assignment trackers, and real-time attendance alerts.
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Tab 4: Connect & Direct Contact */}
          {activeTab === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200">
                  Direct Contact
                </span>
                <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Get in Touch with Naman Pandey
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Whether you want to discuss Placivo AI, explore technical collaborations, or seek career mentorship, feel free to connect directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LinkedIn */}
                <motion.a
                  whileHover={{ y: -4, scale: 1.02 }}
                  href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200 hover:border-blue-400 transition-all group space-y-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </h4>
                    <p className="text-xs text-blue-700 font-bold">in/naman-pandey</p>
                    <p className="text-[11px] text-slate-500 font-medium">Connect for career advice, mentorship, and updates.</p>
                  </div>
                </motion.a>

                {/* GitHub */}
                <motion.a
                  whileHover={{ y: -4, scale: 1.02 }}
                  href="https://github.com/Naman03-08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200 hover:border-slate-400 transition-all group space-y-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </h4>
                    <p className="text-xs text-slate-800 font-bold">github.com/Naman03-08</p>
                    <p className="text-[11px] text-slate-500 font-medium">Explore open source code repositories and projects.</p>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  whileHover={{ y: -4, scale: 1.02 }}
                  href="mailto:naman08mgs@gmail.com"
                  className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/60 border border-purple-200 hover:border-purple-400 transition-all group space-y-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>Email</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </h4>
                    <p className="text-xs text-purple-700 font-bold">naman08mgs@gmail.com</p>
                    <p className="text-[11px] text-slate-500 font-medium">Send direct inquiries, feedback, or collaboration proposals.</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Call to Action Banner (Light Theme with Animation) */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden border border-blue-400"
        >
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Experience Placivo AI?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Join thousands of engineering students utilizing Naman's Academic Operating System for structured DSA, ATS resume optimization, and high-performance study consistency.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {onLaunchApp ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLaunchApp}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Launch Workspace Now
                </motion.button>
              ) : onOpenAuth ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Create Free Student Account
                </motion.button>
              ) : null}
              <motion.a
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-blue-700/80 hover:bg-blue-800 text-white font-bold text-sm border border-blue-300/50 transition-all inline-flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-sky-200" />
                <span>Connect with Naman</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
};
