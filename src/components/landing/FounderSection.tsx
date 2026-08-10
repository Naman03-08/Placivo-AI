import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  Sparkles, 
  Quote, 
  Award, 
  Heart, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  CheckCircle2 
} from 'lucide-react';

export const FounderSection: React.FC = () => {
  const [askText, setAskText] = useState('');
  const [replies, setReplies] = useState<{ q: string; a: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskFounder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askText.trim()) return;

    const query = askText.trim();
    setAskText('');
    setIsTyping(true);

    // Contextual responses from Founder's digital twin
    let response = "Thank you so much for reaching out! I'm dedicated to helping students achieve their absolute best. Let's connect on LinkedIn to talk more in-depth!";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('vision') || lowerQuery.includes('why') || lowerQuery.includes('start') || lowerQuery.includes('how')) {
      response = "I started Placivo AI to eliminate academic tool fatigue. Having all resources—from DSA sheets to notes summarizers and mock interviewers—in a single unified system saves precious study hours and maximizes college consistency.";
    } else if (lowerQuery.includes('placement') || lowerQuery.includes('job') || lowerQuery.includes('career') || lowerQuery.includes('interview')) {
      response = "For placements, my key advice is structured daily progress. Focus on solving 2 core DSA questions on our Roadmap, refining your ATS Resume score here, and running at least 1 mock technical interview daily.";
    } else if (lowerQuery.includes('dsa') || lowerQuery.includes('roadmap') || lowerQuery.includes('coding')) {
      response = "Our 375 DSA Sheet is mathematically structured. Solve topic by topic, check your consistency on Habiturex, and use our AI Assistant whenever you get stuck on a tricky algorithm!";
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('connect')) {
      response = "I'm always active on LinkedIn and love mentoring students. Feel free to shoot me a connection request or email me directly at naman03mgs@gmail.com!";
    }

    setTimeout(() => {
      setReplies(prev => [...prev, { q: query, a: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section 
      id="founder-section" 
      className="py-24 bg-gradient-to-b from-white/90 via-slate-50/50 to-white/90 border-t border-slate-200/60 relative overflow-hidden"
      aria-label="About the Founder"
    >
      {/* Decorative subtle background blobs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            The Mind Behind Placivo AI
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Know About Our Founder
          </h2>
          <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full mt-4" />
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            A vision to unify and elevate student learning, coding, and career placements into a single seamless academic experience.
          </p>
        </div>

        {/* Founder Bio Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Side: Photo Frame / Interactive Portal */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-md">
              {/* Animated decorative gradient ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 via-slate-600 to-purple-500 opacity-20 blur-lg group-hover:opacity-30 transition duration-700" />
              
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-4 shadow-xl">
                {/* Custom geometric styled avatar placeholder / logo representation */}
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-850 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  
                  {/* Subtle vector grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
                  
                  <div className="z-10 text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-slate-800/80 border-2 border-white/10 mx-auto flex items-center justify-center shadow-inner overflow-hidden">
                      {/* Interactive stylized initials with beautiful radial blur */}
                      <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-slate-200 to-purple-300">
                        NP
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Naman Pandey
                      </h3>
                      <p className="text-xs font-black tracking-widest text-blue-400 uppercase">
                        Founder & Chief Architect
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                      "Building highly cohesive, high-performance academic workspaces for the future of technical education."
                    </p>
                    
                    {/* Social Quick Links */}
                    <div className="flex items-center justify-center gap-3 pt-3">
                      <a 
                        href="https://www.linkedin.com/in/naman03mgs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 border border-slate-700/60 transition-all shadow-sm"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a 
                        href="https://github.com/Naman03-08" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-950 border border-slate-700/60 transition-all shadow-sm"
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a 
                        href="mailto:naman03mgs@gmail.com"
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-purple-600 border border-slate-700/60 transition-all shadow-sm"
                        title="Email Naman"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Interactive Founder AI Widget */}
            <div className="w-full max-w-md mt-6 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md p-5 shadow-xs">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Ask Naman's AI Copilot
              </h4>
              
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto scrollbar-thin text-xs">
                {replies.length === 0 ? (
                  <p className="text-slate-500 font-medium italic">
                    Type a question below to ask Naman about Placivo AI, placement tips, or his tech vision!
                  </p>
                ) : (
                  replies.map((r, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-end">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold max-w-[85%] text-right">
                          {r.q}
                        </span>
                      </div>
                      <div className="flex justify-start">
                        <span className="bg-blue-50 text-blue-900 px-2.5 py-1.5 rounded-lg font-medium max-w-[85%] leading-relaxed">
                          {r.a}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg font-medium animate-pulse">
                      Naman is typing...
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAskFounder} className="flex gap-2">
                <input 
                  type="text" 
                  value={askText}
                  onChange={(e) => setAskText(e.target.value)}
                  placeholder="Ask about my vision, placement advice..." 
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-all font-semibold"
                />
                <button 
                  type="submit"
                  className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Philosophy & Mission Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Our Story
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Unifying the Undergraduate Experience
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Every year, millions of undergraduate students struggle through disjointed tools: saving bookmarks for placement roadmaps, checking attendance manually on crude sheets, getting overwhelmed by 200-page academic PDFs, and relying on static documents to format resumes.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-900">Naman Pandey</strong> designed <strong className="text-slate-900">Placivo AI</strong> to completely centralize this journey. By pairing beautiful visual design with persistent database synchronization, Placivo AI gives students a command center to master their academics and ace high-tier campus hiring with pure confidence.
              </p>
            </div>

            {/* Core Values Rows */}
            <div className="space-y-4">
              {/* Row 1: Democratic Prep */}
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-3xs hover:border-slate-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Democratizing Technology Placement Preparation
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Placivo removes the paywall on premium technical interview prep, giving tier-3 and premier college students alike immediate, free access to top-tier ATS Resume checkers, real-time simulated AI voice interviews, and curated DSA roadmap tools.
                  </p>
                </div>
              </div>

              {/* Row 2: Zero-Lag Efficiency */}
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-3xs hover:border-slate-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Precision Academic Cognitive Engines
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Our AI models generate instantaneous PDF summarization, question banks, and custom mock exams. By integrating Gemini API logic directly, we maintain extreme reliability without sacrificing fast response times.
                  </p>
                </div>
              </div>

              {/* Row 3: Absolute Student Consistency */}
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-3xs hover:border-slate-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Consistency Backed by Habiturex OS
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    We believe the key to success is accountability. Through streak logs, interactive mission boards, and our gold credits system, students form lifelong technical habits that naturally translate into real-world achievements.
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Blockquote */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-[0.05] pointer-events-none">
                <Quote className="w-48 h-48" />
              </div>
              <div className="space-y-4 relative z-10">
                <p className="text-sm sm:text-base font-medium italic leading-relaxed text-slate-200">
                  "As student software engineers, the barrier is rarely intellectual capability—it's execution and focus. Placivo AI acts as your tireless co-pilot, handling the tedious task of organization, preparation, and planning, so you can focus entirely on creating incredible technology."
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-blue-400">
                    NP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Naman Pandey</p>
                    <p className="text-[10px] font-medium text-slate-400">Founder, Placivo AI</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
