import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Flame, 
  CheckSquare, 
  Calendar, 
  Code2, 
  Briefcase, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Plus, 
  Award, 
  TrendingUp, 
  CheckCircle2,
  Zap,
  ShieldAlert,
  AlertTriangle,
  Brain,
  Activity
} from 'lucide-react';
import dashboardImg from '../Dashboard.png';

// ============================================================================
// AI ANIMATED SYNAPSE CORE WIDGET - SECTION LOGO
// ============================================================================
const DashboardLogo: React.FC = () => {
  return (
    <motion.div 
      className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0"
      whileHover={{ scale: 1.08, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      id="dashboard-logo-container"
    >
      {/* Glow aura */}
      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3.5s' }} id="dashboard-logo-glow" />
      <div className="absolute inset-3 bg-blue-500/20 rounded-full blur-lg" />

      {/* Outer rotating orbit rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-dashed border-indigo-400/80"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border border-blue-400/50"
      />

      {/* Orbiting sub-nodes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-md animate-pulse" />
      </motion.div>
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2"
      >
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm" />
      </motion.div>

      {/* Solid Tech Core containing dashboard.png */}
      <div className="absolute inset-4 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200/95 shadow-md flex items-center justify-center overflow-hidden" id="dashboard-logo-core">
        <img 
          src={dashboardImg} 
          alt="Dashboard Section Logo" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          id="dashboard-logo-image"
        />
      </div>
    </motion.div>
  );
};

// ============================================================================
// INTERACTIVE 3D STAT CARD
// ============================================================================
interface Dashboard3DStatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  subValueColor: string;
  icon: React.ReactNode;
  bgIconClass: string;
  progressPct?: number;
  onClick: () => void;
  accentColor: 'blue' | 'indigo' | 'cyan' | 'purple';
}

const Dashboard3DStatCard: React.FC<Dashboard3DStatCardProps> = ({
  title,
  value,
  subValue,
  subValueColor,
  icon,
  bgIconClass,
  progressPct,
  onClick,
  accentColor
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / (rect.height / 2)) * 6;
    const rotateY = ((x - centerX) / (rect.width / 2)) * 6;
    setCoords({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const shadowColor = 
    accentColor === 'blue' ? 'rgba(59,130,246,0.15)' :
    accentColor === 'indigo' ? 'rgba(99,102,241,0.15)' :
    accentColor === 'cyan' ? 'rgba(6,182,212,0.15)' :
    'rgba(168,85,247,0.15)';

  const hoverBorderColor = 
    accentColor === 'blue' ? 'border-blue-300' :
    accentColor === 'indigo' ? 'border-indigo-300' :
    accentColor === 'cyan' ? 'border-cyan-300' :
    'border-purple-300';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateY: coords.x,
        rotateX: coords.y,
        scale: isHovered ? 1.025 : 1,
        z: isHovered ? 10 : 0
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`p-5 rounded-2xl bg-white border transition-all duration-300 relative cursor-pointer ${
        isHovered
          ? `${hoverBorderColor} shadow-[0_15px_30px_-10px_${shadowColor}]`
          : 'border-slate-200/80 shadow-2xs hover:bg-slate-50/10'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-1" />

      <div style={{ transform: 'translateZ(15px)' }} className="space-y-3 relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{title}</span>
          <div className={`w-9 h-9 rounded-xl ${bgIconClass} flex items-center justify-center font-black shadow-2xs border border-black/5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
          <p className={`text-[11px] font-black mt-2 inline-block px-2 py-0.5 rounded ${subValueColor}`}>{subValue}</p>
        </div>

        {progressPct !== undefined && (
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2.5 overflow-hidden border border-slate-200/40 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                accentColor === 'blue' ? 'bg-emerald-500' :
                accentColor === 'cyan' ? 'bg-cyan-600' :
                accentColor === 'indigo' ? 'bg-indigo-600' :
                'bg-purple-600'
              }`} 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// INTERACTIVE 3D EVENT CARD
// ============================================================================
interface Dashboard3DEventCardProps {
  item: ScheduleEvent;
  onClick: () => void;
}

const Dashboard3DEventCard: React.FC<Dashboard3DEventCardProps> = ({ item, onClick }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / (rect.height / 2)) * 5;
    const rotateY = ((x - centerX) / (rect.width / 2)) * 5;
    setCoords({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateY: coords.x,
        rotateX: coords.y,
        scale: isHovered ? 1.02 : 1,
        z: isHovered ? 8 : 0
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`p-4 rounded-2xl bg-white border transition-all duration-300 cursor-pointer flex items-center justify-between ${
        isHovered 
          ? 'border-blue-300 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.12)]' 
          : 'border-slate-200/60'
      }`}
    >
      <div className="flex items-center gap-3" style={{ transform: 'translateZ(12px)' }}>
        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border transition-all ${
          isHovered ? 'bg-blue-600 text-white border-blue-500 scale-105 shadow-md shadow-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.category} • {item.time} ({item.durationMinutes}m)</p>
        </div>
      </div>
      <span 
        style={{ transform: 'translateZ(15px)' }}
        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
          item.completed 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}
      >
        {item.completed ? 'Completed' : 'Pending'}
      </span>
    </motion.div>
  );
};

// ============================================================================
// INTERACTIVE 3D STUDY SUITE CARD
// ============================================================================
interface Dashboard3DStudySuiteCardProps {
  suite: StudySuite;
  onClick: () => void;
}

const Dashboard3DStudySuiteCard: React.FC<Dashboard3DStudySuiteCardProps> = ({ suite, onClick }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / (rect.height / 2)) * 5;
    const rotateY = ((x - centerX) / (rect.width / 2)) * 5;
    setCoords({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateY: coords.x,
        rotateX: coords.y,
        scale: isHovered ? 1.02 : 1,
        z: isHovered ? 8 : 0
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`p-4 rounded-2xl bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full ${
        isHovered 
          ? 'border-indigo-300 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.12)]' 
          : 'border-slate-200/60 shadow-2xs'
      }`}
    >
      <div style={{ transform: 'translateZ(12px)' }} className="space-y-2">
        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border transition-all ${
          isHovered ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
        }`}>
          {suite.subject}
        </span>
        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{suite.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">{suite.summary}</p>
      </div>

      <div 
        style={{ transform: 'translateZ(8px)' }}
        className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mt-4 pt-2 border-t border-slate-100"
      >
        <span>{suite.flashcards?.length || 0} Flashcards</span>
        <span>•</span>
        <span>{suite.quiz?.length || 0} Quiz Qs</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// INTERACTIVE 3D CAREER ASSISTANT WIDGET
// ============================================================================
interface DashboardCareerAssistantWidgetProps {
  user: UserProfile;
  onClick: () => void;
}

const DashboardCareerAssistantWidget: React.FC<DashboardCareerAssistantWidgetProps> = ({ user, onClick }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / (rect.height / 2)) * 5;
    const rotateY = ((x - centerX) / (rect.width / 2)) * 5;
    setCoords({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateY: coords.x,
        rotateX: coords.y,
        scale: isHovered ? 1.025 : 1,
        z: isHovered ? 10 : 0
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`p-6 rounded-[28px] bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl relative overflow-hidden border cursor-pointer ${
        isHovered ? 'border-indigo-400/60 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)]' : 'border-slate-800'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div style={{ transform: 'translateZ(15px)' }} className="space-y-4 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-black tracking-tight text-white uppercase flex items-center gap-1.5">
            <span>Placement AI Core</span>
            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          </h3>
        </div>

        <p className="text-xs text-indigo-200/90 font-medium leading-relaxed">
          Practice technical interview questions, resume review modules, & custom mock exams curated for <strong>{user.targetRole || 'Software Engineer'}</strong>.
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full py-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-600 text-slate-900 hover:text-white font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
        >
          Practice Technical Interviews
        </button>
      </div>
    </motion.div>
  );
};
import { UserProfile, AttendanceSubject, ScheduleEvent, DSAProblem, StudySuite, AssignmentItem } from '../../types';
import { SectionUsageBanner } from '../common/SectionUsageBanner';
import { calculatePlanDetails } from '../../lib/planUtils';
import { StreakService } from '../../lib/streakService';

interface DashboardViewProps {
  user: UserProfile;
  attendance: AttendanceSubject[];
  schedule: ScheduleEvent[];
  dsa: DSAProblem[];
  studySuites: StudySuite[];
  assignments: AssignmentItem[];
  onNavigateTab: (tab: string) => void;
  onOpenStudyHubUpload: () => void;
  onStartTrial?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  attendance = [],
  schedule = [],
  dsa = [],
  studySuites = [],
  assignments = [],
  onNavigateTab,
  onOpenStudyHubUpload,
  onStartTrial
}) => {
  const planDetails = calculatePlanDetails(user);

  // Calculate statistics
  const safeAttendance = attendance || [];
  const safeDsa = dsa || [];
  const safeSchedule = schedule || [];
  const safeStudySuites = studySuites || [];

  const totalClasses = safeAttendance.reduce((acc, a) => acc + (a.totalClasses || 0), 0);
  const totalAttended = safeAttendance.reduce((acc, a) => acc + (a.attendedClasses || 0), 0);
  const overallAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 85;

  const solvedDSA = safeDsa.filter(d => d && d.solved).length;
  const totalDSA = safeDsa.length;
  const dsaProgressPct = totalDSA > 0 ? Math.round((solvedDSA / totalDSA) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = safeSchedule.filter(s => s && s.date === todayStr);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section Usage Banner */}
      <SectionUsageBanner
        title="Command Dashboard & Telemetry Central"
        subtitle="Your personalized AI-powered academic command center"
        purpose="This Dashboard section serves as your primary academic hub. It aggregates real-time attendance statistics, active study material suites, upcoming assignment deadlines, DSA problem-solving progress, and quick action shortcuts into a single view."
        keyFeatures={[
          'Real-time Academic Health Overview',
          'Quick AI Notes & PDF Study Suite Generator',
          'Instant Class Attendance Tracker',
          'DSA Problem Solving Progress Meter',
          'Upcoming Class & Assignment Schedule'
        ]}
        icon={<Bot className="w-6 h-6 text-white" />}
        badge="Main Dashboard Overview"
      />

      {/* Trial Inactive Banner */}
      {!planDetails.hasActiveAccess && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-500/40 card-3d">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 mt-0.5 shadow-3d-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-2xs">
                  {planDetails.isExpired ? 'Plan Expired' : 'Free Trial Ready'}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                {planDetails.isExpired ? 'Your Subscription Plan Has Expired' : 'Start Your 4-Day Free Trial (₹0) to Unlock All Features'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {planDetails.isExpired 
                  ? 'Please upgrade to Pro Scholar (₹99) or Placivo Pro Ultimate (₹399) to continue using AI tools.'
                  : 'You are currently browsing in website preview mode. Activate your 4-day free trial whenever you are ready!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {!planDetails.freeTrialUsed && onStartTrial && (
              <button
                onClick={onStartTrial}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md btn-3d-emerald flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                <span>Start 4-Day Free Trial</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('pricing')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md btn-3d-blue flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade to Pro Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* Red Streak Risk Warning Banner */}
      {user.stats?.streakAtRisk && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse border-2 border-red-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
              <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
                ⚠️ STREAK AT RISK! ({user.stats?.dsaStreak || 1} Day Streak)
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                You haven't completed any activity today. Complete at least 1 coding question, assignment, or course topic today or your streak will break tomorrow!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('coding')}
            className="px-4 py-2 rounded-xl bg-white text-red-700 font-black text-xs shrink-0 hover:bg-red-50 shadow-md transition-all cursor-pointer"
          >
            Solve a Problem Now →
          </button>
        </div>
      )}

      {/* Personalized Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20 card-3d">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2">
              {(() => {
                const { streak, isAtRisk } = StreakService.getStreakInfo();
                if (isAtRisk) {
                  return (
                    <span className="px-3 py-1 rounded-full font-extrabold text-xs bg-red-600 text-white border border-red-400 flex items-center gap-1.5 shadow-md animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
                      {streak} Day{streak === 1 ? '' : 's'} Study Streak (At Risk! ⚠️)
                    </span>
                  );
                }
                return (
                  <span className="px-3 py-1 rounded-full font-extrabold text-xs backdrop-blur-md border border-indigo-500/30 bg-indigo-500/20 text-indigo-200 flex items-center gap-1.5 shadow-2xs">
                    <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-orange-400 fill-orange-400 animate-pulse' : 'text-slate-400'}`} />
                    {streak} Day{streak === 1 ? '' : 's'} Study Streak
                  </span>
                );
              })()}
              <span className="text-xs text-indigo-200/80 font-bold">{user.university || 'Stanford University'}</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Welcome back, {user.displayName || 'Alex'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/70 leading-relaxed font-medium">
                Target Role: <strong className="text-white font-extrabold">{user.targetRole || 'Software Engineer'}</strong> | Major: <strong className="text-white font-extrabold">{user.major || 'Computer Science'}</strong>
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigateTab('notes')}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 cursor-pointer transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                AI Notes Summarizer
              </button>
              <button
                onClick={onOpenStudyHubUpload}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/20 cursor-pointer transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-white" />
                Upload Study Notes
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <DashboardLogo />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Widget */}
        <Dashboard3DStatCard
          title="Attendance"
          value={`${overallAttendance}%`}
          subValue="Safe & Above 75%"
          subValueColor="text-emerald-700 bg-emerald-100/90"
          icon={<CheckSquare className="w-4.5 h-4.5 text-blue-600" />}
          bgIconClass="bg-blue-50/90"
          progressPct={overallAttendance}
          onClick={() => onNavigateTab('attendance')}
          accentColor="blue"
        />

        {/* AI Study Suites */}
        <Dashboard3DStatCard
          title="Study Suites"
          value={studySuites.length}
          subValue="Active Suites"
          subValueColor="text-indigo-700 bg-indigo-100/90"
          icon={<BookOpen className="w-4.5 h-4.5 text-indigo-600" />}
          bgIconClass="bg-indigo-50"
          onClick={() => onNavigateTab('studyhub')}
          accentColor="indigo"
        />

        {/* DSA Coding Progress */}
        <Dashboard3DStatCard
          title="DSA Solved"
          value={`${solvedDSA} / ${totalDSA}`}
          subValue={`${dsaProgressPct}% Completed`}
          subValueColor="text-cyan-800 bg-cyan-100/90"
          icon={<Code2 className="w-4.5 h-4.5 text-cyan-600" />}
          bgIconClass="bg-cyan-50"
          progressPct={dsaProgressPct}
          onClick={() => onNavigateTab('coding')}
          accentColor="cyan"
        />

        {/* ATS Resume Score */}
        <Dashboard3DStatCard
          title="ATS Resume"
          value="88 / 100"
          subValue="Top 5%"
          subValueColor="text-purple-800 bg-purple-100/90"
          icon={<Award className="w-4.5 h-4.5 text-purple-600" />}
          bgIconClass="bg-purple-50"
          onClick={() => onNavigateTab('resumebuilder')}
          accentColor="purple"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Schedule & Recent Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule & Events Card */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-white/45 backdrop-blur-2xl border border-white/80 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">Today's Study Checklist & Events</h2>
              </div>
              <button
                onClick={() => onNavigateTab('habiturex')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Planner <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {schedule.length > 0 ? (
              <div className="space-y-3">
                {schedule.slice(0, 3).map((item) => (
                  <Dashboard3DEventCard
                    key={item.id}
                    item={item}
                    onClick={() => onNavigateTab('habiturex')}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center">
                <p className="text-xs font-semibold text-slate-500">No events or planner items recorded for today.</p>
                <button
                  onClick={() => onNavigateTab('habiturex')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  + Create Event in Consistency Planner
                </button>
              </div>
            )}
          </div>

          {/* Recent AI Notes & Libraries */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">Recent AI Study Suites</h2>
              </div>
              <button
                onClick={() => onNavigateTab('studyhub')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {studySuites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studySuites.slice(0, 4).map((suite) => (
                  <Dashboard3DStudySuiteCard
                    key={suite.id}
                    suite={suite}
                    onClick={() => onNavigateTab('studyhub')}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Study Suites Generated Yet</p>
                <p className="text-xs text-slate-500 mb-3">Upload your syllabus notes or slides to generate flashcards and quizzes.</p>
                <button
                  onClick={onOpenStudyHubUpload}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  + Upload Document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Quick Placement & AI Shortcuts */}
        <div className="space-y-6">
          {/* AI Career Assistant Launcher */}
          <DashboardCareerAssistantWidget
            user={user}
            onClick={() => onNavigateTab('interviewprep')}
          />

          {/* Quick Attendance Check */}
          <div className="p-6 rounded-[28px] bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3.5 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" /> Subject Attendance Summary
            </h3>
            <div className="space-y-3.5">
              {attendance.slice(0, 3).map((sub) => {
                const total = sub.totalClasses || 0;
                const attended = sub.attendedClasses || 0;
                const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
                return (
                  <div key={sub.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>{sub.name}</span>
                      <span className={pct >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="w-full mt-5 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100 cursor-pointer"
            >
              Open Attendance Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
