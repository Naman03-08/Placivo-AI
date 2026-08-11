import React from 'react';
import { Zap, ArrowRight, BookOpen, Code, Award, Calendar, CheckSquare, Bot, GraduationCap } from 'lucide-react';
import placivoAILogo from '../landing/Placivo-logo.png';

interface NavbarProps {
  onNavigateLandingSection: (sectionId: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLaunchApp: () => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateLandingSection,
  onOpenAuth,
  onLaunchApp,
  isLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-slate-200/50 transition-all duration-300">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigateLandingSection('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src={placivoAILogo} 
            alt="Placivo AI" 
            className="h-10 w-auto max-h-10 object-contain rounded-2xl group-hover:scale-105 transition-all shrink-0" 
          />
          <div className="flex flex-col">
            <span className="font-black text-xl text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
              Placivo<span className="text-blue-600">.AI</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Academic Operating System
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <button onClick={() => onNavigateLandingSection('features')} className="hover:text-blue-600 transition-colors">Features</button>
          <button onClick={() => onNavigateLandingSection('sandboxes')} className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-indigo-600 font-bold">
            <Bot className="w-4 h-4 text-indigo-600" /> AI Sandboxes
          </button>
          <button onClick={() => onNavigateLandingSection('demo')} className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-600 font-bold">
            <Zap className="w-4 h-4 text-blue-600" /> Interactive AI Demo
          </button>
          <button onClick={() => onNavigateLandingSection('placement')} className="hover:text-blue-600 transition-colors">Placement</button>
          <button onClick={() => onNavigateLandingSection('why-us')} className="hover:text-blue-600 transition-colors">Why Placivo</button>
          <button onClick={() => onNavigateLandingSection('faq')} className="hover:text-blue-600 transition-colors">FAQ</button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={onLaunchApp}
              className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/40 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              Go to Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-2.5 bg-[#2563EB] text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/40 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
