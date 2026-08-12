import React from 'react';
import { motion } from 'motion/react';
import namanImg from '../../assets/Naman.jpeg';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles, 
  Quote, 
  ArrowRight, 
  UserCheck,
  Star,
  Rocket
} from 'lucide-react';

interface FounderSectionProps {
  onOpenFounderDetails?: () => void;
  onLaunchApp?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ 
  onOpenFounderDetails,
  onLaunchApp,
  onOpenAuth
}) => {
  return (
    <section 
      id="founder-section" 
      className="py-20 bg-gradient-to-b from-sky-50/60 via-indigo-50/30 to-white border-t border-sky-100 relative overflow-hidden"
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

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-3"
        >
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200/90 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            The Visionary Behind Placivo AI
          </motion.span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Meet Our Founder
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Discover the story, mission, and technical journey driving Placivo AI.
          </p>

          <div className="relative w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full mt-2 overflow-hidden">
            <motion.div 
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-white/80 rounded-full"
            />
          </div>
        </motion.div>

        {/* Compact Teaser Card */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border-2 border-sky-200/90 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Founder Photo & Name */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative group mb-3">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.04, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 blur-md"
                />
                
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 aspect-square rounded-full bg-gradient-to-b from-sky-100 via-slate-50 to-indigo-100 border-4 border-sky-300 flex items-center justify-center overflow-hidden shadow-xl p-1.5">
                  <img 
                    src={namanImg} 
                    alt="Naman Pandey - Founder & Chief Architect" 
                    className="w-full h-full object-contain object-center rounded-full group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                  />
                </div>

                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap"
                >
                  <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>Chief Architect</span>
                </motion.div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Naman Pandey
              </h3>
              <p className="text-xs font-black tracking-widest text-blue-600 uppercase">
                Founder & Chief Architect
              </p>

              {/* Social Quick Links */}
              <div className="flex items-center justify-center gap-2.5 pt-3">
                <motion.a 
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-200 transition-all shadow-2xs"
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
                  className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-900 border border-slate-300 transition-all shadow-2xs"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href="mailto:naman08mgs@gmail.com"
                  className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:text-white hover:bg-purple-600 border border-purple-200 transition-all shadow-2xs"
                  title="Email Naman"
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Right Column: Brief Intro & Action Button */}
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Founder
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Building the Future of Undergraduate Education
                </h4>
              </div>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Naman Pandey designed Placivo AI to unify fragmented student tools—combining AI notes summarization, 375 curated DSA problems, voice interview preparation, and habit tracking into one central operating system.
              </p>

              {/* Quote Excerpt */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/80 text-slate-800 text-xs sm:text-sm font-semibold italic">
                <Quote className="w-5 h-5 text-blue-500/30 absolute top-2 right-2 pointer-events-none" />
                "As student software engineers, the barrier is rarely intellectual capability—it's execution and focus. Placivo AI acts as your co-pilot so you can focus on building incredible tech."
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3.5">
                {onOpenFounderDetails && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenFounderDetails}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl hover:shadow-blue-300/50 transition-all cursor-pointer border border-blue-400 group"
                  >
                    <UserCheck className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
                    <span>Know About the Founder</span>
                    <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                )}

                {(onLaunchApp || onOpenAuth) && (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (onLaunchApp) onLaunchApp();
                      else if (onOpenAuth) onOpenAuth('login');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200/90 group"
                  >
                    <Rocket className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                    <span>Launch App</span>
                  </motion.button>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

