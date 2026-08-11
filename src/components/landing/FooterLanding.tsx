import React from 'react';
import { Heart, ShieldCheck, FileText, Lock, RefreshCw, Mail, Headphones, GraduationCap } from 'lucide-react';
import placivoAILogo from './Placivo-logo.png';

interface FooterLandingProps {
  onOpenTerms?: (tab?: 'terms' | 'privacy' | 'cancellation') => void;
}

export const FooterLanding: React.FC<FooterLandingProps> = ({ onOpenTerms }) => {
  return (
    <footer className="bg-gradient-to-b from-purple-50/60 to-purple-100/80 text-slate-600 py-16 border-t border-purple-200/80">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-200/60">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src={placivoAILogo} 
                alt="Placivo AI" 
                className="h-9 w-auto max-h-9 object-contain rounded-2xl" 
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI Operating System for College Students. Empowering academic excellence and campus placements worldwide.
            </p>

            <div className="p-3 bg-white/80 rounded-2xl border border-purple-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs text-purple-900 font-extrabold">
                <Headphones className="w-3.5 h-3.5 text-purple-600" />
                <span>24/7 Official Support Contact</span>
              </div>
              <div className="space-y-1 text-xs">
                <a 
                  href="mailto:placivofficial@gmail.com" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">placivofficial@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Core Modules</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><a href="#features" className="hover:text-purple-600 transition-colors">AI Study Hub</a></li>
              <li><a href="#features" className="hover:text-purple-600 transition-colors">AI Academic Tutor</a></li>
              <li><a href="#features" className="hover:text-purple-600 transition-colors">Attendance Manager</a></li>
              <li><a href="#features" className="hover:text-purple-600 transition-colors">Smart Calendar</a></li>
              <li><a href="#features" className="hover:text-purple-600 transition-colors">DSA Coding Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Career & Placements</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><a href="#placement" className="hover:text-purple-600 transition-colors">ATS Resume Builder</a></li>
              <li><a href="#placement" className="hover:text-purple-600 transition-colors">Technical Interview Prep</a></li>
              <li><a href="#placement" className="hover:text-purple-600 transition-colors">LinkedIn Optimizer</a></li>
              <li><a href="#placement" className="hover:text-purple-600 transition-colors">Company Roadmaps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Security & Legal</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Protected by Firebase Auth, Firestore security rules, and server-side AI encryption.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => onOpenTerms?.('terms')}
                className="w-full flex items-center justify-between text-xs text-blue-700 bg-white/80 hover:bg-white px-3 py-2 rounded-xl border border-blue-200 font-bold transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Terms & Conditions
                </span>
                <span className="text-[10px] text-blue-500 font-normal group-hover:translate-x-0.5 transition-transform">Read →</span>
              </button>

              <button 
                onClick={() => onOpenTerms?.('privacy')}
                className="w-full flex items-center justify-between text-xs text-purple-700 bg-white/80 hover:bg-white px-3 py-2 rounded-xl border border-purple-200 font-bold transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  Privacy Policy
                </span>
                <span className="text-[10px] text-purple-500 font-normal group-hover:translate-x-0.5 transition-transform">Read →</span>
              </button>

              <button 
                onClick={() => onOpenTerms?.('cancellation')}
                className="w-full flex items-center justify-between text-xs text-emerald-700 bg-white/80 hover:bg-white px-3 py-2 rounded-xl border border-emerald-200 font-bold transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  Refund & Cancellation
                </span>
                <span className="text-[10px] text-emerald-500 font-normal group-hover:translate-x-0.5 transition-transform">Read →</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <p>© {new Date().getFullYear()} Placivo AI Inc. All rights reserved.</p>
            <button 
              onClick={() => onOpenTerms?.('terms')}
              className="text-slate-600 hover:text-blue-600 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => onOpenTerms?.('privacy')}
              className="text-slate-600 hover:text-purple-600 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onOpenTerms?.('cancellation')}
              className="text-slate-600 hover:text-emerald-600 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
          <p className="flex items-center gap-1 font-medium">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for students globally.
          </p>
        </div>
      </div>
    </footer>
  );
};

