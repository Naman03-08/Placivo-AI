import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquareText, 
  FileCheck, 
  FileText,
  CheckSquare, 
  Calendar, 
  Code2, 
  Briefcase, 
  Bell, 
  Settings, 
  ShieldAlert, 
  ShieldCheck,
  Zap, 
  GraduationCap,
  Bot
} from 'lucide-react';
import { UserProfile } from '../../types';
import placivoAILogo from '../landing/Placivo-logo.png';
import dashboardImg from '../Dashboard.png';
import aiLogoImg from '../landing/Placivo-logo.png';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadNotificationsCount: number;
  user?: UserProfile;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  user,
  isMobile = false,
}) => {
  const userEmail = user?.email?.trim().toLowerCase() || '';
  const isAdminUser = userEmail.startsWith('naman03mgs@gmail') || user?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdminUser ? [{ id: 'admin', label: 'Admin Control Hub', icon: ShieldCheck, badge: 'ADMIN' }] : []),
    { id: 'notes', label: 'AI Notes Summarizer', icon: BookOpen, badge: 'AI' },
    { id: 'quiz', label: 'AI Quiz Practice', icon: FileCheck, badge: 'NEW' },
    { id: 'studyhub', label: 'Personal Assistant', icon: Bot, badge: 'AI' },
    { id: 'resumebuilder', label: 'AI Resume Builder', icon: FileText, badge: 'ATS' },
    { id: 'coverletter', label: 'Cover Letter', icon: FileText },
    { id: 'coding', label: 'Coding Hub', icon: Code2, badge: 'DSA' },
    { id: 'courses', label: 'Coding Courses', icon: GraduationCap, badge: 'NEW' },
    { id: 'interviewprep', label: 'Interview Prep', icon: BookOpen, badge: '256 Qs' },
    { id: 'placement', label: 'Startup Jobs & Internship Hub', icon: Briefcase, badge: 'Jobs' },
    { id: 'habiturex', label: 'Habiturex', icon: CheckSquare, badge: 'v3.5' },
    { id: 'pricing', label: 'Upgrade Plans', icon: Zap, badge: 'Plans' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`h-full overflow-y-auto bg-white/50 backdrop-blur-2xl flex flex-col justify-between p-4 shrink-0 shadow-lg z-20 scrollbar-thin ${
      isMobile ? 'w-full' : 'w-64 border-r border-white/80 hidden md:flex'
    }`}>
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 px-3.5 py-2.5 mb-5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xs cursor-pointer hover:bg-white hover:border-blue-200/80 transition-all group"
        >
          <img 
            src={placivoAILogo} 
            alt="Placivo AI" 
            className="h-8 w-auto max-h-8 object-contain rounded-xl group-hover:scale-105 transition-transform shrink-0" 
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                Placivo<span className="text-blue-600">.AI</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                PRO
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">
              Academic Operating System
            </span>
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-3d-blue scale-[1.02]'
                    : 'text-slate-600 hover:bg-white/80 hover:text-blue-600 hover:shadow-xs hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.id === 'studyhub' ? (
                    <img 
                      src={aiLogoImg} 
                      alt="Personal Assistant" 
                      className={`w-4.5 h-4.5 object-cover rounded-md shrink-0 shadow-2xs transition-transform ${isActive ? 'scale-110 ring-1 ring-white/80' : 'border border-blue-200/80'}`} 
                      referrerPolicy="no-referrer"
                    />
                  ) : item.id === 'dashboard' ? (
                    <img 
                      src={dashboardImg} 
                      alt="Dashboard" 
                      className={`w-4.5 h-4.5 object-contain rounded-md shrink-0 shadow-2xs transition-transform ${isActive ? 'scale-110 ring-1 ring-white/80' : 'border border-blue-200/80'}`} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400'}`} />
                  )}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Plan Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2563EB] via-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden mt-6 border border-white/30 card-3d">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs font-black tracking-wide uppercase text-blue-100">Campus Pro</span>
        </div>
        <p className="text-[11px] text-blue-100 leading-snug mb-3.5 font-medium">
          Unlimited AI Chat Tutor, ATS resume checks & technical interview prep!
        </p>
        <button
          onClick={() => onSelectTab('pricing')}
          className="w-full py-2.5 rounded-xl bg-white text-blue-700 font-extrabold text-xs hover:bg-blue-50 transition-all shadow-md btn-3d-blue"
        >
          View Upgrade Plans
        </button>
      </div>
    </aside>
  );
};
