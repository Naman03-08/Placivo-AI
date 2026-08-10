import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Bot, 
  Users, 
  Building2, 
  Landmark, 
  FileText, 
  Star,
  Zap 
} from 'lucide-react';
import heroStudentsArt from '../../assets/images/campusos_blue_hoodies_art_1785350059169.jpg';
import placivoAILogo from './placivoAI.png';
import aiLogoImg from '../../assets/AILogo.svg';
import { ProfessionalWorkspaceScene } from './ProfessionalWorkspaceScene';

interface HeroProps {
  onOpenAuth: (mode: 'register') => void;
  onExploreDemo: () => void;
}

const LipSyncMouth: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  const [mouthState, setMouthState] = useState(0);

  React.useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const interval = setInterval(() => {
      setMouthState(Math.floor(Math.random() * 4));
    }, 110);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  if (!isSpeaking) {
    return (
      <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="transition-all duration-300">
        {/* Clear subtle smile outline */}
        <path d="M3 4 C6 7, 12 7, 15 4" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Generate talking paths
  let dPath = "M3 4 C6 7, 12 7, 15 4";
  let fill = "none";
  if (mouthState === 1) {
    dPath = "M3 4 C5 8, 13 8, 15 4 C13 5, 5 5, 3 4"; // slight open
    fill = "#EF4444";
  } else if (mouthState === 2) {
    dPath = "M2 4 C4 11, 14 11, 16 4 C13 6, 5 6, 2 4"; // wide open
    fill = "#DC2626";
  } else if (mouthState === 3) {
    dPath = "M5 4 C6 10, 12 10, 13 4 C12 5, 6 5, 5 4"; // tall rounded shape
    fill = "#B91C1C";
  }

  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" className="transition-all duration-100">
      <path d={dPath} fill={fill} stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {(mouthState === 2 || mouthState === 3) && (
        <path d="M6 5.5 Q 9 6.5 12 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      )}
    </svg>
  );
};

export const Hero: React.FC<HeroProps> = ({ onOpenAuth, onExploreDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Silent visual conversation between the boy (Naman) and girl (Riya) characters
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const dialogues = [
    // 0. AI Notes (Top Left)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "Look over there on the top left! The AI Notes Summarizer reads heavy PDFs in seconds! 👈",
      action: 'point_left_up'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "Yes! It generates detailed summaries, interactive flashcards, and quick-quiz sheets automatically! ✨",
      action: 'explain'
    },
    // 1. Courses (Top Right)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "And up on the top right, check out the Courses hub! It has step-by-step guidance! 👉",
      action: 'point_right_up'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "It covers full DSA roadmaps, code notebooks, and grants verified completion certificates! 🎓",
      action: 'explain'
    },
    // 2. Placements (Middle Left)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "On our left, the Placement Hub is packed with startup jobs and resume builders! 👈",
      action: 'point_left_mid'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "The ATS resume builder is amazing! It validates single-column resumes for modern HR criteria! 💼",
      action: 'explain'
    },
    // 3. Planner (Middle Right)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "Look at the Academic Planner on our right! It keeps messy student routines sorted! 👉",
      action: 'point_right_mid'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "It manages class timetables, tracks upcoming exams, and logs daily task priorities! 📅",
      action: 'explain'
    },
    // 4. AI Assistant (Bottom Left)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "And down on the bottom left, our AI Assistant is online 24/7 to solve coding doubts! 👈",
      action: 'point_left_down'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "He is a super smart study buddy. Ask him any question and get instant visual flowcharts! 🤖",
      action: 'explain'
    },
    // 5. Community (Bottom Right)
    { 
      speaker: 'boy', 
      name: 'Naman', 
      text: "Finally, the Community badge on the bottom right connects peers across colleges! 👉",
      action: 'point_right_down'
    },
    { 
      speaker: 'girl', 
      name: 'Riya', 
      text: "We can share lecture notes, discuss interview questions, and collaborate on cool code! 👥",
      action: 'explain'
    }
  ];

  // The active highlight index is mathematically coupled to the current dialogue step
  const activeHighlightIndex = Math.floor(dialogueIndex / 2);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % dialogues.length);
    }, 5000); // Switch dialogue and section every 5 seconds for clear reading pacing
    return () => clearInterval(interval);
  }, [dialogues.length]);

  // Automatic gentle floating/orbiting animation (simulates continuous video-like live motion, no hover required)
  React.useEffect(() => {
    let frameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      // Dual-harmonic sinusoidal waves for highly natural continuous 3D orbiting
      const x = Math.sin(elapsed * 0.7) * 0.6;
      const y = Math.cos(elapsed * 0.5) * 0.5;
      setCoords({ x, y });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const trendingTags = ['Generative AI', 'AI/ML', 'DSA', 'Python', 'App Dev'];

  return (
    <section className="relative pt-4 pb-12 md:pt-6 md:pb-14 overflow-x-clip bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50">
      {/* Soft Ambient Background Orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-[550px] h-[550px] bg-blue-100/50 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Subtle Blueprint Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2563eb 1px, transparent 1px),
            linear-gradient(to bottom, #2563eb 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Left Column: Eyebrow, Headlines, Search Bar, Trending */}
          <div className="lg:col-span-6 text-left space-y-5">
            
            {/* Top Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-600 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Built for Students. Powered by Technology.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.12]">
              The All-in-One <br />
              Operating System <br />
              for <span className="text-[#2563EB]">College Students</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              Placivo AI brings everything a student needs into one beautiful platform. Study smarter, stay organized, and achieve more – all in one place.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl pt-1">
              <div className="relative flex items-center bg-white p-2 rounded-full shadow-lg shadow-slate-200/70 border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges, courses, notes, tools..."
                  className="flex-1 bg-transparent px-3 py-1.5 outline-none text-slate-800 font-medium text-sm sm:text-base placeholder:text-slate-400"
                  onClick={onExploreDemo}
                />
                <button
                  onClick={onExploreDemo}
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-md shadow-blue-500/20 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trending Tag Row */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold text-slate-500 pl-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">Trending Now:</span>
                {trendingTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={onExploreDemo}
                    className="px-3 py-1 rounded-full bg-slate-100/90 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/60 transition-colors text-xs font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-7 py-3 bg-[#2563EB] text-white rounded-full text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                <span>Try Live Demo</span>
              </button>
            </div>

          </div>

          {/* Right Column: Clean Student Illustration encircled by Orbital Blue Ring & 6 Floating Pill Badges with Interactive 3D Parallax */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-10 lg:py-12 px-2 sm:px-4">
            
            {/* Inline keyframe definitions for lip-sync & laser pointers */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes soundBar {
                0%, 100% { transform: scaleY(0.4); }
                50% { transform: scaleY(1.3); }
              }
              @keyframes laserPulse {
                from { stroke-dashoffset: 40; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes lipsPulse {
                0%, 100% { transform: scale(0.9); opacity: 0.8; }
                50% { transform: scale(1.15); opacity: 1; }
              }
            `}} />

            {/* Outer Container for Graphic & Orbit with 3D Perspective moving purely by itself */}
            <div 
              className="relative z-10 w-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center select-none"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                transform: `perspective(1200px) rotateX(${-coords.y * 4}deg) rotateY(${coords.x * 4}deg) scale(1.01)`,
                transition: 'transform 1.8s cubic-bezier(0.1, 0.6, 0.1, 1)',
              }}
            >
              
              {/* Professional technical orbital glow & slow-spinning background rings */}
              <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none z-0" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] rounded-full border border-blue-500/10 animate-[spin_50s_linear_infinite]" />
                <div className="w-[560px] h-[560px] sm:w-[680px] sm:h-[680px] rounded-full border border-dashed border-indigo-500/8 absolute animate-[spin_80s_linear_infinite]" />
              </div>

              {/* Professional Student Workspace Scene */}
              <div 
                className="relative z-10 w-full px-4 sm:px-8"
                style={{
                  transform: 'translateZ(30px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <ProfessionalWorkspaceScene imageSrc={heroStudentsArt} onExploreDemo={onExploreDemo} />
              </div>

              {/* 6 Floating Feature Badges highlighted with beautiful customized colors inside the loop */}

              {/* Badge 1: Top Left - AI Notes (High depth) */}
              <div 
                className={`absolute top-0 left-2 sm:left-6 lg:left-8 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 0 
                    ? 'bg-blue-50/95 border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.65)] scale-112 ring-4 ring-blue-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 0 ? '115px' : '90px'})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${activeHighlightIndex === 0 ? 'bg-blue-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">AI Notes</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Summarize & Study</div>
                </div>
              </div>

              {/* Badge 2: Top Right - Courses (Very high depth) */}
              <div 
                className={`absolute top-0 right-2 sm:right-6 lg:right-8 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 1 
                    ? 'bg-violet-50/95 border-2 border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.65)] scale-112 ring-4 ring-violet-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 1 ? '130px' : '105px'})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 1 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${activeHighlightIndex === 1 ? 'bg-violet-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">Courses</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Learn & Upskill</div>
                </div>
              </div>

              {/* Badge 3: Middle Left - Placements (Medium-High depth) */}
              <div 
                className={`absolute top-1/2 left-1 sm:left-4 lg:left-6 -translate-y-1/2 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 2 
                    ? 'bg-emerald-50/95 border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.65)] scale-112 ring-4 ring-emerald-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 2 ? '110px' : '85px'}) translateY(-50%)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 2 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${activeHighlightIndex === 2 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-blue-50 text-[#2563EB]'}`}>
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">Placements</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Jobs & Internships</div>
                </div>
              </div>

              {/* Badge 4: Middle Right - Planner (Medium-High depth) */}
              <div 
                className={`absolute top-1/2 right-1 sm:right-4 lg:right-6 -translate-y-1/2 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 3 
                    ? 'bg-amber-50/95 border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.65)] scale-112 ring-4 ring-amber-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 3 ? '120px' : '95px'}) translateY(-50%)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 3 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${activeHighlightIndex === 3 ? 'bg-amber-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">Planner</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Organize Better</div>
                </div>
              </div>

              {/* Badge 5: Bottom Left - AI Assistant (Maximum depth) */}
              <div 
                className={`absolute bottom-0 left-2 sm:left-6 lg:left-8 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 4 
                    ? 'bg-cyan-50/95 border-2 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.65)] scale-112 ring-4 ring-cyan-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 4 ? '135px' : '115px'})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 4 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${activeHighlightIndex === 4 ? 'ring-2 ring-cyan-500 shadow-md' : 'border border-slate-200'}`}>
                  <img 
                    src={aiLogoImg} 
                    alt="AI Assistant" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">AI Assistant</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Your Study Buddy</div>
                </div>
              </div>

              {/* Badge 6: Bottom Right - Community (Medium depth) */}
              <div 
                className={`absolute bottom-0 right-2 sm:right-6 lg:right-8 z-20 shadow-lg rounded-2xl p-2 sm:p-2.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeHighlightIndex === 5 
                    ? 'bg-rose-50/95 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.65)] scale-112 ring-4 ring-rose-100/70' 
                    : 'bg-white border border-slate-100 hover:bg-slate-50 opacity-90'
                }`} 
                onClick={onExploreDemo}
                style={{
                  transform: `translateZ(${activeHighlightIndex === 5 ? '100px' : '75px'})`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s',
                }}
              >
                {activeHighlightIndex === 5 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${activeHighlightIndex === 5 ? 'bg-rose-600 text-white animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate">Community</div>
                  <div className="text-[10px] font-medium text-slate-500 truncate">Connect & Grow</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Trusted By Banner */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 text-center">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-6">
            Trusted by <span className="text-blue-600 font-extrabold">1M+</span> students from <span className="text-blue-600 font-extrabold">500+</span> colleges
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> IIT BOMBAY
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> DELHI UNIVERSITY
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> BITS PILANI
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> VIT CHENNAI
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> SRM UNIVERSITY
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 tracking-tight">
              <Building2 className="w-4 h-4 text-blue-600" /> JNU
            </div>
          </div>
        </div>

        {/* Stats Grid Bar (1M+ Active Students, 500+ Top Colleges, 10M+ Notes, 50K+ Placements, 4.8/5 Rating) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">1M+</div>
              <div className="text-[11px] font-medium text-slate-500">Active Students</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">500+</div>
              <div className="text-[11px] font-medium text-slate-500">Top Colleges</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">10M+</div>
              <div className="text-[11px] font-medium text-slate-500">Notes & Resources</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">50K+</div>
              <div className="text-[11px] font-medium text-slate-500">Placement Opportunities</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">4.8/5</div>
              <div className="text-[11px] font-medium text-slate-500">Student Rating</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};



