import React, { useState } from 'react';
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
  ExternalLink
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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans relative selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer group border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Main Page</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 hidden sm:inline">
              Founder Profile & Details
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/naman03mgs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200/60"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            {onLaunchApp && (
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5 text-blue-100" />
                <span>Launch App</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Founder Hero Card (Light Theme) */}
        <div className="relative rounded-3xl bg-white text-slate-900 p-6 sm:p-10 lg:p-12 overflow-hidden border border-slate-200 shadow-xl bg-gradient-to-br from-blue-50/50 via-white to-purple-50/40">
          {/* Decorative light glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Avatar & Badges */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 opacity-30 blur-md group-hover:opacity-60 transition duration-500" />
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center overflow-hidden shadow-xl">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600">
                    NP
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Founder
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 pt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Naman Pandey
                </h1>
                <p className="text-xs font-black text-blue-600 tracking-wider uppercase">
                  Founder & Lead System Architect
                </p>
                <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1 pt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Zenith School of AI / Academic Innovator
                </p>
              </div>

              {/* Social Buttons */}
              <div className="flex items-center gap-3 pt-5">
                <a
                  href="https://www.linkedin.com/in/naman03mgs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 transition-all shadow-2xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Naman03-08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 transition-all shadow-2xs"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:naman03mgs@gmail.com"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white border border-slate-200 transition-all shadow-2xs"
                  title="Email Naman"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Bio Summary & Vision */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/80">
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

              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-slate-900">100K+</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Students Target</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-blue-600">375</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Curated DSA Problems</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-purple-600">15+</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Core Modules</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-emerald-600">100%</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Free Access Goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('journey')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'journey' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>The Founder's Journey</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tech' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Technical Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'modules' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modules Built</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect & Contact</span>
          </button>
        </div>

        {/* Tab 1: Founder's Journey */}
        {activeTab === 'journey' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
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
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">The Problem Identified</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tool fatigue, paid paywalls for basic resume ATS checks, lack of personal accountability, and unorganized academic study materials.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">The Solution Engineered</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Placivo AI—an all-in-one Academic Operating System with instant PDF summarization, DSA trackers, simulated voice interviewers, and habit analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">1. Laser Focus on Placements</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Providing curated 375 DSA problems, company-wise interview questions, ATS resume analysis, and cover letter generators.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">2. Instantaneous Assistance</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Powered by Google Gemini models for real-time document dissection, logical proofs, and algorithmic code debugging.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">3. Habiturex Habit OS</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Ensuring daily student consistency through streak tracking, daily coding goals, and academic milestone rewards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Technical Architecture */}
        {activeTab === 'tech' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
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
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Frontend & Visual Canvas</h4>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
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
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-bold text-slate-900">Backend & API Logic</h4>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
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
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Modules Built */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">375 Curated DSA Sheet</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured problem roadmap with difficulty filters, topic breakdown, and hint generators.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">ATS Resume Builder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated resume scoring engine testing keyword density against tech job descriptions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Habiturex Tracker</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Habit consistency logger tracking daily study streaks, gold credits, and attendance.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Mock Interviewer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time voice-interactive interview simulator evaluating technical articulation and confidence.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Academic Notes Summarizer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload dense academic PDFs to generate instant chapter bullet points and exam flashcards.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Academic Command Center</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Central dashboard providing study schedules, assignment trackers, and real-time attendance alerts.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Connect & Direct Contact */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
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
              <a
                href="https://www.linkedin.com/in/naman03mgs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">in/naman03mgs</p>
                  <p className="text-[11px] text-slate-500">Connect for career advice, mentorship, and updates.</p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Naman03-08"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100/60 transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold">
                  <Github className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">github.com/Naman03-08</p>
                  <p className="text-[11px] text-slate-500">Explore open source code repositories and projects.</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:naman03mgs@gmail.com"
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>Email</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">naman03mgs@gmail.com</p>
                  <p className="text-[11px] text-slate-500">Send direct inquiries, feedback, or collaboration proposals.</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Footer Call to Action Banner (Light Theme) */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden border border-blue-500">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Experience Placivo AI?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Join thousands of engineering students utilizing Naman's Academic Operating System for structured DSA, ATS resume optimization, and high-performance study consistency.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {onLaunchApp ? (
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Launch Workspace Now
                </button>
              ) : onOpenAuth ? (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Create Free Student Account
                </button>
              ) : null}
              <a
                href="https://www.linkedin.com/in/naman03mgs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-blue-700/80 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/50 transition-all inline-flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-blue-200" />
                <span>Connect with Naman</span>
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
