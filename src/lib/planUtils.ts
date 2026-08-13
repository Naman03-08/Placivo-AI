import { UserProfile } from '../types';

export interface PlanInfo {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: string;
  priceYearly: string;
  period: string;
  rawPrice: number;
  popular: boolean;
  badge: string;
  badgeColor: string;
  features: string[];
  usageLimits: {
    studySuites: string;
    dsaSolutions: string;
    assignmentSolver: string;
    resumeScans: string;
    interviewPrep: string;
    aiChatTutor: string;
  };
  notIncluded?: string[];
}

export const PLAN_DEFINITIONS: PlanInfo[] = [
  {
    id: 'free_trial',
    name: 'Free Trial Pass',
    tagline: '4-Day Full Access Pass for every student (Start whenever you choose)',
    priceMonthly: '₹0',
    priceYearly: '₹0',
    period: '4 Days Free',
    rawPrice: 0,
    popular: false,
    badge: '4-Day Free Pass',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    usageLimits: {
      studySuites: '1 Generation / day',
      dsaSolutions: '3 Solutions / day',
      assignmentSolver: '1 Chat / day',
      resumeScans: '1 Audit Scan / day',
      interviewPrep: 'No Subjects',
      aiChatTutor: '1 Session / day'
    },
    features: [
      '4 Days Full Access to basic features',
      '1/Day AI Study Suite generations (Notes, Flashcards, Quiz)',
      '3 Placivo 375 DSA question AI solutions / day',
      '1/Day AI Academic Tutor Sessions',
      '1/Day ATS Resume Audit Scans & PDF Export',
      'Attendance Tracker & Smart Calendar'
    ],
    notIncluded: [
      'Subjects Technical Interview Question Bank',
      'Unlimited High-Score ATS Resume Scans',
      'Unlimited Placivo 375 DSA Code Coach',
      'Priority High-Speed Processing Engine'
    ]
  },
  {
    id: 'plan_199',
    name: 'Pro Scholar Pass',
    tagline: 'Perfect for active college students aiming for top GPAs & Placements',
    priceMonthly: '₹99',
    priceYearly: '₹899',
    period: 'per month (30 Days)',
    rawPrice: 99,
    popular: false,
    badge: 'Popular',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    usageLimits: {
      studySuites: '5 Generations / week',
      dsaSolutions: 'Unlimited 375 DSA Sheet',
      assignmentSolver: '3 Chats / day',
      resumeScans: '5 ATS Scans / month',
      interviewPrep: 'Full Access (256 Subjects)',
      aiChatTutor: '3 Chats / day'
    },
    features: [
      'Everything in Free Trial, PLUS:',
      'Complete Placivo 375 DSA Roadmap Sheet access',
      '5 High-Score ATS Resume Scans & Keyword Scans / month',
      '5 Generations / week AI Study Suites',
      'Full Access to 256 Technical Interview Subjects & Questions',
      'Smart Calendar Auto-Scheduler with exam alerts',
      '3 Chats / day AI Tutor Chat Assistant'
    ],
    notIncluded: [
      'Unlimited High-Score ATS Resume Builder',
      '1-on-1 Company Placement Mentor'
    ]
  },
  {
    id: 'plan_399',
    name: 'Placivo Pro Ultimate',
    tagline: 'The most valuable plan for every individual to master academics, placement prep, and high-scoring DSA.',
    priceMonthly: '₹199',
    priceYearly: '₹1,899',
    period: 'per month (30 Days)',
    rawPrice: 199,
    popular: true,
    badge: 'Most Recommended',
    badgeColor: 'bg-indigo-600 text-white shadow-xs',
    usageLimits: {
      studySuites: '10 /week Generations',
      dsaSolutions: 'UNLIMITED Code Coach',
      assignmentSolver: '10 /week',
      resumeScans: '10 ATS Scans / month',
      interviewPrep: 'UNLIMITED Question Bank Access',
      aiChatTutor: '10 /week'
    },
    features: [
      'Everything in ₹99 Plan, PLUS:',
      '10 /week AI Study Suites Generations',
      '10 /week AI Tutor Chat Assistant',
      'UNLIMITED Technical Interview Question Bank (All 256 Subjects)',
      '10/ Month High-Score ATS Resume Builder & Job Matcher',
      'UNLIMITED Instant Placivo 375 DSA Code Coach (C++, Java, Python, TS)',
      '10 AI Cover Letter Generators for Target Companies / month',
      'Complete AI Placement Mentor & Company Technical Interview Prep',
      'Priority Ultra-Fast AI Reasoning Engine'
    ],
    notIncluded: []
  }
];

