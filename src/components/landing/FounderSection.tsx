import React from 'react';
import { motion } from 'motion/react';
import { 
  Linkedin, 
  Github, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  UserCheck,
  Star,
  Rocket,
  ShieldCheck,
  Code2
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
      {/* Animated Background Light Blobs */}
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

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 relative z-10">
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
            Learn about the architect, mission, and technical journey driving Placivo AI.
          </p>

          <div className="relative w-20 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full mt-2 overflow-hidden">
            <motion.div 
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-white/80 rounded-full"
            />
          </div>
        </motion.div>

        {/* Stylish Founder Callout Card without picture */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border-2 border-sky-200/90 bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-xl bg-gradient-to-br from-white via-sky-50/40 to-indigo-50/30 text-center space-y-6"
        >
          {/* Animated Glowing Accent Border */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.01, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-md pointer-events-none"
          />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/90 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Naman Pandey
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Founder & Chief Architect
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              375 DSA Creator
            </span>
          </div>

          {/* Core Tagline */}
          <div className="relative z-10 space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Empowering Students Worldwide
            </h3>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Designed and engineered to unify college academics, AI study assistants, DSA roadmap preparation, and career placement tools into one seamless operating system.
            </p>
          </div>

          {/* Ultra Stylish "Know About the Founder" Button */}
          <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {onOpenFounderDetails && (
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenFounderDetails}
                className="relative group overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:shadow-indigo-400/40 transition-all cursor-pointer border border-blue-400"
              >
                {/* Shimmer Effect */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />

                <Code2 className="w-5 h-5 text-sky-200 group-hover:rotate-12 transition-transform duration-300" />
                <span className="tracking-wide">Know About the Founder</span>
                <ArrowRight className="w-5 h-5 text-sky-200 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>
            )}

            {(onLaunchApp || onOpenAuth) && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (onLaunchApp) onLaunchApp();
                  else if (onOpenAuth) onOpenAuth('login');
                }}
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white text-slate-800 hover:text-blue-700 hover:bg-blue-50/80 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-200/90 group"
              >
                <Rocket className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                <span>Launch App</span>
              </motion.button>
            )}
          </div>

          {/* Social Links Row */}
          <div className="relative z-10 pt-2 flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Connect:</span>
            <motion.a 
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com/in/naman-pandey-73802539a?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 border border-blue-200 transition-all shadow-2xs"
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
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-900 border border-slate-300 transition-all shadow-2xs"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:naman08mgs@gmail.com"
              className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:text-white hover:bg-purple-600 border border-purple-200 transition-all shadow-2xs"
              title="Email Naman"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


