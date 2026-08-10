import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Zap } from 'lucide-react';
import { CanvasBackground } from './components/common/CanvasBackground';
import { Navbar } from './components/common/Navbar';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AuthModal } from './components/auth/AuthModal';

// Landing Page Components
import { Hero } from './components/landing/Hero';
import { TrustedBy } from './components/landing/TrustedBy';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { AgentSandboxesCarousel } from './components/landing/AgentSandboxesCarousel';
import { InteractiveDemo } from './components/landing/InteractiveDemo';
import { PlacementTimeline } from './components/landing/PlacementTimeline';
import { Testimonials } from './components/landing/Testimonials';
import { WhyChooseUs } from './components/landing/WhyChooseUs';
import { FAQ } from './components/landing/FAQ';
import { AIGEOSection } from './components/landing/AIGEOSection';
import { FounderSection } from './components/landing/FounderSection';
import { FooterLanding } from './components/landing/FooterLanding';
import { SEOHead } from './components/common/SEOHead';

// App Portal Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AINotesSummarizerView } from './components/notes/AINotesSummarizerView';
import { AIQuizHubView } from './components/quiz/AIQuizHubView';
import { StudyHubView } from './components/studyhub/StudyHubView';
import { AIChatView } from './components/chat/AIChatView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { HabiturexView } from './components/habiturex/HabiturexView';
import { CodingHubView } from './components/coding/CodingHubView';
import { CodingCoursesView } from './components/courses/CodingCoursesView';
import { InterviewPrepView } from './components/placement/InterviewPrepView';
import { StartupJobsHubView } from './components/placement/StartupJobsHubView';
import { AIResumeBuilderView } from './components/resume/AIResumeBuilderView';
import { AICoverLetterView } from './components/coverletter/AICoverLetterView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { UpgradePlansView } from './components/pricing/UpgradePlansView';
import { UpgradePromptModal } from './components/common/UpgradePromptModal';
import { PlanReloadModal } from './components/common/PlanReloadModal';
import { CertificateVerificationModal } from './components/courses/CertificateVerificationModal';
import { TermsModal } from './components/common/TermsModal';

import { StorageService, getZeroAttendance, getZeroDSA, getZeroResume } from './lib/storage';
import { FirestoreService } from './lib/firestoreService';
import { StreakService } from './lib/streakService';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { UserProfile, StudySuite, AssignmentItem, AttendanceSubject, ScheduleEvent, DSAProblem, ResumeData, AppNotification } from './types';
import { calculatePlanDetails } from './lib/planUtils';
import { CODING_COURSES } from './data/codingCourses';
import { COURSES } from './components/courses/CodingCoursesView';

