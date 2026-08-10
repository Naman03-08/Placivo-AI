import React from 'react';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles, 
  Quote, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface FounderSectionProps {
  onOpenFounderDetails?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenFounderDetails }) => {
  return (
    <section 
      id="founder-section" 
      className="py-24 bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-200/60 relative overflow-hidden"
      aria-label="About the Founder"
    >
      {/* Subtle light background glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            The Mind Behind Placivo AI
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Know About Our Founder
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mt-4" />
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            A vision to unify and elevate student learning, coding, and career placements into a single seamless academic experience.
          </p>

          {onOpenFounderDetails && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={onOpenFounderDetails}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group border border-blue-500"
              >
                <UserCheck className="w-4 h-4 text-blue-100 group-hover:rotate-12 transition-transform" />
                <span>Know Full Details About Founder</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Founder Bio Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          
          {/* Left Side: Photo Frame Card (Light Theme) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-md">
              {/* Subtle light gradient ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 opacity-30 blur-lg group-hover:opacity-50 transition duration-500" />
              
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-6 shadow-xl">
                {/* Light gradient styled avatar block */}
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-blue-50 via-slate-50 to-purple-50 border border-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
                  
                  <div className="z-10 text-center space-y-4">
                    <div className="w-28 h-28 rounded-full bg-white border-2 border-blue-200/80 mx-auto flex items-center justify-center shadow-md overflow-hidden">
                      <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        NP
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Naman Pandey
                      </h3>
                      <p className="text-xs font-black tracking-widest text-blue-600 uppercase">
                        Founder & Chief Architect
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
                      "Building highly cohesive, high-performance academic workspaces for the future of technical education."
                    </p>
                    
                    {/* Social Quick Links */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <a 
                        href="https://www.linkedin.com/in/naman03mgs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-white hover:bg-blue-600 border border-slate-200 transition-all shadow-2xs"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a 
                        href="https://github.com/Naman03-08" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-white hover:bg-slate-900 border border-slate-200 transition-all shadow-2xs"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a 
                        href="mailto:naman03mgs@gmail.com"
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-white hover:bg-purple-600 border border-slate-200 transition-all shadow-2xs"
                        title="Email Naman"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Philosophy & Mission Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                Our Story
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Unifying the Undergraduate Experience
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Every year, millions of undergraduate students struggle through disjointed tools: saving bookmarks for placement roadmaps, checking attendance manually on crude sheets, getting overwhelmed by 200-page academic PDFs, and relying on static documents to format resumes.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-900">Naman Pandey</strong> designed <strong className="text-blue-700">Placivo AI</strong> to completely centralize this journey. By pairing intuitive visual design with persistent database synchronization, Placivo AI gives students a command center to master their academics and ace high-tier campus hiring with pure confidence.
              </p>
            </div>

            {/* Core Values Rows */}
            <div className="space-y-3">
              {/* Row 1: Democratic Prep */}
              <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Democratizing Technology Placement Preparation
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Placivo removes the paywall on premium technical interview prep, giving students immediate, free access to top-tier ATS Resume checkers, real-time simulated AI voice interviews, and curated DSA roadmap tools.
                  </p>
                </div>
              </div>

              {/* Row 2: Precision Cognitive Engines */}
              <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-purple-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Precision Academic Cognitive Engines
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Instantaneous PDF summarization, question banks, and custom mock exams. By integrating Gemini API logic directly, we maintain extreme reliability without sacrificing response times.
                  </p>
                </div>
              </div>

              {/* Row 3: Absolute Student Consistency */}
              <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Consistency Backed by Habiturex OS
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Accountability through streak logs, interactive mission boards, and our gold credits system, helping students form lifelong technical habits.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Blockquote (Light Theme) */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-purple-50/50 text-slate-800 border border-blue-100 shadow-md overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10 pointer-events-none text-blue-600">
                <Quote className="w-40 h-40" />
              </div>
              <div className="space-y-3 relative z-10">
                <p className="text-sm sm:text-base font-medium italic leading-relaxed text-slate-700">
                  "As student software engineers, the barrier is rarely intellectual capability—it's execution and focus. Placivo AI acts as your tireless co-pilot, handling the tedious task of organization, preparation, and planning, so you can focus entirely on creating incredible technology."
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-700">
                    NP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Naman Pandey</p>
                    <p className="text-[10px] font-semibold text-slate-500">Founder, Placivo AI</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {onOpenFounderDetails && (
          <div className="text-center pt-2">
            <button
              onClick={onOpenFounderDetails}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-500 group"
            >
              <UserCheck className="w-5 h-5 text-blue-100 group-hover:rotate-12 transition-transform" />
              <span>Know Full Details About Founder</span>
              <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
