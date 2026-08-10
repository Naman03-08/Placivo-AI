import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Send, 
  UserCheck, 
  Target, 
  Zap, 
  Flame, 
  Globe, 
  Bot, 
  FileText, 
  Layers, 
  Rocket, 
  Quote,
  GraduationCap
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
  const [askText, setAskText] = useState('');
  const [replies, setReplies] = useState<{ q: string; a: string; time: string }[]>([
    {
      q: "What inspired you to build Placivo AI?",
      a: "As an engineering student, I observed how scattered college preparation was—students kept 15 different tabs open for DSA, resume formatting, attendance tracking, and study notes. I created Placivo AI to synthesize all of these into one intelligent, unified workspace.",
      time: "Just now"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskFounder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askText.trim()) return;

    const query = askText.trim();
    setAskText('');
    setIsTyping(true);

    let response = "Thank you for asking! I'm passionate about building tech that truly simplifies student lives. Feel free to connect with me directly on LinkedIn or via email at naman03mgs@gmail.com!";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('vision') || lowerQuery.includes('why') || lowerQuery.includes('goal') || lowerQuery.includes('future')) {
      response = "My vision for Placivo AI is to make elite technical career preparation completely accessible to every student worldwide, regardless of their college tier or background.";
    } else if (lowerQuery.includes('stack') || lowerQuery.includes('build') || lowerQuery.includes('tech') || lowerQuery.includes('how')) {
      response = "Placivo AI is built with React 18, TypeScript, Tailwind CSS, Google Gemini 1.5/2.0 API models, and Firebase Firestore for persistent cloud data synchronization.";
    } else if (lowerQuery.includes('dsa') || lowerQuery.includes('sheet') || lowerQuery.includes('coding')) {
      response = "Our 375 DSA Sheet is mathematically structured across core topics (Arrays, Trees, Graphs, DP). Each problem includes instant AI hint generation to help you learn without getting stuck.";
    } else if (lowerQuery.includes('resume') || lowerQuery.includes('ats')) {
      response = "Our ATS Resume Builder tests your resume against real tech industry recruiter keywords and gives actionable suggestions to maximize your interview callback rate.";
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('linkedin')) {
      response = "You can reach out to me directly on LinkedIn (in/naman03mgs) or send an email to naman03mgs@gmail.com!";
    }

    setTimeout(() => {
      setReplies(prev => [
        ...prev, 
        { q: query, a: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative selection:bg-purple-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Main Page</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 hidden sm:inline">
              Founder Profile & Vision
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/naman03mgs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            {onLaunchApp && (
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5 text-blue-400" />
                <span>Launch App</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
        
        {/* Founder Hero Card */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden border border-slate-800 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-800/30 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Avatar & Quick Badges */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 opacity-40 blur-md group-hover:opacity-75 transition duration-500" />
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 via-slate-100 to-purple-300">
                    NP
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                  <UserCheck className="w-3.5 h-3.5" />
                  Verified Founder
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white pt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Naman Pandey
                </h1>
                <p className="text-xs font-bold text-blue-400 tracking-wider uppercase">
                  Founder & Lead System Architect
                </p>
                <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1 pt-1">
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
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Naman03-08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all shadow-sm"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:naman03mgs@gmail.com"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-800 transition-all shadow-sm"
                  title="Email Naman"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Bio Summary & Vision */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800/50">
                  Mission Statement
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "Reimagining How Students Learn, Code, and Secure Top Software Engineering Careers"
                </h2>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Placivo AI was created by Naman Pandey out of a firsthand realization: engineering undergraduates spend more time managing chaotic tools, searching for reliable DSA roadmaps, and struggling with ATS resume formatting than actually acquiring skills.
              </p>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                By synthesizing AI-driven document summarization, voice-simulated interviewers, curated 375 DSA problem sets, and habit tracking into a single unified Academic Operating System, Naman is empowering students to build consistency and excel in top-tier campus recruitment.
              </p>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-white">100K+</p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Students Target</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-blue-400">375</p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Curated DSA Problems</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-purple-400">15+</p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Core AI Modules</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Free Access Goal</p>
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
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>The Founder's Journey</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tech' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Technical Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'modules' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modules Built</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Ask Naman's Copilot</span>
          </button>
        </div>

        {/* Tab 1: Founder's Journey */}
        {activeTab === 'journey' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
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
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">1. Laser Focus on Placements</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Providing curated 375 DSA problems, company-wise interview questions, ATS resume analysis, and cover letter generators.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">2. Instantaneous AI Assistance</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Powered by Google Gemini models for real-time document dissection, logical proofs, and algorithmic code debugging.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                Full-Stack Engineering
              </span>
              <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                How Naman Built Placivo AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Engineered from the ground up for extreme speed, real-time persistence, and responsive 3D WebGL visuals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Frontend & Visual Canvas</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>React 18 + Vite:</strong> Ultra-fast component lifecycle and modern JSX.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Tailwind CSS v4:</strong> Custom high-contrast layout system with typography scaling.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Motion (framer-motion):</strong> Smooth spring layout physics and modal transitions.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-bold text-slate-900">Backend & AI Integration</h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Google Gemini SDK:</strong> Server-proxied AI routes for notes, interview simulations, and resume evaluations.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Firebase Firestore:</strong> Cloud database sync for attendance, solved DSA, and user profiles.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Web Speech API:</strong> Audio synthesis for real-time AI mock interviewer voice responses.</span>
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
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Personal AI Assistant</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous academic tutor for logical proofs, code synchronization, and syllabus dissection.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">375 Curated DSA Sheet</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured problem roadmap with difficulty filters, topic breakdown, and hint generators.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">ATS Resume Builder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated resume scoring engine testing keyword density against tech job descriptions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Habiturex Tracker</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Habit consistency logger tracking daily study streaks, gold credits, and attendance.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Mock Interviewer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time voice-interactive interview simulator evaluating technical articulation and confidence.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">AI Notes Summarizer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload dense academic PDFs to generate instant chapter bullet points and exam flashcards.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Copilot */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ask Naman's AI Twin
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Got questions about Placivo AI, placement strategy, or technical collaboration? Ask below!
              </p>
            </div>

            {/* Chat Feed */}
            <div className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              {replies.map((r, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl max-w-[80%] font-medium">
                      {r.q}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-blue-50 text-blue-950 border border-blue-100 px-3.5 py-2.5 rounded-xl max-w-[85%] leading-relaxed font-medium">
                      <div className="flex items-center justify-between gap-2 mb-1 border-b border-blue-200/50 pb-1">
                        <span className="font-bold text-[11px] text-blue-700">Naman Pandey (Digital Twin)</span>
                        <span className="text-[10px] text-blue-400">{r.time}</span>
                      </div>
                      {r.a}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold animate-pulse">
                    Naman is typing response...
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleAskFounder} className="flex gap-2">
              <input
                type="text"
                value={askText}
                onChange={(e) => setAskText(e.target.value)}
                placeholder="Ask about placement advice, tech stack, or vision..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-semibold"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Footer Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Experience Placivo AI?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Join thousands of engineering students utilizing Naman's Academic Operating System for structured DSA, ATS resume optimization, and high-performance study consistency.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {onLaunchApp ? (
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  Launch Workspace Now
                </button>
              ) : onOpenAuth ? (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  Create Free Student Account
                </button>
              ) : null}
              <a
                href="https://www.linkedin.com/in/naman03mgs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all inline-flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>Connect with Naman</span>
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