export function App() {
  const [user, setUser] = useState<UserProfile>(StorageService.getProfile());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const cachedLoggedIn = StorageService.getIsLoggedIn();
    const cachedProfile = StorageService.getProfile();
    return cachedLoggedIn || (!!cachedProfile && cachedProfile.uid !== 'guest_user');
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [termsTab, setTermsTab] = useState<'terms' | 'privacy' | 'cancellation'>('terms');

  const handleOpenTerms = (tab: 'terms' | 'privacy' | 'cancellation' = 'terms') => {
    setTermsTab(tab);
    setShowTermsModal(true);
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string>('this feature');
  const [pendingTabAfterTrial, setPendingTabAfterTrial] = useState<string | null>(null);

  // Plan Reload Modal State (10-second timer on purchase/activation)
  const [showPlanReloadModal, setShowPlanReloadModal] = useState<boolean>(false);
  const [purchasedPlanName, setPurchasedPlanName] = useState<string>('');

  const handlePlanPurchased = (planName: string) => {
    setPurchasedPlanName(planName);
    setShowPlanReloadModal(true);
  };

  // Global Focus Timer State for Navbar Watch & Habiturex (Backed by Local Storage to prevent reset bugs)
  const [focusTimerInitialMinutes, setFocusTimerInitialMinutes] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('campus_os_focus_initial_minutes');
      return cached ? parseInt(cached, 10) : 25;
    } catch {
      return 25;
    }
  });

  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(() => {
    try {
      const cachedSeconds = localStorage.getItem('campus_os_focus_seconds');
      if (cachedSeconds) {
        return parseInt(cachedSeconds, 10);
      }
      const cachedMins = localStorage.getItem('campus_os_focus_initial_minutes');
      return cachedMins ? parseInt(cachedMins, 10) * 60 : 25 * 60;
    } catch {
      return 25 * 60;
    }
  });

  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState<boolean>(() => {
    try {
      const cachedRunning = localStorage.getItem('campus_os_focus_running');
      return cachedRunning === 'true';
    } catch {
      return false;
    }
  });

  const [focusTimerMode, setFocusTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');

  // Keep Local Storage synced with Focus Timer state
  useEffect(() => {
    try {
      localStorage.setItem('campus_os_focus_initial_minutes', focusTimerInitialMinutes.toString());
    } catch {}
  }, [focusTimerInitialMinutes]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_os_focus_seconds', focusTimerSeconds.toString());
    } catch {}
  }, [focusTimerSeconds]);

  useEffect(() => {
    try {
      localStorage.setItem('campus_os_focus_running', isFocusTimerRunning.toString());
    } catch {}
  }, [isFocusTimerRunning]);

  // Use a ref to access latest user data without restarting interval ticks
  const userRefForTimer = React.useRef(user);
  useEffect(() => {
    userRefForTimer.current = user;
  }, [user]);

  // Focus Timer Tick Interval in App.tsx (never unmounts during tab switches)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocusTimerRunning) {
      interval = setInterval(() => {
        setFocusTimerSeconds((prevSeconds) => {
          if (prevSeconds > 1) {
            return prevSeconds - 1;
          }
          // Timer completed!
          setIsFocusTimerRunning(false);
          const currentUid = userRefForTimer.current?.uid;
          if (currentUid) {
            const today = new Date().toISOString().split('T')[0];
            FirestoreService.getHabiturexData(currentUid).then(data => {
              const currentLog = data?.studyHoursLog || {};
              const currentStats = data?.stats || { credits: 0, flameStreak: 0, xp: 0, perfectDays: 0 };
              const newLog = {
                ...currentLog,
                [today]: (currentLog[today] || 0) + 0.5
              };
              FirestoreService.saveHabiturexData(currentUid, {
                tasks: data?.tasks || [],
                missions: data?.missions || [],
                events: data?.events || [],
                studyHoursLog: newLog,
                stats: {
                  ...currentStats,
                  credits: (currentStats.credits || 0) + 50
                }
              }).catch(err => console.warn('Focus timer save error:', err));
            });
          }
          alert('🎉 Focus Session Completed! +50 Gold Credits Earned.');
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusTimerRunning]);

  const displayFocusMinutes = Math.floor(focusTimerSeconds / 60);
  const displayFocusSeconds = focusTimerSeconds % 60;

  const focusTimerInfo = {
    active: isFocusTimerRunning || focusTimerSeconds < focusTimerInitialMinutes * 60,
    isRunning: isFocusTimerRunning,
    minutes: displayFocusMinutes,
    seconds: displayFocusSeconds,
    mode: focusTimerMode,
    onTogglePlay: () => setIsFocusTimerRunning(prev => !prev),
    onReset: () => {
      setIsFocusTimerRunning(false);
      const resetSeconds = focusTimerInitialMinutes * 60;
      setFocusTimerSeconds(resetSeconds);
    }
  };

  // Global Certificate QR code verification listener
  const [globalVerifyCertId, setGlobalVerifyCertId] = useState<string | null>(null);
  const [showGlobalCertModal, setShowGlobalCertModal] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyCertCode = params.get('verifyCert');
    if (verifyCertCode) {
      setGlobalVerifyCertId(verifyCertCode);
      setShowGlobalCertModal(true);
    }
  }, []);

  const gatedTabs = ['notes', 'quiz', 'studyhub', 'resumebuilder', 'chat', 'attendance', 'habiturex', 'coding', 'interviewprep', 'placement'];

  const getTabDisplayName = (tabId: string) => {
    switch (tabId) {
      case 'dashboard': return 'Main Dashboard Overview';
      case 'notes': return 'AI Smart Notes Summarizer';
      case 'quiz': return 'AI Practice Quiz Hub';
      case 'studyhub':
      case 'chat': 
        return 'Personal Assistant';
      case 'attendance': return 'Attendance Manager & Calculator';
      case 'habiturex': return 'Habiturex Daily Consistency OS';
      case 'resumebuilder': return 'AI Resume Builder';
      case 'coverletter': return 'Cover Letter';
      case 'coding': return 'Coding Hub & 375 DSA Roadmap Sheet';
      case 'courses': return 'Interactive Coding Courses & Academies';
      case 'interviewprep': return 'Technical Interview Prep & Question Bank';
      case 'placement': return 'Startup Jobs & Internship Hub';
      case 'admin': return 'Admin Control Hub';
      default: return 'this AI feature';
    }
  };

  const handleNavigateTabWithGuard = (tabId: string, customFeatureName?: string) => {
    // Allow direct navigation to any tab so they can see all the pages, even if subscription is expired
    setActiveTab(tabId);
  };

  const handleStartFreeTrial = () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 Days
    const updated: UserProfile = {
      ...user,
      plan: 'free_trial',
      freeTrialUsed: true,
      freeTrialStartedAt: now.toISOString(),
      planStartedAt: now.toISOString(),
      planExpiresAt: expiresAt.toISOString()
    };
    handleUpdateProfile(updated);
    if (pendingTabAfterTrial) {
      setActiveTab(pendingTabAfterTrial);
      setPendingTabAfterTrial(null);
    }
    handlePlanPurchased('4-Day Free Trial Pass');
  };

  // Core Data State
  const [studySuites, setStudySuites] = useState<StudySuite[]>(StorageService.getStudySuites());
  const [assignments, setAssignments] = useState<AssignmentItem[]>(StorageService.getAssignments());
  const [attendance, setAttendance] = useState<AttendanceSubject[]>(StorageService.getAttendance());
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(StorageService.getSchedule());
  const [dsa, setDSA] = useState<DSAProblem[]>(StorageService.getDSA());
  const [resumeData, setResumeData] = useState<ResumeData>(StorageService.getResume());
  const [notifications, setNotifications] = useState<AppNotification[]>(StorageService.getNotifications());

  // Helper to recalculate and sync user stats to Firestore for real-time Admin Monitoring
  const syncUserStats = async (
    currentProfile: UserProfile,
    currentAttendance: AttendanceSubject[],
    currentDSA: DSAProblem[],
    currentAssignments: AssignmentItem[],
    currentSuites: StudySuite[],
    currentResume: ResumeData
  ) => {
    if (!currentProfile || !currentProfile.uid) return;

    const totalAttended = currentAttendance.reduce((acc, s) => acc + s.attendedClasses, 0);
    const totalClasses = currentAttendance.reduce((acc, s) => acc + s.totalClasses, 0);
    const attPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

    const dsaSolved = currentDSA.filter((p) => p.solved).length;
    const assignmentsSolved = currentAssignments.filter((a) => a.status === 'solved' || a.status === 'submitted').length;
    const mockList = StorageService.getMockInterviews();
    const avgMockScore = mockList.length > 0
      ? Math.round(mockList.reduce((acc, i) => acc + i.overallScore, 0) / mockList.length)
      : 0;

    let courseTopicsCompleted = 0;
    try {
      const savedTopics = localStorage.getItem('campus_os_completed_topics');
      if (savedTopics) {
        const parsed = JSON.parse(savedTopics);
        courseTopicsCompleted = Object.values(parsed).filter(Boolean).length;
      }
    } catch {
      courseTopicsCompleted = 0;
    }

    const totalActivityCount = dsaSolved + assignmentsSolved + courseTopicsCompleted;

    let prevActivityCount = 0;
    try {
      prevActivityCount = parseInt(localStorage.getItem('campus_os_prev_activity_count') || '0', 10);
    } catch {
      prevActivityCount = 0;
    }
    
    let streakInfo = StreakService.evaluateStreak();

    if (totalActivityCount > prevActivityCount && totalActivityCount > 0) {
      streakInfo = StreakService.recordActivity();
      try {
        localStorage.setItem('campus_os_prev_activity_count', totalActivityCount.toString());
      } catch {}
    } else if (totalActivityCount > 0 && !streakInfo.completedToday) {
      streakInfo = StreakService.recordActivity();
      try {
        localStorage.setItem('campus_os_prev_activity_count', totalActivityCount.toString());
      } catch {}
    } else if (totalActivityCount === 0) {
      try {
        localStorage.setItem('campus_os_prev_activity_count', '0');
      } catch {}
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      stats: {
        attendancePercentage: attPct,
        totalClassesAttended: totalAttended,
        totalClassesHeld: totalClasses,
        dsaSolvedCount: dsaSolved,
        dsaTotalCount: currentDSA.length,
        dsaStreak: streakInfo.streak,
        streakAtRisk: streakInfo.isAtRisk,
        streakCompletedToday: streakInfo.completedToday,
        assignmentsSolvedCount: assignmentsSolved,
        assignmentsTotalCount: currentAssignments.length,
        studySuitesCount: currentSuites.length,
        mockInterviewsCount: mockList.length,
        avgMockInterviewScore: avgMockScore,
        resumeAtsScore: currentResume?.atsScore || 0,
        lastActiveAt: new Date().toISOString(),
      },
    };

    setUser(updatedProfile);
    StorageService.saveProfile(updatedProfile);
    await FirestoreService.saveProfile(updatedProfile);
  };

  // Listen to Firebase Auth state changes with real-time profile sync
  useEffect(() => {
    if (!auth) return;
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (fbUser) {
        setIsLoggedIn(true);
        StorageService.setIsLoggedIn(true);

        // Subscribe to real-time profile changes so admin edits take effect instantly
        profileUnsubscribe = FirestoreService.subscribeToProfile(fbUser.uid, (updatedProfile) => {
          if (updatedProfile) {
            setUser(updatedProfile);
            StorageService.saveProfile(updatedProfile);
          }
        });

        // Load Profile from Firestore initially
        let fsProfile = await FirestoreService.getProfile(fbUser.uid);
        if (!fsProfile) {
          // Initialize NEW registered user with 100% ZERO data
          StorageService.initializeZeroUserStorage(fbUser.uid, fbUser.email || '', fbUser.displayName || '');
          fsProfile = await FirestoreService.initializeNewUserWithZeroData(
            fbUser.uid,
            fbUser.email || '',
            fbUser.displayName || ''
          );
          setUser(fsProfile);
          StorageService.saveProfile(fsProfile);
        }

        if (fsProfile && typeof fsProfile.stats?.dsaStreak === 'number') {
          StreakService.syncStreak(fsProfile.stats.dsaStreak, fsProfile.stats.lastActiveAt);
        }

        // Hydrate data from Firestore
        try {
          const fsSuites = await FirestoreService.getStudySuites(fbUser.uid);
          setStudySuites(fsSuites);

          const fsAssignments = await FirestoreService.getAssignments(fbUser.uid);
          setAssignments(fsAssignments);

          const fsAttendance = await FirestoreService.getAttendance(fbUser.uid);
          const filteredAttendance = fsAttendance.filter(item => !item.id.startsWith('att-'));
          setAttendance(filteredAttendance);
          StorageService.saveAttendance(filteredAttendance);
          
          if (filteredAttendance.length !== fsAttendance.length) {
            // Delete the default preloaded subjects from Firestore
            const defaultSubjects = fsAttendance.filter(item => item.id.startsWith('att-'));
            for (const item of defaultSubjects) {
              await FirestoreService.deleteAttendanceSubject(item.id);
            }
          }

          const fsSchedule = await FirestoreService.getSchedule(fbUser.uid);
          setSchedule(fsSchedule);

          const fsDSA = await FirestoreService.getDSA(fbUser.uid);
          if (fsDSA.length > 0) {
            setDSA(fsDSA);
          } else {
            const zeroD = getZeroDSA(fbUser.uid);
            setDSA(zeroD);
            await FirestoreService.saveDSA(fbUser.uid, zeroD);
          }

          const fsResume = await FirestoreService.getResume(fbUser.uid);
          if (fsResume) {
            setResumeData(fsResume);
          } else {
            const zeroRes = getZeroResume(fbUser.uid, fsProfile.displayName, fsProfile.email);
            setResumeData(zeroRes);
            await FirestoreService.saveResume(fbUser.uid, zeroRes);
          }
        } catch (e) {
          console.warn("Error hydrating student data from Firestore:", e);
        }
      } else {
        // If not authenticated in Firebase and local storage says not logged in
        if (!StorageService.getIsLoggedIn()) {
          setIsLoggedIn(false);
        }
      }
    });
    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (newProfile: UserProfile) => {
    setUser(newProfile);
    setIsLoggedIn(true);
    StorageService.setIsLoggedIn(true);
    StorageService.saveProfile(newProfile);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    StorageService.setIsLoggedIn(false);
    StorageService.clearUserData();
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut error:", e);
      }
    }
    setIsLoggedIn(false);
    setUser(StorageService.getProfile());
  };

  const handleSaveSuite = (suite: StudySuite) => {
    const updated = [suite, ...studySuites];
    setStudySuites(updated);
    StorageService.saveStudySuites(updated);
    if (user.uid) {
      FirestoreService.saveStudySuite(user.uid, suite);
      syncUserStats(user, attendance, dsa, assignments, updated, resumeData);
    }
  };

  const handleDeleteSuite = (id: string) => {
    const updated = studySuites.filter((s) => s.id !== id);
    setStudySuites(updated);
    StorageService.saveStudySuites(updated);
    FirestoreService.deleteStudySuite(id);
    if (user.uid) {
      syncUserStats(user, attendance, dsa, assignments, updated, resumeData);
    }
  };

  const handleAddAssignment = (item: AssignmentItem) => {
    const updated = [item, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    if (user.uid) {
      FirestoreService.saveAssignment(user.uid, item);
      syncUserStats(user, attendance, dsa, updated, studySuites, resumeData);
    }
  };

  const handleUpdateAttendance = async (subs: AttendanceSubject[]) => {
    // Find deleted subjects to remove from database
    const deletedSubjects = attendance.filter(oldSub => !subs.some(newSub => newSub.id === oldSub.id));
    
    setAttendance(subs);
    StorageService.saveAttendance(subs);
    
    if (user.uid) {
      for (const item of deletedSubjects) {
        await FirestoreService.deleteAttendanceSubject(item.id);
      }
      await FirestoreService.saveAttendance(user.uid, subs);
      syncUserStats(user, subs, dsa, assignments, studySuites, resumeData);
    }
  };

  const handleAddEvent = (evt: ScheduleEvent) => {
    const updated = [...schedule, evt];
    setSchedule(updated);
    StorageService.saveSchedule(updated);
    if (user.uid) {
      FirestoreService.saveSchedule(user.uid, updated);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const updated = schedule.filter((e) => e.id !== id);
    setSchedule(updated);
    StorageService.saveSchedule(updated);
    if (user.uid) {
      FirestoreService.saveSchedule(user.uid, updated);
    }
  };

  const handleToggleDSA = (id: string) => {
    const updated = dsa.map((p) => (p.id === id ? { ...p, solved: !p.solved } : p));
    setDSA(updated);
    StorageService.saveDSA(updated);
    if (user.uid) {
      FirestoreService.saveDSA(user.uid, updated);
      syncUserStats(user, attendance, updated, assignments, studySuites, resumeData);
    }
  };

  const handleResetDSASheet = (newSheet: DSAProblem[]) => {
    setDSA(newSheet);
    StorageService.saveDSA(newSheet);
    if (user.uid) {
      FirestoreService.saveDSA(user.uid, newSheet);
      syncUserStats(user, attendance, newSheet, assignments, studySuites, resumeData);
    }
  };

  const handleUpdateResume = (r: ResumeData) => {
    setResumeData(r);
    StorageService.saveResume(r);
    if (user.uid) {
      FirestoreService.saveResume(user.uid, r);
      syncUserStats(user, attendance, dsa, assignments, studySuites, r);
    }
  };

  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    StorageService.saveProfile(updated);
    if (user.uid) {
      FirestoreService.saveProfile(updated);
    }
  };

  const handleMarkReadNotification = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    StorageService.saveNotifications([]);
  };

  const scrollToLandingSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const planDetails = calculatePlanDetails(user);
  const checkTabs = ['placement', 'interviewprep'];
  const isCheckTab = checkTabs.includes(activeTab);

  const planIncludesTab = (planId: string, tabId: string): boolean => {
    const normId = planId ? planId.trim().toLowerCase() : '';
    if (normId === 'plan_349' || normId === 'plan_399' || normId.includes('ultimate') || normId.includes('pro')) {
      // Pro Ultimate / active pro plan includes everything
      return true;
    }
    if (normId === 'plan_199' || normId.includes('scholar')) {
      // Pro Scholar includes everything except placement
      return tabId !== 'placement';
    }
    if (normId === 'free_trial' || normId.includes('trial')) {
      // Free trial includes study suite, coding sheet, chats, resumebuilder, and attendance tracker
      // But does NOT include placement and interviewprep
      return tabId !== 'placement' && tabId !== 'interviewprep';
    }
    return false;
  };

  const isTabExcludedByPlan = isCheckTab && (!planDetails.hasActiveAccess || !planIncludesTab(planDetails.currentPlanId, activeTab));

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* 3D WebGL Canvas Ambient Particle Background */}
      <CanvasBackground />

      <SEOHead activeTab={isLoggedIn ? activeTab : 'landing'} />

      {/* VIEWMODE 1: LANDING PAGE (If not logged in) */}
      {!isLoggedIn ? (
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar
            onNavigateLandingSection={scrollToLandingSection}
            onOpenAuth={handleOpenAuth}
            onLaunchApp={() => setIsLoggedIn(true)}
            isLoggedIn={isLoggedIn}
          />

          <main className="flex-1">
            <Hero
              onOpenAuth={() => handleOpenAuth('register')}
              onExploreDemo={() => scrollToLandingSection('demo')}
            />
            <TrustedBy />
            <FeaturesGrid />
            <AgentSandboxesCarousel onOpenAuth={() => handleOpenAuth('register')} />
            <InteractiveDemo />
            <PlacementTimeline />
            <Testimonials />
            <WhyChooseUs onOpenAuth={() => handleOpenAuth('register')} />
            <AIGEOSection />
            <FounderSection />
            <FAQ />
          </main>

          <FooterLanding onOpenTerms={handleOpenTerms} />
        </div>
      ) : (
        /* VIEWMODE 2: APP WORKSPACE PORTAL (If logged in) */
        <div className="relative z-10 h-screen w-full max-w-full overflow-hidden flex flex-col">
          <Header
            user={user}
            notifications={notifications}
            focusTimer={focusTimerInfo}
            onMarkReadNotification={handleMarkReadNotification}
            onDeleteNotification={handleDeleteNotification}
            onClearNotifications={handleClearNotifications}
            onOpenSettings={() => setActiveTab('settings')}
            onToggleAIChat={() => handleNavigateTabWithGuard('chat', 'AI Chat Assistant')}
            onLogout={handleLogout}
            onNavigateTab={handleNavigateTabWithGuard}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          />

          <div className="flex-1 flex w-full overflow-hidden relative">
            {/* Mobile Sidebar Slide-over Drawer Overlay */}
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-50 flex md:hidden">
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                
                {/* Slide Drawer Content */}
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transition-transform duration-300 transform translate-x-0">
                  {/* Close button */}
                  <div className="absolute top-4 right-4 z-50">
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 h-full overflow-hidden pt-12">
                    <Sidebar
                      activeTab={activeTab}
                      onSelectTab={(tab) => {
                        handleNavigateTabWithGuard(tab);
                        setIsMobileSidebarOpen(false);
                      }}
                      unreadNotificationsCount={notifications.filter((n) => !n.read).length}
                      user={user}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={handleNavigateTabWithGuard}
              unreadNotificationsCount={notifications.filter((n) => !n.read).length}
              user={user}
            />

            {/* Main Stage View Area */}
            <main className="flex-1 h-full overflow-y-auto p-3 sm:p-5 lg:p-6 min-w-0 max-w-full scrollbar-thin relative">
              <div 
                className={
                  isTabExcludedByPlan
                    ? "pointer-events-none select-none opacity-[0.01] scale-95 origin-center transition-all duration-500"
                    : !calculatePlanDetails(user).hasActiveAccess && gatedTabs.includes(activeTab)
                      ? "pointer-events-none select-none opacity-70"
                      : ""
                }
                style={{
                  filter: isTabExcludedByPlan ? 'blur(180px) saturate(0)' : undefined
                }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardView
                    user={user}
                    attendance={attendance}
                    schedule={schedule}
                    dsa={dsa}
                    studySuites={studySuites}
                    assignments={assignments}
                    onNavigateTab={handleNavigateTabWithGuard}
                    onOpenStudyHubUpload={() => handleNavigateTabWithGuard('studyhub', 'AI Personal Assistant Upload')}
                    onStartTrial={handleStartFreeTrial}
                  />
                )}

                {activeTab === 'notes' && (
                  <AINotesSummarizerView
                    user={user}
                    onSaveSuite={handleSaveSuite}
                    onDeleteSuite={handleDeleteSuite}
                    onNavigateTab={handleNavigateTabWithGuard}
                    studySuites={studySuites}
                  />
                )}

                {activeTab === 'quiz' && (
                  <AIQuizHubView
                    user={user}
                  />
                )}

                {(activeTab === 'studyhub' || activeTab === 'chat') && (
                  <StudyHubView
                    user={user}
                    studySuites={studySuites}
                    onSaveSuite={handleSaveSuite}
                    onDeleteSuite={handleDeleteSuite}
                  />
                )}

                {(activeTab === 'habiturex' || activeTab === 'attendance') && (
                  <HabiturexView
                    user={user}
                    attendance={attendance}
                    onUpdateAttendance={handleUpdateAttendance}
                    onSyncUserStats={() => syncUserStats(user, attendance, dsa, assignments, studySuites, resumeData)}
                    focusTimerSeconds={focusTimerSeconds}
                    focusTimerInitialMinutes={focusTimerInitialMinutes}
                    isFocusTimerRunning={isFocusTimerRunning}
                    focusTimerMode={focusTimerMode}
                    onToggleFocusTimer={() => setIsFocusTimerRunning(prev => !prev)}
                    onResetFocusTimer={() => {
                      setIsFocusTimerRunning(false);
                      setFocusTimerSeconds(focusTimerInitialMinutes * 60);
                    }}
                    onSetFocusTimerDuration={(mins: number) => {
                      setIsFocusTimerRunning(false);
                      setFocusTimerInitialMinutes(mins);
                      setFocusTimerSeconds(mins * 60);
                    }}
                    initialInnerTab={activeTab === 'attendance' ? 'attendance' : undefined}
                  />
                )}

                {activeTab === 'coding' && (
                  <CodingHubView
                    user={user}
                    dsa={dsa}
                    onToggleSolved={handleToggleDSA}
                    onResetDSASheet={handleResetDSASheet}
                    onNavigateTab={handleNavigateTabWithGuard}
                  />
                )}

                {activeTab === 'courses' && (
                  <CodingCoursesView
                    user={user}
                    onNavigateTab={handleNavigateTabWithGuard}
                    onUpdateCourseTopics={() => syncUserStats(user, attendance, dsa, assignments, studySuites, resumeData)}
                  />
                )}

                {activeTab === 'resumebuilder' && (
                  <AIResumeBuilderView
                    user={user}
                    resumeData={resumeData}
                    onUpdateResume={handleUpdateResume}
                    onNavigateTab={handleNavigateTabWithGuard}
                  />
                )}

                {activeTab === 'coverletter' && (
                  <AICoverLetterView />
                )}

                {activeTab === 'interviewprep' && (
                  <InterviewPrepView
                    user={user}
                    resumeData={resumeData}
                    onNavigateTab={handleNavigateTabWithGuard}
                  />
                )}

                {activeTab === 'placement' && (
                  <StartupJobsHubView
                    user={user}
                    resumeData={resumeData}
                    onUpdateResume={handleUpdateResume}
                    onNavigateTab={handleNavigateTabWithGuard}
                  />
                )}

                {activeTab === 'pricing' && (
                  <UpgradePlansView
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    onPlanPurchased={handlePlanPurchased}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsView 
                    user={user} 
                    onSaveProfile={handleUpdateProfile}
                    onNavigateTab={setActiveTab}
                    onOpenTerms={handleOpenTerms}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminPanelView
                    user={user}
                    onNavigateTab={handleNavigateTabWithGuard}
                  />
                )}
              </div>

              {/* Heavy Lock Overlay for Excluded Tabs */}
              {isTabExcludedByPlan && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-2xl">
                  <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                      <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-4">
                      Upgrade Plan Required
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                      Unlock {getTabDisplayName(activeTab)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {planDetails.hasActiveAccess 
                        ? `Your current plan (${planDetails.planName}) does not include access to the ${getTabDisplayName(activeTab)}. Upgrade your plan to unlock full unlimited access.`
                        : `Your access to the ${getTabDisplayName(activeTab)} has expired. Upgrade your plan to restore full unlimited access.`
                      }
                    </p>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Upgrade to Unlock</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sticky View-Only Mode Alert Banner */}
              {!calculatePlanDetails(user).hasActiveAccess && gatedTabs.includes(activeTab) && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-[calc(50%+112px)] z-50 w-[90%] max-w-xl bg-white border border-amber-200 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Plan Expired (View-Only Mode)</h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                        Your free trial has expired. You can see your dashboard, notes, and progress, but creating new content or chatting is locked.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-blue-600/10"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Upgrade</span>
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        onOpenTerms={handleOpenTerms}
      />

      {/* Feature Upgrade & Free Trial Prompt Modal */}
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        user={user}
        onStartTrial={handleStartFreeTrial}
        onNavigateToPricing={() => setActiveTab('pricing')}
        featureName={upgradeFeatureName}
      />

      {/* Global QR Code Verification Portal */}
      <CertificateVerificationModal
        isOpen={showGlobalCertModal}
        onClose={() => setShowGlobalCertModal(false)}
        certificateId={globalVerifyCertId}
      />

      {/* Terms & Conditions / Privacy Policy Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialTab={termsTab}
      />

      {/* 10-Second Website Reload & Refresh Overlay Modal on Plan Purchase */}
      <PlanReloadModal
        isOpen={showPlanReloadModal}
        planName={purchasedPlanName}
      />
    </div>
  );
}
export default App;
