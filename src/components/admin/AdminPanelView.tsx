import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Database, 
  Users, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck,
  RefreshCw,
  Search,
  BookOpen,
  Code2,
  FileCheck,
  Briefcase,
  GraduationCap,
  Calendar,
  X,
  ExternalLink,
  Clock,
  BarChart3,
  Award,
  DollarSign,
  CreditCard,
  TrendingUp,
  Mail,
  Send,
  CheckSquare,
  Square,
  Settings,
  HelpCircle,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  UserX,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { UserProfile, MonthlyProfitRecord, StudentCoursePurchase, GlobalBounty, UserBountySubmission } from '../../types';
import { FirestoreService, UserFullData } from '../../lib/firestoreService';
import { StorageService } from '../../lib/storage';
import { SectionUsageBanner } from '../common/SectionUsageBanner';

interface AdminPanelViewProps {
  user?: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

const ADMIN_EMAIL = 'naman03mgs@gmail.com';
const SECURITY_KEY = 'Naman@#2008';

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ user, onNavigateTab }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('placivo_admin_unlocked') === 'true' || sessionStorage.getItem('campusos_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [securityInput, setSecurityInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  // Active Admin Section Tab: 'telemetry' | 'financials' | 'bounties'
  const [activeAdminTab, setActiveAdminTab] = useState<'telemetry' | 'financials' | 'bounties'>('telemetry');

  // Firestore Registered Users State
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Student Inspection Modal State
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
  const [inspectData, setInspectData] = useState<UserFullData | null>(null);
  const [loadingInspect, setLoadingInspect] = useState<boolean>(false);
  const [inspectTab, setInspectTab] = useState<'attendance' | 'dsa' | 'assignments' | 'suites' | 'mock'>('attendance');

  // -------------------------------------------------------------
  // BOUNTIES & GLOBAL TASKS STATE
  // -------------------------------------------------------------
  const [globalBounties, setGlobalBounties] = useState<GlobalBounty[]>([]);
  const [loadingBounties, setLoadingBounties] = useState<boolean>(false);
  const [showCreateBountyModal, setShowCreateBountyModal] = useState<boolean>(false);
  const [bountySubmissions, setBountySubmissions] = useState<UserBountySubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);

  const [bountyForm, setBountyForm] = useState({
    title: '',
    category: 'Full-Stack & AI' as GlobalBounty['category'],
    difficulty: 'Hard' as GlobalBounty['difficulty'],
    rewardCredits: 500,
    description: '',
    deliverablesText: 'Public GitHub Repository URL\nLive Deployed Application Link',
    verificationType: 'Link Submission' as GlobalBounty['verificationType'],
    tagsText: 'AI, FullStack, React',
    expiryDate: '2026-12-31'
  });

  // -------------------------------------------------------------
  // SECTION 1 STATE: Financials, Gross Profits & Course Purchases
  // -------------------------------------------------------------
  const [monthlyProfits, setMonthlyProfits] = useState<MonthlyProfitRecord[]>([]);
  const [loadingProfits, setLoadingProfits] = useState<boolean>(false);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => new Date().toISOString().slice(0, 7));

  const [coursePurchases, setCoursePurchases] = useState<StudentCoursePurchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState<boolean>(false);

  // New Monthly Record Modal Form
  const [showAddMonthModal, setShowAddMonthModal] = useState<boolean>(false);
  const [newMonthKey, setNewMonthKey] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().slice(0, 7);
  });
  const [newMonthName, setNewMonthName] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });
  const [newSubRevenue, setNewSubRevenue] = useState('0');
  const [newCourseRevenue, setNewCourseRevenue] = useState('0');

  // Admin Payment Deletion & Subscription Cancellation States
  const [paymentToDelete, setPaymentToDelete] = useState<StudentCoursePurchase | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);
  const [userToCancelSub, setUserToCancelSub] = useState<UserProfile | null>(null);
  const [isCancellingSub, setIsCancellingSub] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Website Subscriptions Search & Plan Update States
  const [subSearchQuery, setSubSearchQuery] = useState<string>('');
  const [userToEditPlan, setUserToEditPlan] = useState<UserProfile | null>(null);
  const [editPlanSelected, setEditPlanSelected] = useState<string>('plan_399');
  const [editPlanDurationMonths, setEditPlanDurationMonths] = useState<number>(1);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState<boolean>(false);

  const currentUserEmail = user?.email?.trim().toLowerCase() || '';
  const isAuthorizedEmail = currentUserEmail.startsWith('naman03mgs@gmail') || currentUserEmail === ADMIN_EMAIL || user?.role === 'admin';

  // Load all data from Firestore when unlocked
  const fetchAllData = async () => {
    setLoadingUsers(true);
    setLoadingProfits(true);
    setLoadingPurchases(true);
    setLoadingBounties(true);
    setLoadingSubmissions(true);

    try {
      // 1. Ensure active user profile and local profile are synced to Firestore users collection
      if (user && user.uid) {
        await FirestoreService.saveProfile(user).catch(() => {});
      }
      const localProfile = StorageService.getProfile();
      if (localProfile && localProfile.uid && localProfile.uid !== user?.uid) {
        await FirestoreService.saveProfile(localProfile).catch(() => {});
      }

      // 2. Fetch all collections in parallel safely using Promise.allSettled
      const [usersRes, profitsRes, purchasesRes, bountiesRes, subsRes] = await Promise.allSettled([
        FirestoreService.getAllUsers(),
        FirestoreService.getMonthlyProfits(),
        FirestoreService.getAllCoursePurchases(),
        FirestoreService.getGlobalBounties(),
        FirestoreService.getUserSubmissions()
      ]);

      // Parse Users
      const usersList: UserProfile[] = usersRes.status === 'fulfilled' ? usersRes.value : [];
      const userMap = new Map<string, UserProfile>();
      usersList.forEach(u => { if (u && u.uid) userMap.set(u.uid, u); });
      if (user && user.uid) userMap.set(user.uid, { ...userMap.get(user.uid), ...user });
      if (localProfile && localProfile.uid) {
        if (!userMap.has(localProfile.uid)) userMap.set(localProfile.uid, localProfile);
      }
      const finalUsers = Array.from(userMap.values());
      setAllUsers(finalUsers);

      // Parse Monthly Profits
      const profitRecords = profitsRes.status === 'fulfilled' ? profitsRes.value : [];
      setMonthlyProfits(profitRecords);
      if (profitRecords.length > 0) {
        setSelectedMonthKey(profitRecords[0].monthKey);
      }

      // Parse Course Purchases
      const purchases = purchasesRes.status === 'fulfilled' ? purchasesRes.value : [];
      setCoursePurchases(purchases);

      // Parse Bounties & Submissions
      const bounties = bountiesRes.status === 'fulfilled' ? bountiesRes.value : [];
      setGlobalBounties(bounties);

      const subs = subsRes.status === 'fulfilled' ? subsRes.value : [];
      setBountySubmissions(subs);

      setActionFeedback({
        type: 'success',
        text: `⚡ Firebase Firestore Sync Complete! Successfully loaded ${finalUsers.length} student profile(s), ${profitRecords.length} financial record(s), ${purchases.length} course purchase(s), and ${bounties.length} bounty task(s) live from Firebase.`
      });

    } catch (e: any) {
      console.warn("Error fetching admin data:", e);
      setActionFeedback({
        type: 'error',
        text: `Firestore Sync Failed: ${e?.message || e || 'Unable to connect to Firebase Firestore'}`
      });
    } finally {
      setLoadingUsers(false);
      setLoadingProfits(false);
      setLoadingPurchases(false);
      setLoadingBounties(false);
      setLoadingSubmissions(false);
    }
  };

  const handlePublishBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bountyForm.title.trim() || !bountyForm.description.trim()) return;

    const deliverables = bountyForm.deliverablesText.split('\n').map(s => s.trim()).filter(Boolean);
    const tags = bountyForm.tagsText.split(',').map(s => s.trim()).filter(Boolean);

    const newBounty: GlobalBounty = {
      id: 'bounty_' + Date.now(),
      title: bountyForm.title.trim(),
      category: bountyForm.category,
      difficulty: bountyForm.difficulty,
      rewardCredits: Number(bountyForm.rewardCredits) || 500,
      description: bountyForm.description.trim(),
      deliverables: deliverables.length > 0 ? deliverables : ['GitHub Repository URL'],
      verificationType: bountyForm.verificationType,
      expiryDate: bountyForm.expiryDate,
      tags: tags.length > 0 ? tags : ['Academic'],
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'Placivo Admin',
      isActive: true,
      totalCompletions: 0
    };

    try {
      await FirestoreService.saveGlobalBounty(newBounty);
      setGlobalBounties(prev => [newBounty, ...prev]);
      setShowCreateBountyModal(false);
      setBountyForm({
        title: '',
        category: 'Full-Stack & AI',
        difficulty: 'Hard',
        rewardCredits: 500,
        description: '',
        deliverablesText: 'Public GitHub Repository URL\nLive Deployed Application Link',
        verificationType: 'Link Submission',
        tagsText: 'AI, FullStack, React',
        expiryDate: '2026-12-31'
      });
      setActionFeedback({
        type: 'success',
        text: `🎉 New Gold Bounty '${newBounty.title}' (+${newBounty.rewardCredits} Gold Credits) was published successfully for all students!`
      });
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        text: `Failed to publish bounty: ${err.message || err}`
      });
    }
  };

  const handleDeleteBounty = async (id: string, title: string) => {
    try {
      await FirestoreService.deleteGlobalBounty(id);
      setGlobalBounties(prev => prev.filter(b => b.id !== id));
      setActionFeedback({
        type: 'success',
        text: `Bounty '${title}' was permanently deleted.`
      });
    } catch (e: any) {
      setActionFeedback({
        type: 'error',
        text: `Failed to delete bounty: ${e.message || e}`
      });
    }
  };

  const handleReviewSubmission = async (sub: UserBountySubmission, newStatus: 'approved' | 'rejected') => {
    try {
      await FirestoreService.updateBountySubmissionStatus(sub.id, newStatus);
      setBountySubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));

      if (newStatus === 'approved') {
        // Find user profile and award credits in Firestore
        const targetUser = allUsers.find(u => u.uid === sub.userId);
        if (targetUser) {
          const currentData = await FirestoreService.getHabiturexData(sub.userId);
          const currentCredits = currentData?.stats?.credits || 0;
          const updatedCredits = currentCredits + sub.rewardCredits;

          await FirestoreService.saveHabiturexData(sub.userId, {
            ...currentData,
            stats: {
              xp: currentData?.stats?.xp || 0,
              credits: updatedCredits,
              flameStreak: currentData?.stats?.flameStreak || 0,
              perfectDays: currentData?.stats?.perfectDays || 0
            }
          });
        }
      }

      setActionFeedback({
        type: 'success',
        text: `Submission for '${sub.userName}' was set to ${newStatus.toUpperCase()}! ${newStatus === 'approved' ? `+${sub.rewardCredits} Gold Credits awarded.` : ''}`
      });
    } catch (e: any) {
      setActionFeedback({
        type: 'error',
        text: `Failed to review submission: ${e.message || e}`
      });
    }
  };

  useEffect(() => {
    let unsubscribeUsers: (() => void) | undefined;

    if (isUnlocked && isAuthorizedEmail) {
      fetchAllData();

      // Subscribe to real-time users list updates from Firestore
      unsubscribeUsers = FirestoreService.subscribeToAllUsers((updatedList) => {
        const userMap = new Map<string, UserProfile>();
        updatedList.forEach(u => {
          if (u && u.uid) userMap.set(u.uid, u);
        });
        
        // Ensure the current active user profile is merged correctly
        if (user && user.uid) {
          userMap.set(user.uid, { ...(userMap.get(user.uid) || {}), ...user });
        }
        
        // Ensure standard local profile fallback if needed
        const localProfile = StorageService.getProfile();
        if (localProfile && localProfile.uid && !userMap.has(localProfile.uid)) {
          userMap.set(localProfile.uid, localProfile);
        }
        
        setAllUsers(Array.from(userMap.values()));
      });
    }

    return () => {
      if (unsubscribeUsers) {
        unsubscribeUsers();
      }
    };
  }, [isUnlocked, isAuthorizedEmail, user]);

  // Unlock Admin Key
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (securityInput === SECURITY_KEY) {
      setIsUnlocked(true);
      try {
        sessionStorage.setItem('placivo_admin_unlocked', 'true');
      } catch {}
      setSecurityInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Security Key. Access Denied!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLockPanel = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem('placivo_admin_unlocked');
      sessionStorage.removeItem('campusos_admin_unlocked');
    } catch {}
    setSecurityInput('');
    setErrorMsg('');
  };

  // Inspect student detailed progress
  const handleInspectUser = async (studentUid: string) => {
    setSelectedUserUid(studentUid);
    setLoadingInspect(true);
    try {
      const data = await FirestoreService.getUserFullData(studentUid);
      setInspectData(data);
    } catch (e) {
      console.warn("Error fetching student full data:", e);
    } finally {
      setLoadingInspect(false);
    }
  };

  // Manual Reset Handler: Reset all revenue numbers to ₹0 baseline starting fresh from today
  const handleResetFinancialsToZero = async () => {
    if (!window.confirm("Are you sure you want to reset all financial numbers, revenue, and monthly profit records in Firestore to ₹0 baseline starting fresh from today?")) {
      return;
    }
    setLoadingProfits(true);
    try {
      const zeroRecords = await FirestoreService.resetFinancialsToZeroBaseline();
      setMonthlyProfits(zeroRecords);
      setCoursePurchases([]);
      if (zeroRecords.length > 0) {
        setSelectedMonthKey(zeroRecords[0].monthKey);
      }
      setActionFeedback({
        type: 'success',
        text: 'All revenue metrics and monthly profits have been reset to ₹0 baseline starting fresh from today!'
      });
    } catch (e: any) {
      console.error("Failed to reset financials:", e);
      setActionFeedback({
        type: 'error',
        text: `Failed to reset financials: ${e.message || e}`
      });
    } finally {
      setLoadingProfits(false);
    }
  };

  // Save new month gross profit record
  const handleSaveNewMonthRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const subRev = Number(newSubRevenue) || 0;
    const crsRev = Number(newCourseRevenue) || 0;
    const totalGross = subRev + crsRev;

    const record: MonthlyProfitRecord = {
      id: newMonthKey,
      monthKey: newMonthKey,
      monthName: newMonthName,
      subscriptionRevenue: subRev,
      courseRevenue: crsRev,
      grossProfit: totalGross,
      subscriptionCount: Math.round(subRev / 99),
      coursePurchaseCount: Math.round(crsRev / 599),
      updatedAt: new Date().toISOString()
    };

    await FirestoreService.saveMonthlyProfit(record);
    setMonthlyProfits((prev) => [record, ...prev.filter((p) => p.monthKey !== record.monthKey)]);
    setSelectedMonthKey(record.monthKey);
    setShowAddMonthModal(false);
  };

  // Admin Handlers: Delete Payment Transaction & Cancel Subscription
  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    setIsDeletingPayment(true);
    try {
      await FirestoreService.deleteTransactionAndAdjustMonthlyProfit(paymentToDelete);
      // Refresh local state
      const updatedPurchases = coursePurchases.filter(p => p.id !== paymentToDelete.id);
      setCoursePurchases(updatedPurchases);

      const updatedProfits = await FirestoreService.getMonthlyProfits();
      setMonthlyProfits(updatedProfits);

      setPaymentToDelete(null);
      setActionFeedback({
        type: 'success',
        text: `Payment of ₹${paymentToDelete.pricePaid} for '${paymentToDelete.courseTitle}' was permanently deleted and monthly profit adjusted in Firestore!`
      });
    } catch (e: any) {
      console.error("Failed to delete payment:", e);
      setActionFeedback({
        type: 'error',
        text: `Failed to delete payment transaction: ${e.message || e}`
      });
    } finally {
      setIsDeletingPayment(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userToCancelSub) return;
    setIsCancellingSub(true);
    try {
      await FirestoreService.cancelUserSubscriptionAndAdjustRevenue(userToCancelSub.uid, userToCancelSub.email);
      // Update local allUsers state
      const nowIso = new Date().toISOString();
      setAllUsers(prev => prev.map(u => u.uid === userToCancelSub.uid ? {
        ...u,
        plan: 'none',
        planStartedAt: nowIso,
        planExpiresAt: nowIso,
        planCancelled: true,
        planCancelledAt: nowIso
      } : u));
      
      // Sync purchases and monthly profits for admin panel
      const [updatedPurchases, updatedProfits] = await Promise.all([
        FirestoreService.getAllCoursePurchases(),
        FirestoreService.getMonthlyProfits()
      ]);
      setCoursePurchases(updatedPurchases);
      setMonthlyProfits(updatedProfits);

      setUserToCancelSub(null);
      setActionFeedback({
        type: 'success',
        text: `Subscription cancelled successfully for ${userToCancelSub.displayName || userToCancelSub.email}. User set to 4-Day Free Trial plan in Firestore and admin panel profits adjusted.`
      });
    } catch (e: any) {
      console.error("Failed to cancel subscription:", e);
      setActionFeedback({
        type: 'error',
        text: `Failed to cancel user subscription: ${e.message || e}`
      });
    } finally {
      setIsCancellingSub(false);
    }
  };

  const handleUpdateUserPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEditPlan) return;
    setIsUpdatingPlan(true);
    try {
      await FirestoreService.updateUserSubscriptionPlan(
        userToEditPlan.uid,
        editPlanSelected,
        editPlanDurationMonths
      );

      // Instantly update the local allUsers state
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + editPlanDurationMonths);
      const planIsNone = editPlanSelected === 'none';

      setAllUsers((prev) =>
        prev.map((u) =>
          u.uid === userToEditPlan.uid
            ? {
                ...u,
                plan: editPlanSelected,
                planStartedAt: now.toISOString(),
                planExpiresAt: planIsNone ? now.toISOString() : expiresAt.toISOString(),
                planCancelled: planIsNone,
                planCancelledAt: planIsNone ? now.toISOString() : undefined,
                updatedAt: now.toISOString(),
              }
            : u
        )
      );

      setActionFeedback({
        type: 'success',
        text: `Successfully updated subscription plan for ${userToEditPlan.displayName || userToEditPlan.email} to '${editPlanSelected}' for ${editPlanDurationMonths} month(s) immediately!`
      });
      setUserToEditPlan(null);
    } catch (e: any) {
      console.error("Failed to update user plan:", e);
      setActionFeedback({
        type: 'error',
        text: `Failed to update user plan: ${e.message || e}`
      });
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const filteredSubUsers = useMemo(() => {
    if (!subSearchQuery.trim()) return allUsers;
    const q = subSearchQuery.toLowerCase();
    return allUsers.filter(u => 
      (u.displayName || '').toLowerCase().includes(q) || 
      ((u as any).username || '').toLowerCase().includes(q) || 
      (u.email || '').toLowerCase().includes(q)
    );
  }, [allUsers, subSearchQuery]);

  // Helper calculation for Subscription Expiration Days Remaining & Real Paid Amount
  const getSubscriptionInfo = (u: UserProfile) => {
    const rawPlan = u.plan ? u.plan.trim() : '';
    const isCancelled = Boolean(u.planCancelled);
    const isFree = isCancelled || !rawPlan || rawPlan === 'none' || rawPlan === 'free_trial' || rawPlan === 'Free Tier' || rawPlan === 'Free' || rawPlan.toLowerCase().includes('starter') || rawPlan.toLowerCase().includes('free');
    
    let planName = 'Free Tier';
    if (isCancelled) {
      planName = 'Subscription Cancelled';
    } else if (rawPlan === 'free_trial') {
      planName = '4-Day Free Trial';
    } else if (rawPlan === 'plan_199') {
      planName = 'Pro Scholar (₹99)';
    } else if (rawPlan === 'plan_349' || rawPlan === 'plan_399') {
      planName = 'Pro Ultimate (₹399)';
    } else if (rawPlan && rawPlan !== 'none') {
      planName = rawPlan;
    }

    // Exact paid price mapping for active plan
    let price = 0;
    if (!isFree && !isCancelled) {
      if (rawPlan === 'plan_199') {
        price = 99;
      } else if (rawPlan === 'plan_349' || rawPlan === 'plan_399') {
        price = 399;
      } else {
        price = 399; // Default paid plan rate
      }
    }

    // Remaining days calculation
    let daysRemaining = 0;
    let statusLabel = isCancelled ? 'Cancelled' : 'Free Access';

    if (!isFree && !isCancelled) {
      if (u.planExpiresAt) {
        const exp = new Date(u.planExpiresAt).getTime();
        const diff = exp - Date.now();
        daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      } else {
        daysRemaining = 30; // Default active 30 days
      }

      statusLabel = `${daysRemaining} Days Remaining`;
      if (daysRemaining === 0) statusLabel = 'Expired';
      if (daysRemaining <= 5 && daysRemaining > 0) statusLabel = `Expiring Soon (${daysRemaining}d left)`;
    }

    return {
      planName,
      price,
      daysRemaining,
      statusLabel,
      isFree,
      isCancelled
    };
  };

  // Real Financial Calculations connected to all registered users (allUsers) and purchase logs (coursePurchases)
  const liveFinancials = useMemo(() => {
    // 1. Subscription Revenue from purchases logged in coursePurchases
    const subPurchasesFromLogs = coursePurchases.filter(
      p => p.id.startsWith('sub_') || p.courseTitle.toLowerCase().includes('subscription')
    );
    const subRevFromLogs = subPurchasesFromLogs.reduce((sum, p) => {
      let amt = p.pricePaid || 0;
      // whenever any user buys Pro Scholar, show 99
      if (p.courseId === 'plan_199' && !amt) {
        amt = 99;
      }
      return sum + amt;
    }, 0);

    // 2. Set of emails already in subPurchasesFromLogs to prevent double-counting
    const loggedUserEmailsForSub = new Set(
      subPurchasesFromLogs.map(p => (p.userEmail || '').toLowerCase().trim())
    );

    // 3. Subscription Revenue from registered users in allUsers holding active paid plans
    // We only add the amount when the user buys the subscription on their own (which means they have a purchase log).
    // If they were upgraded by the admin, they won't have a purchase log, so we do NOT add their plan price to the profit section.
    const subRevFromActiveUsers = 0;

    const totalSubRevenue = subRevFromLogs + subRevFromActiveUsers;
    const totalSubCount = subPurchasesFromLogs.length;

    // 4. Course Sales Revenue from coursePurchases
    const coursePurchasesOnly = coursePurchases.filter(
      p => !p.id.startsWith('sub_') && !p.courseTitle.toLowerCase().includes('subscription')
    );
    const totalCourseRevenue = coursePurchasesOnly.reduce((sum, p) => sum + (p.pricePaid || 0), 0);
    const totalCourseCount = coursePurchasesOnly.length;

    const totalGrossProfit = totalSubRevenue + totalCourseRevenue;

    return {
      totalSubRevenue,
      totalSubCount,
      totalCourseRevenue,
      totalCourseCount,
      totalGrossProfit
    };
  }, [allUsers, coursePurchases]);

  const currentMonthKey = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const currentMonthName = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), []);

  // Effective Monthly Profits records for UI display
  const effectiveMonthlyProfits = useMemo(() => {
    let list = monthlyProfits.length > 0 ? [...monthlyProfits] : [{
      id: currentMonthKey,
      monthKey: currentMonthKey,
      monthName: currentMonthName,
      subscriptionRevenue: liveFinancials.totalSubRevenue,
      courseRevenue: liveFinancials.totalCourseRevenue,
      grossProfit: liveFinancials.totalGrossProfit,
      subscriptionCount: liveFinancials.totalSubCount,
      coursePurchaseCount: liveFinancials.totalCourseCount,
      updatedAt: new Date().toISOString()
    }];

    // Ensure current month record reflects actual live financials
    let hasCurrentMonth = false;
    list = list.map(m => {
      if (m.monthKey === currentMonthKey) {
        hasCurrentMonth = true;
        const subRev = Math.max(m.subscriptionRevenue || 0, liveFinancials.totalSubRevenue);
        const crsRev = Math.max(m.courseRevenue || 0, liveFinancials.totalCourseRevenue);
        return {
          ...m,
          subscriptionRevenue: subRev,
          courseRevenue: crsRev,
          grossProfit: subRev + crsRev,
          subscriptionCount: Math.max(m.subscriptionCount || 0, liveFinancials.totalSubCount),
          coursePurchaseCount: Math.max(m.coursePurchaseCount || 0, liveFinancials.totalCourseCount)
        };
      }
      return m;
    });

    if (!hasCurrentMonth) {
      list.unshift({
        id: currentMonthKey,
        monthKey: currentMonthKey,
        monthName: currentMonthName,
        subscriptionRevenue: liveFinancials.totalSubRevenue,
        courseRevenue: liveFinancials.totalCourseRevenue,
        grossProfit: liveFinancials.totalGrossProfit,
        subscriptionCount: liveFinancials.totalSubCount,
        coursePurchaseCount: liveFinancials.totalCourseCount,
        updatedAt: new Date().toISOString()
      });
    }

    return list;
  }, [monthlyProfits, liveFinancials, currentMonthKey, currentMonthName]);

  // Sync live financials to Firestore whenever live totals are available
  useEffect(() => {
    if (isUnlocked && isAuthorizedEmail && (liveFinancials.totalSubRevenue > 0 || liveFinancials.totalCourseRevenue > 0)) {
      const recordToSync: MonthlyProfitRecord = {
        id: currentMonthKey,
        monthKey: currentMonthKey,
        monthName: currentMonthName,
        subscriptionRevenue: liveFinancials.totalSubRevenue,
        courseRevenue: liveFinancials.totalCourseRevenue,
        grossProfit: liveFinancials.totalGrossProfit,
        subscriptionCount: liveFinancials.totalSubCount,
        coursePurchaseCount: liveFinancials.totalCourseCount,
        updatedAt: new Date().toISOString()
      };
      FirestoreService.saveMonthlyProfit(recordToSync).catch(e => console.warn("Failed syncing live financials to Firestore:", e));
    }
  }, [isUnlocked, isAuthorizedEmail, liveFinancials, currentMonthKey, currentMonthName]);

  // Overall Financial Totals across all months/live
  const totalSubRevenueAllTime = Math.max(liveFinancials.totalSubRevenue, effectiveMonthlyProfits.reduce((sum, p) => sum + (p.subscriptionRevenue || 0), 0));
  const totalCourseRevenueAllTime = Math.max(liveFinancials.totalCourseRevenue, effectiveMonthlyProfits.reduce((sum, p) => sum + (p.courseRevenue || 0), 0));
  const totalGrossProfitAllTime = totalSubRevenueAllTime + totalCourseRevenueAllTime;

  const currentMonthRecord = effectiveMonthlyProfits.find((p) => p.monthKey === selectedMonthKey) || effectiveMonthlyProfits[0];

  // Case 1: Unauthorized Email Access
  if (!isAuthorizedEmail) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-red-200 rounded-3xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Restricted Admin Access</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Admin Panel is strictly locked and exclusive to authorized administrator <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">{ADMIN_EMAIL}</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1">
            <p className="font-bold text-slate-700">Current Logged-in Account:</p>
            <p className="font-mono text-slate-600 truncate">{user?.email || 'Guest / Unauthenticated'}</p>
          </div>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // Case 2: Security Key Locked
  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className={`max-w-md w-full bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all ${shake ? 'animate-bounce' : ''}`}>
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Security Verification Required</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Security Lock</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Welcome <span className="font-bold text-slate-700">{ADMIN_EMAIL}</span>. Please enter your secret key to unlock full platform telemetry, revenue profits & email broadcast studio.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Security Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  value={securityInput}
                  onChange={(e) => {
                    setSecurityInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter Security Key..."
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-mono tracking-wider transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = allUsers.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.major && u.major.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section Usage Banner */}
      <SectionUsageBanner
        title="Admin Control & Financial Revenue Center"
        subtitle="Full administrative command center for platform operations and financial tracking"
        purpose="This comprehensive admin dashboard enables platform administrators to track real-time gross profits from subscription plans and course purchases saved directly in Firebase Firestore, inspect student subscription remaining days, manage monthly revenue history, and track student telemetry."
        keyFeatures={[
          'Gross Profit & Monthly Revenue Records Saved in Firebase Firestore',
          'Student Subscription List with Expiration Days Remaining Calculator',
          'Separate Categorized List of Students who Purchased Coding Courses',
          'Live Registered Student Telemetry & Progress Inspector'
        ]}
        icon={<ShieldAlert className="w-6 h-6 text-white" />}
        badge="Admin Full Control Purpose"
      />

      {/* Header Bar */}
      {actionFeedback && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
          actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <span>{actionFeedback.text}</span>
          <button onClick={() => setActionFeedback(null)} className="text-xs font-bold underline cursor-pointer ml-2">Dismiss</button>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-3d">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Admin Command & Operations Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Firestore Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Administrator: <strong className="text-slate-800">{ADMIN_EMAIL}</strong> • Real-time revenue, telemetry & global task synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAllData}
            disabled={loadingUsers || loadingProfits || loadingPurchases || loadingBounties}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs border border-blue-600 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loadingUsers || loadingProfits || loadingPurchases || loadingBounties) ? 'animate-spin' : ''}`} />
            <span>{(loadingUsers || loadingProfits || loadingPurchases || loadingBounties) ? 'Syncing Firebase...' : 'Sync Firebase / Firestore'}</span>
          </button>

          <button
            onClick={handleLockPanel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-extrabold text-xs border border-slate-200/80 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock Panel</span>
          </button>
        </div>
      </div>

      {/* Main Admin Section Nav Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('telemetry')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeAdminTab === 'telemetry'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory & Progress Inspector</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeAdminTab === 'telemetry' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {allUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('financials')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeAdminTab === 'financials'
              ? 'bg-blue-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financials, Gross Profits & Subscriptions</span>
          <span className={`ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
            activeAdminTab === 'financials' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
          }`}>
            ₹ {totalGrossProfitAllTime.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('bounties')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeAdminTab === 'bounties'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>Gold Bounties & Tasks</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeAdminTab === 'bounties' ? 'bg-slate-950 text-amber-300' : 'bg-amber-100 text-amber-900'
          }`}>
            {globalBounties.length}
          </span>
        </button>
      </div>

      {/* ======================================================================== */}
      {/* SECTION 1 TAB: FINANCIALS, GROSS PROFITS, SUBSCRIPTIONS & COURSE PURCHASES */}
      {/* ======================================================================== */}
      {activeAdminTab === 'financials' && (
        <div className="space-y-6">
          {/* Top Gross Profit Banner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200/90 text-slate-900 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-700">
                <p className="text-xs font-black uppercase tracking-wider">All-Time Gross Profit</p>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-emerald-950">₹ {totalGrossProfitAllTime.toLocaleString()}</p>
              <p className="text-[11px] font-bold text-emerald-800">Subscriptions + Course Sales Combined</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <p className="text-xs font-bold uppercase tracking-wider">Subscription Revenue</p>
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹ {totalSubRevenueAllTime.toLocaleString()}</p>
              <p className="text-[11px] font-bold text-blue-600">From Active Student Plan Purchases</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <p className="text-xs font-bold uppercase tracking-wider">Course Sales Revenue</p>
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹ {totalCourseRevenueAllTime.toLocaleString()}</p>
              <p className="text-[11px] font-bold text-indigo-600">From Individual Course Purchases</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <p className="text-xs font-bold uppercase tracking-wider">Current Month Revenue ({currentMonthRecord?.monthName || 'July 2026'})</p>
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-amber-600">₹ {(currentMonthRecord?.grossProfit || 0).toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-slate-500">Stored in Firebase `monthly_profits`</p>
            </div>
          </div>

          {/* Monthly Gross Profit Selector & History Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 card-3d">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Monthly Gross Profits History (Saved in Firebase Firestore)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select and review historical profit metrics for every month, or add a new monthly profit entry.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedMonthKey}
                  onChange={(e) => setSelectedMonthKey(e.target.value)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {effectiveMonthlyProfits.map((mp) => (
                    <option key={mp.monthKey} value={mp.monthKey}>
                      {mp.monthName} — Gross: ₹{mp.grossProfit.toLocaleString()}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleResetFinancialsToZero}
                  disabled={loadingProfits}
                  title="Reset all revenue and profit metrics to ₹0 starting fresh from today"
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                  <span>Reset to ₹0 Baseline</span>
                </button>

                <button
                  onClick={() => setShowAddMonthModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Month Record</span>
                </button>
              </div>
            </div>

            {/* Monthly Profit Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {effectiveMonthlyProfits.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-500">No monthly gross profit records in Firebase Firestore yet.</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">When users upgrade plans or purchase courses, real monthly profits will automatically record here.</p>
                </div>
              ) : (
                effectiveMonthlyProfits.map((mp) => (
                  <div
                    key={mp.monthKey}
                    onClick={() => setSelectedMonthKey(mp.monthKey)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedMonthKey === mp.monthKey
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-slate-900">{mp.monthName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Firebase Saved
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900">₹ {mp.grossProfit.toLocaleString()}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium flex items-center justify-between">
                      <span>Subs: ₹{mp.subscriptionRevenue.toLocaleString()}</span>
                      <span>Courses: ₹{mp.courseRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TWO SEPARATE CATEGORIZED TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TABLE 1: Students with Subscriptions & Remaining Days */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Students with Website Subscriptions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Names, email IDs, active plan names & days remaining before subscription expiry.
                  </p>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {filteredSubUsers.length} of {allUsers.length} Students
                </span>
              </div>

              {/* Search Bar inside table container */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by username or email..."
                  value={subSearchQuery}
                  onChange={(e) => setSubSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400"
                />
                {subSearchQuery && (
                  <button
                    onClick={() => setSubSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="overflow-x-auto space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredSubUsers.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-500">No matching students found.</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Try searching with a different username or email.</p>
                  </div>
                ) : (
                  filteredSubUsers.map((u) => {
                    const sub = getSubscriptionInfo(u);
                    return (
                      <div
                        key={u.uid}
                        className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-white transition-colors"
                      >
                        <div className="pr-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-slate-900 truncate">{u.displayName}</p>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              sub.isFree ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {sub.planName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium font-mono truncate">{u.email}</p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-right">
                            <p className={`font-black text-xs ${
                              sub.daysRemaining <= 5 && !sub.isFree ? 'text-red-600' : 'text-emerald-600'
                            }`}>
                              {sub.statusLabel}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold">
                              {sub.price > 0 ? `Paid: ₹${sub.price}` : 'Free Access'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setUserToEditPlan(u);
                                setEditPlanSelected(u.plan || 'none');
                                setEditPlanDurationMonths(1);
                              }}
                              title="Modify Student Plan Access"
                              className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Settings className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Modify</span>
                            </button>

                            {!sub.isFree && (
                              <button
                                onClick={() => setUserToCancelSub(u)}
                                title="Cancel user subscription"
                                className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cancel</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* TABLE 2: Students who Purchased Individual Courses */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 card-3d">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Students who Purchased Courses
                  </h3>
                  <p className="text-xs text-slate-500">
                    Separate list of course purchasers, course title, price paid & transaction dates.
                  </p>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {coursePurchases.length} Purchases
                </span>
              </div>

              <div className="overflow-x-auto space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {coursePurchases.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-500">No course purchase records in Firebase Firestore yet.</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">When students buy coding courses, real transaction data will appear here automatically.</p>
                  </div>
                ) : (
                  coursePurchases.map((cp) => (
                    <div
                      key={cp.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-white transition-colors"
                    >
                      <div className="pr-2 min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">{cp.userName}</p>
                        <p className="text-[11px] text-indigo-600 font-bold truncate">{cp.courseTitle}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{cp.userEmail}</p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-xs">₹ {cp.pricePaid}</p>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {cp.paymentStatus}
                          </span>
                        </div>

                        <button
                          onClick={() => setPaymentToDelete(cp)}
                          title="Delete payment record from Firestore"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ======================================================================== */}
      {/* SECTION 2 TAB: TELEMETRY & STUDENT PROGRESS INSPECTOR */}
      {/* ======================================================================== */}
      {activeAdminTab === 'telemetry' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Metrics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Students</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{allUsers.length}</p>
                <p className="text-[11px] text-blue-600 font-bold mt-0.5">Registered on Platform</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pro Subscribers</p>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">
                  {allUsers.filter(u => u.plan && u.plan !== 'free').length}
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Active Premium Members</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Avg Attendance</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {Math.round(allUsers.reduce((s, u) => s + (u.stats?.attendancePercentage || 0), 0) / (allUsers.length || 1))}%
                </p>
                <p className="text-[11px] text-indigo-600 font-bold mt-0.5">Across All Courses</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total DSA Solves</p>
                <p className="text-2xl font-black text-purple-600 mt-0.5">
                  {allUsers.reduce((s, u) => s + (u.stats?.dsaSolvedCount || 0), 0)}
                </p>
                <p className="text-[11px] text-purple-700 font-bold mt-0.5">Problems Verified</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Code2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* User Search & Monitoring Directory */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 card-3d">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Registered Student Directory & Progress Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect student attendance logs, DSA coding problem solves, AI study suites, and exam performance.
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name, email, or major..."
                  className="w-full pl-10 pr-9 py-2.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto text-blue-500" />
                <p className="text-xs font-bold text-slate-600">Syncing registered student profiles from Firestore...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No matching student records found</p>
                <p className="text-xs text-slate-400">Try searching for a different name or clear your search filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u) => {
                  const sub = getSubscriptionInfo(u);
                  const attPct = u.stats?.attendancePercentage || 0;
                  return (
                    <div
                      key={u.uid}
                      className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-blue-300/80 hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                              {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                                {u.displayName}
                              </h3>
                              <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                            sub.isFree ? 'bg-amber-100 text-amber-900 border border-amber-200/80' : 'bg-blue-100 text-blue-900 border border-blue-200/80'
                          }`}>
                            {sub.planName}
                          </span>
                        </div>

                        {/* Extra User Metadata */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold truncate">
                          <span className="truncate bg-slate-200/60 px-2 py-0.5 rounded-md text-slate-700">
                            {u.major || u.university || 'CS & AI'}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600">{u.targetRole || 'Software Engineer'}</span>
                        </div>

                        {/* Attendance Mini Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-extrabold">
                            <span className="text-slate-500 uppercase">Attendance Rate</span>
                            <span className={attPct >= 75 ? 'text-emerald-600' : 'text-amber-600'}>{attPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                attPct >= 75 ? 'bg-emerald-500' : attPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, attPct))}%` }}
                            />
                          </div>
                        </div>

                        {/* Telemetry Numbers */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">DSA Solved</p>
                            <p className="text-xs font-black text-indigo-600">{u.stats?.dsaSolvedCount || 0}</p>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Suites</p>
                            <p className="text-xs font-black text-purple-600">{u.stats?.studySuitesCount || 0}</p>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">GPA Goal</p>
                            <p className="text-xs font-black text-emerald-600">{u.gpaGoal || 4.0}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInspectUser(u.uid)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer mt-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Student Progress</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* SECTION 3 TAB: BOUNTIES & GLOBAL TASKS MANAGER */}
      {/* ======================================================================== */}
      {activeAdminTab === 'bounties' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-indigo-50/60 border border-amber-200/90 text-slate-900 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] tracking-wider uppercase border border-amber-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Global Gold Bounties Arena Manager
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Publish Gold Credit Bounties for Students
                </h2>
                <p className="text-xs text-slate-600 font-medium max-w-xl">
                  Create high-hardness tasks, algorithm marathons, AI agent projects, and research challenges. Set custom Gold Credit rewards that students earn upon proof verification.
                </p>
              </div>

              <button
                onClick={() => setShowCreateBountyModal(true)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Gold Bounty</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active Bounties</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{globalBounties.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Published in Habiturex</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Reward Pool</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {globalBounties.reduce((acc, b) => acc + (b.rewardCredits || 0), 0).toLocaleString()} Gold
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Available for completion</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Submissions</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{bountySubmissions.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Student proof entries</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Approved & Awarded</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {bountySubmissions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Verified claims</p>
            </div>
          </div>

          {/* Active Global Bounties List */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Live Global Bounties</h3>
                <p className="text-xs text-slate-500">Tasks currently visible to all users in Habiturex</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                {globalBounties.length} Published
              </span>
            </div>

            {loadingBounties ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                <p className="text-xs font-bold">Loading global bounties from Firestore...</p>
              </div>
            ) : globalBounties.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No Bounties Published Yet</p>
                <p className="text-xs text-slate-500">Click 'Publish New Gold Bounty' above to create your first global challenge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalBounties.map(bounty => (
                  <div key={bounty.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                          {bounty.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          bounty.difficulty === 'Legendary'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : bounty.difficulty === 'Extreme'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {bounty.difficulty}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{bounty.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{bounty.description}</p>

                      <div className="pt-2 border-t border-slate-200/80 space-y-1">
                        <p className="text-[10px] font-extrabold uppercase text-slate-500">Deliverables Required:</p>
                        <ul className="text-xs text-slate-700 space-y-0.5 list-disc list-inside">
                          {bounty.deliverables.map((del, i) => (
                            <li key={i} className="truncate">{del}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1.5 border border-amber-200">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>+{bounty.rewardCredits} GOLD CREDITS</span>
                      </div>

                      <button
                        onClick={() => handleDeleteBounty(bounty.id, bounty.title)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Bounty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Bounty Submissions Review Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Student Proof Submissions</h3>
                <p className="text-xs text-slate-500">Review student proof links and approve or reject submissions</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black">
                {bountySubmissions.length} Submissions
              </span>
            </div>

            {loadingSubmissions ? (
              <div className="py-8 text-center text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-500" />
                <p className="text-xs font-bold mt-1">Loading submissions...</p>
              </div>
            ) : bountySubmissions.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs font-bold text-slate-600">No student bounty submissions recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-extrabold">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Reward</th>
                      <th className="pb-3">Proof Link / Deliverable</th>
                      <th className="pb-3">Submitted At</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bountySubmissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="py-3 pr-2">
                          <p className="font-bold text-slate-900">{sub.userName}</p>
                          <p className="text-[10px] text-slate-500">{sub.userEmail}</p>
                        </td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-[11px]">
                            +{sub.rewardCredits} Gold
                          </span>
                        </td>
                        <td className="py-3 pr-2 max-w-xs">
                          {sub.proofUrl ? (
                            <a
                              href={sub.proofUrl.startsWith('http') ? sub.proofUrl : `https://${sub.proofUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-bold flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{sub.proofUrl}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No link provided</span>
                          )}
                          {sub.notes && <p className="text-[10px] text-slate-500 truncate mt-0.5">{sub.notes}</p>}
                        </td>
                        <td className="py-3 text-slate-500 font-mono text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                            sub.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {sub.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReviewSubmission(sub, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewSubmission(sub, 'rejected')}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE GLOBAL BOUNTY */}
      {showCreateBountyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Publish New Gold Bounty Challenge
              </h3>
              <button onClick={() => setShowCreateBountyModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handlePublishBounty} className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={bountyForm.title}
                  onChange={(e) => setBountyForm({ ...bountyForm, title: e.target.value })}
                  placeholder="e.g. Build & Deploy Full-Stack AI Chatbot with Gemini API"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={bountyForm.category}
                    onChange={(e) => setBountyForm({ ...bountyForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="DSA & Algorithmic">DSA & Algorithmic</option>
                    <option value="Full-Stack & AI">Full-Stack & AI</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Research & Dev">Research & Dev</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Difficulty Tier</label>
                  <select
                    value={bountyForm.difficulty}
                    onChange={(e) => setBountyForm({ ...bountyForm, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="Hard">⚡ Hard (300 - 500 Gold)</option>
                    <option value="Extreme">🔥 Extreme (600 - 900 Gold)</option>
                    <option value="Legendary">🏆 Legendary (1000+ Gold)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Gold Credits Reward Amount</label>
                <div className="relative">
                  <Award className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    min={100}
                    max={5000}
                    value={bountyForm.rewardCredits}
                    onChange={(e) => setBountyForm({ ...bountyForm, rewardCredits: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-amber-900 font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Detailed Description & Instructions</label>
                <textarea
                  required
                  rows={3}
                  value={bountyForm.description}
                  onChange={(e) => setBountyForm({ ...bountyForm, description: e.target.value })}
                  placeholder="Describe the task requirements, edge cases, benchmarks, or goals clearly..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block mb-1">Required Deliverables (One per line)</label>
                <textarea
                  required
                  rows={2}
                  value={bountyForm.deliverablesText}
                  onChange={(e) => setBountyForm({ ...bountyForm, deliverablesText: e.target.value })}
                  placeholder="Public GitHub Repo URL&#10;Live Deployed Application Link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Verification Type</label>
                  <select
                    value={bountyForm.verificationType}
                    onChange={(e) => setBountyForm({ ...bountyForm, verificationType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="Link Submission">Link Submission</option>
                    <option value="Code Review">Code Review</option>
                    <option value="Text Reflection">Text Reflection</option>
                    <option value="Quiz Test">Quiz Test</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={bountyForm.expiryDate}
                    onChange={(e) => setBountyForm({ ...bountyForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={bountyForm.tagsText}
                  onChange={(e) => setBountyForm({ ...bountyForm, tagsText: e.target.value })}
                  placeholder="AI, Gemini, React, FullStack"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Publish Task to Live Habiturex Arena</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW MONTH GROSS PROFIT RECORD */}
      {showAddMonthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Add Monthly Gross Profit Record
              </h3>
              <button onClick={() => setShowAddMonthModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMonthRecord} className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Month Key (YYYY-MM)</label>
                <input
                  type="text"
                  required
                  value={newMonthKey}
                  onChange={(e) => setNewMonthKey(e.target.value)}
                  placeholder="2026-08"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Month Display Name</label>
                <input
                  type="text"
                  required
                  value={newMonthName}
                  onChange={(e) => setNewMonthName(e.target.value)}
                  placeholder="August 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Subscription Revenue (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSubRevenue}
                    onChange={(e) => setNewSubRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block mb-1">Course Sales Revenue (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCourseRevenue}
                    onChange={(e) => setNewCourseRevenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
                Total Gross Profit for {newMonthName}: <strong>₹ {(Number(newSubRevenue) + Number(newCourseRevenue)).toLocaleString()}</strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Save Record in Firebase Firestore
              </button>
            </form>
          </div>
        </div>
      )}



      {/* MODAL 3: STUDENT FULL DATA INSPECTOR */}
      {selectedUserUid && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Student Detail Inspector</h3>
              <button onClick={() => setSelectedUserUid(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {loadingInspect ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                <p className="text-xs font-semibold">Fetching student data from Firestore...</p>
              </div>
            ) : inspectData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{inspectData.profile.displayName}</h4>
                    <p className="text-xs text-slate-500">{inspectData.profile.email} • {inspectData.profile.university}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {inspectData.profile.plan || 'Ultra AI Plan'}
                  </span>
                </div>

                <div className="flex items-center gap-2 border-b pb-2 text-xs font-bold overflow-x-auto">
                  <button
                    onClick={() => setInspectTab('attendance')}
                    className={`px-3 py-1.5 rounded-lg shrink-0 ${inspectTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Attendance ({inspectData.attendance.length})
                  </button>
                  <button
                    onClick={() => setInspectTab('habiturex' as any)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 ${inspectTab === ('habiturex' as any) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Habiturex & Tasks ({(inspectData.habiturex?.tasks || []).length})
                  </button>
                  <button
                    onClick={() => setInspectTab('marks' as any)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 ${inspectTab === ('marks' as any) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Exam Marks ({(inspectData.marks || []).length})
                  </button>
                  <button
                    onClick={() => setInspectTab('dsa')}
                    className={`px-3 py-1.5 rounded-lg shrink-0 ${inspectTab === 'dsa' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    DSA Solves ({inspectData.dsa.filter(d => d.solved).length})
                  </button>
                  <button
                    onClick={() => setInspectTab('suites')}
                    className={`px-3 py-1.5 rounded-lg shrink-0 ${inspectTab === 'suites' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Study Suites ({inspectData.studySuites.length})
                  </button>
                </div>

                {inspectTab === 'attendance' && (
                  <div className="space-y-2 text-xs">
                    {inspectData.attendance.map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{a.name} ({a.code})</span>
                        <span className="font-mono text-emerald-600 font-bold">{a.attendedClasses}/{a.totalClasses} Attended</span>
                      </div>
                    ))}
                  </div>
                )}

                {inspectTab === ('habiturex' as any) && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                        <p className="text-[10px] text-blue-700 font-extrabold uppercase">Streak</p>
                        <p className="text-base font-black text-blue-900">{inspectData.habiturex?.stats?.flameStreak || 0} Days</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                        <p className="text-[10px] text-amber-700 font-extrabold uppercase">Gold Credits</p>
                        <p className="text-base font-black text-amber-900">{inspectData.habiturex?.stats?.credits || 0} Gold</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                        <p className="text-[10px] text-purple-700 font-extrabold uppercase">Focus Hours</p>
                        <p className="text-base font-black text-purple-900">
                          {Object.values(inspectData.habiturex?.studyHoursLog || {}).reduce<number>((a, b) => a + Number(b), 0).toFixed(1)}h
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-black text-slate-800 text-[11px] uppercase">Tasks & Habits:</p>
                      {(inspectData.habiturex?.tasks || []).length === 0 ? (
                        <p className="text-slate-400 italic">No Habiturex tasks created yet.</p>
                      ) : (
                        (inspectData.habiturex?.tasks || []).map((t: any) => (
                          <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="font-black text-slate-900">{t.name}</span>
                              <span className="text-[10px] text-slate-500 ml-2">({t.subject})</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                              t.status === 'Completed' || t.completedToday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {t.status || 'Pending'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {inspectTab === ('marks' as any) && (
                  <div className="space-y-2 text-xs">
                    {(inspectData.marks || []).length === 0 ? (
                      <p className="text-slate-400 italic py-4 text-center">No exam marks entered by student yet.</p>
                    ) : (
                      (inspectData.marks || []).map((m) => {
                        const pct = m.maxMarks > 0 ? Math.round((m.scoredMarks / m.maxMarks) * 100) : 0;
                        return (
                          <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="font-black text-slate-900">{m.subject} - {m.examTitle}</p>
                              <p className="text-[10px] text-slate-500">{m.semester || 'Semester N/A'} • {m.examDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-slate-800">{m.scoredMarks} / {m.maxMarks}</p>
                              <span className={`px-2 py-0.2 rounded font-black text-[9px] ${
                                pct >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {inspectTab === 'dsa' && (
                  <div className="space-y-2 text-xs">
                    {inspectData.dsa.map((d) => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-800">{d.title} ({d.category})</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${d.solved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {d.solved ? 'Solved' : 'Unsolved'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {inspectTab === 'suites' && (
                  <div className="space-y-2 text-xs">
                    {inspectData.studySuites.map((s) => (
                      <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">{s.title} ({s.subject})</span>
                        <p className="text-slate-500 line-clamp-1">{s.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE PAYMENT TRANSACTION CONFIRMATION */}
      {paymentToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <Trash2 className="w-5 h-5" />
                <span>Delete Payment Transaction</span>
              </div>
              <button
                onClick={() => setPaymentToDelete(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this payment transaction record from Firebase Firestore?
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium">
              <p className="text-slate-900 font-extrabold">{paymentToDelete.courseTitle}</p>
              <p className="text-slate-600">Student: <strong>{paymentToDelete.userName}</strong> ({paymentToDelete.userEmail})</p>
              <p className="text-emerald-700 font-black text-sm pt-1">Amount Paid: ₹{paymentToDelete.pricePaid}</p>
            </div>

            <p className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 font-semibold leading-normal">
              ⚠️ Deleting this transaction will remove it from student purchases and automatically deduct ₹{paymentToDelete.pricePaid} from monthly gross profits in Firestore.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPaymentToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePayment}
                disabled={isDeletingPayment}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeletingPayment ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isDeletingPayment ? 'Deleting...' : 'Delete Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CANCEL USER SUBSCRIPTION CONFIRMATION */}
      {userToCancelSub && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-base">
                <UserX className="w-5 h-5" />
                <span>Cancel User Subscription</span>
              </div>
              <button
                onClick={() => setUserToCancelSub(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel the active subscription for this student?
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium">
              <p className="text-slate-900 font-extrabold">{userToCancelSub.displayName}</p>
              <p className="text-slate-600 font-mono">{userToCancelSub.email}</p>
              <p className="text-blue-700 font-bold pt-1">Current Plan: {userToCancelSub.plan || 'Active Subscription'}</p>
            </div>

            <p className="text-[11px] text-slate-600 bg-slate-100 p-3 rounded-xl border border-slate-200 font-medium leading-normal">
              This student's plan status will be updated to <strong>Free Tier</strong> in Firebase Firestore and active plan perks will be revoked immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToCancelSub(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancellingSub}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isCancellingSub ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
                <span>{isCancellingSub ? 'Cancelling...' : 'Cancel Subscription'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: MODIFY STUDENT PLAN ACCESS */}
      {userToEditPlan && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-base">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Modify Student Plan Access</span>
              </div>
              <button
                onClick={() => setUserToEditPlan(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium">
              <p className="text-slate-900 font-extrabold">{userToEditPlan.displayName}</p>
              <p className="text-slate-600 font-mono">{userToEditPlan.email}</p>
              <p className="text-blue-700 font-bold pt-1">Current Stored Plan: {userToEditPlan.plan || 'Free Tier'}</p>
            </div>

            <form onSubmit={handleUpdateUserPlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Access Plan</label>
                <select
                  value={editPlanSelected}
                  onChange={(e) => setEditPlanSelected(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="free_trial">4-Day Free Trial Pass (₹0)</option>
                  <option value="plan_199">Pro Scholar Pass (₹99)</option>
                  <option value="plan_399">Placivo Pro Ultimate (₹399)</option>
                  <option value="none">Free Tier / Demoted Access (₹0)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Select Subscription Period</label>
                <select
                  value={editPlanDurationMonths}
                  onChange={(e) => setEditPlanDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={1}>1 Month (30 Days)</option>
                  <option value={2}>2 Months (60 Days)</option>
                  <option value={3}>3 Months (90 Days)</option>
                  <option value={4}>4 Months (120 Days)</option>
                  <option value={6}>6 Months (180 Days)</option>
                  <option value={12}>1 Year (365 Days)</option>
                </select>
              </div>

              <p className="text-[11px] text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold leading-normal">
                ✨ Upgrade/Degrade happens immediately. This modification is completely free of charge and synchronizes directly with the student's live profile in Firestore.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToEditPlan(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPlan}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isUpdatingPlan ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{isUpdatingPlan ? 'Saving...' : 'Update Access Immediately'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
