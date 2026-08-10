import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Check, 
  BookOpen, 
  RefreshCw, 
  Zap, 
  Globe, 
  Search, 
  Brain, 
  Cpu, 
  Terminal, 
  Loader2, 
  FileText,
  RotateCcw,
  Sliders,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Code2,
  HelpCircle,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../../types';
import { checkAIChatLimit, incrementFeatureUsage, getDailyKey, getWeeklyKey, calculatePlanDetails } from '../../lib/planUtils';
import { StructuredResponseFormatter } from './StructuredResponseFormatter';

interface ThinkingStep {
  text: string;
  type: 'web' | 'search' | 'think' | 'work' | 'code' | 'draft';
}

// Helper to generate dynamic ChatGPT-style thinking status steps based on user prompt intent
const getChatGPTStyleThinkingSteps = (prompt: string): ThinkingStep[] => {
  const p = prompt.toLowerCase().trim();

  // Coding & Technical queries
  if (
    p.includes('code') ||
    p.includes('debug') ||
    p.includes('python') ||
    p.includes('java') ||
    p.includes('cpp') ||
    p.includes('c++') ||
    p.includes('react') ||
    p.includes('function') ||
    p.includes('error') ||
    p.includes('syntax') ||
    p.includes('script') ||
    p.includes('program') ||
    p.includes('bug') ||
    p.includes('html') ||
    p.includes('css')
  ) {
    return [
      { text: 'Analyzing code & logic...', type: 'code' },
      { text: 'Searching the web...', type: 'web' },
      { text: 'Thinking...', type: 'think' },
      { text: 'Working...', type: 'work' },
      { text: 'Drafting solution...', type: 'draft' },
    ];
  }

  // Math, Algorithms & Academic Proofs
  if (
    p.includes('derive') ||
    p.includes('proof') ||
    p.includes('complexity') ||
    p.includes('quicksort') ||
    p.includes('dijkstra') ||
    p.includes('calculate') ||
    p.includes('formula') ||
    p.includes('solve') ||
    p.includes('algorithm') ||
    p.includes('page fault') ||
    p.includes('math')
  ) {
    return [
      { text: 'Thinking...', type: 'think' },
      { text: 'Searching the web...', type: 'web' },
      { text: 'Analyzing step-by-step logic...', type: 'think' },
      { text: 'Working...', type: 'work' },
      { text: 'Formatting final answer...', type: 'draft' },
    ];
  }

  // General questions, Viva & Information search (Default)
  return [
    { text: 'Searching the web...', type: 'web' },
    { text: 'Reading web sources...', type: 'search' },
    { text: 'Thinking...', type: 'think' },
    { text: 'Working...', type: 'work' },
    { text: 'Drafting response...', type: 'draft' },
  ];
};

const renderStepIcon = (type: string) => {
  switch (type) {
    case 'web':
      return <Globe className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '6s' }} />;
    case 'search':
      return <Search className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
    case 'think':
      return <Brain className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />;
    case 'work':
      return <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />;
    case 'code':
      return <Terminal className="w-3.5 h-3.5 text-emerald-500" />;
    case 'draft':
      return <FileText className="w-3.5 h-3.5 text-purple-500" />;
    default:
      return <Brain className="w-3.5 h-3.5 text-indigo-500" />;
  }
};

import aiLogoImg from '../../assets/AILogo.svg';

// Custom Personalized Mini Assistant Logo in Light Theme
const PersonalAssistantMiniLogo: React.FC = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      {/* Soft halo pulse */}
      <div className="absolute inset-0 bg-blue-500/10 rounded-2xl animate-ping" style={{ animationDuration: '3.5s' }} />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-2xl border border-dashed border-blue-400/50"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-1 rounded-2xl border border-indigo-300/40"
      />
      
      {/* Core Badge with AILogo.jpeg */}
      <div className="absolute inset-0.5 bg-white rounded-xl shadow-xs border border-blue-100 p-0.5 flex items-center justify-center overflow-hidden">
        <img 
          src={aiLogoImg} 
          alt="Personal AI Assistant Logo" 
          className="w-full h-full object-cover rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

import { UserProfile } from '../../types';

interface AIChatViewProps {
  user?: UserProfile;
}

