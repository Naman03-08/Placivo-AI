import React from 'react';
import { motion } from 'motion/react';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles, 
  Quote, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  UserCheck,
  Star,
  Zap,
  BookOpen,
  Compass,
  HeartHandshake
} from 'lucide-react';

interface FounderSectionProps {
  onOpenFounderDetails?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onOpenFounderDetails }) => {
  return (
    <section 
      id="founder-section" 
      className="py-24 bg-gradient-to-b from-sky-50/60 via-indigo-50/30 to-white border-t border-sky-100 relative overflow-hidden"
      aria-label="About the Founder"
    >
      {/* Animated 2D Background Light Blobs */}
      <motion.div 
        animate={{ 
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-12 left-10 w-96 h-96 bg-gradient-to-br from-sky-200/50 to-indigo-200/40 rounded-full blur-3xl pointer-events-none"
      />
      
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
          rotate: [0, -12, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-gradient-to-tl from-purple-200/40 via-pink-200/30 to-blue-200/40 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating 2D Decorative Shapes */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: 360 }}
        transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 20, ease: "linear" } }}
        className="absolute top-20 right-1/4 w-12 h-12 border-2 border-dashed border-sky-300 rounded-2xl pointer-events-none opacity-60 hidden md:block"
      />
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: -360 }}
        transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 25, ease: "linear" } }}
        className="absolute bottom-24 left-1/5 w-10 h-10 border-2 border-indigo-300/80 rounded-full pointer-events-none opacity-60 hidden md:block"
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200/90 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            The Visionary Behind Placivo AI
          </motion.span>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Know About Our Founder
          </h2>

          <div className="relative w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full mt-4 overflow-hidden">
            <motion.div 
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-white/80 rounded-full"
            />
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            Empowering students worldwide by unifying coding, academic preparation, and career growth into one high-performance operating system.
          </p>

          {onOpenFounderDetails && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pt-4 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenFounderDetails}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:shadow-blue-300/50 transition-all cursor-pointer group border border-blue-400"
              >
                <UserCheck className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
                <span>Know Full Details About Founder</span>
                <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Founder Bio Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          
          {/* Left Side: Animated Interactive Photo Frame Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group w-full max-w-md"
            >
              {/* Animated Light Pastel Gradient Border Glow */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.03, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-sky-400 via-indigo-300 via-purple-300 to-pink-300 blur-lg"
              />
              
              <div className="relative rounded-3xl overflow-hidden border-2 border-sky-200/90 bg-white p-6 shadow-2xl">
                
                {/* Floating 2D Badge 1 */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-3 right-3 z-20 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
                >
                  <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>Chief Architect</span>
                </motion.div>

                {/* Floating 2D Badge 2 */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 left-3 z-20 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>375 DSA Creator</span>
                </motion.div>

                {/* Light Gradient Styled Avatar Block */}
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-sky-100 via-indigo-50/80 to-purple-100 border border-indigo-100 flex flex-col items-center justify-center p-8 relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500">
                  
                  {/* Subtle moving grid background */}
                  <motion.div 
                    animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" 
                  />

                  {/* Pulsing Central Ring */}
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1], rotate: 360 }}
                    transition={{ scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 30, ease: "linear" } }}
                    className="absolute w-40 h-40 rounded-full border-2 border-dashed border-indigo-300 pointer-events-none"
                  />
                  
                  <div className="z-10 text-center space-y-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-28 h-28 rounded-full bg-white border-4 border-sky-300 mx-auto flex items-center justify-center shadow-lg overflow-hidden relative cursor-pointer"
                    >
                      <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        NP
                      </span>
                    </motion.div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Naman Pandey
                      </h3>
                      <p className="text-xs font-black tracking-widest text-blue-600 uppercase">
                        Founder & Chief Architect
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-xs mx-auto">
                      "Building highly cohesive, high-performance academic workspaces for the future of technical education."
                    </p>
                    
                    {/* Social Quick Links */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <motion.a 
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://www.linkedin.com/in/naman03mgs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-200 transition-all shadow-sm"
                        title="LinkedIn Profile"
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
                        title="GitHub Profile"
                      >
                        <Github className="w-4 h-4" />
                      </motion.a>
                      <motion.a 
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        href="mailto:naman03mgs@gmail.com"
                        className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:text-white hover:bg-purple-600 border border-purple-200 transition-all shadow-sm"
                        title="Email Naman"
                      >
                        <Mail className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Animated Story & Mission Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-md border border-blue-200">
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

            {/* Core Values Rows with Animated Cards */}
            <div className="space-y-3.5">
              {/* Row 1 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex gap-4 p-4.5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50/40 border border-sky-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200 shadow-2xs">
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
              </motion.div>

              {/* Row 2 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex gap-4 p-4.5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-pink-50/40 border border-purple-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Precision Academic Cognitive Engines
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Instantaneous PDF summarization, question banks, and custom mock exams. By integrating Gemini API logic directly, we maintain extreme reliability without sacrificing response times.
                  </p>
                </div>
              </motion.div>

              {/* Row 3 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex gap-4 p-4.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-teal-50/40 border border-emerald-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
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
              </motion.div>
            </div>

            {/* Founder Blockquote (Light Theme with Shimmer Bar) */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-100/70 via-sky-50 to-indigo-100/60 text-slate-800 border-2 border-sky-200 shadow-md overflow-hidden"
            >
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-15 pointer-events-none text-blue-600">
                <Quote className="w-40 h-40" />
              </div>
              <div className="space-y-3 relative z-10">
                <p className="text-sm sm:text-base font-semibold italic leading-relaxed text-slate-800">
                  "As student software engineers, the barrier is rarely intellectual capability—it's execution and focus. Placivo AI acts as your tireless co-pilot, handling the tedious task of organization, preparation, and planning, so you can focus entirely on creating incredible technology."
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                    NP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Naman Pandey</p>
                    <p className="text-[10px] font-bold text-blue-700">Founder, Placivo AI</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>

        {onOpenFounderDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenFounderDetails}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:shadow-blue-300/60 transition-all cursor-pointer border border-blue-400 group"
            >
              <UserCheck className="w-5 h-5 text-sky-200 group-hover:rotate-12 transition-transform" />
              <span>Know Full Details About Founder</span>
              <ArrowRight className="w-5 h-5 text-sky-200 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
