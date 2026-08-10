import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen,
  Cpu,
  Activity,
  Compass,
  Terminal,
  Award,
  Star,
  Info as InfoIcon,
  Bot,
  Brain,
  Zap,
  Layers,
  MessageSquare,
  Globe
} from 'lucide-react';
import { StudySuite, UserProfile } from '../../types';
import { AIChatView } from '../chat/AIChatView';
import aiLogoImg from '../../assets/AILogo.svg';

// Bespoke Placivo Assistant Core Logo Component
const PersonalAssistantLogo: React.FC = () => {
  return (
    <motion.div 
      className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0"
      whileHover={{ scale: 1.08, rotate: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Light glow aura */}
      <div className="absolute inset-0 bg-blue-300/40 rounded-3xl blur-xl animate-pulse" style={{ animationDuration: '3.5s' }} />
      <div className="absolute inset-2 bg-indigo-200/40 rounded-3xl blur-lg" />

      {/* Outer rotating orbit ring with dash spacing */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-3xl border border-dashed border-blue-400/80"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-2xl border border-indigo-300/60"
      />

      {/* Orbiting sub-nodes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-md ring-2 ring-white" />
      </motion.div>
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2"
      >
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-sm ring-2 ring-white" />
      </motion.div>

      {/* Solid Tech Frame housing Placivo AI Logo */}
      <div className="absolute inset-2.5 bg-white rounded-2xl border-2 border-blue-100 shadow-md p-1.5 flex items-center justify-center overflow-hidden">
        <img 
          src={aiLogoImg} 
          alt="Placivo Personal Assistant Logo" 
          className="w-full h-full object-cover rounded-xl"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
};

interface StudyHubViewProps {
  user: UserProfile | null;
  studySuites?: StudySuite[];
  onSaveSuite?: (suite: StudySuite) => void;
  onDeleteSuite?: (id: string) => void;
  initialMode?: 'chat';
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({ user, studySuites, onSaveSuite, onDeleteSuite }) => {
  const [activeIntroTab, setActiveIntroTab] = useState<'tutor' | 'proofs' | 'hacks'>('tutor');
  const [hovered3dCard, setHovered3dCard] = useState<number | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 3D LUXURY ASSISTANT HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 25 }}
        className="w-full bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative p-6 sm:p-8"
      >
        {/* Decorative background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-1" />
        
        {/* Glow point clouds */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-1" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-1" />
        <div className="absolute top-1/2 left-2/3 w-72 h-72 bg-emerald-50/40 rounded-full blur-3xl -z-1" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* LEFT COLUMN: Headings, description and active tabs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold"
                >
                  <Brain className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>PLACIVO COGNITIVE ENGINE</span>
                </motion.div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>Active Live Chat</span>
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Brand new custom personal Assistant logo */}
                <PersonalAssistantLogo />
                
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Placivo <br/>
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent font-black">
                      Personal Assistant
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">Your 24/7 Academic Copilot & Synthesizer</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed max-w-xl font-medium pt-2">
                Say hello to your intelligent peer. Connect instantly to request step-by-step mathematical proofs, solve complex code blocks, isolate structural concepts, or generate targeted interview prep on the fly.
              </p>
            </div>

            {/* TAB LIST SELECTOR WITH SPRING TRANSITION */}
            <div className="flex bg-slate-200/50 p-1 rounded-2xl max-w-sm sm:max-w-md border border-slate-200/40 relative">
              {(['tutor', 'proofs', 'hacks'] as const).map((tab) => {
                const isActive = activeIntroTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveIntroTab(tab)}
                    className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                      isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeAssistantHeroTabBg"
                        className="absolute inset-0 bg-white rounded-xl border border-slate-200 shadow-sm -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    {tab === 'tutor' ? 'Academic Tutor' : tab === 'proofs' ? 'Logical Proofs' : 'Exam Hacks'}
                  </button>
                );
              })}
            </div>

            {/* TAB CARD DETAIL CONTAINER */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIntroTab}
                initial={{ opacity: 0, x: -10, y: 5 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 10, y: -5 }}
                transition={{ duration: 0.25 }}
                className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4"
              >
                {activeIntroTab === 'tutor' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Advanced Conceptual Dissection</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Never get stuck on dense academic syllabi. Paste text, ask complex questions, or request high-yield study frameworks. The system evaluates questions semantically and maps them to academic criteria.
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-blue-600">Instant</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Responses</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-indigo-600">Double</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Learning Rate</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-emerald-600">100%</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Accurate</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeIntroTab === 'proofs' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Step-By-Step Logic Derivation</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Need mathematical formulas, algorithmic complexities, or database normalization steps explained? Our assistant is primed with high-quality tech formatting to render code and formulas beautifully.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Interactive Code Debugging</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Dijkstra & Math Proofs</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span>SQL Normalization & Indexing</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Token-Saving Fresh Chats</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeIntroTab === 'hacks' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Dynamic Exam & Viva Tactics</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Ace your next oral presentation or lab exam with targeted simulations. Try these quick assistant prompts to build ultimate confidence:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong className="text-slate-700">"Give me DBMS Viva questions"</strong>: Practice standard exam questions with model answers.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong className="text-slate-700">"Derive QuickSort complexity"</strong>: Study high-yield academic summaries.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: 3D FLOATING PERSPECTIVE CARDS GRID */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[380px] lg:min-h-[340px] px-4">
            
            {/* Perspective container */}
            <div 
              className="relative w-full max-w-[320px] h-full min-h-[300px] flex items-center justify-center" 
              style={{ perspective: 1200 }}
            >
              
              {/* BACK RADAR ANIMATIONS */}
              <div className="absolute w-64 h-64 border border-dashed border-slate-300 rounded-full animate-spin opacity-40 pointer-events-none" style={{ animationDuration: '32s' }} />
              <div className="absolute w-44 h-44 border border-slate-200 rounded-full animate-ping opacity-15 pointer-events-none" style={{ animationDuration: '6.5s' }} />

              {/* CARD 1: VIRTUAL ACADEMIC TUTOR */}
              <motion.div
                animate={{
                  y: hovered3dCard === 1 ? -15 : [0, -10, 0],
                  rotateZ: hovered3dCard === 1 ? -6 : [-3, -1, -3],
                }}
                transition={{
                  y: hovered3dCard === 1 ? { duration: 0.2 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: hovered3dCard === 1 ? { duration: 0.2 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: -10,
                  rotateX: 8,
                  z: 40,
                  boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.2)"
                }}
                onHoverStart={() => setHovered3dCard(1)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute top-4 w-[240px] bg-[#EFF6FF] hover:bg-white border border-blue-200/80 hover:border-blue-400 p-4 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer text-slate-800 transform -translate-x-12 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    ACADEMIC TUTOR
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h5 className="font-bold text-xs text-slate-900 mt-2.5 font-sans">Syllabus Explainer</h5>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  Dissect complex chapters and academic theories step-by-step.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-slate-400 font-mono">academic.dissect</span>
                  <Brain className="w-3 h-3 text-blue-500 animate-pulse" />
                </div>
              </motion.div>

              {/* CARD 2: REASONING & MATH PROOFS */}
              <motion.div
                animate={{
                  y: hovered3dCard === 2 ? -15 : [0, 8, 0],
                  rotateZ: hovered3dCard === 2 ? 8 : [2, 0, 2],
                }}
                transition={{
                  y: hovered3dCard === 2 ? { duration: 0.2 } : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  rotateZ: hovered3dCard === 2 ? { duration: 0.2 } : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 12,
                  rotateX: -6,
                  z: 50,
                  boxShadow: "0 20px 40px -15px rgba(139, 92, 246, 0.2)"
                }}
                onHoverStart={() => setHovered3dCard(2)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute top-20 w-[240px] bg-[#FAF5FF] hover:bg-white border border-purple-200/80 hover:border-purple-400 p-4 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer text-slate-800 transform translate-x-12 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    LOGICAL DERIVATION
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h5 className="font-bold text-xs text-slate-900 mt-2.5 font-sans">Formula Deriver</h5>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  Derive sorting complexities and mathematical theorems with ease.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-slate-400 font-mono">reasoning.core</span>
                  <Activity className="w-3 h-3 text-purple-500" />
                </div>
              </motion.div>

              {/* CARD 3: CODE DEBUGGER */}
              <motion.div
                animate={{
                  y: hovered3dCard === 3 ? -15 : [0, -12, 0],
                  rotateZ: hovered3dCard === 3 ? 0 : [0, 1, 0],
                }}
                transition={{
                  y: hovered3dCard === 3 ? { duration: 0.2 } : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  rotateZ: hovered3dCard === 3 ? { duration: 0.2 } : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 0,
                  rotateX: 12,
                  z: 60,
                  boxShadow: "0 25px 45px -15px rgba(16, 185, 129, 0.25)"
                }}
                onHoverStart={() => setHovered3dCard(3)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute bottom-2 w-[244px] bg-[#ECFDF5] hover:bg-white border border-emerald-200/80 hover:border-emerald-400 p-4 rounded-2xl shadow-md transition-all duration-300 cursor-pointer text-slate-800 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CODE SYNCHRONIZER
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h5 className="font-bold text-xs text-slate-900 mt-2.5 font-sans">Interactive Sandbox</h5>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  Debug syntax errors, dry-run test cases, and explain loops.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-slate-400 font-mono">sandbox.eval</span>
                  <div className="flex gap-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Subtitle helper explaining interactive 3D elements */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-[11px] text-slate-400 font-bold mt-2 flex items-center gap-1 cursor-default text-center animate-pulse"
            >
              <InfoIcon className="w-3.5 h-3.5 text-blue-500 animate-bounce" /> Hover or touch 3D cards to track semantic logic
            </motion.p>
          </div>

        </div>
      </motion.div>

      {/* MODE 1: AI Chat Assistant & Tutor */}
      <AIChatView user={user || undefined} />
    </div>
  );
};