export function calculatePlanDetails(user: UserProfile) {
  const rawPlan = user?.plan ? String(user.plan).trim() : '';
  const rawPlanLower = rawPlan.toLowerCase();

  // Normalize Plan ID across all possible name representations
  let currentPlanId = 'none';
  if (
    rawPlanLower === 'plan_199' ||
    rawPlanLower === 'pro_199' ||
    rawPlanLower === '199' ||
    rawPlanLower.includes('scholar')
  ) {
    currentPlanId = 'plan_199';
  } else if (
    rawPlanLower === 'plan_349' ||
    rawPlanLower === 'plan_399' ||
    rawPlanLower === 'pro_349' ||
    rawPlanLower === 'pro_399' ||
    rawPlanLower === '349' ||
    rawPlanLower === '399' ||
    rawPlanLower.includes('ultimate')
  ) {
    currentPlanId = 'plan_399';
  } else if (rawPlanLower.includes('pro')) {
    // Default any generic 'pro' setting to plan_399 (Ultimate)
    currentPlanId = 'plan_399';
  } else if (rawPlanLower === 'free_trial' || rawPlanLower.includes('trial')) {
    currentPlanId = 'free_trial';
  }

  const isPaid = currentPlanId === 'plan_199' || currentPlanId === 'plan_399';

  // Check if trial was explicitly started by user action
  const hasStartedTrial = Boolean(user.freeTrialStartedAt || (currentPlanId === 'free_trial' && user.planStartedAt));
  const freeTrialUsed = Boolean(user.freeTrialUsed || hasStartedTrial);

  if (currentPlanId === 'free_trial' && !hasStartedTrial) {
    currentPlanId = 'none'; // Not active yet
  }

  // Check cancellation flag:
  const isCancelled = Boolean(user.planCancelled);

  if (
    isCancelled ||
    rawPlanLower === 'none' ||
    rawPlanLower === 'free tier' ||
    rawPlanLower === 'free' ||
    currentPlanId === 'none' ||
    !rawPlanLower
  ) {
    return {
      currentPlanId: 'none',
      planName: isCancelled ? 'Subscription Cancelled' : 'Free Tier',
      isFreeTrial: false,
      isPaid: false,
      hasStartedTrial,
      freeTrialUsed,
      hasActiveAccess: false,
      isExpired: false, // Do NOT mark cancelled / free plan as expired
      daysRemaining: 0,
      formattedStartedAt: user.planStartedAt ? new Date(user.planStartedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      formattedExpiresAt: user.planCancelledAt ? new Date(user.planCancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      expiresAtIso: '',
      startedAtIso: ''
    };
  }

  const isFreeTrial = currentPlanId === 'free_trial';

  let startedAtMs = 0;
  let expiresAtMs = 0;
  const nowMs = Date.now();

  if (isPaid) {
    if (user.planStartedAt) {
      startedAtMs = new Date(user.planStartedAt).getTime();
      if (isNaN(startedAtMs)) startedAtMs = nowMs;
    } else {
      startedAtMs = user.createdAt ? new Date(user.createdAt).getTime() : nowMs;
      if (isNaN(startedAtMs)) startedAtMs = nowMs;
    }

    if (user.planExpiresAt) {
      expiresAtMs = new Date(user.planExpiresAt).getTime();
      if (isNaN(expiresAtMs) || expiresAtMs <= startedAtMs) {
        expiresAtMs = startedAtMs + 30 * 24 * 60 * 60 * 1000;
      }
    } else {
      expiresAtMs = startedAtMs + 30 * 24 * 60 * 60 * 1000;
    }

    // Safety guarantee for active paid plans: ensure expiration is at least 30 days from purchase start date or now
    if (expiresAtMs <= nowMs) {
      // If user is set to a paid plan but expiresAt was in the past, reset it to 30 days from now
      expiresAtMs = nowMs + 30 * 24 * 60 * 60 * 1000;
    }
  } else if (hasStartedTrial) {
    const trialStartIso = user.freeTrialStartedAt || user.planStartedAt;
    startedAtMs = trialStartIso ? new Date(trialStartIso).getTime() : nowMs;
    if (isNaN(startedAtMs)) startedAtMs = nowMs;

    if (user.planExpiresAt) {
      expiresAtMs = new Date(user.planExpiresAt).getTime();
      if (isNaN(expiresAtMs)) expiresAtMs = startedAtMs + 4 * 24 * 60 * 60 * 1000;
    } else {
      expiresAtMs = startedAtMs + 4 * 24 * 60 * 60 * 1000; // 4 Days
    }
  }

  let hasActiveAccess = false;
  let isExpired = false;
  let daysRemaining = 0;

  if (isPaid || hasStartedTrial) {
    const diffMs = expiresAtMs - nowMs;
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    if (diffMs <= 0) {
      isExpired = true;
      hasActiveAccess = false;
    } else {
      isExpired = false;
      hasActiveAccess = true;
    }
  } else {
    hasActiveAccess = false;
    isExpired = false;
    daysRemaining = 0;
  }

  let planName = 'No Active Plan';
  if (!hasActiveAccess) {
    if (isExpired) {
      planName = isFreeTrial ? 'Free Trial Expired' : 'Pro Plan Expired';
    } else if (!freeTrialUsed) {
      planName = '4-Day Free Trial Available';
    } else {
      planName = 'No Active Plan';
    }
  } else {
    if (currentPlanId === 'free_trial') planName = 'Free Trial (4 Days)';
    if (currentPlanId === 'plan_199') planName = 'Pro Scholar (₹99)';
    if (currentPlanId === 'plan_399') planName = 'Placivo Pro Ultimate (₹199)';
  }

  const formattedStartedAt = startedAtMs > 0 ? new Date(startedAtMs).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Not Started';

  const formattedExpiresAt = expiresAtMs > 0 ? new Date(expiresAtMs).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Not Started';

  return {
    currentPlanId,
    planName,
    isFreeTrial,
    isPaid,
    hasStartedTrial,
    freeTrialUsed,
    hasActiveAccess,
    isExpired,
    daysRemaining,
    formattedStartedAt,
    formattedExpiresAt,
    expiresAtIso: expiresAtMs > 0 ? new Date(expiresAtMs).toISOString() : '',
    startedAtIso: startedAtMs > 0 ? new Date(startedAtMs).toISOString() : ''
  };
}

export interface LimitCheckResult {
  allowed: boolean;
  maxLimit: number; // -1 for unlimited
  currentCount: number;
  featureName: string;
  message: string;
}

// Calendar period key helpers for robust, correct plan limits tracking
export function getDailyKey(): string {
  try {
    return new Date().toISOString().split('T')[0];
  } catch {
    return '2026-08-03';
  }
}

export function getWeeklyKey(): string {
  try {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to find Monday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  } catch {
    return '2026-W31';
  }
}

export function getMonthlyKey(): string {
  try {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return '2026-08';
  }
}

export function getFeatureUsage(uid: string, feature: string, periodKey: string): number {
  try {
    const val = localStorage.getItem(`placivo_usage_${uid || 'anon'}_${feature}_${periodKey}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementFeatureUsage(uid: string, feature: string, periodKey: string): number {
  try {
    const current = getFeatureUsage(uid, feature, periodKey);
    const newVal = current + 1;
    localStorage.setItem(`placivo_usage_${uid || 'anon'}_${feature}_${periodKey}`, newVal.toString());
    return newVal;
  } catch {
    return 1;
  }
}

export function checkStudySuiteLimit(user: UserProfile, currentCount: number): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: 0,
      featureName: 'AI Study Suites',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to generate AI Study Suites.'
    };
  }

  const uid = user?.uid || 'anon';
  if (details.currentPlanId === 'free_trial') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'study_suite', dailyKey);
    const maxLimit = 1; // 1 Generation per day
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'AI Study Suites',
      message: allowed
        ? `Free Trial Pass: ${periodCount}/${maxLimit} Study Suites generated today.`
        : `Free Trial daily limit reached (${maxLimit} Study Suite / day). Upgrade to Pro Scholar (₹99) or Pro Ultimate (₹199) for more generations!`
    };
  }

  if (details.currentPlanId === 'plan_199') {
    const weeklyKey = getWeeklyKey();
    const periodCount = getFeatureUsage(uid, 'study_suite', weeklyKey);
    const maxLimit = 5;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'AI Study Suites',
      message: allowed
        ? `Pro Scholar Plan: ${periodCount}/${maxLimit} Study Suites generated this week.`
        : `Pro Scholar weekly limit reached (${maxLimit} Generations/week). Upgrade to Placivo Pro Ultimate (₹199) for 10 generations/week!`
    };
  }

  if (details.currentPlanId === 'plan_399') {
    const weeklyKey = getWeeklyKey();
    const periodCount = getFeatureUsage(uid, 'study_suite', weeklyKey);
    const maxLimit = 10;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'AI Study Suites',
      message: allowed
        ? `Placivo Pro Ultimate: ${periodCount}/${maxLimit} Study Suites generated this week.`
        : `Placivo Pro Ultimate weekly limit reached (${maxLimit} Generations/week).`
    };
  }

  return {
    allowed: true,
    maxLimit: -1,
    currentCount,
    featureName: 'AI Study Suites',
    message: 'Active Enterprise / Custom plan active.'
  };
}

export function checkDSASolutionLimit(user: UserProfile, todayCount: number): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: 0,
      featureName: '375 DSA AI Code Coach',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to access 375 DSA AI solutions.'
    };
  }

  const uid = user?.uid || 'anon';
  if (details.currentPlanId === 'free_trial') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'dsa_solution', dailyKey);
    const maxLimit = 3;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: '375 DSA AI Code Coach',
      message: allowed
        ? `Free Trial Pass: ${periodCount}/${maxLimit} DSA AI Solutions used today.`
        : `Free Trial daily limit reached (${maxLimit} DSA Solutions / day). Upgrade to Pro Scholar (₹99) or Pro Ultimate (₹199) for UNLIMITED 375 DSA Sheet Solutions!`
    };
  }

  // plan_199 and plan_399: UNLIMITED
  return {
    allowed: true,
    maxLimit: -1,
    currentCount: 0,
    featureName: '375 DSA AI Code Coach',
    message: 'Pro Plan: UNLIMITED 375 DSA Roadmap Code Coach active.'
  };
}

export function checkAIChatLimit(user: UserProfile, currentChatCount: number): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: 0,
      featureName: '24/7 AI Academic Tutor Chat',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to chat with the AI Academic Tutor.'
    };
  }

  const uid = user?.uid || 'anon';
  if (details.currentPlanId === 'free_trial') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'ai_chat', dailyKey);
    const maxLimit = 1; // 1 Session/Day
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: '24/7 AI Academic Tutor Chat',
      message: allowed
        ? `Free Trial Pass: ${periodCount}/${maxLimit} AI Academic Tutor Chat session used today.`
        : `Free Trial daily limit reached (${maxLimit} Chat session / day). Upgrade to Pro Scholar (₹99) or Pro Ultimate (₹199) for more chats!`
    };
  }

  if (details.currentPlanId === 'plan_199') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'ai_chat', dailyKey);
    const maxLimit = 3;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: '24/7 AI Academic Tutor Chat',
      message: allowed
        ? `Pro Scholar Plan: ${periodCount}/${maxLimit} AI Tutor messages used today.`
        : `Pro Scholar daily chat limit reached (${maxLimit} messages/day). Upgrade to Placivo Pro Ultimate (₹199) for 10 messages/week!`
    };
  }

  if (details.currentPlanId === 'plan_399') {
    const weeklyKey = getWeeklyKey();
    const periodCount = getFeatureUsage(uid, 'ai_chat', weeklyKey);
    const maxLimit = 10;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: '24/7 AI Academic Tutor Chat',
      message: allowed
        ? `Placivo Pro Ultimate: ${periodCount}/${maxLimit} AI Tutor messages used this week.`
        : `Placivo Pro Ultimate weekly chat limit reached (${maxLimit} messages/week).`
    };
  }

  return {
    allowed: true,
    maxLimit: -1,
    currentCount: currentChatCount,
    featureName: '24/7 AI Academic Tutor Chat',
    message: 'Active Enterprise / Custom plan active.'
  };
}

export function checkResumeScanLimit(user: UserProfile, currentScanCount: number): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: 0,
      featureName: 'ATS Resume Scans',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to run ATS Resume Audits.'
    };
  }

  const uid = user?.uid || 'anon';
  if (details.currentPlanId === 'free_trial') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'resume_scan', dailyKey);
    const maxLimit = 1; // 1 Scan/Day
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'ATS Resume Scans',
      message: allowed
        ? `Free Trial Pass: ${periodCount}/${maxLimit} ATS Resume Audits completed today.`
        : `Free Trial ATS scan limit reached (${maxLimit} Audit/day). Upgrade to Pro Scholar (5 Scans/month) or Pro Ultimate (10 Scans/month)!`
    };
  }

  if (details.currentPlanId === 'plan_199') {
    const monthlyKey = getMonthlyKey();
    const periodCount = getFeatureUsage(uid, 'resume_scan', monthlyKey);
    const maxLimit = 5;
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'ATS Resume Scans',
      message: allowed
        ? `Pro Scholar Plan: ${periodCount}/${maxLimit} ATS Resume Scans used this month.`
        : `Pro Scholar monthly limit reached (${maxLimit} Scans/month). Upgrade to Placivo Pro Ultimate (₹199) for 10 Scans/month & Resume Builder!`
    };
  }

  const monthlyKey = getMonthlyKey();
  const periodCount = getFeatureUsage(uid, 'resume_scan', monthlyKey);
  const maxLimit = 10;
  const allowed = periodCount < maxLimit;
  return {
    allowed,
    maxLimit,
    currentCount: periodCount,
    featureName: 'ATS Resume Scans',
    message: allowed
      ? `Placivo Pro Ultimate: ${periodCount}/${maxLimit} ATS Resume Scans used this month.`
      : `Placivo Pro Ultimate monthly limit reached (${maxLimit} Scans/month).`
  };
}

export function checkPDFExportLimit(user: UserProfile): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: 0,
      featureName: 'PDF Resume Export',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to export your Resume as PDF.'
    };
  }

  const uid = user?.uid || 'anon';
  if (details.currentPlanId === 'free_trial') {
    const dailyKey = getDailyKey();
    const periodCount = getFeatureUsage(uid, 'pdf_export', dailyKey);
    const maxLimit = 1; // 1 PDF Export/Day
    const allowed = periodCount < maxLimit;
    return {
      allowed,
      maxLimit,
      currentCount: periodCount,
      featureName: 'PDF Resume Export',
      message: allowed
        ? `Free Trial Pass: ${periodCount}/${maxLimit} PDF exports completed today.`
        : `Free Trial PDF export limit reached (${maxLimit} PDF Export/day). Upgrade to Pro Scholar (₹99) or Pro Ultimate (₹199) for unlimited downloads!`
    };
  }

  return {
    allowed: true,
    maxLimit: -1,
    currentCount: 0,
    featureName: 'PDF Resume Export',
    message: 'Pro Plan: UNLIMITED PDF exports active.'
  };
}

export function checkInterviewPrepLimit(user: UserProfile, currentSessionCount: number): LimitCheckResult {
  const details = calculatePlanDetails(user);
  if (!details.hasActiveAccess) {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: currentSessionCount,
      featureName: 'Technical Interview Prep',
      message: 'Please start your 4-Day Free Trial or upgrade to a Pro Plan to access Technical Interview Prep.'
    };
  }

  if (details.currentPlanId === 'free_trial') {
    return {
      allowed: false,
      maxLimit: 0,
      currentCount: currentSessionCount,
      featureName: 'Technical Interview Prep',
      message: 'Technical Interview Prep is not included in the Free Trial. Upgrade to Pro Scholar (₹99) or Pro Ultimate (₹199) to gain full access!'
    };
  }

  if (details.currentPlanId === 'plan_199') {
    return {
      allowed: true,
      maxLimit: -1,
      currentCount: currentSessionCount,
      featureName: 'Technical Interview Prep',
      message: 'Pro Scholar Plan: UNLIMITED 1-on-1 Practice & 256 Subjects Question Bank active.'
    };
  }

  return {
    allowed: true,
    maxLimit: -1,
    currentCount: currentSessionCount,
    featureName: 'Technical Interview Prep',
    message: 'Placivo Pro Ultimate: UNLIMITED 1-on-1 Technical Interview Prep & Question Bank active.'
  };
}

