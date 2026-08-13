import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Flame, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Filter, 
  RotateCcw,
  BookOpenCheck,
  Trophy,
  AlertTriangle,
  Award,
  ShieldCheck,
  Layers,
  Info as InfoIcon,
  Star,
  X,
  Github,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DSAProblem, UserProfile } from '../../types';
import { SectionUsageBanner } from '../common/SectionUsageBanner';
import { getPlacivoDSASheet } from '../../data/dsaSheet375';
import { StreakService } from '../../lib/streakService';
import { getGfgUrl, getLeetcodeUrl, getPracticeUrl } from '../../lib/dsaProblemLinks';
import { checkDSASolutionLimit, incrementFeatureUsage, getDailyKey, calculatePlanDetails } from '../../lib/planUtils';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import dsaHubImg from '../DSAHUB.png';
import { GitHubSyncSection, GitHubConnectionState } from './GitHubSyncSection';
import { PushToGitHubModal } from './PushToGitHubModal';

// Bespoke Placivo Coding Hub 3D Orbiting Logo Component
const CodingHubLogo: React.FC = () => {
  return (
    <motion.div 
      className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0"
      whileHover={{ scale: 1.08, rotate: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Glow aura */}
      <div className="absolute inset-0 bg-cyan-200/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3.5s' }} />
      <div className="absolute inset-3 bg-indigo-100/40 rounded-full blur-lg" />

      {/* Outer rotating orbit ring with dash spacing */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-cyan-400/80"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border border-indigo-200/60"
      />

      {/* Orbiting sub-nodes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-500 shadow-md" />
      </motion.div>
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2"
      >
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
      </motion.div>

      {/* Solid Tech Core */}
      <div className="absolute inset-4 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200/95 shadow-md flex items-center justify-center overflow-hidden">
        <img 
          src={dsaHubImg} 
          alt="DSA Hub" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
  );
};

interface CodingHubProps {
  user: UserProfile | null;
  dsa: DSAProblem[];
  onToggleSolved: (id: string) => void;
  onResetDSASheet?: (newSheet: DSAProblem[]) => void;
  onNavigateTab?: (tab: string) => void;
}

const CATEGORIES = [
  'All',
  'Arrays',
  'Strings',
  '2D Arrays',
  'Searching & Sorting',
  'Backtracking',
  'Linked List',
  'Stacks & Queues',
  'Greedy',
  'Binary Trees',
  'Binary Search Trees',
  'Heaps & Hashing',
  'Graphs',
  'Tries',
  'Dynamic Programming',
  'Bit Manipulation',
  'Segment Trees',
];

const SECTION_RESOURCES: Record<string, { gfg: string; leetcode: string; youtube: string }> = {
  'Arrays': {
    gfg: 'https://www.geeksforgeeks.org/array-data-structure/',
    leetcode: 'https://leetcode.com/tag/array/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Arrays+DSA'
  },
  'Strings': {
    gfg: 'https://www.geeksforgeeks.org/string-data-structure/',
    leetcode: 'https://leetcode.com/tag/string/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Strings+DSA'
  },
  '2D Arrays': {
    gfg: 'https://www.geeksforgeeks.org/matrix/',
    leetcode: 'https://leetcode.com/tag/matrix/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+2D+Arrays+Matrix+DSA'
  },
  'Searching & Sorting': {
    gfg: 'https://www.geeksforgeeks.org/sorting-algorithms/',
    leetcode: 'https://leetcode.com/tag/sorting/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Searching+and+Sorting+DSA'
  },
  'Backtracking': {
    gfg: 'https://www.geeksforgeeks.org/backtracking-algorithms/',
    leetcode: 'https://leetcode.com/tag/backtracking/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Backtracking+DSA'
  },
  'Linked List': {
    gfg: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
    leetcode: 'https://leetcode.com/tag/linked-list/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Linked+List+DSA'
  },
  'Stacks & Queues': {
    gfg: 'https://www.geeksforgeeks.org/stack-data-structure/',
    leetcode: 'https://leetcode.com/tag/stack/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Stacks+Queues+DSA'
  },
  'Greedy': {
    gfg: 'https://www.geeksforgeeks.org/greedy-algorithms/',
    leetcode: 'https://leetcode.com/tag/greedy/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Greedy+Algorithms+DSA'
  },
  'Binary Trees': {
    gfg: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
    leetcode: 'https://leetcode.com/tag/tree/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Binary+Trees+DSA'
  },
  'Binary Search Trees': {
    gfg: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/',
    leetcode: 'https://leetcode.com/tag/binary-search-tree/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Binary+Search+Trees+DSA'
  },
  'Heaps & Hashing': {
    gfg: 'https://www.geeksforgeeks.org/heap-data-structure/',
    leetcode: 'https://leetcode.com/tag/heap-priority-queue/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Heaps+Hashing+DSA'
  },
  'Graphs': {
    gfg: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
    leetcode: 'https://leetcode.com/tag/graph/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Graphs+DSA'
  },
  'Tries': {
    gfg: 'https://www.geeksforgeeks.org/trie-insert-and-search/',
    leetcode: 'https://leetcode.com/tag/trie/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Trie+Data+Structure+DSA'
  },
  'Dynamic Programming': {
    gfg: 'https://www.geeksforgeeks.org/dynamic-programming/',
    leetcode: 'https://leetcode.com/tag/dynamic-programming/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Dynamic+Programming+DSA'
  },
  'Bit Manipulation': {
    gfg: 'https://www.geeksforgeeks.org/bit-manipulation-data-structure/',
    leetcode: 'https://leetcode.com/tag/bit-manipulation/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Bit+Manipulation+DSA'
  },
  'Segment Trees': {
    gfg: 'https://www.geeksforgeeks.org/segment-tree-data-structure/',
    leetcode: 'https://leetcode.com/tag/segment-tree/',
    youtube: 'https://www.youtube.com/results?search_query=Placivo+Segment+Trees+DSA'
  }
};

export const CodingHubView: React.FC<CodingHubProps> = ({ user, dsa, onToggleSolved, onResetDSASheet, onNavigateTab }) => {
  const [problems, setProblems] = useState<DSAProblem[]>(dsa);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Custom 3D Header Active Tab & Hover States
  const [activeHeaderTab, setActiveHeaderTab] = useState<'sheet' | 'streak' | 'resources'>('sheet');
  const [hovered3dCard, setHovered3dCard] = useState<number | null>(null);

  // AI Solution Coach State
  const [selectedAIProblem, setSelectedAIProblem] = useState<DSAProblem | null>(null);
  const [aiCoachSolution, setAICoachSolution] = useState<string | null>(null);
  const [loadingAISolution, setLoadingAISolution] = useState<boolean>(false);
  const [aiLimitError, setAILimitError] = useState<string | null>(null);

  // GitHub Code Sync State
  const [ghState, setGhState] = useState<GitHubConnectionState>({ connected: false });
  const [pushModalProblem, setPushModalProblem] = useState<DSAProblem | null>(null);
  const [pushModalCode, setPushModalCode] = useState<string>('');

  const sanitizeAICoachSolution = (text: string): string => {
    if (!text) return '';
    // Strip specified unwanted characters: / * & ^ % $ # @ ! ) ( _ + ' ; . ,
    return text.replace(/[\/\*&\^%\$#@!\)\(_\+';\.,]/g, '');
  };

  const handleFetchAISolution = async (prob: DSAProblem) => {
    // Generate a secure, user-independent Firestore cache key based on the problem title
    const cacheKey = prob.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    
    // First, set selected problem and clear existing states
    setSelectedAIProblem(prob);
    setAILimitError(null);
    setLoadingAISolution(true);
    setAICoachSolution(null);

    // Check for cached solution in Firestore first
    let cachedSolution: string | null = null;
    if (db) {
      try {
        const cachedDoc = await getDoc(doc(db, 'codingCoachSolutions', cacheKey));
        if (cachedDoc.exists()) {
          cachedSolution = cachedDoc.data().solution;
        }
      } catch (e) {
        console.warn('Error fetching cached AI solution:', e);
      }
    }

    if (cachedSolution) {
      // Found cached answer! Display it directly and bypass AI calling & limits
      setAICoachSolution(cachedSolution);
      setLoadingAISolution(false);
      return;
    }

    // No cached answer found. This is the first request for this question. Proceed with AI.
    if (user) {
      const limitCheck = checkDSASolutionLimit(user, 0);
      if (!limitCheck.allowed) {
        setAILimitError(limitCheck.message);
        setAICoachSolution(null);
        setLoadingAISolution(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/ai/coding-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Solve this DSA problem: "${prob.title}" from category "${prob.category}" with difficulty "${prob.difficulty}".
Provide:
1. Clear description of the optimal approach.
2. Step-by-step logic and intuition.
3. Fully optimized, correct code solution with comments.
4. Time & Space complexity analysis.
Structure the answer beautifully using bullet points and clean sections.`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        const sanitized = sanitizeAICoachSolution(data.reply);
        setAICoachSolution(sanitized);
        
        // Save to cache collection for all future users
        if (db) {
          try {
            await setDoc(doc(db, 'codingCoachSolutions', cacheKey), {
              problemId: prob.id,
              title: prob.title,
              category: prob.category,
              difficulty: prob.difficulty,
              solution: sanitized,
              savedAt: new Date().toISOString()
            });
          } catch (saveErr) {
            console.warn('Error caching AI solution in Firestore:', saveErr);
          }
        }

        if (user) {
          incrementFeatureUsage(user.uid, 'dsa_solution', getDailyKey());
        }
      } else {
        setAICoachSolution('Unable to generate solution. Please try again.');
      }
    } catch (err) {
      console.error('AI solution fetch error:', err);
      setAICoachSolution('An error occurred while connecting to Placivo AI. Please try again.');
    } finally {
      setLoadingAISolution(false);
    }
  };

  // Sync state if props change externally
  React.useEffect(() => {
    setProblems(dsa);
  }, [dsa]);

  // Category Counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: problems.length };
    problems.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [problems]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchStatus = 
        statusFilter === 'All' ? true : statusFilter === 'Solved' ? p.solved : !p.solved;
      const matchSearch = 
        !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchDiff && matchStatus && matchSearch;
    });
  }, [problems, selectedCategory, selectedDifficulty, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  // Stats
  const solvedCount = problems.filter((p) => p.solved).length;
  const totalCount = problems.length;
  const progressPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string) => {
    const target = problems.find((p) => p.id === id);
    const updated = problems.map((p) => (p.id === id ? { ...p, solved: !p.solved } : p));
    setProblems(updated);
    if (target && !target.solved) {
      StreakService.recordActivity();
    }
    onToggleSolved(id);
  };

  const handleResetToPlacivo375 = () => {
    if (window.confirm('Reset DSA tracker to the complete Placivo 375 DSA Roadmap Sheet?')) {
      const freshSheet = getPlacivoDSASheet('user');
      setProblems(freshSheet);
      if (onResetDSASheet) {
        onResetDSASheet(freshSheet);
      } else {
        freshSheet.forEach((p) => {
          if (p.solved) onToggleSolved(p.id);
        });
      }
      setCurrentPage(1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3D LUXURY CODING HUB HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 25 }}
        className="w-full bg-gradient-to-br from-white via-[#F5FCFF] to-[#F1F3FF] rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative p-6 sm:p-8"
      >
        {/* Decorative background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-1" />
        
        {/* Glow point clouds */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl -z-1" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-1" />
        <div className="absolute top-1/2 left-2/3 w-72 h-72 bg-blue-50/40 rounded-full blur-3xl -z-1" />

        {/* Floating AI Particles (Lots of AI Animation) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-400/30 blur-[1px]"
              initial={{
                x: Math.random() * 800 + 50,
                y: Math.random() * 300 + 50,
                scale: Math.random() * 0.8 + 0.5,
                opacity: Math.random() * 0.6 + 0.2
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 5 + i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* LEFT COLUMN: Headings, description and active tabs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                  <span>PLACIVO CODE COPILOT</span>
                </motion.div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>375 DSA Roadmap Sheet Vetted</span>
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Custom Coding Hub logo */}
                <CodingHubLogo />
                
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Placivo 375 <br/>
                    <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent font-black">
                      DSA Coding Hub
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bold">Systematic Mastery across 17 Algorithmic Topics</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed max-w-xl font-medium pt-2">
                Accelerate technical placement preparedness. Access categorized sheets, instant solution codes (GFG, Leetcode), verified video lectures, and track your coding streak automatically with high precision.
              </p>
            </div>

            {/* TAB LIST SELECTOR WITH SPRING TRANSITION */}
            <div className="flex bg-slate-200/50 p-1 rounded-2xl max-w-sm sm:max-w-md border border-slate-200/40 relative">
              {(['sheet', 'streak', 'resources'] as const).map((tab) => {
                const isActive = activeHeaderTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveHeaderTab(tab)}
                    className={`relative flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                      isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCodingHeroTabBg"
                        className="absolute inset-0 bg-white rounded-xl border border-slate-200 shadow-sm -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    {tab === 'sheet' ? 'DSA Sheet' : tab === 'streak' ? 'Streak Engine' : 'Vetted Resources'}
                  </button>
                );
              })}
            </div>

            {/* TAB CARD DETAIL CONTAINER */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeaderTab}
                initial={{ opacity: 0, x: -10, y: 5 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 10, y: -5 }}
                transition={{ duration: 0.25 }}
                className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4"
              >
                {activeHeaderTab === 'sheet' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Placivo 375 DSA Roadmap Syllabus</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Curated rigorously across 17 categories including Arrays, DP, Graphs, Segment Trees, and Tries. Fully mapped to high-yield engineering interview rounds at product-first firms.
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-cyan-600">{progressPct}%</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completion</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-indigo-600">{solvedCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Solved</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                        <div className="text-lg font-black text-emerald-600">{totalCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">DSA Sheet Total</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeaderTab === 'streak' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Recruiter Streak Analytics Engine</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Recruiters prioritize daily consistency over cramming. Our built-in streak calendar logs coding actions daily to ensure you build reliable engineering muscle memory.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span>Instant Streak Recording</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Daily Consistency Logs</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>At-Risk Streak Alerts</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-emerald-200/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Systematic Problem Progress</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeaderTab === 'resources' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <BookOpenCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Vetted Platform Integrations</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Every DSA question is directly integrated to external practice hosts and official Placivo visual step-by-step video solutions. Focus on learning rather than search loop waste.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong className="text-slate-700">Practice Links</strong>: Direct redirect to LeetCode and GeeksforGeeks.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          <strong className="text-slate-700">Lecture Series</strong>: Embedded YouTube tutorials mapped directly to the question title.
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
              <div className="absolute w-64 h-64 border border-dashed border-cyan-300 rounded-full animate-spin opacity-40 pointer-events-none" style={{ animationDuration: '32s' }} />
              <div className="absolute w-44 h-44 border border-indigo-200 rounded-full animate-ping opacity-15 pointer-events-none" style={{ animationDuration: '6.5s' }} />

              {/* CARD 1: LIVE SHEET PROGRESS CARD */}
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
                  boxShadow: "0 20px 40px -15px rgba(6, 182, 212, 0.2)"
                }}
                onHoverStart={() => setHovered3dCard(1)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute top-4 w-[240px] bg-cyan-50/90 hover:bg-white border border-cyan-200/80 hover:border-cyan-400 p-4 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer text-slate-800 transform -translate-x-12 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    DSA PROGRESS METER
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-white">
                    <Trophy className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-2xl font-black text-slate-900">{progressPct}%</span>
                  <span className="text-xs font-bold text-cyan-600">Completed</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal mt-2.5">
                  Solved {solvedCount} of {totalCount} curated roadmap problems.
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-slate-400 font-mono">sheet.completion.eval</span>
                  <Zap className="w-3 h-3 text-cyan-500 animate-pulse" />
                </div>
              </motion.div>

              {/* CARD 2: ACTIVE STREAK BURNER CARD */}
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
                  boxShadow: "0 20px 40px -15px rgba(249, 115, 22, 0.2)"
                }}
                onHoverStart={() => setHovered3dCard(2)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute top-20 w-[240px] bg-amber-50 hover:bg-white border border-amber-200/80 hover:border-amber-400 p-4 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer text-slate-800 transform translate-x-12 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    STREAK MONITOR
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                    <Flame className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
                  </div>
                </div>
                {(() => {
                  const { streak } = StreakService.getStreakInfo();
                  return (
                    <div>
                      <div className="flex items-baseline gap-1 mt-2.5">
                        <span className="text-2xl font-black text-slate-900">{streak} Days</span>
                        <span className="text-xs font-bold text-amber-600">Active Fire</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1.5">
                        Excellent momentum. Code daily to satisfy recruiter filters.
                      </p>
                    </div>
                  );
                })()}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-slate-400 font-mono">streak.consistency.factor</span>
                  <Zap className="w-3 h-3 text-amber-500" />
                </div>
              </motion.div>

              {/* CARD 3: KEYWORDS/TOPICS SANDBOX CARD */}
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
                  boxShadow: "0 25px 45px -15px rgba(99, 102, 241, 0.25)"
                }}
                onHoverStart={() => setHovered3dCard(3)}
                onHoverEnd={() => setHovered3dCard(null)}
                className="absolute bottom-2 w-[244px] bg-indigo-50 hover:bg-white border border-indigo-200/80 hover:border-indigo-400 p-4 rounded-2xl shadow-md transition-all duration-300 cursor-pointer text-slate-800 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    DSA BLUEPRINTS
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-700">DP Matrix</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-cyan-50 border border-cyan-100 rounded text-cyan-700">Trie Node</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-purple-50 border border-purple-100 rounded text-purple-700">Segment Trees</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[9px] text-indigo-600 font-bold uppercase font-sans">
                    17 Categorized Topics
                  </span>
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
              <InfoIcon className="w-3.5 h-3.5 text-cyan-500 animate-bounce" /> Hover or touch 3D cards to track sheet status
            </motion.p>
          </div>

        </div>
      </motion.div>

      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Placivo 375 DSA Roadmap Sheet</h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Comprehensive 375 DSA Question Bank (By Placivo) • Solved {solvedCount} of {totalCount} Questions
              </p>
            </div>
          </div>

          {/* Section Links */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('courses')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Learn from Placivo courses</span>
              </button>
            )}

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3 h-3 text-cyan-600" />
                <span>Placivo Portal</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {(() => {
            const { streak, isAtRisk } = StreakService.getStreakInfo();
            if (isAtRisk) {
              return (
                <div className="px-3.5 py-2 rounded-2xl bg-red-600 border border-red-400 text-white font-extrabold text-xs flex items-center gap-2 animate-pulse shadow-md">
                  <AlertTriangle className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce shrink-0" />
                  <span>Streak: {streak} Day{streak === 1 ? '' : 's'} (At Risk! ⚠️)</span>
                </div>
              );
            }
            return (
              <div className="px-3.5 py-2 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold text-xs flex items-center gap-2">
                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-bounce' : 'text-slate-400'}`} />
                <span>Streak: {streak} Day{streak === 1 ? '' : 's'}</span>
              </div>
            );
          })()}

          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Solved: {solvedCount}/{totalCount} ({progressPct}%)</span>
          </div>

          <button
            onClick={handleResetToPlacivo375}
            className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Reset to Placivo 375 Questions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset 375 Sheet</span>
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* GitHub Code Sync Banner */}
        <GitHubSyncSection
          userId={user?.uid || 'guest'}
          connectionState={ghState}
          setConnectionState={setGhState}
        />

        {/* Search & Secondary Filters */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="relative md:col-span-5">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search 375 questions by title or keyword..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="md:col-span-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'All' | 'Solved' | 'Unsolved');
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Solved">Solved</option>
                  <option value="Unsolved">Unsolved</option>
                </select>
              </div>

              {/* Page size selector */}
              <div className="md:col-span-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none"
                >
                  <option value={30}>Show 30 / page</option>
                  <option value={60}>Show 60 / page</option>
                  <option value={100}>Show 100 / page</option>
                  <option value={375}>Show All 375</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-thin">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Section Resource Links Banner */}
            {selectedCategory !== 'All' && SECTION_RESOURCES[selectedCategory] && (
              <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4 text-cyan-600" />
                  <span>{selectedCategory} Section Roadmap Resources:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={SECTION_RESOURCES[selectedCategory].gfg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <span>GeeksforGeeks Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={SECTION_RESOURCES[selectedCategory].leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[11px] hover:bg-amber-600 transition-colors flex items-center gap-1"
                  >
                    <span>LeetCode Tag</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={SECTION_RESOURCES[selectedCategory].youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <span>YouTube Tutorials</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Table / Question List */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            {filteredProblems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Code2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No questions match your current search and filters.</p>
                <p>Try resetting categories or search terms.</p>
              </div>
            ) : (
              paginatedProblems.map((prob, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                const gfgUrl = getGfgUrl(prob);
                const leetcodeUrl = getLeetcodeUrl(prob);
                const linkUrl = getPracticeUrl(prob);
                const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent('Placivo ' + prob.title + ' solution')}`;

                return (
                  <motion.div
                    key={prob.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    whileHover={{ 
                      y: -4,
                      scale: 1.008,
                      rotateY: 2,
                      boxShadow: prob.solved 
                        ? '0 12px 24px -10px rgba(16, 185, 129, 0.08)' 
                        : '0 12px 24px -10px rgba(6, 182, 212, 0.12)',
                      transition: { duration: 0.2 } 
                    }}
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden group ${
                      prob.solved ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Hover light glow background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-1" />

                    <div className="flex items-center gap-3.5 min-w-0" style={{ transform: 'translateZ(15px)' }}>
                      <span className="text-[11px] font-extrabold text-slate-400 w-8 shrink-0 text-right">
                        #{globalIndex}
                      </span>

                      <button
                        onClick={() => handleToggle(prob.id)}
                        className="text-slate-300 hover:text-emerald-600 transition-colors shrink-0 relative"
                        title={prob.solved ? 'Mark as unsolved' : 'Mark as solved'}
                      >
                        {prob.solved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                            {prob.category}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </div>
                        <h3 className={`font-bold text-xs sm:text-sm mt-1 truncate flex items-center gap-1.5 ${prob.solved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          <span>{prob.title}</span>
                          {!prob.solved && (
                            <Zap className="w-3.5 h-3.5 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                          )}
                        </h3>
                      </div>
                    </div>

                    {/* Question Links */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 md:grid md:grid-cols-[75px_50px_75px_100px_110px_85px] lg:grid-cols-[85px_55px_85px_110px_120px_95px] md:gap-1 lg:gap-2" style={{ transform: 'translateZ(20px)' }}>
                      {linkUrl ? (
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs hover:shadow-md hover:scale-[1.03] w-full text-center whitespace-nowrap"
                          title="Practice primary problem link"
                        >
                          <span>Practice</span>
                          <ExternalLink className="w-3 h-3 text-white/80 shrink-0" />
                        </a>
                      ) : (
                        <div className="hidden md:block" />
                      )}

                      {gfgUrl ? (
                        <a
                          href={gfgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] transition-all flex items-center justify-center gap-1 hover:scale-[1.03] w-full text-center whitespace-nowrap"
                          title="Open GeeksforGeeks Problem"
                        >
                          <span>GFG</span>
                          <ExternalLink className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        </a>
                      ) : (
                        <div className="hidden md:block" />
                      )}

                      {leetcodeUrl ? (
                        <a
                          href={leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] transition-all flex items-center justify-center gap-1 hover:scale-[1.03] w-full text-center whitespace-nowrap"
                          title="Open LeetCode Problem"
                        >
                          <span>LeetCode</span>
                          <ExternalLink className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                        </a>
                      ) : (
                        <div className="hidden md:block" />
                      )}

                      {ytUrl ? (
                        <a
                          href={ytUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-[11px] transition-all flex items-center justify-center gap-1 hover:scale-[1.03] w-full text-center whitespace-nowrap"
                          title="Search Placivo Video Solution"
                        >
                          <span>Video Solution</span>
                          <ExternalLink className="w-2.5 h-2.5 text-red-500 shrink-0" />
                        </a>
                      ) : (
                        <div className="hidden md:block" />
                      )}

                      <button
                        onClick={() => handleFetchAISolution(prob)}
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs hover:shadow-md hover:scale-[1.03] cursor-pointer w-full text-center whitespace-nowrap"
                        title="Get Placivo AI custom step-by-step code solution"
                      >
                        <Zap className="w-3 h-3 text-amber-300 animate-pulse fill-amber-300 shrink-0" />
                        <span className="whitespace-nowrap">AI Coach</span>
                      </button>

                      <button
                        onClick={() => {
                          setPushModalProblem(prob);
                          setPushModalCode('');
                        }}
                        className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs hover:shadow-md hover:scale-[1.03] cursor-pointer w-full text-center whitespace-nowrap"
                        title="Push or sync solution to GitHub"
                      >
                        <Github className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Sync</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs">
                <p className="text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">
                    {Math.min(currentPage * pageSize, filteredProblems.length)}
                  </span>{' '}
                  of <span className="font-bold text-slate-900">{filteredProblems.length}</span> questions
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 font-bold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Solution Coach Overlay Modal */}
        <AnimatePresence>
          {selectedAIProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setSelectedAIProblem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                        AI Code Coach
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {selectedAIProblem.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                      {selectedAIProblem.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedAIProblem(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content body */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {aiLimitError ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
                      <div className="flex items-center gap-2 font-black text-rose-900">
                        <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                        <span>Placivo AI Solution Limit Reached</span>
                      </div>
                      <p className="font-bold">{aiLimitError}</p>
                      <p className="text-[11px] text-rose-800 font-semibold leading-normal">
                        Consistency and deliberate practice are key. To gain unlimited on-demand solutions, please upgrade your subscription from your Profile dashboard.
                      </p>
                    </div>
                  ) : loadingAISolution ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                      <p className="font-bold text-purple-950 animate-pulse">Placivo AI is formulating step-by-step logic & code...</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap font-mono bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-x-auto text-slate-800 text-[11px] sm:text-xs">
                      {aiCoachSolution}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 flex-wrap">
                  {aiCoachSolution && (
                    <button
                      onClick={() => {
                        setPushModalProblem(selectedAIProblem);
                        setPushModalCode(aiCoachSolution);
                        setSelectedAIProblem(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Github className="w-4 h-4 text-cyan-400" />
                      <span>Push Solution to GitHub</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAIProblem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer ml-auto"
                  >
                    Close Coach
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Push to GitHub Modal */}
        {pushModalProblem && (
          <PushToGitHubModal
            userId={user?.uid || 'guest'}
            problem={pushModalProblem}
            initialCode={pushModalCode}
            connectionState={ghState}
            onClose={() => setPushModalProblem(null)}
            onOpenConnect={() => {
              setPushModalProblem(null);
              // scroll to top or focus sync card
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        )}
      </div>
  );
};