export const AIChatView: React.FC<AIChatViewProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your Personal AI Assistant. Ask me any conceptual question, algorithm proof, code debugging, or exam strategy!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [currentThinkingStepIndex, setCurrentThinkingStepIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Token saving and word limit settings (default true)
  const [limitWords, setLimitWords] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem('campus_os_chat_limit_words');
      return cached !== 'false'; // defaults to true
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campus_os_chat_limit_words', limitWords.toString());
    } catch {}
  }, [limitWords]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, currentThinkingStepIndex]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    if (user) {
      const limitCheck = checkAIChatLimit(user, 0);
      if (!limitCheck.allowed) {
        const errorMsg: ChatMessage = {
          id: 'ai_limit_error_' + Date.now(),
          sender: 'ai',
          text: `⚠️ **Usage Limit Reached**\n\n${limitCheck.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }
    }

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const hasPreviousUserMsg = messages.some((m) => m.sender === 'user');
    let activeMessages = [...messages];

    // Automatically reset and start a fresh session on every new question by default
    if (hasPreviousUserMsg) {
      const initialMsg = messages[0] || {
        id: 'm1',
        sender: 'ai',
        text: 'Hello! I am your Personal AI Assistant. Ask me any conceptual question, algorithm proof, code debugging, or exam strategy!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      activeMessages = [initialMsg, userMsg];
      setMessages([initialMsg, userMsg]);
    } else {
      activeMessages = [...messages, userMsg];
      setMessages((prev) => [...prev, userMsg]);
    }

    const promptToSend = inputText;
    setInputText('');
    setLoading(true);

    const steps = getChatGPTStyleThinkingSteps(promptToSend);
    setThinkingSteps(steps);
    setCurrentThinkingStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentThinkingStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          limitWords,
          history: activeMessages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await res.json();

      if (user) {
        const details = calculatePlanDetails(user);
        const periodKey = details.currentPlanId === 'free_trial' || details.currentPlanId === 'plan_199' ? getDailyKey() : getWeeklyKey();
        incrementFeatureUsage(user.uid, 'ai_chat', periodKey);
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.reply || 'Here is the step-by-step solution.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (loading) return;
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user');
    if (!lastUserMessage) return;

    setInputText(lastUserMessage.text);
    handleSend();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const topicCategories = [
    {
      label: 'Algorithms',
      icon: <Code2 className="w-3.5 h-3.5 text-blue-600" />,
      prompt: 'Explain Dijkstra\'s algorithm step-by-step with time complexity',
    },
    {
      label: 'Math & Proofs',
      icon: <Brain className="w-3.5 h-3.5 text-indigo-600" />,
      prompt: 'Derive the worst-case and average-case time complexity of QuickSort',
    },
    {
      label: 'Operating Systems',
      icon: <Cpu className="w-3.5 h-3.5 text-sky-600" />,
      prompt: 'How do I calculate page faults in FIFO vs LRU page replacement?',
    },
    {
      label: 'Exam Prep',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-600" />,
      prompt: 'Give me 5 practice viva questions and answers for DBMS normalization',
    },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[600px] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden relative font-sans">
      
      {/* Light-Theme Header */}
      <div className="p-4 px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <PersonalAssistantMiniLogo />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                Personal AI Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Autonomous Tutor & Problem Solver</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
              showSettings 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Toggle Settings"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Options</span>
          </button>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 px-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5"
            title="Start New Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Light Settings Banner */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50/90 border-b border-slate-200/80 p-3 px-6 flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-bold text-slate-700">Optimization Settings</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <input
                  type="checkbox"
                  checked={limitWords}
                  onChange={(e) => setLimitWords(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-semibold text-slate-700">Strict Word Limit (&lt;2000 Words)</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 relative">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img 
            src={aiLogoImg} 
            alt="" 
            className="w-80 h-80 object-cover rounded-full" 
            referrerPolicy="no-referrer"
          />
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex items-start gap-3 max-w-4xl ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {m.sender === 'user' ? (
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <div className="mt-1">
                  <PersonalAssistantMiniLogo />
                </div>
              )}

              <div className="flex flex-col gap-1.5 max-w-[88%] sm:max-w-[85%]">
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs border transition-all ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white border-blue-600 rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 border-slate-200/90 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <div className="whitespace-pre-wrap font-sans text-white text-xs sm:text-sm">{m.text}</div>
                  ) : (
                    <StructuredResponseFormatter content={m.text} />
                  )}
                </div>

                {/* Footer Metadata & Controls */}
                <div className={`flex items-center gap-3 text-[10px] text-slate-400 font-semibold px-1 ${m.sender === 'user' ? 'justify-end' : 'justify-between'}`}>
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="px-2 py-0.5 hover:text-blue-600 text-slate-500 hover:bg-slate-100 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="px-2 py-0.5 hover:text-blue-600 text-slate-500 hover:bg-slate-100 rounded-md transition-all flex items-center gap-1 cursor-pointer font-bold disabled:opacity-50"
                        title="Retry answer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dynamic ChatGPT-style Thinking Indicator */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-3 max-w-xl"
          >
            <div className="mt-1">
              <PersonalAssistantMiniLogo />
            </div>
            
            <div className="p-3.5 px-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm text-xs font-medium text-slate-700 flex flex-col gap-2.5 min-w-[260px]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                  <span className="font-extrabold text-blue-900 text-xs tracking-tight">AI Reasoning</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step {currentThinkingStepIndex + 1}/{thinkingSteps.length}</span>
              </div>

              <AnimatePresence mode="wait">
                {thinkingSteps.length > 0 && (
                  <motion.div
                    key={thinkingSteps[currentThinkingStepIndex]?.text || 'Thinking...'}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2.5 font-bold text-slate-800 text-xs"
                  >
                    <div className="p-1 rounded-lg bg-slate-100 shrink-0">
                      {renderStepIcon(thinkingSteps[currentThinkingStepIndex]?.type)}
                    </div>
                    <span>{thinkingSteps[currentThinkingStepIndex]?.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Progress Bar */}
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                  initial={{ width: '10%' }}
                  animate={{ 
                    width: `${((currentThinkingStepIndex + 1) / thinkingSteps.length) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Cards in Light Tone */}
      <div className="p-3 px-4 sm:px-6 bg-slate-50/80 border-t border-slate-200/80">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Suggested Topics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {topicCategories.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(tc.prompt)}
              className="p-2.5 px-3 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 text-left transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  {tc.icon}
                  {tc.label}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] font-semibold text-slate-700 line-clamp-1 group-hover:text-blue-900">
                {tc.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask any conceptual question, derive proofs, debug code..."
          className="flex-1 px-4 py-3 text-xs sm:text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white shadow-2xs transition-all text-slate-800 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-5 sm:px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

