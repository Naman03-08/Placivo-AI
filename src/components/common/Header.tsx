import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Flame, 
  Bot, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  Trash2,
  Check,
  CheckCheck,
  AlertCircle,
  Calendar,
  X,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Menu
} from 'lucide-react';
import { UserProfile, AppNotification } from '../../types';
import { StreakService } from '../../lib/streakService';

export interface FocusTimerInfo {
  active: boolean;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  onTogglePlay?: () => void;
  onReset?: () => void;
}

interface HeaderProps {
  user: UserProfile;
  notifications: AppNotification[];
  focusTimer?: FocusTimerInfo;
  onMarkReadNotification: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onClearNotifications: () => void;
  onOpenSettings: () => void;
  onToggleAIChat: () => void;
  onLogout: () => void;
  onNavigateTab: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  focusTimer,
  onMarkReadNotification,
  onDeleteNotification,
  onClearNotifications,
  onOpenSettings,
  onToggleAIChat,
  onLogout,
  onNavigateTab,
  onToggleMobileSidebar,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) onMarkReadNotification(n.id);
    });
  };

  const streakInfo = StreakService.getStreakInfo();

  return (
    <>
      <header className="sticky top-0 z-30 w-full h-16 bg-white/50 backdrop-blur-2xl border-b border-white/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
      {/* Mobile Hamburger Toggle */}
      {onToggleMobileSidebar && (
        <button
          onClick={onToggleMobileSidebar}
          className="mr-1.5 p-1.5 sm:mr-2 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer md:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search Command Input */}
      <div className="flex items-center gap-3 flex-1 max-w-[120px] xs:max-w-[180px] sm:max-w-md">
        <div className="relative w-full group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Ask Placivo AI..."
            className="w-full pl-8 sm:pl-10 pr-4 sm:pr-12 py-2 text-xs sm:text-sm rounded-xl bg-white/80 backdrop-blur-md border border-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-3d-sm transition-all font-semibold text-slate-800 placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onToggleAIChat();
              }
            }}
          />
          <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 bg-slate-100/90 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Persistent Focus Time Watch (If active / running or when user leaves Habiturex) */}
        {focusTimer && (focusTimer.active || focusTimer.isRunning) && (
          <div 
            onClick={() => onNavigateTab('habiturex')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs font-black shadow-md cursor-pointer transition-all ${
              focusTimer.isRunning
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Focus Time Watch - Click to open Habiturex"
          >
            <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${focusTimer.isRunning ? 'text-amber-300 animate-spin' : 'text-amber-600'}`} />
            <span className="tabular-nums font-mono text-[10px] sm:text-xs">
              {String(focusTimer.minutes).padStart(2, '0')}:{String(focusTimer.seconds).padStart(2, '0')}
            </span>

            {focusTimer.onTogglePlay && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  focusTimer.onTogglePlay?.();
                }}
                className={`p-0.5 rounded-full transition-colors ${
                  focusTimer.isRunning 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-amber-200 hover:bg-amber-300 text-amber-900'
                }`}
                title={focusTimer.isRunning ? 'Pause Focus Session' : 'Resume Focus Session'}
              >
                {focusTimer.isRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              </button>
            )}
          </div>
        )}
        {/* Study Streak Badge */}
        {(() => {
          const { streak, isAtRisk } = streakInfo;
          if (isAtRisk) {
            return (
              <div 
                title="Streak at Risk! Complete 1 task today or your streak breaks tomorrow!"
                className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 border border-red-400 text-white text-[10px] sm:text-xs font-black shadow-md shadow-red-500/20 cursor-pointer hover:scale-105 transition-all animate-pulse"
                onClick={() => onNavigateTab('coding')}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce shrink-0" />
                <span className="hidden xs:inline">{streak} Day{streak === 1 ? '' : 's'} (Risk! ⚠️)</span>
                <span className="xs:hidden">{streak}⚠️</span>
              </div>
            );
          }
          return (
            <div 
              title="Daily Study Streak"
              className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-black shadow-3d-sm cursor-pointer hover:scale-105 transition-all ${
                streak > 0 
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-600' 
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-bounce' : 'text-slate-400'}`} />
              <span className="hidden xs:inline">{streak} Day{streak === 1 ? '' : 's'} Streak</span>
              <span className="xs:hidden">{streak}🔥</span>
            </div>
          );
        })()}

        {/* Quick AI Trigger */}
        <button
          onClick={onToggleAIChat}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2563EB] text-white font-extrabold text-xs sm:text-sm shadow-md btn-3d-blue cursor-pointer transition-all"
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications Button & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsMenu && (
            <>
              {/* Backdrop closer */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotificationsMenu(false)} 
              />

              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Popover Header */}
                <div className="p-3.5 px-4 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h3 className="font-black text-xs sm:text-sm text-slate-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-[11px] font-extrabold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Delete all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List (Short & Small Format) */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/80">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                      <p>No notifications right now.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">You're all caught up on academic alerts!</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 px-4 transition-all flex items-start justify-between gap-2 group ${
                          n.read ? 'bg-white opacity-75' : 'bg-blue-50/50 font-medium'
                        }`}
                      >
                        <div 
                          className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                          onClick={() => !n.read && onMarkReadNotification(n.id)}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                            n.type === 'attendance' ? 'bg-amber-100 text-amber-700' :
                            n.type === 'assignment' ? 'bg-purple-100 text-purple-700' :
                            n.type === 'exam' ? 'bg-red-100 text-red-700' :
                            n.type === 'placement' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {n.type === 'exam' || n.type === 'attendance' ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : n.type === 'assignment' ? (
                              <Calendar className="w-3.5 h-3.5" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs leading-snug truncate ${n.read ? 'font-semibold text-slate-800' : 'font-black text-slate-900'}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-tight font-normal">
                              {n.message}
                            </p>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 block">
                              {n.createdAt || 'Just now'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: Mark Read & Delete */}
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {!n.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkReadNotification(n.id);
                              }}
                              className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteNotification(n.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationsMenu(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-md shadow-blue-500/20">
              {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'EX'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user.displayName || 'Alex Rivers'}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {user.university || 'Stanford University'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user.displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-wider">
                    {user.major || 'Computer Science'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile & Settings
                </button>

                {(user?.email?.trim().toLowerCase().startsWith('naman03mgs@gmail') || user?.role === 'admin') && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateTab('admin');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Admin Panel
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  </>
);
};

